import pandas as pd
import numpy as np
import os
import json
import logging
import boto3
from botocore.exceptions import ClientError


def toInt(idx, precision):
    return pd.Index([int(x*(10**precision)) for x in idx])


def fromInt(idx, precision):
    return pd.Index([float(x/(10**precision)) for x in idx])


def reconcile(**spectra):
    minIndex = max(s.index.min() for s in spectra.values())
    maxIndex = min(s.index.max() for s in spectra.values())
    avgDiff = sum(pd.Series(s.index).diff(1).mean()
                  for s in spectra.values())/len(spectra.values())
    freqToUpsampleTo = avgDiff
    numSamples = int((maxIndex - minIndex)/freqToUpsampleTo)
    precision = 7
    newIndex = toInt(np.linspace(minIndex, maxIndex, numSamples), precision)
    newDfs = {}
    for k, v in spectra.items():
        v = v.drop_duplicates()
        v.index = toInt(v.index, precision)
        unionIndex = v.index.union(newIndex)
        v = v.reindex(unionIndex)
        newDf = v.interpolate(method='akima')
        intersect = np.intersect1d(newDf.index, newIndex)
        newDf = newDf.loc[intersect]
        newDf.index = fromInt(newDf.index, precision)
        newDfs[f"{'/'.join(os.path.split(k)[:-1])}/generated/{os.path.split(k)[-1]}"] = newDf

    return newDfs


def loadSeries(filename):
    with open(filename, 'r') as fp:
        rawData = fp.read()
        lines = rawData.split('\n')[:-1]
        index = [float(line.split('\t')[0]) for line in lines]
        data = [float(line.split('\t')[1]) for line in lines]
    series = pd.Series(data, index)
    return series


def saveSeries(filename, series: pd.Series):
    series.to_csv(filename, sep='\t', header=None)


def reconcileAndReplace(*filepaths):
    spectra = {
        f: loadSeries(f) for f in filepaths
    }
    newSpectra = reconcile(**spectra)
    for k, v in newSpectra.items():
        saveSeries(k, v)


class Spectrum:
    def __init__(self, filename: str, temperature: float):
        self.filename = filename
        self.temperature = temperature
        self.data = self._load()

    def _load(self):
        df = pd.read_csv(self.filename, sep="\t", names=[
                         "wavenumber", "intensity"], dtype={"wavenumber": float, "intensity": float})
        df = df.set_index(df.wavenumber)
        return df

    def toString(self):
        dataToWrite = pd.DataFrame(data={
                "wavenumber": self.data["wavenumber"],
                "intensity": self.data["intensity"]
            })

        dataList = dataToWrite.to_csv(None, sep="\t",header=None, index=False)
        return dataList

    def filter(self, mn, mx):
        data = self.data.copy(True)
        dataFiltered = data[(data["wavenumber"] >= mn) &
                            (data["wavenumber"] < mx)]
        dataToWrite = pd.DataFrame(data={
                "wavenumber": dataFiltered["wavenumber"],
                "intensity": dataFiltered["intensity"]
            })

        dataList = dataToWrite.to_csv(None, sep="\t",header=None, index=False)
        return "Wavenumber (cm-1)\tIntensity\n" + dataList


class Interpolator:
    def __init__(self, spectrum1: Spectrum, spectrum2: Spectrum, temperature: float):
        self.spectrum1 = spectrum1
        self.spectrum2 = spectrum2
        self.temperature = temperature
        self.data: pd.DataFrame = None

    def _interpolate(self, series: pd.Series) -> float:
        x = self.temperature
        x1, y1 = self.spectrum1.temperature, series["int1"]
        x2, y2 = self.spectrum2.temperature, series["int2"]
        y = y1 + (x-x1)*(y2-y1)/(x2-x1)
        return y

    def interpolate(self):
        index = pd.concat([self.spectrum1.data.wavenumber,
                          self.spectrum2.data.wavenumber])
        index = index[~index.duplicated(keep='first')]
        self.data = pd.DataFrame(
            index=index
        )
        self.data["int1"] = self.spectrum1.data[~self.spectrum1.data.index.duplicated(
            keep='first')]["intensity"]
        self.data["int2"] = self.spectrum2.data[~self.spectrum2.data.index.duplicated(
            keep='first')]["intensity"]

        self.data["intensity"] = self.data.apply(self._interpolate, axis=1)

    def write(self, filename):
        dataToWrite = pd.Series(index=self.data.index,
                                data=self.data["intensity"])
        dataToWrite.to_csv(filename, sep="\t", header=False)


def lambda_handler(event, context):
    print("invoked with ", event, context)
    stringTemp = event["pathParameters"]["temperature"]
    temperature = float(stringTemp)
    mn = float(event["pathParameters"]["min"])
    mx = float(event["pathParameters"]["max"])
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('virtual-hendi')
    temperatures = [
        13.5,
        16,
        18,
        20
    ]
    fileName = f"OCS_{stringTemp}K.dat"
    outputPath = f"/tmp/{fileName}"
    baseFilePath=f'spectra/{fileName}'
    finalFile = f"/tmp/{temperature}-{mn}-{mx}.dat"
    finalKey = f"spectra{finalFile}"
   
    createdFile = False
    try:
        obj = s3.Object("virtual-hendi", finalKey)
        print("exact temp and range has already been calculated, no need to recalculate")
        return {
        'statusCode': 200,
        'headers': json.dumps({"Content-Type": "application/json"}),
        'body': json.dumps({
            "url": f"https://virtual-hendi.s3.amazonaws.com/{finalKey}"
        })
    }
    except Exception as e:
        print(e)

    if temperature in temperatures:
        outputPath = os.path.join("./spectra", f'OCS_{stringTemp}K.dat')
    else:
        try:
            bucket.download_file(Key=baseFilePath, Filename=outputPath)
            print("fetched previously created file from S3")
        except Exception as e:
            print(f"Error fetching {baseFilePath}", e)
    
    if not os.path.exists(outputPath):
        lowerTemp, upperTemp = None, None
        lowerF, upperF = None, None
        for i in range(len(temperatures) - 1):
            temp1 = temperatures[i]
            temp2 = temperatures[i+1]
            if temp1 < temperature <= temp2:
                lowerTemp = temp1
                lowerF = os.path.join(
                    "./spectra", f"OCS_{temp1}K.dat")
                upperTemp = temp2
                upperF = os.path.join(
                    "./spectra", f"OCS_{temp2}K.dat")
        spec1 = Spectrum(lowerF, upperTemp)
        spec2 = Spectrum(upperF, lowerTemp)
        interp = Interpolator(spec1, spec2, temperature)
        interp.interpolate()
        interp.write(outputPath)
        createdFile = True
    finalSpec = Spectrum(outputPath, temperature)
    baseFile = finalSpec.toString()
    response = finalSpec.filter(mn, mx)
    if createdFile:
        bucket.put_object(
            ACL="public-read",
            Body=baseFile.encode(),
            ContentType="text/plain",
            ContentEncoding="utf-8",
            Key=baseFilePath
        )
    bucket.put_object(
        ACL="public-read",
        Body=response.encode(),
        ContentType="text/plain",
        ContentEncoding="utf-8",
        Key=finalKey
    )
    return {
        'statusCode': 200,
        'headers': json.dumps({"Content-Type": "application/json"}),
        'body': json.dumps({
            "url": f"https://virtual-hendi.s3.amazonaws.com/{finalKey}"
        })
    }
