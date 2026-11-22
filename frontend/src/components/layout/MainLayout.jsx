import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function MainLayout({ children }) {
  const location = useLocation()
  const isStandalone = location.pathname === '/camera'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (isStandalone) {
    return <main className="w-screen h-screen overflow-hidden bg-black">{children}</main>
  }

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Sidebar (hidden on mobile, fixed width on md+) */}
      <div className="hidden md:flex md:w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-card border-r border-border md:hidden transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} isMobile />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
