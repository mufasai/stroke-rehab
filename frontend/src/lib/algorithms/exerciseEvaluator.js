import {
  calculateDistance2D,
  calculateDistance3D,
  calculateJointAngle,
  calculateHandOrientationAngle,
  calculateWristDeviation,
  calculateSpreadVariance,
} from './kinematics'

export const QUALITY_STATUS = {
  CORRECT: 'correct',
  INCOMPLETE: 'incomplete',
  COMPENSATORY: 'compensatory',
}

/**
 * Evaluates Finger Spread (EX-01) exercise from 21 MediaPipe hand landmarks.
 * @param {Array} landmarks - 21 normalized landmarks
 * @param {Object} options - Optional calibration parameters
 * @param {number|null} options.baselineWristAngle - Calibrated neutral wrist angle
 * @returns {Object} Evaluation metrics and quality label
 */
export function evaluateFingerSpread(landmarks, options = {}) {
  const { baselineWristAngle = null } = options

  if (!landmarks || landmarks.length < 21) {
    return {
      romValue: 0,
      quality: QUALITY_STATUS.INCOMPLETE,
      wristDeviation: 0,
      rawHandAngle: null,
      variance: 0,
      isSymmetric: true,
      feedbackMessage: 'Posisikan telapak tangan di dalam area kamera',
      isHandDetected: false,
      targetRom: 0.15,
    }
  }

  // Fingertip landmarks: 4 (thumb), 8 (index), 12 (middle), 16 (ring), 20 (pinky)
  const p4 = landmarks[4]
  const p8 = landmarks[8]
  const p12 = landmarks[12]
  const p16 = landmarks[16]
  const p20 = landmarks[20]

  const d1 = calculateDistance2D(p4, p8)
  const d2 = calculateDistance2D(p8, p12)
  const d3 = calculateDistance2D(p12, p16)
  const d4 = calculateDistance2D(p16, p20)

  const meanDistance = (d1 + d2 + d3 + d4) / 4

  // Evaluate symmetry across comparable finger gaps (index-middle, middle-ring, ring-pinky)
  // Thumb-index gap (d1) is excluded from variance because it is anatomically wider
  const fingerGaps = [d2, d3, d4]
  const fingerMean = (d2 + d3 + d4) / 3
  const variance = calculateSpreadVariance(fingerGaps, fingerMean)

  const rawHandAngle = calculateHandOrientationAngle(landmarks[0], landmarks[9])
  const wristDeviation = calculateWristDeviation(
    landmarks[0],
    landmarks[9],
    baselineWristAngle
  )

  // Only flag finger asymmetry once hand begins opening past resting state
  const isSymmetric = meanDistance < 0.1 ? true : variance < 0.0025

  let quality = QUALITY_STATUS.INCOMPLETE
  let feedbackMessage = 'Buka jari perlahan menuju batas target'

  if (wristDeviation > 25) {
    quality = QUALITY_STATUS.COMPENSATORY
    feedbackMessage = `Pergelangan miring (${wristDeviation}°). Luruskan kembali ke posisi awal.`
  } else if (!isSymmetric) {
    quality = QUALITY_STATUS.COMPENSATORY
    feedbackMessage = 'Bukaan antar jari belum merata. Ada jari yang tertinggal.'
  } else if (meanDistance >= 0.15 && wristDeviation <= 25) {
    quality = QUALITY_STATUS.CORRECT
    feedbackMessage = 'Bukaan jari optimal dan posisi tangan stabil'
  } else if (meanDistance >= 0.07) {
    quality = QUALITY_STATUS.INCOMPLETE
    feedbackMessage = 'Terus lebarkan jari hingga mencapai batas target'
  }

  return {
    romValue: parseFloat(meanDistance.toFixed(3)),
    quality,
    wristDeviation,
    rawHandAngle,
    variance: parseFloat(variance.toFixed(5)),
    isSymmetric,
    feedbackMessage,
    isHandDetected: true,
    targetRom: 0.15,
  }
}

/**
 * Evaluates Thumb-to-Fingertips Opposition (EX-02).
 * @param {Array} landmarks - 21 normalized landmarks
 * @param {number} targetIndex - Landmark index of target fingertip (8, 12, 16, or 20)
 * @param {Object} options - Optional calibration parameters
 * @returns {Object} Evaluation metrics and quality label
 */
export function evaluateThumbOpposition(landmarks, targetIndex = 8, options = {}) {
  const { baselineWristAngle = null } = options

  if (!landmarks || landmarks.length < 21) {
    return {
      romValue: 0,
      quality: QUALITY_STATUS.INCOMPLETE,
      wristDeviation: 0,
      rawHandAngle: null,
      isSymmetric: true,
      feedbackMessage: 'Tangan belum terdeteksi',
      isHandDetected: false,
      targetRom: 0.035,
    }
  }

  const thumbTip = landmarks[4]
  const targetTip = landmarks[targetIndex]
  const contactDist = calculateDistance3D(thumbTip, targetTip)
  const rawHandAngle = calculateHandOrientationAngle(landmarks[0], landmarks[9])
  const wristDeviation = calculateWristDeviation(
    landmarks[0],
    landmarks[9],
    baselineWristAngle
  )

  // Check PIP joint angle of non-target fingers to detect parasitic flexion
  const nonTargetFingers = [
    { mcp: 5, pip: 6, dip: 7, tip: 8 },
    { mcp: 9, pip: 10, dip: 11, tip: 12 },
    { mcp: 13, pip: 14, dip: 15, tip: 16 },
    { mcp: 17, pip: 18, dip: 19, tip: 20 },
  ].filter((f) => f.tip !== targetIndex)

  let hasParasiticFlexion = false
  for (const finger of nonTargetFingers) {
    const pipAngle = calculateJointAngle(
      landmarks[finger.mcp],
      landmarks[finger.pip],
      landmarks[finger.dip]
    )
    if (pipAngle < 120) {
      hasParasiticFlexion = true
      break
    }
  }

  let quality = QUALITY_STATUS.INCOMPLETE
  let feedbackMessage = 'Dekatkan ibu jari ke ujung jari target'

  if (contactDist <= 0.035) {
    if (hasParasiticFlexion) {
      quality = QUALITY_STATUS.COMPENSATORY
      feedbackMessage = 'Sentuhan tercapai, namun jari lain ikut melengkung kaku'
    } else {
      quality = QUALITY_STATUS.CORRECT
      feedbackMessage = 'Sentuhan presisi dan jari lain tetap stabil'
    }
  } else if (contactDist > 0.05) {
    quality = QUALITY_STATUS.INCOMPLETE
    feedbackMessage = 'Jarak sentuhan belum tercapai'
  }

  return {
    romValue: parseFloat(contactDist.toFixed(3)),
    quality,
    wristDeviation,
    rawHandAngle,
    isSymmetric: !hasParasiticFlexion,
    feedbackMessage,
    isHandDetected: true,
    targetRom: 0.035,
  }
}

/**
 * Evaluates Fist Open-Close Exercise (EX-03).
 * @param {Array} landmarks - 21 normalized landmarks
 * @param {Object} options - Optional calibration parameters
 * @returns {Object} Evaluation metrics and quality label
 */
export function evaluateFistCurl(landmarks, options = {}) {
  const { baselineWristAngle = null } = options

  if (!landmarks || landmarks.length < 21) {
    return {
      romValue: 0,
      quality: QUALITY_STATUS.INCOMPLETE,
      wristDeviation: 0,
      rawHandAngle: null,
      isSymmetric: true,
      feedbackMessage: 'Tangan belum terdeteksi',
      isHandDetected: false,
      targetRom: 45,
    }
  }

  const angleIndex = calculateJointAngle(landmarks[5], landmarks[6], landmarks[7])
  const angleMiddle = calculateJointAngle(landmarks[9], landmarks[10], landmarks[11])
  const angleRing = calculateJointAngle(landmarks[13], landmarks[14], landmarks[15])
  const anglePinky = calculateJointAngle(landmarks[17], landmarks[18], landmarks[19])

  const meanAngle = Math.round((angleIndex + angleMiddle + angleRing + anglePinky) / 4)
  const rawHandAngle = calculateHandOrientationAngle(landmarks[0], landmarks[9])
  const wristDeviation = calculateWristDeviation(
    landmarks[0],
    landmarks[9],
    baselineWristAngle
  )

  let quality = QUALITY_STATUS.INCOMPLETE
  let feedbackMessage = 'Lakukan gerakan mengepal penuh atau membuka jari rata'

  if (wristDeviation > 25) {
    quality = QUALITY_STATUS.COMPENSATORY
    feedbackMessage = `Pergelangan miring (${wristDeviation}°). Jaga pergelangan tetap lurus.`
  } else if (meanAngle <= 45) {
    quality = QUALITY_STATUS.CORRECT
    feedbackMessage = 'Kepalan tangan rapat dan pergelangan lurus'
  } else if (meanAngle >= 150) {
    quality = QUALITY_STATUS.CORRECT
    feedbackMessage = 'Jari terbuka penuh dan rata'
  } else {
    quality = QUALITY_STATUS.INCOMPLETE
    feedbackMessage = `Sudut tekukan jari ${meanAngle}°. Lanjutkan gerakan.`
  }

  return {
    romValue: meanAngle,
    quality,
    wristDeviation,
    rawHandAngle,
    isSymmetric: true,
    feedbackMessage,
    isHandDetected: true,
    targetRom: 45,
  }
}
