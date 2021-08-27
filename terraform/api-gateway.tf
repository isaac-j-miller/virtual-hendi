module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"

  name          = "virtual-hendi"
  description   = "Functions for virtual HENDI api"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Custom domain
  domain_name                 = "api.virtual-hendi.isaac-j-miller.com"
  domain_name_certificate_arn = aws_acm_certificate.cert.arn

  # Routes and integrations
  integrations = {
    "GET /interpolator/{temperature}/{min}/{max}" = {
      integration_type          = "AWS_PROXY"
      integration_method        = "POST"
      connection_type           = "INTERNET"
      description               = "Interpolate spectrum at temperature"  
      integration_uri           = resource.aws_lambda_function.interpolator_lambda.invoke_arn
      payload_format_version    = "2.0"
      timeout_milliseconds      = 30000
    }
  }
}