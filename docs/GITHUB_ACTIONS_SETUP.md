# GitHub Actions Setup for SSO

This guide covers how to set up GitHub Actions secrets for deploying your SSO
infrastructure with Terraform.

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. Google OAuth Credentials

- `TF_VAR_google_client_id` - Your Google OAuth Client ID
- `TF_VAR_google_client_secret` - Your Google OAuth Client Secret

The `TF_VAR_` prefix tells Terraform to treat these as Terraform variables
automatically.

### 2. AWS Credentials (if not already set)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Adding Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value
5. Click **Add secret**

## Updating Your GitHub Actions Workflow

Your workflow needs to:

1. **Pass Terraform variables** for infrastructure deployment
2. **Pass Cognito configuration** to the Vite build

### Example Workflow Steps

```yaml
- name: Terraform Apply
  working-directory: infra/terraform
  env:
    TF_VAR_google_client_id: ${{ secrets.TF_VAR_google_client_id }}
    TF_VAR_google_client_secret: ${{ secrets.TF_VAR_google_client_secret }}
  run: |
    terraform init
    terraform apply -auto-approve

- name: Get Terraform Outputs
  id: tf_outputs
  working-directory: infra/terraform
  run: |
    echo "cognito_domain=$(terraform output -raw cognito_domain)" >> \
      $GITHUB_OUTPUT
    echo "cognito_client_id=$(terraform output -raw cognito_client_id)" >> \
      $GITHUB_OUTPUT
    echo "cognito_user_pool_id=$(
      terraform output -raw cognito_user_pool_id
    )" >> \
      $GITHUB_OUTPUT

- name: Build Application
  env:
    VITE_MOCK_AUTH: false
    VITE_COGNITO_DOMAIN: ${{ steps.tf_outputs.outputs.cognito_domain }}
    VITE_COGNITO_CLIENT_ID: \
      ${{ steps.tf_outputs.outputs.cognito_client_id }}
    VITE_COGNITO_USER_POOL_ID: \
      ${{ steps.tf_outputs.outputs.cognito_user_pool_id }}
    VITE_COGNITO_REGION: eu-west-2
    VITE_RUM_APP_MONITOR_ID: 5b322ad5-4c81-45a6-aa38-e8a428b726e9
    VITE_RUM_IDENTITY_POOL_ID: \
      eu-west-2:095e0231-ef63-4bd1-a3ec-1935f6105dfd
    VITE_RUM_REGION: eu-west-2
  run: npm run build
```

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use GitHub secrets** for sensitive values like OAuth client secrets
3. **Rotate credentials regularly** if compromised
4. **Limit AWS IAM permissions** to only what's needed for deployment

## Terraform State Management

Ensure your Terraform backend is configured to use S3 for state storage:

```hcl
terraform {
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "h3ow3d/cognito/terraform.tfstate"
    region = "eu-west-2"
  }
}
```

This prevents conflicts when running Terraform from GitHub Actions.

## Testing the Workflow

1. Push your changes to trigger the workflow
2. Check the Actions tab to monitor the deployment
3. Review Terraform plan/apply output for any errors
4. Verify the application builds with Cognito configuration

## Troubleshooting

### Error: "No value for required variable"

- Check that secret names match exactly (case-sensitive)
- Ensure `TF_VAR_` prefix is used for Terraform variables

### Error: "Invalid provider credentials"

- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set
- Check IAM permissions for Cognito operations

### Build fails with undefined environment variables

- Ensure Terraform outputs step runs before build
- Check `GITHUB_OUTPUT` syntax is correct for your runner version

## Next Steps

After setting up GitHub Actions:

1. Create Google OAuth credentials (see [GOOGLE_SOCIAL_IDP_SETUP.md](./GOOGLE_SOCIAL_IDP_SETUP.md))
2. Add secrets to GitHub repository
3. Push changes to trigger deployment
4. Test SSO authentication on production site
