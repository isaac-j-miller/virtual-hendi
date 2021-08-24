import os
from interpolation import Interpolator
from interpolation import Spectrum


def lambda_handler(event, context):
    temperature = event.temperature
    mn = event.min
    mx = event.max
    temperatures = [
        13.5,
        16,
        18,
        20
    ]
    fileName = f"OCS_${temperature}K.dat"
    outputPath = f"./spectra/generated/{fileName}"
    if not os.path.exists("./spectra/generated"):
        os.mkdir("./spectra/generated")
    if not os.path.exists(outputPath):
        lowerTemp, upperTemp = None, None
        lowerF, upperF = None, None
        for i in range(len(temperatures - 1)):
            temp1 = temperatures[i]
            temp2 = temperatures[i+1]
            if temperature > temp1 and temperature < temp2:
                lowerTemp = temp1
                lowerF = os.path.join(
                    ".", 'spectra', 'generated', f"OCS_{temp1}K.dat")
                upperTemp = temp2
                upperF = os.path.join(
                    ".", 'spectra', 'generated', f"OCS_{temp2}K.dat")
        spec1 = Spectrum(lowerF, float(upperTemp))
        spec2 = Spectrum(upperF, float(lowerTemp))
        interp = Interpolator(spec1, spec2, float(temperature))
        interp.interpolate()
        interp.write(outputPath)

    finalSpec = Spectrum(outputPath, temperature)
    response = finalSpec.filter(mn, mx)
    return {
        'statusCode': 200,
        'body': response
    }
