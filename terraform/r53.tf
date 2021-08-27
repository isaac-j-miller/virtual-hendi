data "aws_route53_zone" "zone" {
  name         = "isaac-j-miller.com"
  private_zone = false
}

resource "aws_route53_record" "api_record_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name    = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id = data.aws_route53_zone.zone.zone_id
}

resource "aws_route53_record" "api_record" {
  name    = "api.virtual-hendi.isaac-j-miller.com"
  type    = "CNAME"
  zone_id = data.aws_route53_zone.zone.zone_id
  ttl     = 60
  records = [replace(module.api_gateway.apigatewayv2_api_api_endpoint, "https://", "")]
}
resource "aws_acm_certificate" "cert" {
  domain_name       = "api.virtual-hendi.isaac-j-miller.com"
  validation_method = "DNS"
}
resource "aws_acm_certificate_validation" "api_record" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.api_record_validation : record.fqdn]
}