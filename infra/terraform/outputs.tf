output "s3_bucket_name" {
  description = "Name of the S3 bucket for the site"
  value       = aws_s3_bucket.site.bucket
}

output "s3_website_endpoint" {
  description = "S3 static website endpoint"
  value       = aws_s3_bucket_website_configuration.site.website_endpoint
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = try(aws_cloudfront_distribution.cdn.domain_name, null)
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = try(aws_cloudfront_distribution.cdn.id, null)
}

# CloudWatch RUM outputs
output "rum_app_monitor_id" {
  description = "CloudWatch RUM App Monitor ID (name)"
  value       = aws_rum_app_monitor.h3ow3d.name
}

output "rum_app_monitor_name" {
  description = "CloudWatch RUM App Monitor name (for CLI update)"
  value       = aws_rum_app_monitor.h3ow3d.name
}

output "rum_app_monitor_uuid" {
  description = "CloudWatch RUM App Monitor UUID"
  value       = aws_rum_app_monitor.h3ow3d.app_monitor_id
}

output "rum_identity_pool_id" {
  description = "Cognito Identity Pool ID for RUM"
  value       = aws_cognito_identity_pool.rum.id
}

output "rum_guest_role_arn" {
  description = "IAM Role ARN for RUM guest access"
  value       = aws_iam_role.rum_guest.arn
}

output "sourcemaps_bucket_name" {
  description = "S3 bucket name for source maps"
  value       = aws_s3_bucket.sourcemaps.id
}
