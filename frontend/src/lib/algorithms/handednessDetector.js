/**
 * Anatomical Handedness Detector for stroke rehabilitation monitoring.
 * Accurately determines whether a detected hand is 'Kanan' (Right Hand)
 * or 'Kiri' (Left Hand) in a mirrored selfie webcam environment.
 */

/**
 * Detects whether the hand is 'Kanan' (Right) or 'Kiri' (Left).
 *
 * @param {Array} landmarks - 21 MediaPipe hand landmarks with {x, y, z}
 * @param {Array|null} multiHandedness - MediaPipe multiHandedness classification array
 * @param {boolean} invert - Whether to invert the detected side (failsafe toggle)
 * @returns {Object} { side: 'Kanan' | 'Kiri', confidence: number, isRight: boolean, isLeft: boolean }
 */
export function detectHandedness(landmarks, multiHandedness = null, invert = false) {
  if (!landmarks || landmarks.length < 21) {
    return {
      side: null,
      confidence: 0,
      isRight: false,
      isLeft: false,
      detail: 'No landmarks',
    }
  }

  // 1. MediaPipe Handedness Classification (Primary)
  // According to official MediaPipe documentation:
  // MediaPipe hands assumes the input image is horizontally mirrored (selfie mode).
  // In an unmirrored input stream (such as standard HTML5 video from getUserMedia):
  // - User's physical Right hand ('Kanan') -> MediaPipe outputs rawLabel = 'Left'
  // - User's physical Left hand ('Kiri')  -> MediaPipe outputs rawLabel = 'Right'
  // Therefore, as per MediaPipe specs, we swap the handedness:
  // 'Left' maps to 'Kanan', and 'Right' maps to 'Kiri'.
  let mpSide = null
  let mpScore = 0
  let rawLabel = null

  if (multiHandedness && multiHandedness.length > 0) {
    rawLabel = multiHandedness[0].label
    mpScore = multiHandedness[0].score || 0.9
    const normalized = String(rawLabel).toLowerCase()
    mpSide = normalized === 'left' ? 'Kanan' : 'Kiri'
  }

  // 2. 2D Anatomical Landmark Relative Position Verification
  // In raw video coordinates from webcam facing user (x: 0 left to 1 right, y: 0 top to 1 bottom):
  // When facing camera:
  // - Physical Right Hand is on camera's left side: thumb points inward to center (t.x > p.x) -> 'Kanan'
  // - Physical Left Hand is on camera's right side: thumb points inward to center (t.x < p.x) -> 'Kiri'
  const p = landmarks[17]  // Pinky finger MCP
  const t = landmarks[4]   // Thumb tip

  const anatSide = t.x > p.x ? 'Kanan' : 'Kiri'

  // Resolution:
  // Use MediaPipe's deep neural classifier if available, else fallback to 2D geometry
  let detectedSide
  let confidence

  if (mpSide && mpScore >= 0.65) {
    detectedSide = mpSide
    confidence = mpScore
  } else {
    detectedSide = anatSide
    confidence = 0.85
  }

  // Apply optional inversion if explicitly requested
  const finalSide = invert
    ? detectedSide === 'Kanan' ? 'Kiri' : 'Kanan'
    : detectedSide

  return {
    side: finalSide,
    confidence: parseFloat(confidence.toFixed(2)),
    isRight: finalSide === 'Kanan',
    isLeft: finalSide === 'Kiri',
    anatSide,
    mpSide,
    rawLabel,
    invertApplied: invert,
  }
}
