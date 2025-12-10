import { useState } from 'react'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './UserProfile.css'

function UserProfile({ onBack }) {
  useEffect(() => {
    window.awsRum?.recordEvent('profile_rendered', { timestamp: Date.now() })
  }, [])
  const handleEdit = (changes) => {
    window.awsRum?.recordEvent('profile_edited', { changes })
    // ...existing edit logic...
  }
  // Removed unused handleEdit
  const { user, isAuthenticated, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isAuthenticated) {
    return (
      <div className="user-profile">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="profile-content">
          <div className="profile-empty">
            <h2>Not signed in</h2>
            <p>Please sign in to view your profile</p>
            <button className="profile-signin-button" onClick={onBack}>
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="user-profile">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-text">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name || 'User'}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="profile-body">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Profile Information</h2>
              <div className="profile-fields">
                <div className="profile-field">
                  <label className="profile-field-label">User ID</label>
                  <p className="profile-field-value">{user.sub}</p>
                </div>
                <div className="profile-field">
                  <label className="profile-field-label">Email</label>
                  <p className="profile-field-value">{user.email}</p>
                </div>
                <div className="profile-field">
                  <label className="profile-field-label">Name</label>
                  <p className="profile-field-value">{user.name}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Recent Activity</h2>
              <div className="profile-empty-state">
                <p>Activity tracking coming soon...</p>
                <p className="profile-empty-hint">
                  We&apos;ll show your reading history and engagement here
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Account Settings</h2>
              <div className="profile-settings">
                <div className="profile-setting">
                  <h3>Sign Out</h3>
                  <p className="profile-setting-description">
                    Sign out of your account on this device
                  </p>
                  <button className="profile-danger-button" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
