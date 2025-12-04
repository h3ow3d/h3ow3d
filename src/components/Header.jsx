import React from 'react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-main">
          <h1 className="logo">
            <span className="logo-bracket">{'<'}</span>
            h3ow3d
            <span className="logo-bracket">{'/>'}</span>
          </h1>
          <a href="/rss.xml" className="rss-link" aria-label="RSS Feed" title="Subscribe via RSS">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9"></path>
              <path d="M4 4a16 16 0 0 1 16 16"></path>
              <circle cx="5" cy="19" r="1"></circle>
            </svg>
          </a>
        </div>
        <p className="tagline">Patch Notes • Tech Projects & Development Stories</p>
      </div>
    </header>
  )
}

export default Header
