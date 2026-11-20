/**
 * Captures a crisp, high-definition composite frame of the active webcam stream and MediaPipe skeleton overlay.
 * Uses an offscreen HTML5 canvas at HD resolution (720px - 800px width) with 0.82 JPEG quality and bicubic smoothing,
 * ensuring high clinical fidelity so finger joints and landmarks are sharp and clear (tidak burik/pixelated).
 *
 * @param {HTMLVideoElement|null} videoElement
 * @param {HTMLCanvasElement|null} landmarkCanvas
 * @returns {string|null} base64 data URL string, or null on failure
 */
export function captureRepetitionSnapshot(videoElement, landmarkCanvas, isMirrored = false) {
  try {
    if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
      return null
    }

    const sourceWidth = videoElement.videoWidth
    const sourceHeight = videoElement.videoHeight

    // 800px width ensures crisp display on Retina/HD screens without exceeding storage limits
    const targetWidth = Math.min(Math.max(sourceWidth, 720), 840)
    const targetHeight = Math.round((sourceHeight / sourceWidth) * targetWidth) || 480

    const offscreen = document.createElement('canvas')
    offscreen.width = targetWidth
    offscreen.height = targetHeight

    const ctx = offscreen.getContext('2d', { alpha: false })
    if (!ctx) return null

    // Enable high-grade bicubic smoothing for crisp downscaling
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Save context state for potential mirror flip
    ctx.save()
    if (isMirrored) {
      ctx.translate(targetWidth, 0)
      ctx.scale(-1, 1)
    }

    // 1. Draw raw high-resolution video frame
    ctx.drawImage(videoElement, 0, 0, targetWidth, targetHeight)

    // 2. Overlay skeleton landmarks if available
    if (landmarkCanvas && landmarkCanvas.width > 0 && landmarkCanvas.height > 0) {
      ctx.drawImage(landmarkCanvas, 0, 0, targetWidth, targetHeight)
    }
    ctx.restore()

    // 3. Clinical timestamp badge in bottom-left corner
    ctx.save()
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
    ctx.fillRect(10, targetHeight - 26, 110, 18)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(timeStr + ' WIB', 16, targetHeight - 12)
    ctx.restore()

    // 0.82 quality produces sharp, artifact-free medical photos (~35-45 KB each)
    return offscreen.toDataURL('image/jpeg', 0.82)
  } catch (err) {
    console.warn('Gagal menangkap snapshot repetisi:', err)
    return null
  }
}
