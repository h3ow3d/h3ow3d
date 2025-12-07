import React, { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Comments from './Comments'
import './BlogPost.css'

function BlogPost({ post, onBack }) {
  const startTimeRef = useRef(null)

  useEffect(() => {
    // Track when user starts reading
    startTimeRef.current = Date.now()

    // Track when user leaves/unmounts
    return () => {
      if (startTimeRef.current) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
        window.awsRum?.recordEvent('post_read_time', {
          post_id: post.id,
          post_title: post.title,
          time_seconds: timeSpent,
        })
      }
    }
  }, [post.id, post.title])

  // Custom link component to track external link clicks
  const LinkComponent = ({ href, children, ...props }) => {
    const handleClick = () => {
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        window.awsRum?.recordEvent('external_link_clicked', {
          post_id: post.id,
          url: href,
          link_text: typeof children === 'string' ? children : 'link',
        })
      }
    }

    return (
      <a href={href} {...props} onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <div className="blog-post">
      <button className="back-button" onClick={onBack}>
        ← Back to all posts
      </button>

      <article className="post-content">
        <header className="post-header">
          <div className="post-meta">
            <span className="post-date-large">{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
          </div>
          <h1 className="post-title-large">{post.title}</h1>
          <div className="post-tags-large">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-large">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="post-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: LinkComponent,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <Comments postId={post.id} postTitle={post.title} />
      </article>
    </div>
  )
}

export default BlogPost
