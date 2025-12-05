# Deployment Checklist for CloudWatch RUM

## ✅ Pre-Deployment (Complete)

- [x] CloudWatch RUM SDK installed (`aws-rum-web`)
- [x] Frontend integration complete (`src/main.jsx`, `src/utils/cloudwatch-rum.js`)
- [x] Terraform infrastructure defined (`infra/terraform/cloudwatch-rum.tf`)
- [x] GitHub Actions workflow updated
- [x] Setup-terraform action updated to extract RUM outputs
- [x] Source map demo page ready (🐛 icon)
- [x] Documentation created
- [x] Build tested locally

## 🚀 Deployment Steps

### 1. Commit and Push

```bash
git add .
git commit -m "feat: add AWS CloudWatch RUM with source maps"
git push origin main
```

### 2. Monitor GitHub Actions

Watch the workflow at: <https://github.com/h3ow3d/h3ow3d/actions>

**What will happen:**

1. ✅ Checkout code
2. ✅ Setup Node.js and install dependencies
3. ✅ Configure AWS credentials
4. ✅ **Terraform init** (initialize with new cloudwatch-rum.tf)
5. ✅ **Terraform apply** (create RUM resources - auto-approved in workflow)
6. ✅ Get Terraform outputs (including new RUM values)
7. ✅ Build app with RUM environment variables
8. ✅ Upload source maps to private S3 bucket
9. ✅ Remove source maps from public bundle
10. ✅ Deploy to S3
11. ✅ Invalidate CloudFront cache

**Expected duration:** 5-8 minutes

### 3. Verify Terraform Resources Created

After workflow completes, check that these resources exist:

```bash
# List RUM app monitors
aws rum list-app-monitors --region eu-west-2

# List Cognito identity pools
aws cognito-identity list-identity-pools --max-results 10 --region eu-west-2

# Check source maps bucket
aws s3 ls | grep sourcemaps
```

### 4. Test the Demo Page

1. Visit your site (wait for CloudFront cache to clear if needed)
2. Look for "CloudWatch RUM: Initialized successfully" in browser console
3. Click the 🐛 icon to open the demo page
4. Click any error button
5. Verify errors appear in browser console

### 5. Check CloudWatch RUM Console (after 5-10 minutes)

```bash
# Open CloudWatch RUM in AWS Console
open "https://console.aws.amazon.com/cloudwatch/home?region=eu-west-2#rum:monitors"
```

Or navigate to:

- AWS Console → CloudWatch → Application Monitoring → CloudWatch RUM
- Select `h3ow3d-monitor`
- View errors with un-minified stack traces

### 6. Verify Source Maps

```bash
# Check that source maps were uploaded
aws s3 ls s3://h3ow3d-sourcemaps/ --recursive

# You should see files like:
# <commit-sha>/index-ABC123.js.map
# <commit-sha>/vendor-XYZ789.js.map
```

## 🔍 What to Look For

### In GitHub Actions Logs

```text
✅ Found RUM app monitor: <id>
✅ Found RUM identity pool: <pool-id>
✅ Found RUM role: arn:aws:iam::...
✅ Found source maps bucket: h3ow3d-sourcemaps
📦 Uploading source maps to s3://h3ow3d-sourcemaps/<commit-sha>/
  ✓ Uploaded index-ABC123.js.map
  ✓ Uploaded vendor-XYZ789.js.map
✅ Source maps uploaded successfully
🗑️  Removing source maps from dist/ before public deployment
✅ Source maps removed from public bundle
```

### In Browser Console

```text
CloudWatch RUM: Initialized successfully
  appId: "<your-app-id>"
  version: "<commit-sha>"
  region: "eu-west-2"
```

### In CloudWatch RUM Dashboard

- **Errors tab**: Stack traces showing `SourceMapDemo.jsx:10:5`
- **Performance tab**: Page load metrics
- **Sessions tab**: User session data

## 🆘 Troubleshooting

### Workflow fails on Terraform apply

**Issue:** Terraform can't create resources

**Solutions:**

- Check AWS credentials are valid
- Verify region is correct (eu-west-2)
- Check if bucket name `h3ow3d-sourcemaps` is available
- Review Terraform error in workflow logs

### RUM not initializing in browser

**Issue:** No console log "CloudWatch RUM: Initialized successfully"

**Check:**

1. View page source - verify environment variables are in JS:

   ```text
   VITE_AWS_RUM_APP_ID
   VITE_AWS_RUM_IDENTITY_POOL_ID
   VITE_AWS_RUM_GUEST_ROLE_ARN
   ```

2. Check GitHub Actions build logs for RUM env vars
3. Ensure you're on production site (not localhost)

### Source maps not in S3

**Issue:** No files in `s3://h3ow3d-sourcemaps/`

**Check:**

1. Review GitHub Actions logs for "Uploading source maps"
2. Verify build generated `.js.map` files before upload
3. Check AWS credentials have S3 write permissions

### Errors not appearing in CloudWatch

**Issue:** No data in CloudWatch RUM dashboard

**Wait first:** Events can take 5-10 minutes to appear

**Then check:**

1. RUM SDK initialized (browser console log)
2. IAM role has `rum:PutRumEvents` permission
3. Cognito identity pool is properly configured
4. Network tab shows requests to `dataplane.rum.eu-west-2.amazonaws.com`

### Stack traces still minified

**Issue:** Errors show `index-ABC123.js:1:23456` instead of original files

**Wait first:** CloudWatch needs time to process source maps

**Then check:**

1. Source maps uploaded to S3 for this version
2. Bucket policy allows CloudWatch RUM access
3. Try a fresh error (not cached)

## 📊 Expected Costs

### CloudWatch RUM

- **Free tier**: 100,000 events/month
- **After free tier**: $1.00 per 100,000 events
- **Estimated for blog**: $0-2/month

### S3 Source Maps

- **Storage**: ~1MB per version × 90 days retention
- **Cost**: ~$0.02/month
- **Lifecycle**: Auto-cleanup after 90 days

### Total estimated cost: **$0-2/month**

## 📚 Additional Resources

- See `docs/CLOUDWATCH_RUM.md` for detailed documentation
- See `CLOUDWATCH_RUM_SETUP.md` for architecture overview
- [AWS CloudWatch RUM Docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html)

---

**Ready?** Just push to GitHub and watch the magic happen! 🚀
