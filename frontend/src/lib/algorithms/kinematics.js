/**
 * Kinematic calculation utilities for hand landmarks based on MediaPipe Hands.
 * Normalized coordinates (x, y, z) range from 0.0 to 1.0.
 */

/**
 * Calculates Euclidean distance between two 2D points.
 * @param {Object} p1 - Point { x, y }
 * @param {Object} p2 - Point { x, y }
 * @returns {number} Distance in normalized units
 */
export function calculateDistance2D(p1, p2) {
  if (!p1 || !p2) return 0
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculates Euclidean distance between two 3D points.
 * @param {Object} p1 - Point { x, y, z }
 * @param {Object} p2 - Point { x, y, z }
 * @returns {number} Distance in normalized 3D units
 */
export function calculateDistance3D(p1, p2) {
  if (!p1 || !p2) return 0
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  const dz = (p1.z || 0) - (p2.z || 0)
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Calculates the angle at joint B formed by points A, B, and C.
 * Formula: angle = arccos((u . v) / (|u| * |v|)) in degrees.
 * @param {Object} a - First point
 * @param {Object} b - Middle vertex joint
 * @param {Object} c - Third point
 * @returns {number} Angle in degrees (0 to 180)
 */
export function calculateJointAngle(a, b, c) {
  if (!a || !b || !c) return 0

  const u = { x: a.x - b.x, y: a.y - b.y }
  const v = { x: c.x - b.x, y: c.y - b.y }

  const dotProduct = u.x * v.x + u.y * v.y
  const magU = Math.sqrt(u.x * u.x + u.y * u.y)
  const magV = Math.sqrt(v.x * v.x + v.y * v.y)

  if (magU === 0 || magV === 0) return 0

  let cosine = dotProduct / (magU * magV)
  cosine = Math.max(-1, Math.min(1, cosine))

  return (Math.acos(cosine) * 180) / Math.PI
}

/**
 * Calculates signed orientation angle of the palm axis (Wrist 0 -> Middle MCP 9)
 * relative to screen upward vertical axis in degrees (-180 to 180).
 * @param {Object} wrist - Landmark 0
 * @param {Object} middleMCP - Landmark 9
 * @returns {number} Orientation angle in degrees
 */
export function calculateHandOrientationAngle(wrist, middleMCP) {
  if (!wrist || !middleMCP) return 0
  const dx = middleMCP.x - wrist.x
  const dy = middleMCP.y - wrist.y
  return (Math.atan2(dx, -dy) * 180) / Math.PI
}

/**
 * Computes shortest angular difference between two angles in degrees (0 to 180).
 * @param {number} angleA - First angle in degrees
 * @param {number} angleB - Second angle in degrees
 * @returns {number} Absolute angular difference in degrees
 */
export function calculateAngularDifference(angleA, angleB) {
  let diff = Math.abs(angleA - angleB) % 360
  if (diff > 180) diff = 360 - diff
  return Math.round(diff)
}

/**
 * Calculates wrist deviation angle relative to a calibrated baseline hand orientation.
 * When baselineAngle is not set, measures tilt against the screen vertical axis.
 * @param {Object} wrist - Landmark 0
 * @param {Object} middleMCP - Landmark 9
 * @param {number|null} baselineAngle - Calibrated neutral orientation in degrees
 * @returns {number} Absolute deviation angle in degrees
 */
export function calculateWristDeviation(wrist, middleMCP, baselineAngle = null) {
  if (!wrist || !middleMCP) return 0

  if (typeof baselineAngle === 'number' && !Number.isNaN(baselineAngle)) {
    const currentAngle = calculateHandOrientationAngle(wrist, middleMCP)
    return calculateAngularDifference(currentAngle, baselineAngle)
  }

  const dx = middleMCP.x - wrist.x
  const dy = middleMCP.y - wrist.y
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy))
  return Math.round((angleRad * 180) / Math.PI)
}

/**
 * Calculates variance of inter-digital distances to measure movement symmetry.
 * @param {number[]} distances - Array of inter-digital distances
 * @param {number} mean - Mean distance
 * @returns {number} Variance
 */
export function calculateSpreadVariance(distances, mean) {
  if (!distances || distances.length === 0) return 0
  const sumSquaredDiff = distances.reduce((acc, d) => acc + Math.pow(d - mean, 2), 0)
  return sumSquaredDiff / distances.length
}

/**
 * Exponential Moving Average (EMA) filter to suppress single-frame landmark jitter.
 * @param {number|null} previous - Previous smoothed value
 * @param {number} current - Current raw measurement
 * @param {number} alpha - Smoothing factor (0 < alpha <= 1)
 * @returns {number} Smoothed value
 */
export function smoothValue(previous, current, alpha = 0.35) {
  if (previous === null || previous === undefined || Number.isNaN(previous)) {
    return current
  }
  return previous + alpha * (current - previous)
}
