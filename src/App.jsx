import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import SourceMapDemo from './components/SourceMapDemo'
import UserProfile from './components/UserProfile'
import { posts } from './data/posts'
import './App.css'

function AppContent() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [showDemo, setShowDemo] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  // Track app load
  useEffect(() => {
    window.awsRum?.recordEvent('app_loaded', {
      timestamp: Date.now(),
    })
  }, [])

  // Track route changes (selectedPost, showDemo, showProfile)
  useEffect(() => {
    let route = 'home'
    if (selectedPost) route = `post/${selectedPost.id}`
    else if (showDemo) route = 'demo'
    else if (showProfile) route = 'profile'
    window.awsRum?.recordEvent('route_change', {
      route,
      timestamp: Date.now(),
    })
  }, [selectedPost, showDemo, showProfile])
  // Initialize theme from localStorage directly instead of in effect
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  // Track app load
  useEffect(() => {
    window.awsRum?.recordEvent('app_loaded', {
      timestamp: Date.now(),
    })
  }, [])

  // Track route changes (selectedPost, showDemo, showProfile)
  useEffect(() => {
    let route = 'home'
    if (selectedPost) route = `post/${selectedPost.id}`
    else if (showDemo) route = 'demo'
    else if (showProfile) route = 'profile'
    window.awsRum?.recordEvent('route_change', {
      route,
      timestamp: Date.now(),
    })
  }, [selectedPost, showDemo, showProfile])
  useEffect(() => {
    // Only update DOM attribute when theme changes
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)

    // Track theme change
    window.awsRum?.recordEvent('theme_changed', {
      from_theme: theme,
      to_theme: newTheme,
    })
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setShowDemo(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Track post view
    window.awsRum?.recordEvent('post_viewed', {
      post_id: post.id,
      post_title: post.title,
      post_tags: post.tags.join(','),
    })
  }

  const handleBackToList = () => {
    setSelectedPost(null)
    setShowDemo(false)
    setShowProfile(false)

    // Track navigation back to list
    window.awsRum?.recordEvent('navigation', {
      action: 'back_to_list',
    })
  }

  const handleShowDemo = () => {
    setSelectedPost(null)
    setShowDemo(true)
    setShowProfile(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Track demo view
    window.awsRum?.recordEvent('navigation', {
      action: 'view_demo',
    })
  }

  const handleShowProfile = () => {
    setSelectedPost(null)
    setShowDemo(false)
    setShowProfile(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Track profile view
    window.awsRum?.recordEvent('navigation', {
      action: 'view_profile',
    })
  }

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onShowDemo={handleShowDemo}
        onShowProfile={handleShowProfile}
      />
      <main className="main-content">
        {showProfile ? (
          <UserProfile onBack={handleBackToList} />
        ) : showDemo ? (
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
