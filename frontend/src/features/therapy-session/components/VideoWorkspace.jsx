import React, { useState } from 'react'
import { Camera, Eye, Volume2, VideoOff, FlipHorizontal, Scan } from 'lucide-react'
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
  isMirrored = true,
  onToggleMirror = () => {},
  isHandDetected = false,
  quality = 'incomplete',
  wristDeviation = 0,
  onStartCamera,
  onStopCamera,
}) {
  const [showGuide, setShowGuide] = useState(true)

  // Dynamic adaptive state for detection guide box
  let guideBorder = 'border-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]'
  let guideBadge = 'bg-cyan-950/90 text-cyan-300 border-cyan-400/60'
  let guideText = 'Arahkan Telapak Tangan ke Area Ini'

  if (isHandDetected) {
    if (quality === 'compensatory') {
      guideBorder = 'border-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.85)]'
      guideBadge = 'bg-amber-950/90 text-amber-300 border-amber-400/60 animate-pulse'
      guideText = `Pergelangan Miring (${wristDeviation}°) - Luruskan Tangan`
    } else if (quality === 'correct') {
      guideBorder = 'border-emerald-400 drop-shadow-[0_0_18px_rgba(52,211,153,0.85)]'
      guideBadge = 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60'
      guideText = 'Posisi Tangan & Bukaan Jari Optimal'
    } else {
      guideBorder = 'border-teal-400 drop-shadow-[0_0_12px_rgba(45,212,191,0.7)]'
      guideBadge = 'bg-teal-950/90 text-teal-300 border-teal-400/60'
      guideText = 'Tangan Terdeteksi (21 Titik Landmark Aktif)'
    }
  }
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col space-y-3">
      {/* Video Viewport Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-border/80">
        {/* HTML5 Video Element with optional mirror flip */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-200 ${
            isCameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* MediaPipe 21-Landmark Canvas Overlay (mirrored in sync with video) */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10 transition-transform duration-200"
        />

        {/* Status Badges Overlay */}
        {isCameraActive && (
          <>
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
                <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                LIVE STREAMING
              </span>

              {/* Quick Mirror Toggle Button on video overlay */}
              <button
                type="button"
                onClick={onToggleMirror}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold backdrop-blur-md transition-all border ${
                  isMirrored
                    ? 'bg-emerald-600/90 text-white border-emerald-400/80 shadow-xs'
                    : 'bg-black/60 text-slate-300 border-white/20 hover:bg-black/80'
                }`}
                title="Klik untuk membalikkan arah kamera (mode cermin)"
              >
                <FlipHorizontal className="size-3.5" />
                <span>{isMirrored ? 'Cermin: ON' : 'Cermin: OFF'}</span>
              </button>
            </div>

            <div className="absolute top-3 right-3 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-medium text-emerald-400">
                FPS: {fps} | MediaPipe WASM Active
              </span>
            </div>

            {/* Adaptive Optimal Detection Guide Box with high contrast drop shadow */}
            {showGuide && (
              <div
                style={{
                  filter:
                    'drop-shadow(0px 2px 5px rgba(0,0,0,0.9)) drop-shadow(0px 0px 1px rgba(0,0,0,0.9))',
                }}
                className={`absolute inset-7 sm:inset-11 md:inset-12 border-2 border-dashed rounded-2xl pointer-events-none flex flex-col justify-between p-3.5 z-10 transition-colors duration-300 ${guideBorder}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md shadow-xs flex items-center gap-1.5 transition-colors ${guideBadge}`}
                  >
                    <span className="size-1.5 rounded-full bg-current animate-ping" />
                    {guideText}
                  </span>
                  <span className="bg-black/75 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded border border-white/20">
                    Top-Down 90°
                  </span>
                </div>

                <div className="flex justify-between items-end text-[10px] font-mono">
                  <span className="bg-black/75 text-white/80 px-2 py-0.5 rounded border border-white/20">
                    Telapak Menghadap Meja
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border backdrop-blur-md font-semibold transition-colors ${
                      isHandDetected
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-black/75 text-white/60 border-white/20'
                    }`}
                  >
                    {isHandDetected ? 'Landmarks: 21 Pts (Terkunci)' : 'Menunggu Tangan...'}
                  </span>
                </div>
              </div>
            )}
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

        {/* Visual, Audio, and Mirror Toggles */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleMirror}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              isMirrored
                ? 'bg-primary-50 text-primary-800 border-primary-300 font-semibold'
                : 'bg-background text-muted-foreground border-input hover:text-foreground'
            }`}
            title="Ubah arah kamera antara invers (cermin) atau kamera normal"
          >
            <FlipHorizontal className="size-3.5" />
            <span>{isMirrored ? 'Invers' : 'Normal'}</span>
          </button>

          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={showGuide}
              onChange={(e) => setShowGuide(e.target.checked)}
              className="rounded border-input text-primary-600 focus:ring-primary-500"
            />
            <Scan className="h-3.5 w-3.5" />
            <span>Kotak Panduan</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={showLandmarks}
              onChange={(e) => onToggleLandmarks(e.target.checked)}
              className="rounded border-input text-primary-600 focus:ring-primary-500"
            />
            <Eye className="h-3.5 w-3.5" />
            <span>Landmarks</span>
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
