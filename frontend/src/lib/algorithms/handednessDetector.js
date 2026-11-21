/**
 * Anatomical Handedness Detector for stroke rehabilitation monitoring.
 * Determines whether a detected hand is the patient's Right Hand ('Kanan')
 * or Left Hand ('Kiri') using 3D invariant chirality and palm orientation geometry.
 */

/**
 * Calculates the 3D scalar triple product of palm vectors to determine
 * anatomical chirality (invariant under arbitrary 3D rigid rotations).
 *
 * @param {Array} landmarks - 21 MediaPipe hand landmarks with {x, y, z}
 * @returns {number} Scalar triple product
 */
export function calculateHandChirality(landmarks) {
  if (!landmarks || landmarks.length < 21) return 0

  const w = landmarks[0] // Wrist
  const m = landmarks[9] // Middle finger MCP (knuckle)
  const p = landmarks[17] // Pinky MCP
  const i = landmarks[5] // Index MCP
  const t = landmarks[2] // Thumb MCP

  // Vector: Wrist -> Middle MCP (longitudinal palm axis)
  const u = [
    m.x - w.x,
    m.y - w.y,
    (m.z || 0) - (w.z || 0),
  ]

  // Vector: Pinky MCP -> Index MCP (transverse palm axis)
  const v = [
    i.x - p.x,
    i.y - p.y,
    (i.z || 0) - (p.z || 0),
  ]

  // Palm normal: u x v
  const n = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ]

  // Vector: Wrist -> Thumb MCP
  const w_t = [
    t.x - w.x,
    t.y - w.y,
    (t.z || 0) - (w.z || 0),
  ]

  // Scalar triple product: n . w_t
  return n[0] * w_t[0] + n[1] * w_t[1] + n[2] * w_t[2]
}

/**
 * Detects whether the hand is 'Kanan' (Right) or 'Kiri' (Left).
 *
 * @param {Array} landmarks - 21 normalized landmarks
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

  // 1. 3D Invariant Chirality
  const triple = calculateHandChirality(landmarks)
  // Right hand has triple < 0, Left hand has triple > 0
  const geomSide = triple < 0 ? 'Kanan' : 'Kiri'

  // 2. 2D Palm Facing and Thumb Relative Position (in raw video coordinates)
  const w = landmarks[0]
  const m = landmarks[9]
  const p = landmarks[17]
  const i = landmarks[5]
  const t = landmarks[4] // thumb tip

  const u_x = m.x - w.x
  const u_y = m.y - w.y
  const v_x = i.x - p.x
  const v_y = i.y - p.y
  // z-component of palm normal: positive means facing into screen (back of hand), negative means facing camera
  const normalZ = u_x * v_y - u_y * v_x

  let anatSide
  if (normalZ < 0) {
    // Palm facing camera
    // For a person facing camera:
    // Left hand has thumb pointing to the right in raw image: t.x > p.x
    // Right hand has thumb pointing to the left in raw image: t.x < p.x
    anatSide = t.x > p.x ? 'Kiri' : 'Kanan'
  } else {
    // Back of hand facing camera
    anatSide = t.x < p.x ? 'Kiri' : 'Kanan'
  }

  // 3. MediaPipe multiHandedness classifier
  // Note: MediaPipe Hands outputs 'Left' / 'Right' from the perspective of an external observer.
  // In a front webcam (selfie camera without raw mirror):
  // User's Left hand -> MediaPipe classifies as 'Right'
  // User's Right hand -> MediaPipe classifies as 'Left'
  let mpSide = null
  let mpScore = 0.5
  if (multiHandedness && multiHandedness.length > 0) {
    const rawLabel = multiHandedness[0].label
    mpScore = multiHandedness[0].score || 0.85
    mpSide = rawLabel === 'Left' ? 'Kanan' : 'Kiri'
  }

  // Weighted fusion
  let rightScore = 0
  let totalWeight = 0

  // Geometric 3D determinant weight
  const geomWeight = Math.min(Math.abs(triple) * 50, 1.5) + 0.8
  rightScore += (geomSide === 'Kanan' ? 1 : 0) * geomWeight
  totalWeight += geomWeight

  // 2D anatomical relative position weight
  const anatWeight = 1.0
  rightScore += (anatSide === 'Kanan' ? 1 : 0) * anatWeight
  totalWeight += anatWeight

  // MediaPipe classifier weight
  if (mpSide) {
    const mpWeight = mpScore * 1.5
    rightScore += (mpSide === 'Kanan' ? 1 : 0) * mpWeight
    totalWeight += mpWeight
  }

  const pRight = rightScore / totalWeight
  const side = pRight >= 0.5 ? 'Kanan' : 'Kiri'
  const confidence = pRight >= 0.5 ? pRight : 1 - pRight

  return {
    side,
    confidence: parseFloat(confidence.toFixed(2)),
    isRight: side === 'Kanan',
    isLeft: side === 'Kiri',
    geomSide,
    anatSide,
    mpSide,
    triple: parseFloat(triple.toFixed(5)),
  }
}
