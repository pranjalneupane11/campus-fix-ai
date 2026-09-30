import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import ReportIssuePage from './pages/ReportIssuePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TicketDetailPage from './pages/TicketDetailPage.jsx'
import EquipmentPage from './pages/EquipmentPage.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
        </Routes>
      </main>
    </div>
  )
}
