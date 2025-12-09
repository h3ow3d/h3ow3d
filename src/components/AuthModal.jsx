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
            <svg
              className="auth-button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                fill="currentColor"
              />
            </svg>
            Sign in with SSO
          </button>

          <p className="auth-modal-footer">Secure authentication powered by AWS Cognito</p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
