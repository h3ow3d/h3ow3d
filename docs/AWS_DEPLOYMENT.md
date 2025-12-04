# AWS Deployment Guide for h3ow3d

This guide will help you deploy your h3ow3d blog to AWS using S3 and CloudFront.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Domain name (optional, but recommended)

## Option A: One-command IaC deploy (Terraform)

Infra code is provided in `infra/terraform/` to create:

- S3 bucket with static website hosting (SPA: index.html for 404s)
- CloudFront distribution in front of S3 (always enabled)

### Prereqs

- Terraform 1.5+
- AWS CLI configured

### Usage

```bash
cd infra/terraform
terraform init
terraform plan -var="project_name=patch-notes" -var="aws_region=us-east-1"
terraform apply -auto-approve -var="project_name=patch-notes" -var="aws_region=us-east-1"
```

Outputs will include:

- `s3_website_endpoint` — the public website URL
- `cloudfront_domain_name` — CDN URL (if enabled)

Customize via variables in `variables.tf`:

- `domain_name` and `acm_certificate_arn` if you want a custom domain

To destroy:

```bash
terraform destroy -auto-approve
```

## Option B: Manual via AWS CLI

### Step 1: Create S3 Bucket

```bash
# Create bucket (replace YOUR_BUCKET_NAME with your unique name)
aws s3 mb s3://YOUR_BUCKET_NAME

# Enable static website hosting
aws s3 website s3://YOUR_BUCKET_NAME --index-document index.html --error-document index.html
```

## Step 2: Configure Bucket Policy

Create a file `s3-bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy --bucket YOUR_BUCKET_NAME --policy file://s3-bucket-policy.json
```

## Step 3: Create CloudFront Distribution

1. Go to AWS CloudFront Console
2. Create new distribution
3. Configure:
   - **Origin Domain**: Your S3 bucket website endpoint
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Default Root Object**: index.html
   - **Error Pages**: Add custom error response for 404 → /index.html (for SPA routing)

## Step 4: Update package.json

Replace placeholders in the deploy script:

```json
"deploy": "npm run build && aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete && aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'"
```

## Step 5: Deploy

```bash
npm run deploy
```

## Optional: Custom Domain with Route 53

1. Request SSL certificate in ACM (must be in us-east-1)
2. Add custom domain to CloudFront distribution
3. Create Route 53 A record pointing to CloudFront

## Cost Estimate

- **S3**: ~$0.023 per GB stored + $0.09 per GB transfer
- **CloudFront**: First 1TB free per month, then $0.085 per GB
- **Route 53**: $0.50 per hosted zone per month

For a small blog: **$1-5/month**

## Useful Commands

```bash
# Build locally
npm run build

# Preview build
npm run preview

# Deploy to S3
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'
```
