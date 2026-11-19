import { useState, useEffect, useRef, useCallback } from 'react'
import { Hands, HAND_CONNECTIONS, VERSION } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Camera } from '@mediapipe/camera_utils'

/**
 * Custom hook to initialize MediaPipe Hands, webcam video stream,
 * and real-time landmark rendering on an overlay canvas.
 */
export function useMediaPipeHands({
  videoRef,
  canvasRef,
  showLandmarks = true,
  selectedDeviceId = '',
  onResults = () => {},
}) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [fps, setFps] = useState(0)
  const [latencyMs, setLatencyMs] = useState(0)
  const [availableCameras, setAvailableCameras] = useState([])
  const [cameraError, setCameraError] = useState(null)

  const handsRef = useRef(null)
  const cameraRef = useRef(null)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const isProcessingRef = useRef(false)

  // Keep latest callback and options in refs to avoid recreating Hands instance
  const onResultsRef = useRef(onResults)
  useEffect(() => {
    onResultsRef.current = onResults
  }, [onResults])

  const showLandmarksRef = useRef(showLandmarks)
  useEffect(() => {
    showLandmarksRef.current = showLandmarks
  }, [showLandmarks])

  // Enumerate connected video input devices
  const refreshCameras = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Kamera ${index + 1}`,
        }))
      setAvailableCameras(videoInputs)
    } catch (err) {
      // Fallback silently if device enumeration fails
    }
  }, [])

  // Initialize MediaPipe Hands instance once on mount
  useEffect(() => {
    let isMounted = true

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    hands.onResults((results) => {
      if (!isMounted) return

      // Calculate real-time FPS
      const now = performance.now()
      frameCountRef.current += 1
      const elapsed = now - lastTimeRef.current
      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed))
        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      // Draw landmarks onto overlay canvas
      const canvas = canvasRef?.current
      const video = videoRef?.current

      if (canvas && video) {
        if (video.videoWidth && canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0]

            if (showLandmarksRef.current) {
              drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: '#34613A',
                lineWidth: 3,
              })
              drawLandmarks(ctx, landmarks, {
                color: '#8EBD55',
                lineWidth: 1,
                radius: 4,
              })
            }

            // Deliver detected landmarks to parent listener
            if (onResultsRef.current) {
              onResultsRef.current(landmarks, results)
            }
          } else {
            // Hand not detected
            if (onResultsRef.current) {
              onResultsRef.current(null, results)
            }
          }

          ctx.restore()
        }
      }
    })

    handsRef.current = hands
    setIsModelLoaded(true)
    refreshCameras()

    return () => {
      isMounted = false
      if (handsRef.current) {
        try {
          handsRef.current.close()
        } catch (e) {
          // Ignore teardown errors
        }
      }
    }
  }, [canvasRef, videoRef, refreshCameras])

  // Start webcam stream using MediaPipe Camera utility
  const startCamera = useCallback(async () => {
    setCameraError(null)
    const video = videoRef?.current
    if (!video || !handsRef.current) return

    try {
      if (cameraRef.current) {
        cameraRef.current.stop()
      }

      const camera = new Camera(video, {
        onFrame: async () => {
          if (isProcessingRef.current) return
          if (videoRef?.current && handsRef.current) {
            try {
              isProcessingRef.current = true
              const startTimestamp = performance.now()
              await handsRef.current.send({ image: videoRef.current })
              setLatencyMs(Math.round(performance.now() - startTimestamp))
            } catch (err) {
              // Frame dropped during inference
            } finally {
              isProcessingRef.current = false
            }
          }
        },
        width: 1280,
        height: 720,
        deviceId: selectedDeviceId || undefined,
      })

      await camera.start()
      cameraRef.current = camera
      setIsCameraActive(true)
      await refreshCameras()
    } catch (err) {
      setIsCameraActive(false)
      setCameraError(
        'Tidak dapat mengakses webcam. Pastikan izin kamera aktif dan perangkat terhubung.'
      )
    }
  }, [videoRef, selectedDeviceId, refreshCameras])

  // Stop webcam stream
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      try {
        cameraRef.current.stop()
      } catch (e) {
        // Ignore stop error
      }
      cameraRef.current = null
    }

    const video = videoRef?.current
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      video.srcObject = null
    }

    const canvas = canvasRef?.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    setIsCameraActive(false)
    setFps(0)
  }, [videoRef, canvasRef])

  return {
    isCameraActive,
    isModelLoaded,
    fps,
    latencyMs,
    availableCameras,
    cameraError,
    startCamera,
    stopCamera,
  }
}
