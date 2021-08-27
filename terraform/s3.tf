resource "aws_s3_bucket" "bucket" {
  bucket = "virtual-hendi"
  acl    = "public-read"
}