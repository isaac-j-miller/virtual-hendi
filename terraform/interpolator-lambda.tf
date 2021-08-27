data "aws_iam_policy_document" "lambda_iam_policy" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
        type = "Service"
        identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "s3_access" {
  statement {
    effect = "Allow"
    actions = [
      "s3:*",
    ]
    resources = [
      aws_s3_bucket.bucket.arn,
      "${aws_s3_bucket.bucket.arn}/*",
      "${aws_s3_bucket.bucket.arn}/**/*"
    ]
  }
}
resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role = resource.aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}
resource "aws_iam_policy" "lambda_s3_attach" {
    name = "VhLambdaS3Policy"
    policy = data.aws_iam_policy_document.s3_access.json
}
resource "aws_iam_policy_attachment" "s3_attach" {
    name = "VhLambdaS3Attachment"
    roles = [resource.aws_iam_role.iam_for_lambda.name]
    policy_arn = resource.aws_iam_policy.lambda_s3_attach.arn
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_vh_lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_iam_policy.json
}

resource "aws_lambda_function" "interpolator_lambda" {
  filename      = "${var.VH_ROOT}/dist/lambda/deployment-package.zip"
  function_name = "interpolator-lambda"
  role          = resource.aws_iam_role.iam_for_lambda.arn
  handler       = "handler.lambda_handler"
  source_code_hash = filebase64sha256("${var.VH_ROOT}/dist/lambda/deployment-package.zip")
  runtime = "python3.8"
  timeout = 30
  memory_size = 512
  layers = [
      "arn:aws:lambda:us-east-1:770693421928:layer:Klayers-python38-pandas:38",
      "arn:aws:lambda:us-east-1:770693421928:layer:Klayers-python38-nltk:45"
  ]
}
resource "aws_lambda_permission" "api_gw" {  
    statement_id  = "AllowExecutionFromAPIGateway"  
    action        = "lambda:InvokeFunction"  
    function_name = resource.aws_lambda_function.interpolator_lambda.function_name  
    principal     = "apigateway.amazonaws.com"
    source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
}