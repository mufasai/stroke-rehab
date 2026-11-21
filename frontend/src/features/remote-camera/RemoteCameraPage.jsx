import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Camera, SwitchCamera, CheckCircle2, Radio, VideoOff, Wifi, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RemoteCameraPage() {
  const [searchParams] = useSearchParams()
  const initialRoom = searchParams.get('room') || ''

  const [roomCode, setRoomCode] = useState(initialRoom)
  const [isStreaming, setIsStreaming] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('initializing') // 'initializing' | 'connecting' | 'connected' | 'error'
  const [facingMode, setFacingMode] = useState('environment') // 'environment' (back) | 'user' (front)
  const [errorMessage, setErrorMessage] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const peerRef = useRef(null)
  const callRef = useRef(null)

  // Start phone camera
  const startLocalStream = useCallback(async (facing) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = mediaStream

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      return mediaStream
    } catch (err) {
      console.error('Gagal mengakses kamera smartphone:', err)
      setErrorMessage(
        'Izin kamera tidak diberikan atau perangkat tidak mendukung. Izinkan akses kamera di pengaturan browser.'
      )
      setConnectionStatus('error')
      return null
    }
  }, [])

  // Switch between back and front camera
  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextMode)
    const newStream = await startLocalStream(nextMode)
    if (newStream && callRef.current && peerRef.current) {
      // Re-call desktop with the new camera track
      try {
        const desktopPeerId = `rehab-desktop-${roomCode}`
        callRef.current.close()
        callRef.current = peerRef.current.call(desktopPeerId, newStream)
      } catch (e) {
        console.warn('Re-call with new track failed:', e)
      }
    }
  }

  // Connect to desktop via PeerJS
  const connectToDesktop = useCallback(
    async (codeToConnect) => {
      const targetRoom = codeToConnect || roomCode
      if (!targetRoom) {
        setErrorMessage('Kode ruangan tidak ditemukan.')
        setConnectionStatus('error')
        return
      }

      setConnectionStatus('connecting')
      setErrorMessage('')

      const localStream = await startLocalStream(facingMode)
      if (!localStream) return

      const PeerClass = window.Peer
      if (!PeerClass) {
        setErrorMessage('Modul transmisi PeerJS belum siap. Muat ulang halaman.')
        setConnectionStatus('error')
        return
      }

      try {
        if (peerRef.current) {
          try {
            peerRef.current.destroy()
          } catch (e) {}
        }

        const phonePeerId = `rehab-phone-${targetRoom}-${Math.random().toString(36).substring(2, 6)}`
        const peer = new PeerClass(phonePeerId, { debug: 1 })
        peerRef.current = peer

        peer.on('open', () => {
          const desktopPeerId = `rehab-desktop-${targetRoom}`
          const call = peer.call(desktopPeerId, localStream)
          callRef.current = call

          setIsStreaming(true)
          setConnectionStatus('connected')

          call.on('error', (err) => {
            console.error('Call error:', err)
            setErrorMessage('Sambungan video terputus.')
            setConnectionStatus('error')
            setIsStreaming(false)
          })

          call.on('close', () => {
            setConnectionStatus('error')
            setErrorMessage('Laptop telah menutup sambungan.')
            setIsStreaming(false)
          })
        })

        peer.on('error', (err) => {
          console.error('Phone peer error:', err)
          if (err.type === 'peer-unavailable') {
            setErrorMessage(
              `Ruangan "${targetRoom}" tidak ditemukan di laptop. Pastikan laptop masih membuka menu "Hubungkan Kamera HP".`
            )
          } else {
            setErrorMessage('Gagal menghubungi laptop. Pastikan kedua perangkat memiliki internet.')
          }
          setConnectionStatus('error')
          setIsStreaming(false)
        })
      } catch (err) {
        console.error('Peer connection error:', err)
        setErrorMessage('Gagal memulai koneksi WebRTC.')
        setConnectionStatus('error')
      }
    },
    [facingMode, roomCode, startLocalStream]
  )

  useEffect(() => {
    if (initialRoom) {
      connectToDesktop(initialRoom)
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (peerRef.current) {
        try {
          peerRef.current.destroy()
        } catch (e) {}
      }
    }
  }, [initialRoom, connectToDesktop])

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-between font-sans select-none">
      {/* Top Floating Controls */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
            Kamera HP Top-Down
          </span>
          {roomCode && (
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono text-white/90">
              #{roomCode}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleFacingMode}
          className="bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full p-2.5 active:scale-95 transition-transform"
          title="Ubah Kamera Belakang / Depan"
        >
          <SwitchCamera className="size-5" />
        </button>
      </div>

      {/* Main Fullscreen Video Viewport */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top-Down Framing Guide Box for Hands */}
        <div className="absolute inset-12 sm:inset-20 border-2 border-dashed border-emerald-400/80 rounded-3xl pointer-events-none flex flex-col justify-between p-4 z-10 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <div className="flex justify-between items-start">
            <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
              AREA TELAPAK TANGAN
            </span>
            <span className="bg-black/70 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded">
              Posisikan 90° Dari Meja
            </span>
          </div>

          <div className="text-center">
            <span className="bg-black/70 backdrop-blur-md text-white/90 text-xs px-3 py-1 rounded-full border border-white/20">
              Arahkan kamera ke telapak tangan pasien di atas meja
            </span>
          </div>

          <div className="flex justify-between items-end text-[10px] font-mono text-white/70">
            <span>Jarak Ideal: 40-50 cm</span>
            <span className="text-emerald-400">Siap Deteksi AI</span>
          </div>
        </div>

        {/* Overlay Status Banner */}
        <div className="absolute bottom-20 inset-x-4 z-20 flex justify-center pointer-events-none">
          {connectionStatus === 'connected' && (
            <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-2 shadow-lg animate-fade-in">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Tersambung ke Laptop! Video sedang disiarkan.</span>
            </div>
          )}
          {connectionStatus === 'connecting' && (
            <div className="bg-primary-950/90 border border-primary-500/60 text-primary-200 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-2 shadow-lg animate-pulse">
              <Wifi className="size-4 text-primary-400 animate-spin" />
              <span>Menghubungkan ke Laptop (#{roomCode})...</span>
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="bg-rose-950/90 border border-rose-500/60 text-rose-200 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-2 shadow-lg max-w-sm pointer-events-auto">
              <AlertTriangle className="size-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Room Entry Form if opened without ?room query */}
      {!initialRoom && !isStreaming && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Camera className="size-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Sambungkan Kamera HP</h2>
            <p className="text-xs text-slate-400 max-w-xs">
              Masukkan 4 digit kode ruangan yang tampil di layar laptop Anda.
            </p>
          </div>

          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="text"
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="CONTOH: 89AB"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center font-mono text-base tracking-widest uppercase text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
            />
            <Button
              type="button"
              onClick={() => connectToDesktop(roomCode)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 h-auto rounded-xl"
            >
              Hubungkan
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Bar Controls */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Radio className="size-3 text-emerald-400 animate-pulse" />
          <span>Kamera: {facingMode === 'environment' ? 'Belakang (Utama)' : 'Depan'}</span>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-xs text-slate-400 hover:text-white underline"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  )
}

export default RemoteCameraPage
