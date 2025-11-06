import { Outlet, useLocation } from 'react-router'
import Sidebar from '@/pages/Sidebar'
import '@/styles/variables.css'

const MainLayout = () => {
  const location = useLocation()
  return (
    <main className="main-container">
      <Sidebar current_path={location.pathname} />
      <section className="content-area">
        <Outlet />
      </section>
    </main>
  )
}

export default MainLayout
