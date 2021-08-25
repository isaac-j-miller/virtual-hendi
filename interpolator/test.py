from handler import lambda_handler

if __name__ == "__main__":
    ans = lambda_handler({
        "pathParameters": {
            "temperature": "16",
            "min": "2000",
            "max": "2100"
        }
    }, {})
    print(ans)
