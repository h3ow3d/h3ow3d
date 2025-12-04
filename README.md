# h3ow3d 🚀

A modern, single-page tech blog by h3ow3d, built with React and deployed on AWS. Perfect for sharing project updates, technical articles, and development stories in a clean, developer-focused format.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Single Page Application** - Fast, smooth navigation with React
- **Markdown Support** - Write posts in Markdown with syntax highlighting
- **Responsive Design** - Looks great on desktop, tablet, and mobile
- **Version-Based Posts** - Each post has a version tag for tracking updates
- **AWS Hosted** - Static hosting on S3 with CloudFront CDN
- **Dark Theme** - Easy on the eyes with a modern dark UI
- **Fast & Lightweight** - Optimized build with Vite

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Markdown**: React Markdown
- **Hosting**: AWS S3 + CloudFront
- **CI/CD**: AWS CLI

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd patch-notes

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📝 Adding New Posts

1. Open `src/data/posts.js`
2. Add a new post object to the array:

```javascript
{
  id: 4,
  version: 'v1.1.0',
  date: '2024-12-10',
  title: 'Your Post Title',
  excerpt: 'A brief description of your post',
  tags: ['tag1', 'tag2'],
  content: `
# Your Post Title

Your markdown content here...
  `
}
```

Posts automatically appear on the homepage in reverse chronological order.

## 🎨 Customization

### Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: #3B82F6;        /* Blue */
  --secondary: #10B981;      /* Green */
  --background: #0F172A;     /* Dark background */
  --text: #F1F5F9;           /* Light text */
}
```

### Site Title & Tagline

Set in `src/components/Header.jsx`:

```javascript
<h1 className="logo">h3ow3d</h1>
<p className="tagline">Patch Notes • Tech Projects & Development Stories</p>
```

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder.

## ☁️ Deploying to AWS

### Step 1: Set Up AWS

1. Create an S3 bucket for static hosting
2. Create a CloudFront distribution
3. Configure AWS CLI with your credentials

See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for detailed instructions.

### Step 2: Update Deploy Script

In `package.json`, replace placeholders:

```json
"deploy": "npm run build && aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete && aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'"
```

### Step 3: Deploy

```bash
npm run deploy
```

## 📁 Project Structure

```
patch-notes/
├── public/
│   └── favicon.svg           # Site icon
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Site header
│   │   ├── BlogList.jsx      # Post listing
│   │   ├── BlogPost.jsx      # Individual post view
│   │   └── *.css             # Component styles
│   ├── data/
│   │   └── posts.js          # Blog post content
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies & scripts
```

## 🎯 Features to Add

Some ideas for future enhancements:

- [ ] Add search functionality
- [ ] Implement tags filtering
- [x] Add RSS feed
- [x] Dark/light theme toggle
- [ ] Reading time estimates
- [ ] Share buttons
- [x] Comments system
- [ ] Analytics integration

## 📄 License

MIT License - feel free to use this for your own blog!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

h3ow3d - [Your Website](https://yourwebsite.com)

---

Built with ❤️ using React and AWS
