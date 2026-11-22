/**
 * Anatomical Handedness Detector for stroke rehabilitation monitoring.
 * Accurately determines whether a detected hand is 'Kanan' (Right Hand)
 * or 'Kiri' (Left Hand) using MediaPipe Handedness classification and
 * 2D anatomical landmark geometry.
 */

/**
 * Detects whether the hand is 'Kanan' (Right) or 'Kiri' (Left).
 *
 * @param {Array} landmarks - 21 MediaPipe hand landmarks with {x, y, z}
 * @param {Array|null} multiHandedness - MediaPipe multiHandedness classification array
 * @returns {Object} { side: 'Kanan' | 'Kiri', confidence: number, isRight: boolean, isLeft: boolean }
 */
export function detectHandedness(landmarks, multiHandedness = null) {
  if (!landmarks || landmarks.length < 21) {
    return {
      side: null,
      confidence: 0,
      isRight: false,
      isLeft: false,
      detail: 'No landmarks',
    }
  }

  // 1. MediaPipe Deep Neural Network Handedness Classification (Primary)
  // MediaPipe Hands outputs 'Right' for the subject's Right Hand ('Kanan')
  // and 'Left' for the subject's Left Hand ('Kiri').
  let mpSide = null
  let mpScore = 0
  let rawLabel = null

  if (multiHandedness && multiHandedness.length > 0) {
    rawLabel = multiHandedness[0].label
    mpScore = multiHandedness[0].score || 0.9
    mpSide = rawLabel === 'Right' ? 'Kanan' : 'Kiri'
  }

  // 2. 2D Anatomical Relative Landmark Verification
  // In standard raw webcam video coordinates:
  // The camera faces the user.
  // Wrist is at bottom (larger y), fingers at top (smaller y).
  const w = landmarks[0]   // Wrist
  const m = landmarks[9]   // Middle finger MCP
  const i = landmarks[5]   // Index finger MCP
  const p = landmarks[17]  // Pinky finger MCP
  const t = landmarks[4]   // Thumb tip

  // 2D cross product of palm vector (wrist -> middle) and transverse (pinky -> index)
  const u_x = m.x - w.x
  const u_y = m.y - w.y
  const v_x = i.x - p.x
  const v_y = i.y - p.y
  const normalZ = u_x * v_y - u_y * v_x

  let anatSide
  if (normalZ <= 0) {
    // Palm facing camera:
    // User's Left hand: thumb points towards body center (camera left: t.x < p.x) -> 'Kiri'
    // User's Right hand: thumb points towards body center (camera right: t.x > p.x) -> 'Kanan'
    anatSide = t.x < p.x ? 'Kiri' : 'Kanan'
  } else {
    // Back of hand facing camera:
    anatSide = t.x > p.x ? 'Kiri' : 'Kanan'
  }

  // Resolution:
  // If MediaPipe provides confidence >= 0.65, rely on MediaPipe's neural model.
  // Otherwise, use 2D anatomical verification.
  let side
  let confidence

  if (mpSide && mpScore >= 0.65) {
    side = mpSide
    confidence = mpScore
  } else {
    side = anatSide
    confidence = 0.82
  }

  return {
    side,
    confidence: parseFloat(confidence.toFixed(2)),
    isRight: side === 'Kanan',
    isLeft: side === 'Kiri',
    anatSide,
    mpSide,
    rawLabel,
  }
}
