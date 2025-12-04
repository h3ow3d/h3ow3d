---
id: 2
date: 2024-11-20
title: Building a Serverless API with AWS Lambda
excerpt: Deep dive into building a scalable serverless REST API using AWS Lambda, API Gateway, and DynamoDB.
tags:
  - aws
  - serverless
  - backend
---

# Building a Serverless API with AWS Lambda

Recently, I built a serverless REST API for a side project. Here's what I learned about AWS Lambda and serverless architecture.

## Architecture Overview

The stack consists of:
- **API Gateway** - HTTP endpoints
- **Lambda Functions** - Business logic
- **DynamoDB** - NoSQL database
- **CloudWatch** - Monitoring and logs

## Key Learnings

### Cold Starts
Cold starts are real, but not as bad as I thought:
- Kept functions under 10MB
- Used provisioned concurrency for critical endpoints
- Average cold start: ~800ms

### Cost Optimization
Serverless doesn't always mean cheaper:
- Pay per request model works great for sporadic traffic
- DynamoDB on-demand pricing saved 60% vs provisioned
- CloudWatch logs can add up - implement retention policies

### Development Tips
```javascript
// Use environment variables
const TABLE_NAME = process.env.TABLE_NAME;

// Reuse connections outside handler
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  // Handler code here
};
```

## Results

- 99.9% uptime
- <100ms avg response time (after warm-up)
- $5/month for 100K requests

Would definitely use serverless again for APIs with variable traffic!
