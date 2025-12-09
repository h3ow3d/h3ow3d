# SSO Authentication Setup Guide

Your app uses AWS Cognito with Google Social Identity Provider for
authentication.

## Overview

Users sign in with their Google accounts through Cognito Hosted UI. No
additional identity provider setup is required - users just bring their
existing Google accounts.

## What Was Implemented

### Frontend Components

- ✅ `src/services/ssoAuth.js` - Cognito Hosted UI integration with mock mode
- ✅ `src/contexts/AuthContext.jsx` - Auth context with RUM tracking
- ✅ `src/components/AuthModal.jsx` - Sign-in modal with Lucide icons
- ✅ `src/components/UserProfile.jsx` - User profile page with tabs
- ✅ `src/components/AuthModal.css` - Auth modal styles
- ✅ `src/components/UserProfile.css` - User profile styles
- ✅ Updated `src/App.jsx` - Wrapped with AuthProvider, profile route
- ✅ Updated `src/components/Header.jsx` - Auth buttons with Lucide icons

### Infrastructure

- ✅ `infra/terraform/cognito.tf` - User Pool with Google Social IdP
- ✅ `infra/terraform/variables.tf` - Google OAuth credential variables

### Documentation

- ✅ `docs/GOOGLE_SOCIAL_IDP_SETUP.md` - Google OAuth setup guide
- ✅ `docs/GITHUB_ACTIONS_SETUP.md` - CI/CD integration guide

## Development Setup

Mock authentication is enabled by default for local development:

```bash
# .env.local
VITE_MOCK_AUTH=true
```

This allows you to test the auth UI without deploying Cognito infrastructure.

## Production Deployment

See the detailed guides:

1. **[Google OAuth Setup](./GOOGLE_SOCIAL_IDP_SETUP.md)** - Create Google
   OAuth credentials
2. **[GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md)** - Configure secrets
   and CI/CD

### Quick Start

1. **Create Google OAuth Credentials** (one-time setup)
   - Follow `docs/GOOGLE_SOCIAL_IDP_SETUP.md`
   - Get Client ID and Client Secret

2. **Add GitHub Secrets**
   - `TF_VAR_google_client_id`
   - `TF_VAR_google_client_secret`

3. **Deploy Infrastructure**

   ```bash
   cd infra/terraform
   terraform init
   terraform apply
   ```

4. **Deploy Frontend**
   - GitHub Actions will automatically use Terraform outputs
   - Build includes Cognito configuration from outputs

   ```hcl
   variable "google_client_id" {
     description = "Google OAuth client ID"
     type        = string
     sensitive   = true
   }

   variable "google_client_secret" {
     description = "Google OAuth client secret"
     type        = string
     sensitive   = true
   }
   ```

5. Uncomment the Google Identity Provider section in `cognito.tf`
6. Run `terraform apply`

### 6. Test Locally

```bash
npm run dev
```

## Features

### Mock Authentication for Development

When `VITE_MOCK_AUTH=true` (default in `.env.local`):

- No AWS infrastructure required
- Sign in with any email (e.g., `test@example.com`)
- Instant authentication for testing UI
- Perfect for development and testing

### Production Authentication

When deployed with `VITE_MOCK_AUTH=false`:

- Users sign in with Google accounts
- Managed by AWS Cognito Hosted UI
- Secure token-based authentication
- RUM tracking integration

## How It Works

### Sign-In Flow

1. User clicks "Sign In" button
2. Redirects to Cognito Hosted UI (`h3ow3d-auth.auth.eu-west-2.amazoncognito.com`)
3. User authenticates with Google
4. Cognito redirects back with tokens in URL hash
5. App parses tokens and stores in localStorage
6. User is authenticated, RUM session updated

### Session Persistence

- Tokens stored in localStorage
- On page refresh, AuthContext checks for valid token
- Expired tokens automatically cleared
- Sign out clears tokens and Cognito session

### RUM Integration

- Auth events tracked (sign-in, sign-out)
- User ID associated with RUM session
- All events linked to authenticated user

## Architecture

```text
User → Sign In → Cognito Hosted UI → Google OAuth
                                         ↓
                                   Authenticate
                                         ↓
                              Redirect with Tokens
                                         ↓
                    App (stores tokens, updates state)
                                         ↓
                              Authenticated Session
                                         ↓
                           RUM Tracking with User ID
```

## Security

- ✅ No passwords handled by your app
- ✅ All authentication managed by AWS Cognito
- ✅ OAuth 2.0 implicit flow (suitable for SPAs)
- ✅ Tokens auto-expire (access token: 1 hour, ID token: 1 hour)
- ⚠️ Tokens stored in localStorage (acceptable for SPAs)

## Troubleshooting

### "Invalid redirect URI" error

Check callback URLs in `cognito.tf` match your domain:

```hcl
callback_urls = [
  "https://h3ow3d.com",
  "https://www.h3ow3d.com",
  "http://localhost:5173"
]
```

### Tokens not persisting

- Check browser localStorage for `cognitoTokens` key
- Verify redirect URI matches configured callback URLs
- Check browser console for errors

### RUM not tracking authenticated users

- Verify RUM initialized before AuthContext (`src/main.jsx`)
- Check browser console for `recordEvent` errors
- Ensure RUM identity pool has correct permissions

### Mock auth not working locally

Ensure `.env.local` has:

```bash
VITE_MOCK_AUTH=true
```
