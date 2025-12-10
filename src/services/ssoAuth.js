// Removed unused instrumentation functions
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin

// Mock mode for development
const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true'

// Mock user for development
const MOCK_USER = {
  email: 'dev@h3ow3d.com',
  name: 'Dev User',
  sub: 'mock-user-123',
  picture: null,
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
}

export const ssoAuth = {
  // Redirect to Cognito Hosted UI (or mock for dev)
  signIn() {
    if (MOCK_AUTH) {
      // Simulate SSO flow with a small delay
      setTimeout(() => {
        localStorage.setItem('id_token', 'mock_token')
        localStorage.setItem('access_token', 'mock_access_token')
        localStorage.setItem('mock_user', JSON.stringify(MOCK_USER))
        window.location.reload()
      }, 100)
      return
    }

    const state = Math.random().toString(36).substring(7)
    sessionStorage.setItem('oauth_state', state)

    window.location.href =
      `https://${COGNITO_DOMAIN}/login?` +
      `client_id=${CLIENT_ID}&` +
      `response_type=token&` +
      `scope=openid+email+profile&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `state=${state}`
  },

  // Sign out and redirect to Cognito logout (or mock for dev)
  signOut() {
    if (MOCK_AUTH) {
      localStorage.removeItem('id_token')
      localStorage.removeItem('access_token')
      localStorage.removeItem('mock_user')
      window.location.reload()
      return
    }

    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')

    window.location.href =
      `https://${COGNITO_DOMAIN}/logout?` +
      `client_id=${CLIENT_ID}&` +
      `logout_uri=${encodeURIComponent(REDIRECT_URI)}`
  },

  // Handle OAuth callback - parse tokens from URL hash (or return mock for dev)
  handleCallback() {
    if (MOCK_AUTH) {
      const mockUser = localStorage.getItem('mock_user')
      return mockUser ? JSON.parse(mockUser) : null
    }

    const hash = window.location.hash.substring(1)
    if (!hash) return null

    const params = new URLSearchParams(hash)
    const idToken = params.get('id_token')
    const accessToken = params.get('access_token')
    const state = params.get('state')
    const storedState = sessionStorage.getItem('oauth_state')

    // Validate state parameter
    if (state && storedState && state !== storedState) {
      console.error('OAuth state mismatch')
      return null
    }

    if (idToken && accessToken) {
      // Store tokens
      localStorage.setItem('id_token', idToken)
      localStorage.setItem('access_token', accessToken)

      // Clear OAuth state
      sessionStorage.removeItem('oauth_state')

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)

      return this.parseToken(idToken)
    }

    return null
  },

  // Parse JWT token to extract user info (or return mock for dev)
  parseToken(token) {
    if (MOCK_AUTH) {
      return MOCK_USER
    }

    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const payload = JSON.parse(jsonPayload)

      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        this.clearTokens()
        return null
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email,
        picture: payload.picture,
        exp: payload.exp,
      }
    } catch (error) {
      console.error('Failed to parse token:', error)
      return null
    }
  },

  // Get current user from stored token (or return mock for dev)
  getCurrentUser() {
    if (MOCK_AUTH) {
      const mockUser = localStorage.getItem('mock_user')
      return mockUser ? JSON.parse(mockUser) : null
    }

    const idToken = localStorage.getItem('id_token')
    if (!idToken) return null

    return this.parseToken(idToken)
  },

  // Clear tokens from localStorage
  clearTokens() {
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
  },

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser()
    return !!user
  },
}
