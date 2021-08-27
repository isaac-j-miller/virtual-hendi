import json
import sys
import os
import pathlib
from handler import lambda_handler

if __name__ == "__main__":
    temperature = sys.argv[1]
    mn = sys.argv[2]
    mx = sys.argv[3]
    rootDir = sys.argv[4]
    tmpDir = os.path.join(rootDir, "spectra/tmp")
    pathlib.Path(tmpDir).mkdir(parents=True, exist_ok=True)
    ans = lambda_handler({
        "pathParameters": {
            "temperature": temperature,
            "min": mn,
            "max": mx
        },
        "cli": True,
        "rootDir": rootDir
    }, {})
    jsonAns = json.dumps(ans)
    print(jsonAns)
