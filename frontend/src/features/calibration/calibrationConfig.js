/**
 * Calibration configuration storage and retrieval helper using localStorage.
 * Enables clinicians to customize movement thresholds for different hand sizes
 * and spasticity levels without hardcoding values.
 */

export const STORAGE_KEY = 'stroke_therapy_calibration_config'

export const DEFAULT_CALIBRATION_CONFIG = {
  targetRomSpread: 0.15,
  maxWristDeviation: 25,
  holdDurationSeconds: 0.7,
  targetRomThumb: 0.035,
  targetAngleFist: 45,
  selectedCameraId: '',
  audioFeedback: true,
  showLandmarks: true,
}

/**
 * Loads saved calibration settings from localStorage, or returns defaults.
 * @returns {Object} Configuration object
 */
export function loadCalibrationConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...DEFAULT_CALIBRATION_CONFIG }
    const parsed = JSON.parse(saved)
    return {
      targetRomSpread: Number(parsed.targetRomSpread) || DEFAULT_CALIBRATION_CONFIG.targetRomSpread,
      maxWristDeviation: Number(parsed.maxWristDeviation) || DEFAULT_CALIBRATION_CONFIG.maxWristDeviation,
      holdDurationSeconds: Number(parsed.holdDurationSeconds) || DEFAULT_CALIBRATION_CONFIG.holdDurationSeconds,
      targetRomThumb: Number(parsed.targetRomThumb) || DEFAULT_CALIBRATION_CONFIG.targetRomThumb,
      targetAngleFist: Number(parsed.targetAngleFist) || DEFAULT_CALIBRATION_CONFIG.targetAngleFist,
      selectedCameraId: parsed.selectedCameraId || '',
      audioFeedback: parsed.audioFeedback !== undefined ? parsed.audioFeedback : true,
      showLandmarks: parsed.showLandmarks !== undefined ? parsed.showLandmarks : true,
    }
  } catch (err) {
    return { ...DEFAULT_CALIBRATION_CONFIG }
  }
}

/**
 * Saves current calibration settings to localStorage.
 * @param {Object} config - Configuration object
 */
export function saveCalibrationConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    return true
  } catch (err) {
    return false
  }
}

/**
 * Resets calibration settings back to clinical default values.
 */
export function resetCalibrationConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return { ...DEFAULT_CALIBRATION_CONFIG }
  } catch (err) {
    return { ...DEFAULT_CALIBRATION_CONFIG }
  }
}
