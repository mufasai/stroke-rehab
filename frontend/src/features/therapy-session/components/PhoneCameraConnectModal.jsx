import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QRCodeDisplay } from '@/components/common/QRCodeDisplay'
import { Smartphone, CheckCircle2, Copy, Check, Radio, Wifi, AlertCircle } from 'lucide-react'

function generateRoomCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function PhoneCameraConnectModal({
  isOpen = false,
  onClose = () => {},
  onStreamConnected = () => {},
}) {
  const [roomCode] = useState(() => generateRoomCode())
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('waiting') // 'waiting' | 'connecting' | 'connected' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const peerInstanceRef = useRef(null)
  const isConnectedRef = useRef(false)

  const phoneUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/camera?room=${roomCode}`
      : `/camera?room=${roomCode}`

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    isConnectedRef.current = false
    setStatus('waiting')
    setErrorMessage('')

    const desktopPeerId = `rehab-desktop-${roomCode}`

    const initPeer = () => {
      const PeerClass = window.Peer
      if (!PeerClass) {
        setErrorMessage(
          'Modul WebRTC P2P (PeerJS) belum selesai dimuat. Pastikan koneksi internet aktif.'
        )
        setStatus('error')
        return
      }

      try {
        const peer = new PeerClass(desktopPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:stun3.l.google.com:19302' },
              { urls: 'stun:stun4.l.google.com:19302' },
            ],
          },
        })

        peerInstanceRef.current = peer

        peer.on('open', () => {
          if (isMounted) {
            setStatus('waiting')
          }
        })

        peer.on('call', (call) => {
          if (!isMounted) return
          setStatus('connecting')

          call.answer()

          call.on('stream', (remoteStream) => {
            if (!isMounted) return
            isConnectedRef.current = true
            setStatus('connected')
            setTimeout(() => {
              onStreamConnected(remoteStream, {
                roomCode,
                peerId: call.peer,
                peer,
                call,
              })
              onClose()
            }, 500)
          })

          call.on('error', (err) => {
            console.error('Call stream error:', err)
            if (isMounted) {
              setErrorMessage('Terjadi kendala pada transmisi video dari HP.')
              setStatus('error')
            }
          })
        })

        peer.on('error', (err) => {
          console.error('PeerJS error on desktop:', err)
          if (isMounted && !isConnectedRef.current) {
            if (err.type === 'unavailable-id') {
              return
            }
            setErrorMessage('Gagal membuka saluran sinyal nirkabel. Coba tutup dan buka kembali.')
            setStatus('error')
          }
        })
      } catch (err) {
        console.error('Peer creation failed:', err)
        if (isMounted) {
          setErrorMessage('Gagal menginisialisasi sambungan nirkabel.')
          setStatus('error')
        }
      }
    }

    // Small delay to ensure Peer is loaded from CDN
    const timeout = setTimeout(initPeer, 250)

    return () => {
      isMounted = false
      clearTimeout(timeout)
      // Only destroy peer if modal was closed before a call was successfully connected
      if (peerInstanceRef.current && !isConnectedRef.current) {
        try {
          peerInstanceRef.current.destroy()
        } catch (e) {
          // Ignore destruction error
        }
        peerInstanceRef.current = null
      }
    }
  }, [isOpen, roomCode, onClose, onStreamConnected])

  const handleCopy = () => {
    navigator.clipboard?.writeText(phoneUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-card border-border">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Smartphone className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Gunakan Kamera Smartphone (HP)
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center py-2">
          {/* QR Code Container */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <QRCodeDisplay url={phoneUrl} size={180} />
            <div className="mt-2 text-center">
              <span className="text-[11px] text-muted-foreground font-mono">
                Kode Ruangan: <strong className="text-foreground">{roomCode}</strong>
              </span>
            </div>
          </div>

          {/* Instructions and Steps */}
          <div className="sm:col-span-7 space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-[11px] shrink-0">
                  1
                </span>
                <span className="text-muted-foreground">
                  Buka aplikasi kamera di HP Anda dan <strong>scan QR Code</strong> di samping.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-[11px] shrink-0">
                  2
                </span>
                <span className="text-muted-foreground">
                  Izinkan akses kamera di browser HP Anda.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-[11px] shrink-0">
                  3
                </span>
                <span className="text-muted-foreground">
                  Posisikan HP menghadap meja.
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
