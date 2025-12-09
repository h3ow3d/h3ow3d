# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "h3ow3d-users"

  # Allow users to sign in with email
  username_attributes = ["email"]

  # Auto-verify email addresses
  auto_verified_attributes = ["email"]

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # User attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = false
    mutable             = true
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Name        = "h3ow3d-user-pool"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "web" {
  name         = "h3ow3d-web-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # OAuth configuration
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["implicit"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]

  # Callback URLs - update these with your actual domains
  callback_urls = [
    "https://h3ow3d.com",
    "https://www.h3ow3d.com",
    "http://localhost:5173"
  ]

  # Logout URLs
  logout_urls = [
    "https://h3ow3d.com",
    "https://www.h3ow3d.com",
    "http://localhost:5173"
  ]

  # Supported identity providers
  supported_identity_providers = ["COGNITO", "Google"]

  # Token validity
  id_token_validity      = 60 # minutes
  access_token_validity  = 60 # minutes
  refresh_token_validity = 30 # days

  token_validity_units {
    id_token      = "minutes"
    access_token  = "minutes"
    refresh_token = "days"
  }

  # Prevent secret generation (for public client)
  generate_secret = false

  # Enable token revocation
  enable_token_revocation = true

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"
}

# Cognito User Pool Domain
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "h3ow3d-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Google Identity Provider (optional - requires Google OAuth setup)
# Uncomment and configure after setting up Google OAuth credentials
#
# resource "aws_cognito_identity_provider" "google" {
#   user_pool_id  = aws_cognito_user_pool.main.id
#   provider_name = "Google"
#   provider_type = "Google"
#
#   provider_details = {
#     authorize_scopes = "openid email profile"
#     client_id        = var.google_client_id
#     client_secret    = var.google_client_secret
#   }
#
#   attribute_mapping = {
#     email    = "email"
#     name     = "name"
#     picture  = "picture"
#     username = "sub"
#   }
# }

# Outputs
output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "cognito_user_pool_endpoint" {
  description = "The endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}

output "cognito_client_id" {
  description = "The client ID for the web application"
  value       = aws_cognito_user_pool_client.web.id
}

output "cognito_domain" {
  description = "The Cognito Hosted UI domain"
  value       = "${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}
