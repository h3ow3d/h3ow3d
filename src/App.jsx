import { useState, useEffect } from 'react'
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import SourceMapDemo from './components/SourceMapDemo'
import { posts } from './data/posts'
import './App.css'

function App() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [showDemo, setShowDemo] = useState(false)
  // Initialize theme from localStorage directly instead of in effect
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    // Only update DOM attribute when theme changes
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setShowDemo(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToList = () => {
    setSelectedPost(null)
    setShowDemo(false)
  }

  const handleShowDemo = () => {
    setSelectedPost(null)
    setShowDemo(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} onShowDemo={handleShowDemo} />
      <main className="main-content">
        {showDemo ? (
          <SourceMapDemo onBack={handleBackToList} />
        ) : selectedPost ? (
          <BlogPost post={selectedPost} onBack={handleBackToList} />
        ) : (
          <BlogList posts={posts} onPostClick={handlePostClick} />
        )}
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} h3ow3d. Built with React & hosted on AWS.</p>
      </footer>
    </div>
  )
}

export default App
