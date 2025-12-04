import { useState, useEffect } from 'react'
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import { posts } from './data/posts'
import './App.css'

const THEMES = ['blue', 'green', 'purple', 'orange']

function App() {
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    // Randomly select a theme on mount
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)]
    document.documentElement.setAttribute('data-theme', randomTheme)
    console.log(`🎨 Theme loaded: ${randomTheme}`)
  }, [])

  const handlePostClick = (post) => {
    setSelectedPost(post)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToList = () => {
    setSelectedPost(null)
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {selectedPost ? (
          <BlogPost post={selectedPost} onBack={handleBackToList} />
        ) : (
          <BlogList posts={posts} onPostClick={handlePostClick} />
        )}
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Patch Notes. Built with React & hosted on AWS.</p>
      </footer>
    </div>
  )
}

export default App
