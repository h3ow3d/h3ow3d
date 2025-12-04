// Auto-generated from content/posts/*.md
// Run 'npm run generate-posts' to regenerate this file

export const posts = [
  {
    "id": 1,
    "date": "2024-12-01T00:00:00.000Z",
    "title": "Launching h3ow3d Blog",
    "excerpt": "Welcome to h3ow3d! A new way to share my tech project updates and development journey.",
    "tags": [
      "announcement",
      "meta"
    ],
    "content": "Welcome to **h3ow3d** - my personal tech blog where I'll be sharing updates about my projects, lessons learned, and interesting technical challenges I encounter.\n\n## Why h3ow3d?\n\nI've always loved the format of h3ow3d in software and games. They're:\n\n- **Clear and structured** - Easy to follow what changed\n- **Version-based** - Track progress over time\n- **Technical yet accessible** - Balance detail with readability\n\n## What to Expect\n\nI'll be posting about:\n\n- Web development projects\n- Cloud infrastructure experiments\n- DevOps learnings\n- Code optimization stories\n- Architecture decisions\n\n## Tech Stack\n\nThis blog itself is built with:\n\n- **React** - For the UI\n- **Vite** - Lightning fast development\n- **AWS S3 + CloudFront** - Static hosting with global CDN\n- **React Markdown** - For content rendering\n\nStay tuned for more updates!",
    "filename": "2024-12-01-launching-h3ow3d-blog.md"
  },
  {
    "id": 2,
    "date": "2024-11-20T00:00:00.000Z",
    "title": "Building a Serverless API with AWS Lambda",
    "excerpt": "Deep dive into building a scalable serverless REST API using AWS Lambda, API Gateway, and DynamoDB.",
    "tags": [
      "aws",
      "serverless",
      "backend"
    ],
    "content": "Recently, I built a serverless REST API for a side project. Here's what I learned about AWS Lambda and serverless architecture.\n\n## Architecture Overview\n\nThe stack consists of:\n\n- **API Gateway** - HTTP endpoints\n- **Lambda Functions** - Business logic\n- **DynamoDB** - NoSQL database\n- **CloudWatch** - Monitoring and logs\n\n## Key Learnings\n\n### Cold Starts\n\nCold starts are real, but not as bad as I thought:\n\n- Kept functions under 10MB\n- Used provisioned concurrency for critical endpoints\n- Average cold start: ~800ms\n\n### Cost Optimization\n\nServerless doesn't always mean cheaper:\n\n- Pay per request model works great for sporadic traffic\n- DynamoDB on-demand pricing saved 60% vs provisioned\n- CloudWatch logs can add up - implement retention policies\n\n### Development Tips\n\n```javascript\n// Use environment variables\nconst TABLE_NAME = process.env.TABLE_NAME\n\n// Reuse connections outside handler\nconst dynamodb = new AWS.DynamoDB.DocumentClient()\n\nexport const handler = async (event) => {\n  // Handler code here\n}\n```\n\n## Results\n\n- 99.9% uptime\n- <100ms avg response time (after warm-up)\n- $5/month for 100K requests\n\nWould definitely use serverless again for APIs with variable traffic!",
    "filename": "2024-11-20-building-serverless-api.md"
  },
  {
    "id": 3,
    "date": "2024-11-10T00:00:00.000Z",
    "title": "React Performance: Lessons from a Slow App",
    "excerpt": "How I improved my React app performance by 300% through code splitting, memoization, and lazy loading.",
    "tags": [
      "react",
      "performance",
      "frontend"
    ],
    "content": "My React dashboard was getting slow. Really slow. Here's how I fixed it.\n\n## The Problem\n\nInitial render time: **4.2 seconds** 😱\n\n- Bundle size: 2.3MB\n- Unnecessary re-renders everywhere\n- No code splitting\n\n## Solutions Applied\n\n### 1. Code Splitting\n\n```javascript\n// Before: Import everything\nimport Dashboard from './Dashboard'\n\n// After: Lazy load\nconst Dashboard = lazy(() => import('./Dashboard'))\n```\n\n**Result**: Initial bundle down to 400KB\n\n### 2. Memoization\n\nUsed `React.memo` and `useMemo` strategically:\n\n```javascript\nconst MemoizedChart = React.memo(Chart, (prev, next) => {\n  return prev.data === next.data\n})\n```\n\n### 3. Virtual Scrolling\n\nFor long lists, implemented react-window:\n\n- Renders only visible items\n- Handles 10,000+ items smoothly\n\n## Final Results\n\n- **Initial load**: 4.2s → 1.2s (71% improvement)\n- **Time to interactive**: 5.1s → 1.5s\n- **Bundle size**: 2.3MB → 450KB\n\n## Key Takeaways\n\n1. Measure before optimizing (use React DevTools Profiler)\n2. Code splitting is your friend\n3. Don't memo everything - profile first\n4. Virtual scrolling for large lists\n\nPerformance matters! 🚀",
    "filename": "2024-11-10-react-performance.md"
  }
];
