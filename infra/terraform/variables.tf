variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "h3ow3d"
}

variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "eu-west-2"
}


variable "domain_name" {
  description = "Optional custom domain (e.g., blog.example.com). If provided, also provide an ACM certificate ARN."
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN for custom domain on CloudFront (must be in us-east-1)."
  type        = string
  default     = ""
}
