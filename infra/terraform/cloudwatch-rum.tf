# CloudWatch RUM App Monitor
resource "aws_rum_app_monitor" "h3ow3d" {
  name   = "h3ow3d-monitor"
  domain = aws_cloudfront_distribution.cdn.domain_name

  app_monitor_configuration {
    allow_cookies       = true
    enable_xray         = false
    session_sample_rate = 1.0
    telemetries         = ["errors", "performance", "http"]

    identity_pool_id = aws_cognito_identity_pool.rum.id
    guest_role_arn   = aws_iam_role.rum_guest.arn
  }

  custom_events {
    status = "ENABLED"
  }

  tags = {
    Name        = "h3ow3d-rum"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Cognito Identity Pool for unauthenticated RUM access
resource "aws_cognito_identity_pool" "rum" {
  identity_pool_name               = "h3ow3d_rum_pool"
  allow_unauthenticated_identities = true
  allow_classic_flow               = true

  tags = {
    Name        = "h3ow3d-rum-identity-pool"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# IAM role for unauthenticated RUM users
resource "aws_iam_role" "rum_guest" {
  name = "h3ow3d-rum-guest-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = "cognito-identity.amazonaws.com"
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.rum.id
        }
        "ForAnyValue:StringLike" = {
          "cognito-identity.amazonaws.com:amr" = "unauthenticated"
        }
      }
    }]
  })

  tags = {
    Name        = "h3ow3d-rum-guest-role"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# IAM policy for RUM guest role
resource "aws_iam_role_policy" "rum_guest_policy" {
  name = "h3ow3d-rum-guest-policy"
  role = aws_iam_role.rum_guest.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "rum:PutRumEvents"
        Resource = "arn:aws:rum:${var.aws_region}:${data.aws_caller_identity.current.account_id}:appmonitor/*"
      }
    ]
  })
}

# Attach role to identity pool
resource "aws_cognito_identity_pool_roles_attachment" "rum" {
  identity_pool_id = aws_cognito_identity_pool.rum.id

  roles = {
    unauthenticated = aws_iam_role.rum_guest.arn
  }
}

# S3 bucket for source maps (private)
resource "aws_s3_bucket" "sourcemaps" {
  bucket = "h3ow3d-sourcemaps"

  tags = {
    Name        = "h3ow3d-sourcemaps"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Block all public access to source maps bucket
resource "aws_s3_bucket_public_access_block" "sourcemaps" {
  bucket = aws_s3_bucket.sourcemaps.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for source maps (track different versions)
resource "aws_s3_bucket_versioning" "sourcemaps" {
  bucket = aws_s3_bucket.sourcemaps.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Lifecycle rule to clean up old source maps after 90 days
resource "aws_s3_bucket_lifecycle_configuration" "sourcemaps" {
  bucket = aws_s3_bucket.sourcemaps.id

  rule {
    id     = "cleanup-old-sourcemaps"
    status = "Enabled"

    expiration {
      days = 90
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# Allow CloudWatch RUM to access source maps
resource "aws_s3_bucket_policy" "sourcemaps_rum_access" {
  bucket = aws_s3_bucket.sourcemaps.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchRUMAccess"
        Effect = "Allow"
        Principal = {
          Service = "rum.amazonaws.com"
        }
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.sourcemaps.arn,
          "${aws_s3_bucket.sourcemaps.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
          ArnEquals = {
            "aws:SourceArn" = aws_rum_app_monitor.h3ow3d.arn
          }
        }
      }
    ]
  })
}

# Data source for current AWS account
data "aws_caller_identity" "current" {}
