import React from 'react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import Comments from './Comments'
import './BlogPost.css'

function BlogPost({ post, onBack }) {
  return (
    <div className="blog-post">
      <button className="back-button" onClick={onBack}>
        ← Back to all posts
      </button>
      
      <article className="post-content">
        <header className="post-header">
          <div className="post-meta">
            <span className="post-version-large">{post.version}</span>
            <span className="post-date-large">
              {format(new Date(post.date), 'MMMM dd, yyyy')}
            </span>
          </div>
          <h1 className="post-title-large">{post.title}</h1>
          <div className="post-tags-large">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-large">{tag}</span>
            ))}
          </div>
        </header>
        
        <div className="post-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        <Comments postId={post.id} postTitle={post.title} />
      </article>
    </div>
  )
}

export default BlogPost
