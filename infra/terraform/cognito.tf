# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "h3ow3d-users"

  # Allow email as username
  alias_attributes         = ["email", "preferred_username"]
  auto_verified_attributes = ["email"]

  # Password policy (only needed if allowing email/password signup)
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # User pool settings
  username_configuration {
    case_sensitive = false
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Environment = "production"
    Application = "h3ow3d"
  }
}

# Google Social Identity Provider
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "profile email openid"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
    name     = "name"
    picture  = "picture"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "web" {
  name         = "h3ow3d-web-client"
  user_pool_id = aws_cognito_user_pool.main.id

  callback_urls = [
    "https://h3ow3d.com",
    "https://www.h3ow3d.com",
    "http://localhost:5173"
  ]

  logout_urls = [
    "https://h3ow3d.com",
    "https://www.h3ow3d.com",
    "http://localhost:5173"
  ]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["implicit"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]

  # Only use Google Social IdP
  supported_identity_providers = ["Google"]

  # Disable secret for public client (SPA)
  generate_secret = false

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"

  # Token validity
  id_token_validity      = 60 # minutes
  access_token_validity  = 60 # minutes
  refresh_token_validity = 30 # days

  token_validity_units {
    id_token      = "minutes"
    access_token  = "minutes"
    refresh_token = "days"
  }

  # Must be created after the identity provider
  depends_on = [aws_cognito_identity_provider.google]
}

# Cognito User Pool Domain
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "h3ow3d-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Data source for current region
data "aws_region" "current" {}

# Outputs
output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.main.id
  description = "Cognito User Pool ID"
}

output "cognito_client_id" {
  value       = aws_cognito_user_pool_client.web.id
  description = "Cognito User Pool Client ID"
}

output "cognito_domain" {
  value       = "${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
  description = "Cognito Hosted UI domain"
}
