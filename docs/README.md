# Documentation

## 🚀 Deployment Guides

### Getting Started

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Complete
  deployment checklist for all features

### AWS Infrastructure

- **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** - General AWS setup and
  configuration

## 🔐 Authentication (SSO)

- **[SSO_SETUP.md](./SSO_SETUP.md)** - Overview and quick start guide
- **[GOOGLE_SOCIAL_IDP_SETUP.md](./GOOGLE_SOCIAL_IDP_SETUP.md)** - Google
  OAuth credential setup
- **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** - CI/CD secrets
  configuration

**Quick Start**: Users sign in with Google. See SSO_SETUP.md for mock auth
in development.

## 📊 Monitoring (CloudWatch RUM)

- **[CLOUDWATCH_RUM.md](./CLOUDWATCH_RUM.md)** - Complete RUM documentation
  and troubleshooting
- **[CLOUDWATCH_RUM_SETUP.md](./CLOUDWATCH_RUM_SETUP.md)** - Quick reference
  guide

**Quick Start**: Error tracking with source maps. See CLOUDWATCH_RUM_SETUP.md
for quick deploy.

## 💬 Features

- **[COMMENTS_SETUP.md](./COMMENTS_SETUP.md)** - Giscus comments integration
- **[POST_MANAGEMENT.md](./POST_MANAGEMENT.md)** - Blog post workflow and
  management

## 📋 Planning

- **[TODO.md](./TODO.md)** - Feature tracking and roadmap

## Document Structure

```text
docs/
├── README.md (this file)
│
├── Deployment
│   ├── DEPLOYMENT_CHECKLIST.md    (Main checklist)
│   └── AWS_DEPLOYMENT.md           (AWS basics)
│
├── Authentication
│   ├── SSO_SETUP.md                (Overview)
│   ├── GOOGLE_SOCIAL_IDP_SETUP.md  (Google OAuth)
│   └── GITHUB_ACTIONS_SETUP.md     (CI/CD config)
│
├── Monitoring
│   ├── CLOUDWATCH_RUM.md           (Full guide)
│   └── CLOUDWATCH_RUM_SETUP.md     (Quick reference)
│
├── Features
│   ├── COMMENTS_SETUP.md           (Giscus)
│   └── POST_MANAGEMENT.md          (Blog workflow)
│
└── Planning
    └── TODO.md                     (Roadmap)
```

## Quick Links

### For Development

1. Start local dev: See project README.md
2. Mock auth: `.env.local` has `VITE_MOCK_AUTH=true`
3. Test RUM: Production only (check browser console)

### For Deployment

1. Review: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. Google OAuth: [GOOGLE_SOCIAL_IDP_SETUP.md](./GOOGLE_SOCIAL_IDP_SETUP.md)
3. GitHub Secrets: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
4. Deploy: `git push origin main`

### For Monitoring

1. CloudWatch RUM: AWS Console → CloudWatch → RUM → `h3ow3d-monitor`
2. Cognito Users: AWS Console → Cognito → User Pools → `h3ow3d-users`
3. Errors: See [CLOUDWATCH_RUM.md](./CLOUDWATCH_RUM.md) troubleshooting

## Architecture Overview

```text
User → CloudFront → S3 (Static Site)
  ↓
Sign In → Cognito Hosted UI → Google OAuth
  ↓
Authenticated → RUM Tracking → CloudWatch

GitHub Actions
  ↓
Terraform (Infrastructure)
  ↓
Vite Build (with env vars)
  ↓
S3 Upload (source maps + dist)
  ↓
CloudFront Invalidation
```

## Key Technologies

- **Frontend**: React, Vite, Lucide Icons
- **Auth**: AWS Cognito, Google Social IdP
- **Monitoring**: CloudWatch RUM with source maps
- **Comments**: Giscus (GitHub Discussions)
- **Infrastructure**: Terraform
- **Hosting**: S3 + CloudFront
- **CI/CD**: GitHub Actions
