import pandas as pd
import numpy as np
import os

def toInt(idx, precision):
    return pd.Index([int(x*(10**precision)) for x in idx])

def fromInt(idx, precision):
    return pd.Index([float(x/(10**precision)) for x in idx])

def reconcile(**spectra):
    minIndex = max(s.index.min() for s in spectra.values())
    maxIndex = min(s.index.max() for s in spectra.values())
    avgDiff = sum(pd.Series(s.index).diff(1).mean() for s in spectra.values())/len(spectra.values())
    freqToUpsampleTo = avgDiff
    numSamples = int((maxIndex - minIndex)/freqToUpsampleTo)
    precision = 7
    newIndex = toInt(np.linspace(minIndex, maxIndex, numSamples), precision)
    newDfs = {}
    for k, v in spectra.items():
        v=v.drop_duplicates()
        v.index = toInt(v.index, precision)
        unionIndex = v.index.union(newIndex)
        v=v.reindex(unionIndex)
        newDf = v.interpolate(method='akima')
        intersect = np.intersect1d(newDf.index, newIndex)
        newDf = newDf.loc[intersect]
        newDf.index = fromInt(newDf.index,precision)
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

def saveSeries(filename, series:pd.Series):
    series.to_csv(filename,sep='\t',header=None)

def reconcileAndReplace(*filepaths):
    spectra = {
        f:loadSeries(f) for f in filepaths
    }
    newSpectra = reconcile(**spectra)
    for k, v in newSpectra.items():
        saveSeries(k,v)

