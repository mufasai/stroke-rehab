import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ClinicNotification() {
  return (
    <Alert className="bg-primary-50 border-primary-200">
      <div className="flex items-start gap-3">
        <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <AlertTitle className="text-sm font-semibold text-foreground mb-1">
            Pemberitahuan Klinik
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">SENSOR & MEJA TERAPI</span>
            <br />
            Kalibrasi webcam sudut atas meja terapi terverifikasi otomatis.
            Distorsi lensa terkompensasi pada grid 40×40 cm dengan deviasi spatial &lt; 1.2 mm.
          </AlertDescription>
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium">ID Kamera:</span> Cam-Rehab-3B (FHD 60FPS)
            <span className="font-medium ml-3">SIAP DIGUNAKAN</span>
          </div>
        </div>
      </div>
    </Alert>
  )
}
