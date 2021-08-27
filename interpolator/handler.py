import pandas as pd
import numpy as np
import os
import json
import boto3
from abc import ABC, abstractmethod


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
        try:
            df = pd.read_csv(self.filename, sep="\t", names=[
                            "wavenumber", "intensity"], dtype={"wavenumber": float, "intensity": float})
            df = df.set_index(df.wavenumber)
            return df
        except Exception as e:
            raise FileNotFoundError(f"Could not find {self.filename}")

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

class FileManagerInterface(ABC):
    def __init__(self):
        pass
    @abstractmethod
    def doesExactFileExist(self, key: str) -> bool:
        return False

    @abstractmethod
    def writeFile(self, key: str, data: str):
        pass

    @abstractmethod
    def downloadFile(self, key: str, to: str):
        pass

class FileManager(FileManagerInterface):
    def __init__(self, rootDir: str):
        super()
        self.rootDir = rootDir
    
    def doesExactFileExist(self, key: str) -> bool:
        fullPath = os.path.join(self.rootDir, key)
        return os.path.exists(fullPath)

    def writeFile(self, key: str, data: str):
        fullPath = os.path.join(self.rootDir, key)
        with open(fullPath, "w") as f:
            f.write(data)
    
    def downloadFile(self, key: str, to: str):
        with open(key, "r") as f:
            data = f.read(f)
            with open(to, "w") as d:
                d.write(data)

class S3Manager(FileManagerInterface):
    def __init__(self, bucketName: str):
        super()
        self.s3 = boto3.resource('s3')
        self.bucket = self.s3.Bucket(bucketName)
    
    def doesExactFileExist(self, key: str) -> bool:
        try:
            self.s3.Object(self.bucket, key).load()
            return True
        except Exception:
            return False

    def writeFile(self, key: str, data: str):
        self.bucket.put_object(
            ACL="public-read",
            Body=data.encode(),
            ContentType="text/plain",
            ContentEncoding="utf-8",
            Key=key
        )
    
    def downloadFile(self, key: str, to: str):
        self.bucket.download_file(Key=key, Filename=to)

def getManager(cli: bool, rootDir=None) -> FileManagerInterface:
    if(cli):
        return FileManager(rootDir)
    return S3Manager("virtual-hendi")


def lambda_handler(event, context):
    print("invoked with ", event, context)
    stringTemp = event["pathParameters"]["temperature"]
    temperature = float(stringTemp)
    mn = float(event["pathParameters"]["min"])
    mx = float(event["pathParameters"]["max"])
    cli = False
    rootDir = None
    try:
        cli = event["cli"]
    except KeyError:
        cli = False
    try:
        rootDir = event["rootDir"]
    except KeyError:
        rootDir = False
    manager = getManager(cli, rootDir)
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
    if manager.doesExactFileExist(finalKey):
        print(f"Found exact file matching {finalKey}, skipping expensive calculations...")
        return {
            'statusCode': 200,
            'headers': json.dumps({"Content-Type": "application/json"}),
            'body': json.dumps({"url": f"/{finalKey}"})
            }
    spectraDir = os.path.join(os.path.dirname(__file__), "spectra")
    if temperature in temperatures:
        outputPath = os.path.join(spectraDir, f'OCS_{stringTemp}K.dat')
    else:
        try:
            manager.downloadFile(baseFilePath, outputPath)
            print("fetched previously created file from S3")
        except Exception as e:
            print(f"Error fetching {baseFilePath}", e)
    
    if not os.path.exists(outputPath):
        lowerTemp, upperTemp = None, None
        lowerF, upperF = None, None
        for i in range(len(temperatures) - 1):
            temp1 = temperatures[i]
            temp2 = temperatures[i+1]
            if temp1 <= temperature <= temp2:
                lowerTemp = temp1
                lowerF = os.path.join(
                    spectraDir, f"OCS_{temp1}K.dat")
                upperTemp = temp2
                upperF = os.path.join(
                    spectraDir, f"OCS_{temp2}K.dat")
        if(lowerF is None):
            raise Exception("Lower temp file is None!")
        if(upperF is None):
            raise Exception("Upper temp file is None!")
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
        manager.writeFile(baseFilePath, baseFile)
    manager.writeFile(finalKey, response)
    return {
        'statusCode': 200,
        'headers': json.dumps({"Content-Type": "application/json"}),
        'body': json.dumps({
            "url": f"/{finalKey}"
        })
    }
