# Google Social IdP Setup for h3ow3d

## Quick Setup (5 minutes)

### 1. Get Google OAuth Credentials

1. Go to: <https://console.cloud.google.com/apis/credentials?project=holden-apy>
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted about consent screen:
   - Click **"Configure Consent Screen"**
   - Select **"External"**
   - Fill in:
     - App name: `h3ow3d`
     - User support email: your email
     - Developer contact: your email
   - Click **"Save and Continue"** (skip scopes, test users)
   - Go back to **"Credentials"**
4. Create OAuth client ID:
   - Application type: **"Web application"**
   - Name: `h3ow3d-cognito`
   - Authorized redirect URIs → **Add URI**:

     ```text
     https://h3ow3d-auth.auth.eu-west-2.amazoncognito.com/oauth2/idpresponse
     ```

   - Click **"Create"**

5. **Copy the Client ID and Client Secret**

### 2. Create Terraform Variables File

Create `infra/terraform/terraform.tfvars`:

```hcl
google_client_id     = "your-client-id-here.apps.googleusercontent.com"
google_client_secret = "your-client-secret-here"
```

### 3. Deploy Infrastructure

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### 4. Get Outputs

```bash
terraform output cognito_client_id
terraform output cognito_domain
terraform output cognito_user_pool_id
```

### 5. Update Environment Variables

#### Development (.env.local) - Already configured with mock auth

```bash
VITE_MOCK_AUTH=true
```

#### Production - Add to GitHub Secrets

- `COGNITO_DOMAIN` = from terraform output
- `COGNITO_CLIENT_ID` = from terraform output
- `COGNITO_USER_POOL_ID` = from terraform output

## What Changed

### ✅ Simplified Configuration

- **Before:** OAuth consent screen + manual IdP setup
- **Now:** Social IdP (Google) built into Cognito

### ✅ User Experience

- Users click "Sign In"
- Cognito Hosted UI shows "Sign in with Google"
- Users authenticate with their Gmail/Google account
- Redirected back to app, signed in!

### ✅ No Email/Password Option

- Only Google sign-in available
- Simpler, more secure
- Users already have Google accounts

## Testing

### Local (Mock Mode)

```bash
npm run dev
# Click "Sign In" → Instant mock auth
```

### Production (Real Google)

```bash
# After deploying Terraform and updating GitHub secrets
# Visit https://h3ow3d.com
# Click "Sign In" → Google OAuth flow
```

## Cost

- ✅ Google OAuth: **FREE**
- ✅ Cognito (< 50K MAUs): **FREE**
- ✅ No hidden costs

## Architecture

```text
User clicks "Sign In"
    ↓
Cognito Hosted UI
    ↓
"Sign in with Google"
    ↓
Google Authentication
    ↓
User grants access
    ↓
Google returns to Cognito
    ↓
Cognito creates user profile
    ↓
App receives token
    ↓
User signed in! ✅
```
