/**
 * Captures a composite frame of the active webcam stream and MediaPipe skeleton overlay.
 * Uses an offscreen HTML5 canvas downscaled to 360px width with 0.65 JPEG compression.
 * Resulting base64 string is ~12-18 KB, allowing 10 full repetitions to fit comfortably in localStorage.
 *
 * @param {HTMLVideoElement|null} videoElement
 * @param {HTMLCanvasElement|null} landmarkCanvas
 * @returns {string|null} base64 data URL string, or null on failure
 */
export function captureRepetitionSnapshot(videoElement, landmarkCanvas) {
  try {
    if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
      return null
    }

    const sourceWidth = videoElement.videoWidth
    const sourceHeight = videoElement.videoHeight

    // Target width 360 keeps aspect ratio and low byte-size for localStorage
    const targetWidth = 360
    const targetHeight = Math.round((sourceHeight / sourceWidth) * targetWidth) || 270

    const offscreen = document.createElement('canvas')
    offscreen.width = targetWidth
    offscreen.height = targetHeight

    const ctx = offscreen.getContext('2d')
    if (!ctx) return null

    // 1. Draw camera video frame
    ctx.drawImage(videoElement, 0, 0, targetWidth, targetHeight)

    // 2. Overlay skeleton landmarks if available
    if (landmarkCanvas && landmarkCanvas.width > 0 && landmarkCanvas.height > 0) {
      ctx.drawImage(landmarkCanvas, 0, 0, targetWidth, targetHeight)
    }

    // 3. Optional small timestamp watermark in corner
    ctx.save()
    ctx.font = '10px monospace'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(6, targetHeight - 18, 90, 14)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(
      new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      10,
      targetHeight - 7
    )
    ctx.restore()

    return offscreen.toDataURL('image/jpeg', 0.65)
  } catch (err) {
    console.warn('Gagal menangkap snapshot repetisi:', err)
    return null
  }
}
