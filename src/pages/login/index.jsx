import { useState } from 'react'
import { Alert, Box, Button, Divider, IconButton, InputAdornment, Link, Paper, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ArrowForward, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material'

const theme = createTheme({
  palette: {
    mode: 'dark', primary: {
      main: '#00D2FF', light: '#33DBFF', dark: '#0099CC',
    }, secondary: {
      main: '#FF006E', light: '#FF3384', dark: '#CC0058',
    }, background: {
      default: '#0A0A0F', paper: '#12121A',
    }, text: {
      primary: '#FFFFFF', secondary: '#A0A3BD',
    }, grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    }, success: {
      main: '#00FF88',
    }, error: {
      main: '#FF3B30',
    },
  }, typography: {
    fontFamily: '"Geist", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #00D2FF 0%, #FF006E 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h6: {
      fontSize: '1rem', fontWeight: 500, letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem', lineHeight: 1.6, letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem', lineHeight: 1.5, letterSpacing: '0.01em',
    },
  }, components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(160, 163, 189, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(0, 210, 255, 0.3)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: '#00D2FF',
              boxShadow: '0 0 0 3px rgba(0, 210, 255, 0.1)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }, '& .MuiInputLabel-root': {
            color: '#A0A3BD',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#00D2FF',
            },
          }, '& .MuiOutlinedInput-input': {
            color: '#FFFFFF', fontSize: '0.875rem', padding: '14px 16px',
          },
        },
      },
    }, MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          padding: '12px 24px',
          height: '48px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }, contained: {
          background: 'linear-gradient(135deg, #00D2FF 0%, #FF006E 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #0099CC 0%, #CC0058 100%)',
            boxShadow: '0 8px 25px -8px rgba(0, 210, 255, 0.4)',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            background: 'rgba(160, 163, 189, 0.1)',
            color: 'rgba(160, 163, 189, 0.5)',
          },
        },
      },
    }, MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#12121A',
          border: '1px solid rgba(160, 163, 189, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
  },
})

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (username && password) {
        console.log('Login successful')
      } else {
        setError('Por favor completa todos los campos')
      }
      setIsLoading(false)
    }, 1500)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (<ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 50% 0%, rgba(0, 210, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(255, 0, 110, 0.1) 0%, transparent 50%),
            #0A0A0F
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(160, 163, 189, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(160, 163, 189, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            backgroundColor: '#00D2FF',
            boxShadow: '0 0 10px #00D2FF',
            animation: 'pulse 3s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.5)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '70%',
            right: '20%',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: '#FF006E',
            boxShadow: '0 0 15px #FF006E',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        <Paper
          elevation={0}
          sx={{
            padding: { xs: 4, sm: 6 },
            maxWidth: '400px',
            width: '100%',
            borderRadius: '16px',
            position: 'relative',
            backdropFilter: 'blur(20px)',
            background: 'rgba(18, 18, 26, 0.8)',
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00D2FF 0%, #FF006E 100%)',
                mb: 3,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: '1px',
                  borderRadius: '11px',
                  background: '#12121A',
                  zIndex: 1,
                },
                '&::after': {
                  content: '"AI"',
                  position: 'absolute',
                  zIndex: 2,
                  fontSize: '14px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00D2FF 0%, #FF006E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                },
              }}
            />

            <Typography variant="h1" component="h1" mb={1}>
              Distribuidora Aceso
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary', mb: 1,
              }}
            >
              Plataforma de Inteligencia Artificial
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Accede a tu cuenta para continuar
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Usuario"
              variant="outlined"
              fullWidth
              margin="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary', fontSize: '20px' }}/>
                  </InputAdornment>),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary', fontSize: '20px' }}/>
                  </InputAdornment>),
                endAdornment: (<InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small"/> :
                        <Visibility fontSize="small"/>}
                    </IconButton>
                  </InputAdornment>),
              }}
              sx={{ mb: 3 }}
            />

            {error && (<Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                  color: '#FF9F9B',
                  '& .MuiAlert-icon': {
                    color: '#FF9F9B',
                  },
                }}
              >
                {error}
              </Alert>)}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              endIcon={!isLoading && <ArrowForward fontSize="small"/>}
              sx={{ mb: 4 }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  Iniciando sesión...
                </Box>) : ('Iniciar Sesión')}
            </Button>
          </Box>

          <Divider sx={{ mb: 4, borderColor: 'rgba(160, 163, 189, 0.1)' }}/>

          {/* Footer */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" mb={2}>
              <strong>Soporte:</strong> Tel. 563 28 015 | contacto@aceso.mx
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary', opacity: 0.7, fontSize: '0.75rem',
              }}
            >
              © 2025 Distribuidora de Medicamentos Aceso S.A. de C.V.{' '}
              <Link
                href="https://aceso.mx"
                target="_blank"
                rel="noopener"
                sx={{
                  color: 'primary.light', textDecoration: 'none', '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Todos los derechos reservados
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>)
}

export default LoginPage