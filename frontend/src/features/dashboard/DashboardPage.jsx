import { StatsCard } from "@/components/dashboard/StatsCard"
import { SessionQueueTable } from "@/components/dashboard/SessionQueueTable"
import { ROMTrendChart } from "@/components/dashboard/ROMTrendChart"
import { ClinicNotification } from "@/components/dashboard/ClinicNotification"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentTime } from "@/hooks/useCurrentTime"
import { getTimeGreeting } from "@/lib/utils"

export default function DashboardPage() {
  const currentTime = useCurrentTime()
  const greeting = getTimeGreeting(currentTime)

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {greeting}, <span className="text-primary-600">Fisioterapis</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Pantau perkembangan latihan gerak jari dan kestabilan tangan pasien hari ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="TOTAL PASIEN TERDAFTAR"
          value="28"
          subtitle="Pasien Aktif"
          trend={{ text: "+3 pasien baru minggu ini", isPositive: true }}
        />

        <StatsCard
          title="SESI TERAPI HARI INI"
          value="6"
          subtitle="/8 Selesai"
        />

        <StatsCard
          title="RATA-RATA BUKAAN JARI (ROM)"
          value="+14.2%"
          subtitle="Kemampuan buka jari membaik"
          trend={{ text: "Target Harian: 75%", isPositive: true }}
        />

        <StatsCard
          title="TINGKAT KEMIRINGAN TANGAN"
          value="11.5%"
          subtitle="Turun 4.8% (Posisi tangan makin stabil)"
        />
      </div>

      <div className="w-full">
        <Card className="w-full">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Tabel Antrean Terapi Hari Ini
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Jadwal Latihan Pasien
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-desa-foreshadow px-3 py-1 text-xs font-semibold text-desa-dark-green border border-desa-dark-green/20">
                  <span className="size-1.5 rounded-full bg-desa-dark-green" />
                  4 Pasien Terjadwal
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <SessionQueueTable />
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
