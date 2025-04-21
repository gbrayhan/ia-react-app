import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import { FaBook, FaCartArrowDown, FaChevronLeft, FaHospitalUser, FaLock, FaMoneyBill, FaPills, FaPlusCircle, FaSearch, FaStore as FaShop, FaTablets, FaTachometerAlt, FaUsers } from 'react-icons/fa'
import PropTypes from 'prop-types'

const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed(prev => {
      localStorage.setItem('sidebarCollapsed', !prev)
      return !prev
    })
  }

  const sidebarWidthClass = collapsed ? 'w-16' : 'w-64'
  const textClasses = collapsed
    ? 'opacity-0 max-w-0 overflow-hidden transition-all duration-300 ease-in-out delay-150 whitespace-nowrap'
    : 'opacity-100 max-w-xs transition-all duration-300 ease-in-out delay-0 whitespace-nowrap'
  const menuItemClasses = `group flex items-center h-12 px-4 relative transition-colors duration-300 hover:bg-[#91C1E7] ${collapsed
    ? 'justify-center'
    : 'justify-start'}`

  const tooltip = label => collapsed && (<div
    className="absolute left-full ml-2 bg-[#1A3E74] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
    {label}
  </div>)

  return (<div
    className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 ${sidebarWidthClass}`}>
    <div
      className="flex items-center justify-between px-4 py-2 bg-[#1A3E74] text-white transition-all duration-300">
      {!collapsed && <h3 className="text-lg font-light">Menu</h3>}
      <IconButton onClick={toggleSidebar} size="small"
                  className="p-1 text-white">
        <FaChevronLeft
          className={`transition-transform duration-300 ${collapsed
            ? 'rotate-180'
            : ''}`}/>
      </IconButton>
    </div>
    <div className="mt-2">
      <div className="mt-4">
        {!collapsed && <h4
          className="px-4 text-xs uppercase text-[#365F91] tracking-wide">General</h4>}
        <ul className="mt-1">
          <li>
            <Link to="/dashboard" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaTachometerAlt className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Dashboard</span>
              {tooltip('Dashboard')}
            </Link>
          </li>
          <li>
            <Link to="/create-order" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaPlusCircle className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Nuevo Pedido</span>
              {tooltip('Nuevo Pedido')}
            </Link>
          </li>
          <li>
            <Link to="/view-orders" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaSearch className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Consulta Pedido</span>
              {tooltip('Consulta Pedido')}
            </Link>
          </li>
          <li>
            <Link to="/clients" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaUsers className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Clientes</span>
              {tooltip('Clientes')}
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        {!collapsed && <h4
          className="px-4 text-xs uppercase text-[#365F91] tracking-wide">Pacientes
          Recurrentes</h4>}
        <ul className="mt-1">
          <li>
            <Link to="/recurrent-patient" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaHospitalUser className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Pacientes Recurrentes</span>
              {tooltip('Pacientes Recurrentes')}
            </Link>
          </li>

          <li>
            <Link to="/med-pacientes-rec" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaTablets className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Med. Pacientes Rec.</span>
              {tooltip('Med. Pacientes Rec.')}
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        {!collapsed && <h4
          className="px-4 text-xs uppercase text-[#365F91] tracking-wide">Administración</h4>}
        <ul className="mt-1">
          <li>
            <Link to="/medicine-catalog" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaPills className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Catalogo Med.</span>
              {tooltip('Catalogo Med.')}
            </Link>
          </li>
          <li>
            <Link to="/medicine-cost" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaMoneyBill className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Costo Med.</span>
              {tooltip('Costo Med.')}
            </Link>
          </li>
          <li>
            <Link to="/icd-catalog" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaBook className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Catalogo ICD</span>
              {tooltip('Catalogo ICD')}
            </Link>
          </li>
          <li>
            <Link to="/warehouse-medicine" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaShop className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Almacen</span>
              {tooltip('Almacen')}
            </Link>
          </li>
          <li>
            <Link to="/procurement" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaCartArrowDown className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Aprovisionamiento</span>
              {tooltip('Aprovisionamiento')}
            </Link>
          </li>
          <li>
            <Link to="/permisos-manager" className={menuItemClasses}>
              <div className="w-8 flex justify-center">
                <FaLock className="text-[#365F91] text-lg"/>
              </div>
              <span className={textClasses}>Permisos</span>
              {tooltip('Permisos')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>)
}

Sidebar.defaultProps = {
  collapsed: false, setCollapsed: () => {},
}
Sidebar.propTypes = {
  collapsed: PropTypes.bool, setCollapsed: PropTypes.func,
}

export default Sidebar
