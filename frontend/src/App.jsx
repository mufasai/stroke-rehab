import { BrowserRouter } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
