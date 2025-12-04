# Post Management System

This blog uses individual markdown files for posts instead of maintaining all content in a single JavaScript file.

## Structure

```text
content/
  posts/
    2024-12-01-launching-h3ow3d-blog.md
    2024-11-20-building-serverless-api.md
    2024-11-10-react-performance.md
```

## How It Works

1. **Write posts** in `content/posts/` as markdown files with frontmatter
2. **Run build script** to generate `src/data/posts.js` from markdown files
3. **App imports** posts from the generated file

## Creating a New Post

### 1. Create a new markdown file

File naming convention: `YYYY-MM-DD-post-slug.md`

Example: `content/posts/2024-12-15-my-new-post.md`

### 2. Add frontmatter

```markdown
---
id: 4
date: 2024-12-15
title: My Awesome Post Title
excerpt: A brief description of what this post is about (shown in list view).
tags:
  - javascript
  - tutorial
  - web-dev
---

# My Awesome Post Title

Your markdown content goes here...

## Subheading

More content...
```

### 3. Generate posts.js

Run the build script to convert markdown files to the posts array:

```bash
npm run generate-posts
```

This updates `src/data/posts.js` with all posts from the `content/posts/` directory.

## Frontmatter Fields

| Field     | Required | Description                               |
| --------- | -------- | ----------------------------------------- |
| `id`      | Yes      | Unique post ID (increment from last post) |
| `date`    | Yes      | Post date in YYYY-MM-DD format            |
| `title`   | Yes      | Post title                                |
| `excerpt` | Yes      | Brief summary (1-2 sentences)             |
| `tags`    | Yes      | Array of tags for categorization          |

## Build Process

The build script automatically runs when you build the app:

```bash
npm run build
# Runs: generate-posts → generate-rss → vite build
```

Posts are sorted by date (newest first) automatically.

## Benefits of This Approach

✅ **Easier to manage** - Each post is a separate file
✅ **Better version control** - Git diffs work better with separate files
✅ **Markdown-focused** - Write in pure markdown, not JS template strings
✅ **Frontmatter metadata** - Clean separation of metadata and content
✅ **Automated** - Posts.js is auto-generated, never edit it manually

## Tips

- **Never edit** `src/data/posts.js` directly - it's auto-generated
- Keep the **id** field unique and sequential
- Use **descriptive filenames** for easy identification
- Add posts in **date order** (newest at the top) for better organization
- Run `npm run generate-posts` after creating/editing any markdown files

## Example Workflow

```bash
# 1. Create new post
touch content/posts/2024-12-15-new-feature.md

# 2. Edit in your favorite editor
# Add frontmatter and content

# 3. Generate posts.js
npm run generate-posts

# 4. Test locally
npm run dev

# 5. Build and deploy
npm run build
git add .
git commit -m "Add new post: New Feature"
git push
```

## Future Enhancements

Possible additions to this system:

- Draft posts (add `draft: true` to frontmatter)
- Scheduled posts (filter by date)
- Categories in addition to tags
- Featured posts
- Related posts based on tags
