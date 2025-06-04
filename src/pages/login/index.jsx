import { useState } from 'react'
import { Alert, Box, Button, Link, Paper, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useAuth } from '../../contexts/useAuth.js'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../config.js'

const theme = createTheme({
  palette: { primary: { main: '#1a73e8' }, background: { default: '#ffffff' } },
  typography: {
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem' },
  },
})

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      })

      if (!response.ok) {
        setError('Email y/o contraseña inválidos.')
        return
      }

      const data = await response.json()
      dispatch({
        type: 'LOGIN', payload: {
          user: {
            email: data.userEmail, fullName: data.userFullName, id: data.userId,
          }, accessToken: data.accessToken, refreshToken: data.refreshToken,
        },
      })

      navigate('/dashboard')
    } catch (err) {
      setError('Error al conectar al servidor.')
      console.error(err)
    }
  }

  return (<ThemeProvider theme={theme}>
    <Box position="relative" minHeight="100vh">
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/bg-login.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />
      <Box display="flex" justifyContent="center" alignItems="center"
           minHeight="100vh" p={2}>
        <Paper elevation={3}
               sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
          <Box textAlign="center" mb={2}>
            <Typography variant="h5" component="h1">
              Distribuidora Aceso
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Lo mejor, siempre.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Distribuidora de medicamentos de alta especialidad
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              label="Usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (<Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>)}
            <Button type="submit" variant="contained" fullWidth
                    sx={{ mt: 2 }}>
              Ingresar
            </Button>
          </Box>
          <Box mt={4} textAlign="center">
            <Typography variant="body2"></Typography>
            <Typography variant="body2" mt={1}>
              <strong>Contacto:</strong> Tel. 563 28 015 | contacto@aceso.mx
            </Typography>
            <Typography variant="caption" display="block" mt={2}>
              Copyright © 2021 | Derechos Reservados{' '}
              <Link
                className="margin"
                href="https://aceso.mx"
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                Distribuidora de Medicamentos Aceso S.A. de C.V.
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  </ThemeProvider>)
}

export default LoginPage
