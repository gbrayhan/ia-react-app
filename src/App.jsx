import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import UIPage from './pages/ui'
import DashboardPage from './pages/dashboard/index.jsx'
import LoginPage from './pages/login/index.jsx'
import NotFoundPage from './NotFoundPage.jsx'

function App () {
  return (<div>
    <Routes>
      <Route path="/" element={<AppLayout component={<DashboardPage/>}/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route
        path="/dashboard"
        element={<AppLayout component={<DashboardPage/>}/>}
      />

      <Route path="/ui" element={<AppLayout component={<UIPage/>}/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  </div>)
}

export default App
