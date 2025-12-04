import React, { useState } from 'react'
import './Header.css'

// Random command-line style variations
const logoVariations = [
  { prefix: 'less ', suffix: '.md' },
  { prefix: 'cat ', suffix: '.txt' },
  { prefix: 'tail ', suffix: '.log' },
  { prefix: "git commit -m '", suffix: "'" },
  { prefix: 'vim ', suffix: '.sh' },
  { prefix: 'nano ', suffix: '.js' },
  { prefix: 'grep ', suffix: ' -r .' },
  { prefix: 'echo ', suffix: '' },
  { prefix: 'cd ', suffix: '/' },
  { prefix: 'man ', suffix: '' },
]

function Header({ theme, onToggleTheme }) {
  const [logoStyle] = useState(() => {
    // Pick a random variation on component mount
    return logoVariations[Math.floor(Math.random() * logoVariations.length)]
  })

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-main">
          <h1 className="logo">
            <span className="logo-command">{logoStyle.prefix}</span>
            <span className="logo-name">h3ow3d</span>
            <span className="logo-command">{logoStyle.suffix}</span>
          </h1>
          <div className="header-actions">
            <button
              onClick={onToggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <a href="/rss.xml" className="rss-link" aria-label="RSS Feed" title="Subscribe via RSS">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>
            </a>
          </div>
        </div>
        <p className="tagline">Tech Projects & Development Stories</p>
      </div>
    </header>
  )
}

export default Header
