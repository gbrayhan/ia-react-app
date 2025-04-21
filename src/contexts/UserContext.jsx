import { createContext, useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'

const getInitialState = () => {
  const storedUser = localStorage.getItem('user')
  const storedAccessToken = localStorage.getItem('accessToken')
  const storedRefreshToken = localStorage.getItem('refreshToken')
  return {
    loginOnProgress: false,
    lastAuthenticationDate: null,
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedAccessToken || null,
    refreshToken: storedRefreshToken || null,
  }
}

const initialAuthState = { user: null, accessToken: null, refreshToken: null }

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loginOnProgress: true,
      }
    case 'LOGIN':
      return {
        ...state,
        loginOnProgress: false,
        lastAuthenticationDate: new Date(),
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }
    case 'LOGOUT':
      return initialAuthState
    case 'REFRESH_TOKEN':
      return {
        ...state,
        lastAuthenticationDate: new Date(),
        loginOnProgress: false,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }
    default:
      return state
  }
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState())

  useEffect(() => {
    if (state.accessToken) {
      localStorage.setItem('accessToken', state.accessToken)
    } else {
      localStorage.removeItem('accessToken')
    }
    if (state.refreshToken) {
      localStorage.setItem('refreshToken', state.refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('user')
    }
  }, [state])

  return <AuthContext.Provider
    value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => useContext(AuthContext)

