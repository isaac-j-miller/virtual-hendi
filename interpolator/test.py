import json
from handler import lambda_handler
rootDir = "./tmp"
if __name__ == "__main__":
    ans = lambda_handler({
        "pathParameters": {
            "temperature": "16",
            "min": "2000",
            "max": "2100"
        },
        "cli": True,
        "rootDir": rootDir
    }, {})
    jsonAns = json.dumps(ans)
    print(jsonAns)
