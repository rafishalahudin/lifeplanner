import { Routes, Route, Navigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import TopNav from './components/TopNav'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import WeddingPlanner from './pages/WeddingPlanner'
import LifePlanner from './pages/LifePlanner'
import Journal from './pages/Journal'
import Finance from './pages/Finance'

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-container">
        <TopNav />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wedding" element={<WeddingPlanner />} />
            <Route path="/life" element={<LifePlanner />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your preferences</p>
      </div>
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <Settings size={48} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.4 }}/>
        <p style={{ color: 'var(--text-muted)' }}>Settings coming soon</p>
      </div>
    </div>
  )
}
