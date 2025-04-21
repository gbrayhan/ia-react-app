import { Link, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { FaChartBar, FaFileInvoice, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/UserContext.jsx'

export default function Navbar () {
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  return (<Box className="fixed top-0 w-full min-h-[50px] bg-white z-[1000]">
    <Box
      className="fixed top-0 right-0 p-[10px] px-[20px] z-[1001] flex items-center">
      <ul className="flex list-none m-0 p-0">
        <li className="ml-[20px]">
          <Link to="/"
                className="text-[#1A3E74] no-underline text-sm transition-colors duration-300 ease hover:bg-[#91C1E7] flex items-center py-[5px] px-[10px] rounded-[5px]">
            <FaFileInvoice className="mr-[5px] text-[1.1em]"/> Facturas
          </Link>
        </li>
        <li className="ml-[20px]">
          <Link to="/reportes"
                className="text-[#1A3E74] no-underline text-sm transition-colors duration-300 ease hover:bg-[#91C1E7] flex items-center py-[5px] px-[10px] rounded-[5px]">
            <FaChartBar className="mr-[5px] text-[1.1em]"/> Reportes
          </Link>
        </li>
        <li className="ml-[20px]">
          <button onClick={handleLogout}
                  className="text-[#1A3E74] no-underline text-sm transition-colors duration-300 ease hover:bg-[#91C1E7] flex items-center py-[5px] px-[10px] rounded-[5px] bg-transparent border-none cursor-pointer">
            <FaSignOutAlt className="mr-[5px] text-[1.1em]"/> Cerrar Sesión
          </button>
        </li>
      </ul>
    </Box>
  </Box>)
}
