import { useCurrentTime } from '@/hooks/useCurrentTime'

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export function Header({ therapistName = "Aisyah Putri, S.Ft., Ftr." }) {
  const currentTime = useCurrentTime()

  const dayName = DAYS[currentTime.getDay()]
  const date = currentTime.getDate()
  const monthName = MONTHS[currentTime.getMonth()]
  const year = currentTime.getFullYear()
  const hours = String(currentTime.getHours()).padStart(2, '0')
  const minutes = String(currentTime.getMinutes()).padStart(2, '0')
  const seconds = String(currentTime.getSeconds()).padStart(2, '0')

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">
              HARI/TANGGAL/TAHUN
            </div>
            <div className="text-sm font-medium text-foreground">
              {dayName}, {date} {monthName} {year}
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">
              JAM
            </div>
            <div className="text-sm font-semibold text-foreground font-mono">
              {hours}:{minutes}:{seconds}
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">
                FISIOTERAPIS
              </div>
              <div className="text-sm font-semibold text-foreground">
                {therapistName}
              </div>
            </div>

            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
              AP
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
