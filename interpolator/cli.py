from logging import root
import sys
from handler import lambda_handler

if __name__ == "__main__":
    temperature = sys.argv[1]
    mn = sys.argv[2]
    mx = sys.argv[3]
    rootDir = sys.argv[4]
    ans = lambda_handler({
        "pathParameters": {
            "temperature": temperature,
            "min": mn,
            "max": mx
        },
        "cli": True,
        "rootDir": rootDir
    }, {})
    print(ans)
