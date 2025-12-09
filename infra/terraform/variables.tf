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

variable "google_client_id" {
  description = "Google OAuth 2.0 client ID for Social Identity Provider"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth 2.0 client secret for Social Identity Provider"
  type        = string
  sensitive   = true
}
