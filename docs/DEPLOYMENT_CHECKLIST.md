# Deployment Checklist

## ✅ Infrastructure Complete

- [x] CloudWatch RUM configured and deployed
- [x] Cognito User Pool with Google Social IdP configured
- [x] Terraform infrastructure defined and documented
- [x] GitHub Actions workflow configured
- [x] Source maps enabled for error debugging

## ✅ Frontend Complete

- [x] RUM SDK integrated (`aws-rum-web`)
- [x] Custom event tracking throughout app
- [x] SSO authentication with Google
- [x] User profile management
- [x] Mock auth for development
- [x] Lucide React icons
- [x] Comments system (Giscus)
- [x] RSS feed generation

## 🚀 Deployment Prerequisites

### 1. Google OAuth Credentials

- [ ] Created OAuth 2.0 Client ID in Google Cloud Console
- [ ] Added callback URLs to authorized redirect URIs
- [ ] Saved Client ID and Client Secret

See: `docs/GOOGLE_SOCIAL_IDP_SETUP.md`

### 2. GitHub Secrets Configured

- [x] `AWS_ACCESS_KEY_ID`
- [x] `AWS_SECRET_ACCESS_KEY`
- [x] `TF_VAR_GOOGLE_CLIENT_ID`
- [x] `TF_VAR_GOOGLE_CLIENT_SECRET`

**Note:** GitHub automatically uppercases secret names.

See: `docs/GITHUB_ACTIONS_SETUP.md`

## 🚀 Deployment Steps

### 1. Deploy Terraform Infrastructure

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

This creates:

- Cognito User Pool
- Google Social Identity Provider
- User Pool Client
- Cognito Hosted UI Domain

### 2. Commit and Push

```bash
git add .
git commit -m "feat: deploy SSO with Google Social IdP"
git push origin main
```

### 3. Monitor GitHub Actions

Watch the workflow at: <https://github.com/h3ow3d/h3ow3d/actions>

**Deployment steps:**

1. ✅ Checkout code
2. ✅ Setup Node.js and install dependencies
3. ✅ Configure AWS credentials
4. ✅ Terraform init and apply (with Google OAuth secrets)
5. ✅ Get Terraform outputs (Cognito config, RUM config)
6. ✅ Build app with all environment variables
7. ✅ Upload source maps to private S3 bucket
8. ✅ Remove source maps from public bundle
9. ✅ Deploy to CloudFront via S3

### 4. Verify Deployment

1. **Check Cognito User Pool**
   - AWS Console → Cognito → User Pools → h3ow3d-users
   - Verify Google identity provider is configured
   - Check domain: `h3ow3d-auth.auth.eu-west-2.amazoncognito.com`

2. **Test Authentication**
   - Visit <https://h3ow3d.com>
   - Click "Sign In" button
   - Should redirect to Cognito Hosted UI
   - Sign in with Google account
   - Verify redirected back and authenticated

3. **Check RUM Dashboard**
   - AWS Console → CloudWatch → RUM → h3ow3d-monitor
   - Verify sessions being recorded
   - Check custom events (theme_toggle, post_view, etc.)
   - Verify user authentication events tracked

4. **Test User Profile**
   - Click profile icon in header
   - Verify profile page displays user info
   - Test sign-out functionality

## 📊 Post-Deployment Monitoring

### CloudWatch RUM Metrics

Monitor these metrics in CloudWatch:

- Session count
- Error rate
- Page load times
- Custom event counts (post_view, comment_click, etc.)
- User authentication events

### Cognito Metrics

- Sign-in attempts
- Failed authentication
- User registrations
- Token usage

### Cost Monitoring

- CloudWatch RUM: Usage and costs
- Cognito: MAU (Monthly Active Users)
- CloudFront: Data transfer and requests

## 🔧 Troubleshooting

### Authentication Issues

**Problem:** "Invalid redirect URI"

- Check callback URLs in `cognito.tf`
- Verify Terraform applied successfully
- Check CloudFront distribution URL matches callback

**Problem:** Google sign-in fails

- Verify Google OAuth credentials in GitHub Secrets
- Check authorized redirect URIs in Google Cloud Console
- Ensure Cognito domain matches redirect URI

### RUM Not Tracking

**Problem:** No sessions in RUM dashboard

- Check browser console for errors
- Verify RUM environment variables in build
- Check identity pool permissions
- Ensure RUM initialized before page interactions

### Deployment Failures

**Problem:** Terraform apply fails

- Check AWS credentials in GitHub Secrets
- Verify IAM permissions for Cognito operations
- Check Terraform state lock (S3 backend)
- Review GitHub Actions logs for specific errors

**Problem:** Build fails with missing env vars

- Verify Terraform outputs step succeeded
- Check workflow YAML syntax
- Ensure all VITE\_ variables defined

## 📚 Additional Documentation

- `docs/SSO_SETUP.md` - SSO authentication overview
- `docs/GOOGLE_SOCIAL_IDP_SETUP.md` - Google OAuth setup guide
- `docs/GITHUB_ACTIONS_SETUP.md` - CI/CD integration guide
- `docs/CLOUDWATCH_RUM.md` - RUM monitoring documentation

## 💰 Expected Costs

### CloudWatch RUM

- Free tier: 100,000 events/month
- After free tier: $1.00 per 100,000 events
- Estimated: $0-2/month for typical blog traffic

### AWS Cognito

- Free tier: 50,000 MAU (Monthly Active Users)
- After free tier: $0.0055 per MAU
- Estimated: $0/month (under free tier for blog)

### S3 & CloudFront

- Existing costs (source maps add ~$0.02/month)

Total additional cost: ~$0-2/month
