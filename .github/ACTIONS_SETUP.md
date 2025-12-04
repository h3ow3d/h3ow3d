# GitHub Actions Setup

This repository uses GitHub Actions to automatically build and deploy the application to AWS S3 and CloudFront whenever changes are pushed to the `main` branch.

## Required GitHub Secrets

To enable automated deployments, you need to configure the following secrets in your GitHub repository:

### Navigate to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Required Secrets:

1. **AWS_ACCESS_KEY_ID**
   - Your AWS access key ID
   - Used to authenticate with AWS services

2. **AWS_SECRET_ACCESS_KEY**
   - Your AWS secret access key
   - Used to authenticate with AWS services

3. **S3_BUCKET** (Optional if using Terraform)
   - The name of your S3 bucket
   - Example: `my-blog-bucket`
   - If you're using Terraform, this will be read automatically from Terraform outputs

4. **CLOUDFRONT_DISTRIBUTION_ID** (Optional)
   - Your CloudFront distribution ID
   - Example: `E1234567890ABC`
   - If not provided, CloudFront cache invalidation will be skipped
   - If you're using Terraform, this will be read automatically from Terraform outputs

## How to Get AWS Credentials

### Option 1: Create an IAM User (Recommended for CI/CD)

1. Go to AWS IAM Console
2. Create a new user for GitHub Actions
3. Attach the following policies:
   - `AmazonS3FullAccess` (or a more restrictive custom policy)
   - `CloudFrontFullAccess` (if using CloudFront)
4. Create access keys for this user
5. Copy the Access Key ID and Secret Access Key

### Option 2: Use Existing AWS CLI Credentials

If you already have AWS CLI configured locally:
```bash
cat ~/.aws/credentials
```

⚠️ **Security Note**: Never commit AWS credentials to your repository!

## Custom Policy (More Secure)

Instead of using full access policies, create a custom policy with only the required permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

## Workflow Triggers

The deployment workflow runs automatically when:
- Code is pushed to the `main` branch
- Manually triggered via the Actions tab (using workflow_dispatch)

## Workflow Steps

1. **Checkout code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js 18
3. **Install dependencies** - Runs `npm ci` for clean install
4. **Build application** - Runs `npm run build` to create production build
5. **Configure AWS credentials** - Authenticates with AWS
6. **Get Terraform outputs** - Attempts to read S3 bucket and CloudFront ID from Terraform state (if available)
7. **Deploy to S3** - Syncs the built files to S3 with appropriate cache headers
8. **Invalidate CloudFront cache** - Clears the CDN cache (if configured)
9. **Deployment summary** - Shows deployment details in the workflow summary

## Manual Deployment

You can manually trigger a deployment:

1. Go to the **Actions** tab in your GitHub repository
2. Select the **Build and Deploy to AWS** workflow
3. Click **Run workflow**
4. Select the branch (usually `main`)
5. Click **Run workflow**

## Monitoring Deployments

- View deployment status in the **Actions** tab
- Each workflow run shows detailed logs for each step
- Check the deployment summary for quick overview of what was deployed

## Terraform Integration

If you're using Terraform to manage your infrastructure:
- The workflow will automatically detect Terraform state
- It will read the S3 bucket name and CloudFront distribution ID from Terraform outputs
- No need to manually configure these as GitHub secrets

## Troubleshooting

### Deployment fails with authentication error
- Verify AWS credentials are correct in GitHub secrets
- Check IAM user has necessary permissions

### S3 sync fails
- Verify S3_BUCKET secret is set correctly
- Check bucket exists and is accessible
- Ensure IAM user has S3 permissions

### CloudFront invalidation fails
- Verify CLOUDFRONT_DISTRIBUTION_ID is correct
- Check IAM user has CloudFront permissions
- This step is optional and won't fail the deployment

## Local Testing

You can still deploy locally using the Makefile:
```bash
make deploy
```

Or with npm:
```bash
npm run deploy
```
