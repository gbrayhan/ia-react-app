import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/dashboard'
import LoginPage from './pages/login'
import NotFoundPage from './NotFoundPage'

function App () {
  return (<div>
    <Routes>
      <Route path="/" element={<AppLayout component={<DashboardPage/>}/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route
        path="/dashboard"
        element={<AppLayout component={<DashboardPage/>}/>}
      />

      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  </div>)
}

export default App
