import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function MainLayout({ children }) {
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
