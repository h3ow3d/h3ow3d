import React, { useState } from 'react'
import { Bug, Sun, Moon, Rss, LogIn, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'
import './Header.css'

// Random command-line style variations
const logoVariations = [
  { prefix: 'less ', suffix: '.md' },
  { prefix: 'cat ', suffix: '.txt' },
  { prefix: 'tail ', suffix: '.log' },
  { prefix: 'bash -c ./', suffix: '.sh' },
  { prefix: 'git commit -m "', suffix: '"' },
  { prefix: 'python ', suffix: '.py' },
  { prefix: 'find ./ -type f -name "', suffix: '"' },
  { prefix: 'grep ', suffix: ' -r .' },
  { prefix: 'echo ', suffix: '' },
  { prefix: 'cd ', suffix: '/' },
  { prefix: 'man ', suffix: '' },
  { prefix: 'kubectl apply -f ', suffix: '.yaml' },
]

function Header({ theme, onToggleTheme, onShowDemo, onShowProfile }) {
  const { isAuthenticated, user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [logoStyle] = useState(() => {
    // Pick a random variation on component mount
    return logoVariations[Math.floor(Math.random() * logoVariations.length)]
  })

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-command">{logoStyle.prefix}</span>
          <span className="logo-name">h3ow3d</span>
          <span className="logo-command">{logoStyle.suffix}</span>
        </h1>
        <div className="header-actions">
          <button onClick={onShowDemo} className="demo-link" title="Source Map Demo">
            <Bug size={20} />
          </button>
          <button
            onClick={onToggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="/rss.xml" className="rss-link" aria-label="RSS Feed" title="Subscribe via RSS">
            <Rss size={20} />
          </a>
          {isAuthenticated ? (
            <button
              onClick={onShowProfile}
              className="profile-button"
              title="View Profile"
              aria-label="View Profile"
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="profile-avatar-img" />
              ) : (
                <span className="profile-avatar-text">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="signin-button"
              title="Sign In"
              aria-label="Sign In"
            >
              <LogIn size={20} />
            </button>
          )}
        </div>
        <p className="tagline">Tech Projects & Development Stories</p>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  )
}

export default Header
