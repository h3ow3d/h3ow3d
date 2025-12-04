# Setting Up Giscus Comments

Giscus is a comments system powered by GitHub Discussions. It's free, open-source, and requires no database.

## Prerequisites

- GitHub repository (you already have: h3ow3d/h3ow3d)
- GitHub Discussions enabled on the repository

## Setup Steps

### 1. Enable GitHub Discussions

1. Go to your repository: https://github.com/h3ow3d/h3ow3d
2. Click **Settings**
3. Scroll down to **Features**
4. Check ✅ **Discussions**

### 2. Create a Comments Category

1. Go to **Discussions** tab in your repo
2. Click **Categories** (or the gear icon)
3. Create a new category:
   - **Name**: Comments
   - **Description**: Blog post comments
   - **Discussion Format**: Announcement (recommended)
   - This ensures only you can create new discussions, but anyone can comment

### 3. Install Giscus App

1. Go to https://github.com/apps/giscus
2. Click **Install**
3. Select **Only select repositories**
4. Choose **h3ow3d/h3ow3d**
5. Click **Install**

### 4. Get Your Configuration

1. Go to https://giscus.app
2. Fill in the configuration:
   - **Repository**: h3ow3d/h3ow3d
   - **Page ↔️ Discussions Mapping**: Choose "Discussion title contains page `pathname`" or "specific term"
   - **Discussion Category**: Select "Comments" (the one you created)
   - **Features**: Enable reactions (optional)
   - **Theme**: "Preferred color scheme"

3. Giscus will generate a script tag at the bottom

4. Copy these two values from the generated script:
   - `data-repo-id="..."`
   - `data-category-id="..."`

### 5. Update the Code

Open `src/components/Comments.jsx` and replace:

```javascript
script.setAttribute('data-repo-id', 'YOUR_REPO_ID') // Replace with your actual repo ID
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID') // Replace with your actual category ID
```

With your actual IDs from step 4.

### 6. Test

1. Build and deploy your site
2. Open a blog post
3. You should see the comment section at the bottom
4. Try adding a comment (requires GitHub login)

## Features

- ✅ GitHub-based authentication (no separate account needed)
- ✅ Markdown support in comments
- ✅ Reactions to comments
- ✅ Moderation through GitHub Discussions
- ✅ Free and no tracking
- ✅ Works with light/dark themes
- ✅ Lazy loading (doesn't slow down page load)

## Privacy

- Comments are stored in your GitHub repository
- Users need a GitHub account to comment
- No third-party tracking or ads
- All data stays on GitHub

## Moderation

You can moderate comments by:
- Managing discussions in your GitHub repo
- Locking discussions
- Hiding or deleting comments
- Blocking users

## Alternative: Disabled Comments

If you prefer not to enable comments, you can remove the `<Comments />` component from `src/components/BlogPost.jsx`.

## Documentation

- Giscus: https://giscus.app
- GitHub Discussions: https://docs.github.com/en/discussions
