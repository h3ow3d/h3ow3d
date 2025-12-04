import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDirectory = path.join(__dirname, '../content/posts')
const outputFile = path.join(__dirname, '../src/data/posts.js')

// Read all markdown files from content/posts
function generatePostsFile() {
  console.log('📝 Generating posts.js from markdown files...')

  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'))

  if (files.length === 0) {
    console.warn('⚠️  No markdown files found in content/posts/')
    return
  }

  const posts = files.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')

    // Parse frontmatter
    const { data, content } = matter(fileContents)

    // Extract metadata with defaults
    const post = {
      id: data.id || parseInt(filename.split('-')[0]) || 0,
      date: data.date || filename.split('-').slice(0, 3).join('-'),
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      content: content.trim(),
      filename: filename,
    }

    return post
  })

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Generate the posts.js file
  const output = `// Auto-generated from content/posts/*.md
// Run 'npm run generate-posts' to regenerate this file

export const posts = ${JSON.stringify(posts, null, 2)};
`

  fs.writeFileSync(outputFile, output, 'utf8')

  console.log(`✅ Generated posts.js with ${posts.length} posts`)
  posts.forEach((post) => {
    console.log(`   - ${post.date}: ${post.title}`)
  })
}

try {
  generatePostsFile()
} catch (error) {
  console.error('❌ Error generating posts:', error)
  process.exit(1)
}
