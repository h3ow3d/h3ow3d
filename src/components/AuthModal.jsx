import { LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './AuthModal.css'

function AuthModal({ onClose }) {
  const { signIn } = useAuth()

  const handleSignIn = () => {
    signIn()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="auth-modal-content">
          <h2 className="auth-modal-title">Welcome to h3ow3d</h2>
          <p className="auth-modal-description">
            Sign in to access your profile and personalized content
          </p>

          <button className="auth-button auth-button-primary" onClick={handleSignIn}>
            <LogIn size={20} className="auth-button-icon" />
            Sign in with SSO
          </button>

          <p className="auth-modal-footer">Secure authentication powered by AWS Cognito</p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
