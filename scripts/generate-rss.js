import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read posts data
const postsPath = path.join(__dirname, '../src/data/posts.js')
const postsContent = fs.readFileSync(postsPath, 'utf-8')

// Extract posts array using a simple regex (works for the current format)
const postsMatch = postsContent.match(/export const posts = (\[[\s\S]*?\]);/)
if (!postsMatch) {
  console.error('Could not parse posts.js')
  process.exit(1)
}

// Evaluate the posts array
const posts = eval(postsMatch[1])

// Configuration
const SITE_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:5173'
const SITE_TITLE = 'h3ow3d'
const SITE_DESCRIPTION = 'A tech blog for project updates'
const AUTHOR_EMAIL = 'hello@h3ow3d.com'
const AUTHOR_NAME = 'h3ow3d'

console.log(`🌐 Using site URL: ${SITE_URL}`)

// Helper to escape XML characters
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Helper to format date to RFC-822
function toRFC822Date(dateString) {
  const date = new Date(dateString)
  return date.toUTCString()
}

// Generate RSS feed
function generateRSS(posts) {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestPostDate =
    sortedPosts.length > 0 ? toRFC822Date(sortedPosts[0].date) : new Date().toUTCString()

  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${latestPostDate}</lastBuildDate>
    <atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${escapeXml(AUTHOR_EMAIL)} (${escapeXml(AUTHOR_NAME)})</managingEditor>
    <webMaster>${escapeXml(AUTHOR_EMAIL)} (${escapeXml(AUTHOR_NAME)})</webMaster>
`

  sortedPosts.forEach((post) => {
    const postUrl = `${SITE_URL}#post-${post.id}`
    const pubDate = toRFC822Date(post.date)

    // Use excerpt as description, fallback to truncated content
    let description = post.excerpt || ''
    if (!description && post.content) {
      // Fallback: create description from content if no excerpt
      description = post.content
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/`/g, '') // Remove code
        .substring(0, 500)

      if (post.content.length > 500) {
        description += '...'
      }
    }

    rss += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(AUTHOR_EMAIL)} (${escapeXml(AUTHOR_NAME)})</author>
      <category>${escapeXml(post.category)}</category>
    </item>`
  })

  rss += `
  </channel>
</rss>`

  return rss
}

// Generate and save RSS feed
const rssContent = generateRSS(posts)
const outputPath = path.join(__dirname, '../public/rss.xml')

fs.writeFileSync(outputPath, rssContent, 'utf-8')
console.log(`✅ RSS feed generated: ${outputPath}`)
console.log(`📝 ${posts.length} posts included in feed`)
