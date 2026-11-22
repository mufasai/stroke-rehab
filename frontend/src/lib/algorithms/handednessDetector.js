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
  // MediaPipe Hands multiHandedness:
  // In an unmirrored camera stream, MediaPipe outputs 'Right' for the subject's Right Hand ('Kanan')
  // and 'Left' for the subject's Left Hand ('Kiri').
  let mpSide = null
  let mpScore = 0
  let rawLabel = null

  if (multiHandedness && multiHandedness.length > 0) {
    rawLabel = multiHandedness[0].label
    mpScore = multiHandedness[0].score || 0.9
    const normalized = String(rawLabel).toLowerCase()
    mpSide = normalized === 'right' ? 'Kanan' : 'Kiri'
  }

  // 2. 2D Anatomical Landmark Relative Position Verification
  // In raw video coordinates from webcam facing user (x: 0 left to 1 right, y: 0 top to 1 bottom):
  // Wrist is at bottom (larger y), fingers at top (smaller y).
  const w = landmarks[0]   // Wrist
  const m = landmarks[9]   // Middle finger MCP
  const i = landmarks[5]   // Index finger MCP
  const p = landmarks[17]  // Pinky finger MCP
  const t = landmarks[4]   // Thumb tip

  // 2D cross product of longitudinal palm vector (wrist -> middle) and transverse knuckle vector (pinky -> index)
  const u_x = m.x - w.x
  const u_y = m.y - w.y
  const v_x = i.x - p.x
  const v_y = i.y - p.y
  const normalZ = u_x * v_y - u_y * v_x

  let anatSide
  if (normalZ <= 0) {
    // Palm facing camera:
    // User's Right Hand: thumb points towards body center (to the right side of hand in camera frame, t.x > p.x) -> 'Kanan'
    // User's Left Hand: thumb points towards body center (to the left side of hand in camera frame, t.x < p.x) -> 'Kiri'
    anatSide = t.x > p.x ? 'Kanan' : 'Kiri'
  } else {
    // Back of hand facing camera:
    anatSide = t.x < p.x ? 'Kanan' : 'Kiri'
  }

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
