import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { useAuth } from '../contexts/useAuth.js'
import { BACKEND_URL } from '../config.js'
import { Typography } from '@mui/material'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/clients': 'Panel de Clientes',
  '/medicine-catalog': 'Catálogo de Medicamentos',
  '/medicine-cost': 'Costo de Medicamentos',
  '/icd-catalog': 'Catálogo ICD',
  '/view-orders': 'Órdenes',
  '/recurrent-patient': 'Pacientes Recurrentes',
  '/admin-order': 'Administrar Orden',
  '/admin-acuses': 'Panel de Asignación de Medicamentos',
  '/warehouse-medicine': 'Inventario',
  '/create-order': 'Crear Orden',
  '/procurement': 'Adquisiciones',
  '/ui': 'UI',
}

function useAuthManager () {
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()
  const refreshTokenRef = useRef(state.refreshToken)
  const lastAuthRef = useRef(state.lastAuthenticationDate)
  const timers = useRef({
    refreshIntervalId: null, inactivityTimeoutId: null,
  })

  useEffect(() => {
    refreshTokenRef.current = state.refreshToken
  }, [state.refreshToken])

  useEffect(() => {
    lastAuthRef.current = state.lastAuthenticationDate
  }, [state.lastAuthenticationDate])

  useEffect(() => {
    if (!state.user) {
      navigate('/login')
    }
  }, [state.user, navigate])

  useEffect(() => {
    if (!refreshTokenRef.current) return

    const controller = new AbortController()

    const refresh = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/access-token/refresh`, {
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

    refresh()
    timers.current.refreshIntervalId = setInterval(refresh, 5 * 60_000)

    return () => {
      controller.abort()
      clearInterval(timers.current.refreshIntervalId)
    }
  }, [dispatch, navigate])

  useEffect(() => {
    const logout = () => {
      dispatch({ type: 'LOGOUT' })
      navigate('/login')
    }

    const resetInactivity = () => {
      clearTimeout(timers.current.inactivityTimeoutId)
      timers.current.inactivityTimeoutId = setTimeout(logout, 10 * 60_000)
    }

    const activityEvents = [
      'mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']
    activityEvents.forEach(
      (ev) => window.addEventListener(ev, resetInactivity))

    resetInactivity()

    return () => {
      clearTimeout(timers.current.inactivityTimeoutId)
      activityEvents.forEach(
        (ev) => window.removeEventListener(ev, resetInactivity))
    }
  }, [dispatch, navigate])
}

export default function AppLayout ({ component }) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed')
    return stored === 'true'
  })
  useAuthManager()
  const { state } = useAuth()
  const location = useLocation()

  if (!state.user) return null

  let pageTitle = PAGE_TITLES[location.pathname]
  if (!pageTitle) {
    const match = Object.keys(PAGE_TITLES).
      find((p) => p !== '/' && location.pathname.startsWith(p))
    if (match) pageTitle = PAGE_TITLES[match]
  }

  return (<div>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
      <main
        className={`transition-all duration-300 p-4 mt-12 ${collapsed
          ? 'ml-16'
          : 'ml-64'}`}
      >
        <Navbar/>
        {pageTitle && <Typography variant="h5">{pageTitle}</Typography>}
        {component}
      </main>
    </div>)
}

AppLayout.propTypes = {
  component: PropTypes.node.isRequired,
}
