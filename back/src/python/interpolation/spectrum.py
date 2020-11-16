import pandas as pd

class Spectrum:
    def __init__(self, filename: str, temperature: float):
        self.filename = filename
        self.temperature = temperature
        self.data = self._load()
    
    def _load(self):
        df = pd.read_csv(self.filename, sep="\t",names=["wavenumber","intensity"], dtype={"wavenumber":float,"intensity":float})
        df = df.set_index(df.wavenumber)
        return df
