import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { useAuth } from '../contexts/UserContext.jsx'
import { ACESO_BACKEND_URL } from '../config.js'

//  20-10-5 minutes pattern on auth manager
function useAuthManager () {
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()
  const refreshTokenRef = useRef(state.refreshToken)
  const lastAuthRef = useRef(state.lastAuthenticationDate)
  const timers = useRef({ timeoutId: null, intervalId: null })

  // Mantener refs actualizadas
  useEffect(() => { refreshTokenRef.current = state.refreshToken },
    [state.refreshToken])
  useEffect(() => { lastAuthRef.current = state.lastAuthenticationDate },
    [state.lastAuthenticationDate])

  // 1) Redirigir si no hay usuario
  useEffect(() => {
    if (!state.user) navigate('/login')
  }, [state.user, navigate])

  useEffect(() => {
    if (!refreshTokenRef.current || !lastAuthRef.current) return

    const now = Date.now()
    const lastMs = new Date(lastAuthRef.current).getTime()
    const delayMs = Math.max(5 * 60_000 - (now - lastMs), 0)
    const controller = new AbortController()

    const refresh = async () => {
      try {
        const res = await fetch(`${ACESO_BACKEND_URL}/access-token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refreshTokenRef.current }),
          signal: controller.signal,
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (data.accessToken) {
          dispatch({
            type: 'REFRESH_TOKEN', payload: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken || refreshTokenRef.current,
            },
          })
        }
      } catch {
        dispatch({ type: 'LOGOUT' })
        navigate('/login')
      }
    }

    timers.current.timeoutId = setTimeout(() => {
      refresh()
      timers.current.intervalId = setInterval(refresh, 9 * 60_000)
    }, delayMs)

    return () => {
      controller.abort()
      clearTimeout(timers.current.timeoutId)
      if (timers.current.intervalId) clearInterval(timers.current.intervalId)
    }
  }, [dispatch, navigate])

  useEffect(() => {
    let inactivityTimeout = null
    const logout = () => {
      dispatch({ type: 'LOGOUT' })
      navigate('/login')
    }
    const reset = () => {
      clearTimeout(inactivityTimeout)
      inactivityTimeout = setTimeout(logout, 10 * 60_000)
    }
    const debounced = () => window.requestAnimationFrame(reset)

    const events = [
      'mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, debounced))
    reset()

    return () => {
      clearTimeout(inactivityTimeout)
      events.forEach(e => window.removeEventListener(e, debounced))
    }
  }, [dispatch, navigate])
}

export default function AppLayout ({ component }) {
  const [collapsed, setCollapsed] = useState(false)
  useAuthManager()
  const { state } = useAuth()

  if (!state.user) return null

  return (<div>
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
    <main className={`transition-all duration-300 p-4 mt-12 ${collapsed
      ? 'ml-16'
      : 'ml-64'}`}>
      <Navbar/>
      {component}
    </main>
  </div>)
}

AppLayout.propTypes = {
  component: PropTypes.node.isRequired,
}
