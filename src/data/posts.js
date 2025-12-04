export const posts = [
  {
    id: 1,
    version: 'v1.0.0',
    date: '2024-12-01',
    title: 'Launching h3ow3d Blog',
    excerpt: 'Welcome to h3ow3d! A new way to share my tech project updates and development journey.',
    tags: ['announcement', 'meta'],
    content: `# Launching h3ow3d Blog

Welcome to **h3ow3d** - my personal tech blog where I'll be sharing updates about my projects, lessons learned, and interesting technical challenges I encounter.

## Why h3ow3d?

I've always loved the format of h3ow3d in software and games. They're:
- **Clear and structured** - Easy to follow what changed
- **Version-based** - Track progress over time
- **Technical yet accessible** - Balance detail with readability

## What to Expect

I'll be posting about:
- Web development projects
- Cloud infrastructure experiments
- DevOps learnings
- Code optimization stories
- Architecture decisions

## Tech Stack

This blog itself is built with:
- **React** - For the UI
- **Vite** - Lightning fast development
- **AWS S3 + CloudFront** - Static hosting with global CDN
- **React Markdown** - For content rendering

Stay tuned for more updates!
`
  },
  {
    id: 2,
    version: 'v0.9.0',
    date: '2024-11-20',
    title: 'Building a Serverless API with AWS Lambda',
    excerpt: 'Deep dive into building a scalable serverless REST API using AWS Lambda, API Gateway, and DynamoDB.',
    tags: ['aws', 'serverless', 'backend'],
    content: `# Building a Serverless API with AWS Lambda

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
\`\`\`javascript
// Use environment variables
const TABLE_NAME = process.env.TABLE_NAME;

// Reuse connections outside handler
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  // Handler code here
};
\`\`\`

## Results

- 99.9% uptime
- <100ms avg response time (after warm-up)
- $5/month for 100K requests

Would definitely use serverless again for APIs with variable traffic!
`
  },
  {
    id: 3,
    version: 'v0.8.5',
    date: '2024-11-10',
    title: 'React Performance: Lessons from a Slow App',
    excerpt: 'How I improved my React app performance by 300% through code splitting, memoization, and lazy loading.',
    tags: ['react', 'performance', 'frontend'],
    content: `# React Performance: Lessons from a Slow App

My React dashboard was getting slow. Really slow. Here's how I fixed it.

## The Problem

Initial render time: **4.2 seconds** 😱
- Bundle size: 2.3MB
- Unnecessary re-renders everywhere
- No code splitting

## Solutions Applied

### 1. Code Splitting
\`\`\`javascript
// Before: Import everything
import Dashboard from './Dashboard';

// After: Lazy load
const Dashboard = lazy(() => import('./Dashboard'));
\`\`\`

**Result**: Initial bundle down to 400KB

### 2. Memoization
Used \`React.memo\` and \`useMemo\` strategically:
\`\`\`javascript
const MemoizedChart = React.memo(Chart, (prev, next) => {
  return prev.data === next.data;
});
\`\`\`

### 3. Virtual Scrolling
For long lists, implemented react-window:
- Renders only visible items
- Handles 10,000+ items smoothly

## Final Results

- **Initial load**: 4.2s → 1.2s (71% improvement)
- **Time to interactive**: 5.1s → 1.5s
- **Bundle size**: 2.3MB → 450KB

## Key Takeaways

1. Measure before optimizing (use React DevTools Profiler)
2. Code splitting is your friend
3. Don't memo everything - profile first
4. Virtual scrolling for large lists

Performance matters! 🚀
`
  }
];
