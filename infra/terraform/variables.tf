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
