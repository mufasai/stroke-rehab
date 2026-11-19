import React from 'react'
import { Camera, Eye, Volume2, VideoOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VideoWorkspace({
  videoRef,
  canvasRef,
  isCameraActive,
  isModelLoaded,
  fps,
  cameraError,
  availableCameras = [],
  selectedCameraId,
  onSelectCamera,
  showLandmarks,
  onToggleLandmarks,
  audioEnabled,
  onToggleAudio,
  onStartCamera,
  onStopCamera,
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col space-y-3">
      {/* Video Viewport Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-border/80">
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover ${
            isCameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* MediaPipe 21-Landmark Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />

        {/* Status Badges Overlay */}
        {isCameraActive && (
          <>
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
                <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                LIVE STREAMING
              </span>
            </div>

            <div className="absolute top-3 right-3 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-medium text-emerald-400">
                FPS: {fps} | MediaPipe WASM Active
              </span>
            </div>

            {/* Optimal Detection Guide Box */}
            <div className="absolute inset-10 sm:inset-14 border-2 border-dashed border-emerald-500/50 rounded-xl pointer-events-none flex flex-col justify-between p-3 z-10">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-950/70 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  AREA DETEKSI OPTIMAL
                </span>
                <span className="bg-black/60 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                  Top-Down 90°
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-white/70">
                  Telapak Menghadap Meja
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Landmarks: 21 Pts
                </span>
              </div>
            </div>
          </>
        )}

        {/* Fallback Display When Camera Is Off or Errored */}
        {!isCameraActive && (
          <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center max-w-md">
            <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <VideoOff className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Kamera Belum Aktif
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {cameraError ||
                'Aktifkan webcam untuk memulai pelacakan landmark tangan secara real-time.'}
            </p>
            <Button
              onClick={onStartCamera}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-5 py-2"
            >
              <Camera className="h-4 w-4 mr-2" />
              Nyalakan Kamera Terapi
            </Button>
          </div>
        )}
      </div>

      {/* Video Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        {/* Device Selection */}
        <div className="flex items-center gap-2">
          <label htmlFor="camera-select" className="text-muted-foreground font-medium">
            Sumber Kamera:
          </label>
          <select
            id="camera-select"
            value={selectedCameraId}
            onChange={(e) => onSelectCamera(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {availableCameras.length > 0 ? (
              availableCameras.map((cam) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label}
                </option>
              ))
            ) : (
              <option value="">Tidak Ada Kamera</option>
            )}
          </select>
        </div>

        {/* Visual and Audio Toggles */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={showLandmarks}
              onChange={(e) => onToggleLandmarks(e.target.checked)}
              className="rounded border-input text-primary-600 focus:ring-primary-500"
            />
            <Eye className="h-3.5 w-3.5" />
            <span>Overlay Landmark (21 Pts)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => onToggleAudio(e.target.checked)}
              className="rounded border-input text-primary-600 focus:ring-primary-500"
            />
            <Volume2 className="h-3.5 w-3.5" />
            <span>Audio Chime</span>
          </label>

          {isCameraActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={onStopCamera}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              Hentikan Kamera
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
