import { useCurrentTime } from '@/hooks/useCurrentTime'
import { Menu } from 'lucide-react'

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export function Header({ therapistName = "Aisyah Putri, S.Ft., Ftr.", onOpenMobileMenu = () => {} }) {
  const currentTime = useCurrentTime()

  const dayName = DAYS[currentTime.getDay()]
  const date = currentTime.getDate()
  const monthName = MONTHS[currentTime.getMonth()]
  const year = currentTime.getFullYear()
  const hours = String(currentTime.getHours()).padStart(2, '0')
  const minutes = String(currentTime.getMinutes()).padStart(2, '0')
  const seconds = String(currentTime.getSeconds()).padStart(2, '0')

  return (
    <div className="bg-card border-b border-border px-3 sm:px-6 h-16 md:h-[73px] flex items-center shrink-0">
      <div className="flex items-center justify-between w-full min-w-0">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 -ml-1 rounded-lg text-foreground hover:bg-secondary-100 transition-colors"
            title="Buka Menu"
          >
            <Menu className="size-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <div className="size-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">
              SH
            </div>
            <div className="font-bold text-sm text-foreground leading-tight">
              Hand Rehab
            </div>
          </div>
        </div>

        {/* Telemetry info and Therapist info */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
          {/* Hari / Tanggal (Hidden on mobile < 640px) */}
          <div className="text-right hidden sm:block">
            <div className="text-[10px] md:text-xs text-muted-foreground mb-0.5">
              HARI/TANGGAL/TAHUN
            </div>
            <div className="text-xs md:text-sm font-medium text-foreground">
              {dayName}, {date} {monthName} {year}
            </div>
          </div>

          <div className="h-6 md:h-8 w-px bg-border hidden sm:block" />

          {/* Jam (Hidden on mobile and tablet < 768px) */}
          <div className="text-right hidden md:block">
            <div className="text-[10px] md:text-xs text-muted-foreground mb-0.5">
              JAM
            </div>
            <div className="text-xs md:text-sm font-semibold text-foreground font-mono">
              {hours}:{minutes}:{seconds}
            </div>
          </div>

          <div className="h-6 md:h-8 w-px bg-border hidden md:block" />

          {/* Therapist Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden lg:block">
              <div className="text-[10px] md:text-xs text-muted-foreground mb-0.5">
                FISIOTERAPIS
              </div>
              <div className="text-xs md:text-sm font-semibold text-foreground">
                {therapistName}
              </div>
            </div>

            <div
              className="size-8 sm:size-9 md:size-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm shrink-0 shadow-xs cursor-default"
              title={therapistName}
            >
              AP
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
