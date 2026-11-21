import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '@/features/dashboard/DashboardPage'
import TherapySessionPage from '@/features/therapy-session/TherapySessionPage'
import PatientsPage from '@/features/patients/PatientsPage'
import HistoryPage from '@/features/history/HistoryPage'
import CalibrationPage from '@/features/calibration/CalibrationPage'
import RemoteCameraPage from '@/features/remote-camera/RemoteCameraPage'

function AppRoutes() {
  const isDevMode = typeof window !== 'undefined' && localStorage.getItem('stroke_therapy_dev_mode') === 'true'
  const defaultPath = isDevMode ? '/dashboard' : '/therapy'

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/therapy" element={<TherapySessionPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/calibration" element={<CalibrationPage />} />
      <Route path="/camera" element={<RemoteCameraPage />} />
      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  )
}

export default AppRoutes
