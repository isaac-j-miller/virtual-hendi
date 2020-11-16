import sys, os
from interpolation import Interpolator
from interpolation import Spectrum

filePath1 = sys.argv[1].replace("\"","")
temperature1 = sys.argv[2]
filePath2 = sys.argv[3].replace("\"","")
temperature2 = sys.argv[4]
temperature = sys.argv[5]
outputPath = sys.argv[6].replace("\"","")

if __name__ == '__main__':
    if not os.path.exists(outputPath):
        spec1 = Spectrum(filePath1,float(temperature1))
        spec2 = Spectrum(filePath2,float(temperature2))
        interp = Interpolator(spec1, spec2, float(temperature))
        interp.interpolate()
        interp.write(outputPath)
    print(outputPath)
