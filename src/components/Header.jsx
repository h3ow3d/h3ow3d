import React from 'react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-bracket">{'<'}</span>
          h3ow3d
          <span className="logo-bracket">{'/>'}</span>
        </h1>
        <p className="tagline">Patch Notes • Tech Projects & Development Stories</p>
      </div>
    </header>
  )
}

export default Header
