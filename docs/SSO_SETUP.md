# SSO Authentication Setup Guide

Your app has been refactored to support SSO authentication using AWS Cognito
Hosted UI.

## What Was Added

### Frontend Components

- ✅ `src/services/ssoAuth.js` - Cognito Hosted UI integration
- ✅ `src/contexts/AuthContext.jsx` - React auth context with RUM integration
- ✅ `src/components/AuthModal.jsx` - Sign in modal
- ✅ `src/components/UserProfile.jsx` - User profile page
- ✅ `src/components/AuthModal.css` - Auth modal styles
- ✅ `src/components/UserProfile.css` - User profile styles
- ✅ Updated `src/App.jsx` - Wrapped with AuthProvider
- ✅ Updated `src/components/Header.jsx` - Added auth buttons

### Infrastructure

- ✅ `infra/terraform/cognito.tf` - Cognito User Pool configuration

## Next Steps

### 1. Deploy Terraform Infrastructure

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

This will create:

- Cognito User Pool
- User Pool Client
- Cognito Domain (Hosted UI)

### 2. Get Terraform Outputs

After deploying, get the required values:

```bash
terraform output cognito_client_id
terraform output cognito_domain
terraform output cognito_user_pool_id
```

### 3. Update Environment Variables

Create or update `.env.local` in your project root:

```bash
VITE_COGNITO_DOMAIN=h3ow3d-auth.auth.eu-west-2.amazoncognito.com
VITE_COGNITO_CLIENT_ID=<from terraform output>
VITE_REDIRECT_URI=https://h3ow3d.com
```

For local development, also add to `.env.local`:

```bash
VITE_REDIRECT_URI=http://localhost:5173
```

### 4. Update GitHub Actions

Add the Cognito environment variables to your GitHub Actions workflow:

```yaml
env:
  # ... existing env vars ...
  VITE_COGNITO_DOMAIN: ${{ secrets.COGNITO_DOMAIN }}
  VITE_COGNITO_CLIENT_ID: ${{ secrets.COGNITO_CLIENT_ID }}
  VITE_REDIRECT_URI: https://h3ow3d.com
```

Add the secrets in GitHub:

- Repository → Settings → Secrets and variables → Actions
- Add `COGNITO_DOMAIN` and `COGNITO_CLIENT_ID`

### 5. (Optional) Set Up Google OAuth

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://h3ow3d-auth.auth.eu-west-2.amazoncognito.com/oauth2/idpresponse`
4. Update `infra/terraform/variables.tf`:

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

Visit `http://localhost:5173` and click "Sign In" to test the authentication flow.

## How It Works

1. **Sign In Flow:**
   - User clicks "Sign In" button
   - Redirects to Cognito Hosted UI
   - User authenticates (with email/password or Google)
   - Cognito redirects back with tokens in URL hash
   - App parses tokens and stores them in localStorage
   - User is authenticated

2. **Session Persistence:**
   - Tokens stored in localStorage
   - On page refresh, AuthContext checks for valid token
   - Expired tokens are automatically cleared

3. **RUM Integration:**
   - User authentication events tracked
   - User ID associated with RUM session
   - All subsequent events linked to user

4. **Sign Out:**
   - Clears local tokens
   - Redirects to Cognito logout endpoint
   - Cognito clears session and redirects back

## Architecture

```text
User → Sign In Button → Cognito Hosted UI
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

## Security Notes

- Tokens stored in localStorage (consider httpOnly cookies for production)
- No passwords handled by your app
- All authentication managed by AWS Cognito
- Token expiration handled automatically
- Uses implicit OAuth flow (suitable for SPAs)

## Troubleshooting

### "Invalid redirect URI" error

- Check callback URLs in Cognito User Pool Client match your domain
- Ensure URLs include protocol (https://)

### Tokens not persisting

- Check browser localStorage
- Verify VITE_REDIRECT_URI matches current domain

### RUM not tracking authenticated users

- Check browser console for errors
- Verify RUM is initialized before auth context
