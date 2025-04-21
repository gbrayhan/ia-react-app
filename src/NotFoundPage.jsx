import { Box, Button, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { FiChevronLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const theme = createTheme({
  palette: { primary: { main: '#1a73e8' }, background: { default: '#ffffff' } },
  typography: {
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    h1: { fontSize: '4rem', fontWeight: 'bold' },
    h6: { fontSize: '1.2rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 500,
        },
      },
    }, MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        },
      },
    },
  },
})

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (<ThemeProvider theme={theme}>
    <Box
      className="flex flex-col items-center justify-center min-h-screen bg-white p-4"
    >
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" gutterBottom>
        Oh no, no hemos encontrado la página que buscas.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        startIcon={<FiChevronLeft/>}
      >
        Regresar a Inicio
      </Button>
    </Box>
  </ThemeProvider>)
}

export default NotFoundPage
