import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { FiActivity, FiBox, FiDollarSign, FiFileText } from 'react-icons/fi'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A3E74', // Azul Oscuro
    }, secondary: {
      main: '#365F91', // Azul Cobalto
    }, background: {
      default: '#FFFFFF', // Blanco
      paper: '#FFFFFF', // Blanco
    }, text: {
      primary: '#1D1D1F', // Texto estándar (negro suave)
    }, success: {
      main: '#5FD1A2', // Verde Suave
    }, warning: {
      main: '#F7D674', // Amarillo Claro
    }, error: {
      main: '#E57373', // Rojo Suave
    },
  }, typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', h4: {
      fontWeight: 600, color: '#1A3E74',
    }, h5: {
      fontWeight: 500, color: '#365F91',
    }, h6: {
      fontWeight: 500, color: '#1A3E74',
    },
  }, components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        },
      },
    },
  },
})

const AnimatedBox = motion(Box)

const Dashboard = () => {
  const [currentStats, setCurrentStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredMedications: 0,
    invoicedAmount: 0,
  })

  const [orderStates, setOrderStates] = useState({
    'REGISTRO INICIAL': 0,
    'DATOS CONFIRMADOS': 0,
    'MEDICAMENTOS SOLICITADOS': 0,
    'LISTO PARA ENVIO': 0,
    'SURTIDO PARCIAL': 0,
    'SURTIDO TOTAL': 0,
    'CON RECETA': 0,
    FACTURADO: 0,
    CANCELADO: 0,
  })

  const [timeSeriesData, setTimeSeriesData] = useState({
    acuses: [], ordenes: [], medicamentos: [],
  })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCurrentStats({
        totalOrders: 1250,
        pendingOrders: 75,
        deliveredMedications: 3750,
        invoicedAmount: 125000,
      })

      setOrderStates({
        'REGISTRO INICIAL': 50,
        'DATOS CONFIRMADOS': 100,
        'MEDICAMENTOS SOLICITADOS': 200,
        'LISTO PARA ENVIO': 150,
        'SURTIDO PARCIAL': 75,
        'SURTIDO TOTAL': 300,
        'CON RECETA': 250,
        FACTURADO: 100,
        CANCELADO: 25,
      })

      setTimeSeriesData({
        acuses: [
          { month: 'Ene', generados: 100, entregados: 90 },
          { month: 'Feb', generados: 120, entregados: 110 },
          { month: 'Mar', generados: 140, entregados: 130 },
          { month: 'Abr', generados: 160, entregados: 150 },
          { month: 'May', generados: 180, entregados: 170 }],
        ordenes: [
          { month: 'Ene', creadas: 100, entregadas: 80, facturadas: 75 },
          { month: 'Feb', creadas: 120, entregadas: 100, facturadas: 95 },
          { month: 'Mar', creadas: 140, entregadas: 120, facturadas: 115 },
          { month: 'Abr', creadas: 160, entregadas: 140, facturadas: 135 },
          { month: 'May', creadas: 180, entregadas: 160, facturadas: 155 }],
        medicamentos: [
          { month: 'Ene', solicitados: 300, entregados: 280, facturados: 270 },
          { month: 'Feb', solicitados: 350, entregados: 330, facturados: 320 },
          { month: 'Mar', solicitados: 400, entregados: 380, facturados: 370 },
          { month: 'Abr', solicitados: 450, entregados: 430, facturados: 420 },
          {
            month: 'May', solicitados: 500, entregados: 480, facturados: 470,
          }],
      })
    }, 1000)
  }, [])

  const StatCard = ({ title, value, icon }) => (<AnimatedBox
    component={Paper}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'background.paper',
    }}
  >
    <Box>
      <Typography variant="body2" component="h2"
                  sx={{ color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h5" component="p"
                  sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ color: 'secondary.main', opacity: 0.8 }}>{icon}</Box>
  </AnimatedBox>)
  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
  }
  const OrderStateCard = ({ state, count }) => (<AnimatedBox
    component={Paper}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    sx={{
      p: 2,
      textAlign: 'center',
      height: '100%',
      backgroundColor: 'background.paper',
    }}
  >
    <Typography variant="body2" component="h3"
                sx={{ color: 'text.secondary', mb: 1 }}>
      {state}
    </Typography>
    <Typography variant="h6" component="p"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      {count}
    </Typography>
  </AnimatedBox>)

  OrderStateCard.propTypes = {
    state: PropTypes.string.isRequired, count: PropTypes.number.isRequired,
  }

  const ChartContainer = ({ title, children }) => (<AnimatedBox
    component={Paper}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{ mt: 4, p: 3, backgroundColor: 'background.paper' }}
  >
    <Typography variant="h6" component="h3"
                sx={{ mb: 2, color: 'primary.main' }}>
      {title}
    </Typography>
    {children}
  </AnimatedBox>)

  ChartContainer.propTypes = {
    title: PropTypes.string.isRequired, children: PropTypes.node.isRequired,
  }

  return (<ThemeProvider theme={theme}>
    <Box sx={{
      flexGrow: 1,
      p: 3,
      backgroundColor: 'background.default',
      minHeight: '100vh',
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total de Órdenes" value={currentStats.totalOrders}
                    icon={<FiFileText size={24}/>}/>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Órdenes Pendientes"
                    value={currentStats.pendingOrders}
                    icon={<FiActivity size={24}/>}/>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Medicamentos Entregados"
            value={currentStats.deliveredMedications}
            icon={<FiBox size={24}/>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monto Facturado ($)"
            value={currentStats.invoicedAmount.toLocaleString()}
            icon={<FiDollarSign size={24}/>}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom
                  sx={{ mt: 6, mb: 3 }}>
        Estado de las Órdenes
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(orderStates).
          map(([state, count]) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={state}>
              <OrderStateCard state={state} count={count}/>
            </Grid>))}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom
                  sx={{ mt: 6, mb: 3 }}>
        Evolución en el Tiempo
      </Typography>

      <ChartContainer title="Acuses">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData.acuses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#BCC1C6"/>
            <XAxis dataKey="month" stroke="#1D1D1F"/>
            <YAxis stroke="#1D1D1F"/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="generados" stroke="#1A3E74"
                  name="Acuses Generados"/>
            <Line type="monotone" dataKey="entregados" stroke="#365F91"
                  name="Acuses Entregados"/>
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Órdenes">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeSeriesData.ordenes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#BCC1C6"/>
            <XAxis dataKey="month" stroke="#1D1D1F"/>
            <YAxis stroke="#1D1D1F"/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="creadas" fill="#1A3E74" name="Órdenes Creadas"/>
            <Bar dataKey="entregadas" fill="#365F91"
                 name="Órdenes Entregadas"/>
            <Bar dataKey="facturadas" fill="#91C1E7"
                 name="Órdenes Facturadas"/>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Medicamentos">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData.medicamentos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#BCC1C6"/>
            <XAxis dataKey="month" stroke="#1D1D1F"/>
            <YAxis stroke="#1D1D1F"/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="solicitados" stroke="#1A3E74"
                  name="Medicamentos Solicitados"/>
            <Line type="monotone" dataKey="entregados" stroke="#365F91"
                  name="Medicamentos Entregados"/>
            <Line type="monotone" dataKey="facturados" stroke="#91C1E7"
                  name="Medicamentos Facturados"/>
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Box>
  </ThemeProvider>)
}

export default Dashboard

