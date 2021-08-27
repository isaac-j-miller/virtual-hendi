terraform {
    backend "s3" {
      region  = "us-east-1"
      bucket  = "imiller-tfstate"
      key     = "virtual-hendi.tfstate"
      encrypt = true
      acl     = "bucket-owner-full-control"
    }
    required_version = "~> 1.0.0"
    required_providers {
      aws = {
        source  = "hashicorp/aws"
        version = "3.50.0"
      }
    }
  }
  
  data "aws_region" "current" {}
  
  data "aws_caller_identity" "current" {}
  
  provider "aws" {
    region = "us-east-1"
  }
  