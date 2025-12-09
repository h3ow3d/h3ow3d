import { createContext, useContext, useState, useEffect } from 'react'
import { ssoAuth } from '../services/ssoAuth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAuth()
  }, [])

  const initAuth = async () => {
    try {
      // Check if this is an OAuth callback
      if (window.location.hash.includes('id_token')) {
        const userData = ssoAuth.handleCallback()

        if (userData) {
          setUser(userData)

          // Associate user with RUM
          window.awsRum?.setAwsCredentials({
            sessionId: userData.sub,
            userId: userData.email,
          })

          window.awsRum?.recordEvent('user_authenticated', {
            provider: 'cognito_sso',
            user_id: userData.sub,
          })
        }
      } else {
        // Check for existing session
        const currentUser = ssoAuth.getCurrentUser()

        if (currentUser) {
          setUser(currentUser)

          // Restore RUM session
          window.awsRum?.setAwsCredentials({
            sessionId: currentUser.sub,
            userId: currentUser.email,
          })

          window.awsRum?.recordEvent('user_session_restored', {
            user_id: currentUser.sub,
          })
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      window.awsRum?.recordError(error, {
        context: 'auth_init',
      })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = () => {
    window.awsRum?.recordEvent('sso_signin_initiated')
    ssoAuth.signIn()
  }

  const signOut = () => {
    window.awsRum?.recordEvent('user_sign_out', {
      user_id: user?.sub,
    })
    ssoAuth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
