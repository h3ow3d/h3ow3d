import React from 'react'
import { format } from 'date-fns'
import './BlogList.css'

function BlogList({ posts, onPostClick }) {
  const handleCardClick = (post) => {
    // Track post card engagement
    window.awsRum?.recordEvent('post_card_clicked', {
      post_id: post.id,
      post_title: post.title,
      post_position: posts.findIndex((p) => p.id === post.id) + 1,
      total_posts: posts.length,
    })

    onPostClick(post)
  }

  return (
    <div className="blog-list">
      <h2 className="section-title">Recent Updates</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="post-card" onClick={() => handleCardClick(post)}>
            <div className="post-card-header">
              <span className="post-date">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="post-read-more">Read more →</div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default BlogList
