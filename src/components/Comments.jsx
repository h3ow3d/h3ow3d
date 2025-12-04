import { useEffect, useRef } from 'react'
import './Comments.css'

function Comments({ postId, postTitle }) {
  const commentsRef = useRef(null)

  useEffect(() => {
    // Clear existing comments when post changes
    if (commentsRef.current) {
      commentsRef.current.innerHTML = ''
    }

    // Create script element for Giscus
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'h3ow3d/h3ow3d')
    script.setAttribute('data-repo-id', 'R_kgDOQiwJ3w')
    script.setAttribute('data-category', 'Blog Post Comments')
    script.setAttribute('data-category-id', 'DIC_kwDOQiwJ384CzaJj')
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', `post-${postId}`)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    if (commentsRef.current) {
      commentsRef.current.appendChild(script)
    }

    return () => {
      // Cleanup when component unmounts
      if (commentsRef.current) {
        commentsRef.current.innerHTML = ''
      }
    }
  }, [postId])

  return (
    <div className="comments-section">
      <h2 className="comments-title">Comments</h2>
      <div ref={commentsRef} className="giscus-container"></div>
    </div>
  )
}

export default Comments
