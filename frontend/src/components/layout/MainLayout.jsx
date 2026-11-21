import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function MainLayout({ children }) {
  const location = useLocation()
  const isStandalone = location.pathname === '/camera'

  if (isStandalone) {
    return <main className="w-screen h-screen overflow-hidden bg-black">{children}</main>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
