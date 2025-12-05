# CloudWatch RUM Setup

This project uses AWS CloudWatch Real User Monitoring (RUM) for error
tracking and performance monitoring with source map support.

## Architecture

```text
User Browser → CloudWatch RUM SDK → CloudWatch RUM Service
                                          ↓
Build Pipeline → Source Maps → Private S3 Bucket
                                          ↓
CloudWatch RUM Service reads source maps to un-minify stack traces
                                          ↓
                          CloudWatch Console (readable errors)
```

## Components

### 1. Frontend SDK (`aws-rum-web`)

- Captures errors, performance metrics, and HTTP calls
- Initialized in `src/main.jsx`
- Configuration in `src/utils/cloudwatch-rum.js`

### 2. AWS Infrastructure (Terraform)

- **RUM App Monitor**: Receives telemetry from browsers
- **Cognito Identity Pool**: Allows unauthenticated access for browser SDK
- **IAM Role**: Grants permission to send RUM events
- **S3 Bucket**: Stores source maps privately (90-day retention)

### 3. CI/CD Pipeline

- Builds application with source maps
- Uploads `.js.map` files to private S3 bucket
- Removes source maps from public deployment
- Deploys minified JS to public S3/CloudFront

## Deployment Steps

### 1. Apply Terraform Infrastructure

```bash
cd infra/terraform
terraform init
terraform apply
```

This creates:

- CloudWatch RUM app monitor
- Cognito identity pool
- IAM roles and policies
- Private S3 bucket for source maps

### 2. Note the Terraform Outputs

```bash
terraform output rum_app_monitor_id
terraform output rum_identity_pool_id
terraform output rum_guest_role_arn
terraform output sourcemaps_bucket_name
```

These are automatically passed to the build via GitHub Actions.

### 3. Deploy via GitHub Actions

Push to `main` branch - the workflow will:

1. Build with RUM environment variables
2. Upload source maps to private S3
3. Remove source maps from public bundle
4. Deploy to production

## Viewing Errors in CloudWatch

1. Go to AWS Console → CloudWatch → Application Monitoring → CloudWatch RUM
2. Select the `h3ow3d-monitor` app monitor
3. View dashboards:
   - **Errors**: Stack traces with original file names and line numbers
   - **Performance**: Page load times, resource timings
   - **Sessions**: User journey analytics
   - **HTTP**: API call performance

## Source Maps

### Where They're Stored

```text
s3://h3ow3d-sourcemaps/
  ├── <commit-sha-1>/
  │   ├── index-ABC123.js.map
  │   └── vendor-XYZ789.js.map
  ├── <commit-sha-2>/
  │   ├── index-DEF456.js.map
  │   └── vendor-GHI012.js.map
  └── ...
```

### Retention Policy

- Source maps are kept for **90 days**
- Old versions automatically deleted via S3 lifecycle policy
- Versioning enabled to track different deployments

### Access Control

- Bucket is **private** (no public access)
- Only CloudWatch RUM service can read them
- Access restricted to specific RUM app monitor via bucket policy

## Environment Variables

Required for production builds:

```bash
VITE_APP_VERSION=${{ github.sha }}           # Commit hash for version tracking
VITE_AWS_REGION=eu-west-2                     # AWS region
VITE_AWS_RUM_APP_ID=<from terraform>          # RUM app monitor ID
VITE_AWS_RUM_IDENTITY_POOL_ID=<from terraform> # Cognito pool ID
VITE_AWS_RUM_GUEST_ROLE_ARN=<from terraform>   # IAM role ARN
```

These are automatically injected by GitHub Actions from Terraform outputs.

## Testing Locally

CloudWatch RUM only initializes in production builds (`import.meta.env.PROD`).

To test the demo page:

```bash
npm run build
npm run preview
```

Navigate to the 🐛 icon and trigger errors. Check:

1. Browser console for RUM initialization logs
2. CloudWatch RUM console (after a few minutes)

## Cost

CloudWatch RUM pricing (eu-west-2):

- **$1.00 per 100,000 events**
- First 100,000 events per month are free

For a personal blog with low traffic:

- Estimated cost: **$0-2/month**

## Security Benefits

✅ **Source maps never exposed publicly**

- Minified code deployed to users
- Source maps in private S3 bucket
- Only CloudWatch RUM can access them

✅ **No third-party services**

- All data stays in your AWS account
- GDPR/privacy friendly
- Full control over data retention

✅ **Automatic monitoring**

- Errors captured automatically
- No user reports needed
- Full context (browser, URL, user flow)

## Troubleshooting

### RUM not initializing

Check browser console for:

```text
CloudWatch RUM: Missing required environment variables
```

Verify Terraform outputs are being passed to build.

### Source maps not working

1. Verify source maps uploaded to S3:

   ```bash
   aws s3 ls s3://h3ow3d-sourcemaps/<commit-sha>/
   ```

2. Check CloudWatch RUM app monitor has access to bucket

3. Wait 5-10 minutes for CloudWatch to process events

### Errors not appearing in CloudWatch

- RUM batches events (can take 1-5 minutes to appear)
- Check session sample rate is 1.0 (100%)
- Verify IAM role has `rum:PutRumEvents` permission

## References

- [AWS CloudWatch RUM Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html)
- [aws-rum-web SDK](https://github.com/aws-observability/aws-rum-web)
- [Source Maps Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-sourcemaps.html)
