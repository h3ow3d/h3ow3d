# CloudWatch RUM Quick Start

> **📚 Full documentation**: See [CLOUDWATCH_RUM.md](./CLOUDWATCH_RUM.md)

## What You Have

✅ CloudWatch RUM SDK integrated (`aws-rum-web`)
✅ Terraform infrastructure configured
✅ GitHub Actions workflow with source map upload
✅ Demo page with error testing (`🐛` icon in header)

## Quick Deploy

### 1. Infrastructure

```bash
cd infra/terraform
terraform init
terraform apply
```

### 2. Deploy

```bash
git push origin main
```

GitHub Actions will automatically:

- Build with RUM configuration
- Upload source maps to private S3
- Deploy to production

### 3. Test

1. Visit your site
2. Click 🐛 icon for demo page
3. Trigger test errors
4. Check CloudWatch RUM dashboard (5-10 min delay)

## Key Files

### Frontend

- `src/utils/cloudwatch-rum.js` - RUM SDK initialization
- `src/main.jsx` - RUM startup
- `src/components/SourceMapDemo.jsx` - Test page

### Infrastructure

- `infra/terraform/cloudwatch-rum.tf` - RUM resources
- `.github/workflows/build-and-deploy.yml` - Source map upload

## Resources Created

- **RUM App Monitor**: `h3ow3d-monitor`
- **Identity Pool**: For unauthenticated browser access
- **S3 Bucket**: Private source map storage (90-day retention)
- **IAM Role**: RUM event permissions

## Viewing Data

**AWS Console** → **CloudWatch** → **Application Monitoring** → **RUM**

Select `h3ow3d-monitor` to view:

- Errors (with un-minified stack traces)
- Performance metrics
- Session analytics
- HTTP telemetry

## Cost

- **Free tier**: 100,000 events/month
- **After free tier**: $1.00 per 100,000 events
- **Estimated**: $0-2/month

## Troubleshooting

### No data in dashboard

- Wait 5-10 minutes for events to appear
- Check browser console for "CloudWatch RUM: Initialized successfully"
- Verify site is production (not localhost)

### Stack traces still minified

- Wait for CloudWatch to process source maps
- Verify source maps uploaded to S3: `aws s3 ls s3://h3ow3d-sourcemaps/`
- Check bucket policy allows CloudWatch RUM access

### More Help

See [CLOUDWATCH_RUM.md](./CLOUDWATCH_RUM.md) for:

- Detailed architecture
- Complete troubleshooting guide
- Environment variable reference
- Security best practices
- CloudWatch alerts setup
- Advanced configuration
