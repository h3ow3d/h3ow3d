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
