import { useState, useEffect } from 'react'
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import { posts } from './data/posts'
import './App.css'

function App() {
  const [selectedPost, setSelectedPost] = useState(null)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToList = () => {
    setSelectedPost(null)
  }

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="main-content">
        {selectedPost ? (
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
