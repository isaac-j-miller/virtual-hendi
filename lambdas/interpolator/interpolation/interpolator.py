import pandas as pd
from .spectrum import Spectrum


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
        self.data = pd.DataFrame(
            index=self.spectrum1.data.wavenumber
        )
        self.data["int1"] = self.spectrum1.data.intensity
        self.data["int2"] = self.spectrum2.data.intensity

        self.data["intensity"] = self.data.apply(self._interpolate, axis=1)
        print()

    def write(self, filename):
        dataToWrite = pd.Series(index=self.data.index,
                                data=self.data["intensity"])
        dataToWrite.to_csv(filename, sep="\t", header=False)
