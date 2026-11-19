import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDeviceInfo } from '@/hooks/useDeviceInfo'
import { Code2, Sparkles } from 'lucide-react'

const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    id: 'patients',
    label: 'Data Pasien',
    path: '/patients',
    badge: '18 Aktif'
  },
  {
    id: 'therapy',
    label: 'Sesi Terapi',
    path: '/therapy',
    hasIndicator: true
  },
  {
    id: 'history',
    label: 'Riwayat & Laporan',
    path: '/history',
  },
  {
    id: 'calibration',
    label: 'Kalibrasi',
    path: '/calibration',
  }
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { os, architecture } = useDeviceInfo()

  const [isDevMode, setIsDevMode] = useState(() => {
    const saved = localStorage.getItem('stroke_therapy_dev_mode')
    return saved === 'true'
  })

  const handleToggleDevMode = () => {
    setIsDevMode((prev) => {
      const nextVal = !prev
      localStorage.setItem('stroke_therapy_dev_mode', String(nextVal))
      window.dispatchEvent(new Event('storage'))
      if (!nextVal && location.pathname !== '/therapy') {
        navigate('/therapy')
      }
      return nextVal
    })
  }

  // Filter menu based on dev mode
  const visibleMenuItems = isDevMode
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.id === 'therapy')

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            SH
          </div>
          <div>
            <div className="font-bold text-foreground">Hand Rehab</div>
            <div className="text-xs text-muted-foreground">Stroke Therapy</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-foreground hover:bg-secondary-100'
                  }
                `}
              >
                <span>{item.label}</span>

                {item.badge && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-secondary-200 text-secondary-700'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}

                {item.hasIndicator && (
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {!isDevMode && (
          <div className="mt-4 p-3 rounded-lg bg-primary-50/70 border border-primary-100 text-[11px] text-primary-800 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary-600" />
              Mode Terapi Aktif
            </div>
            <p className="text-[10.5px] text-primary-700/90 leading-tight">
              Tampilan difokuskan untuk latihan pasien. Aktifkan Dev Mode di bawah untuk melihat seluruh menu klinik.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border space-y-3">
        {/* Toggle Dev Mode */}
        <div className="bg-secondary-50/90 rounded-lg p-2.5 border border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Code2 className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Dev Mode
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isDevMode}
              onClick={handleToggleDevMode}
              className={`
                relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none
                ${isDevMode ? 'bg-primary-600' : 'bg-secondary-300'}
              `}
              title={isDevMode ? 'Matikan Dev Mode (Mode Terapi Saja)' : 'Aktifkan Dev Mode (Tampilkan Semua Menu)'}
            >
              <span
                className={`
                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 
                  transition duration-200 ease-in-out
                  ${isDevMode ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">
              {isDevMode ? 'Semua Menu Terbuka' : 'Hanya Sesi Terapi'}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded font-semibold text-[9px] uppercase tracking-wider ${
                isDevMode
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isDevMode ? 'Full Access' : 'Kiosk'}
            </span>
          </div>
        </div>

        {/* Device Status */}
        <div className="bg-secondary-50 rounded-lg p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1">
            DEVICE
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs font-medium text-foreground">ONLINE</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {os} {architecture}
          </div>
        </div>
      </div>
    </div>
  )
}
