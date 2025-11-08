import { Outlet, useLocation } from 'react-router'
import Sidebar from '@/pages/Sidebar'
import '@/styles/variables.css'

const MainLayout = () => {
  const location = useLocation()
  return (
    <main className="main-container">
      <Sidebar current_path={location.pathname} />
      <Outlet />
    </main>
  )
}

export default MainLayout
