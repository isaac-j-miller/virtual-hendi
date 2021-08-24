import pandas as pd


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

    def filter(self, mn, mx):
        data = self.data.copy(True)
        dataFiltered = data[(data["wavenumber"] >= mn) &
                            (data["wavenumber"] < mx)]
        dataToWrite = pd.Series(
            index=dataFiltered["wavenumber"], data=dataFiltered["intensity"])
        return dataToWrite.to_csv("\t", header=["Wavenumber (cm-1)", "Intensity"])
