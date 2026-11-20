import { useState, useRef, useCallback, useEffect } from 'react'
import {
  evaluateFingerSpread,
  evaluateThumbOpposition,
  evaluateFistCurl,
  QUALITY_STATUS,
} from '@/lib/algorithms/exerciseEvaluator'
import { smoothValue } from '@/lib/algorithms/kinematics'
import { loadCalibrationConfig } from '@/features/calibration/calibrationConfig'

const NEUTRAL_HOLD_MS = 250
const REP_COOLDOWN_MS = 1000

/**
 * Audio feedback helper using Web Audio API to prevent external file dependency.
 */
function playChime(isCorrect = true) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    if (isCorrect) {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime)
      osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.35)
    } else {
      osc.frequency.setValueAtTime(220.0, ctx.currentTime)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.25)
    }
  } catch (e) {
    // Audio autoplay blocked or unsupported
  }
}

export function useTherapySession({
  exerciseType = 'finger_spread',
  targetRepetitions = 10,
  audioFeedbackEnabled = true,
  onCaptureSnapshot = null,
  patientData = {
    id: 'RM-2024-089',
    name: 'Tn. Budi Santoso',
    affectedHand: 'Kanan',
    age: 62,
  },
}) {
  // 'ready' | 'running' | 'paused' | 'finished'
  const [sessionStatus, setSessionStatus] = useState('ready')
  const [currentReps, setCurrentReps] = useState(0)
  const [repetitionHistory, setRepetitionHistory] = useState([])
  const [therapistNotes, setTherapistNotes] = useState('')
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [sessionPhase, setSessionPhase] = useState('READY')
  const [holdProgress, setHoldProgress] = useState(0)
  const [isCalibrated, setIsCalibrated] = useState(false)

  // Load configured thresholds dynamically from calibration settings
  const calib = loadCalibrationConfig()
  const effectiveTargetRom =
    exerciseType === 'fist_curl'
      ? calib.targetAngleFist
      : exerciseType === 'thumb_to_tips'
      ? calib.targetRomThumb
      : calib.targetRomSpread
  const effectiveMaxWrist = calib.maxWristDeviation || 25
  const effectiveHoldDurationMs = (calib.holdDurationSeconds || 0.7) * 1000

  // Real-time kinematic live state
  const [liveMetrics, setLiveMetrics] = useState({
    romValue: 0,
    targetRom: effectiveTargetRom,
    quality: QUALITY_STATUS.INCOMPLETE,
    wristDeviation: 0,
    variance: 0,
    isSymmetric: true,
    feedbackMessage: 'Posisikan telapak tangan di kamera, lalu tekan Mulai Hitung Latihan',
    isHandDetected: false,
  })

  // Mutable refs for frame-rate-safe state machine and smoothing
  const currentRepsRef = useRef(0)
  const baselineWristAngleRef = useRef(null)
  const latestRawHandAngleRef = useRef(null)
  const smoothRomRef = useRef(null)
  const smoothWristDevRef = useRef(null)

  const stateRef = useRef({
    phase: 'READY', // 'READY' | 'WAITING_NEUTRAL' | 'NEUTRAL' | 'PEAK' | 'RETURNING'
    peakHoldStartTime: 0,
    neutralStartTime: 0,
    lastRepTimestamp: 0,
    totalHoldFrames: 0,
    compensatoryHoldFrames: 0,
    bestRomInRep: 0,
  })

  const calibrateNeutralPosition = useCallback(() => {
    if (latestRawHandAngleRef.current !== null) {
      baselineWristAngleRef.current = latestRawHandAngleRef.current
      smoothWristDevRef.current = 0
      setIsCalibrated(true)
    } else {
      // Reset so next detected hand frame auto-calibrates cleanly
      baselineWristAngleRef.current = null
      setIsCalibrated(false)
    }
  }, [])

  const startSession = useCallback(() => {
    // Lock current hand orientation as straight (0 degree) neutral baseline
    if (latestRawHandAngleRef.current !== null) {
      baselineWristAngleRef.current = latestRawHandAngleRef.current
      smoothWristDevRef.current = 0
      setIsCalibrated(true)
    }
    stateRef.current = {
      phase: 'WAITING_NEUTRAL',
      peakHoldStartTime: 0,
      neutralStartTime: 0,
      lastRepTimestamp: 0,
      totalHoldFrames: 0,
      compensatoryHoldFrames: 0,
      bestRomInRep: 0,
    }
    setSessionPhase('WAITING_NEUTRAL')
    setHoldProgress(0)
    setSessionStatus('running')
  }, [])

  const processHandLandmarks = useCallback(
    (landmarks) => {
      if (sessionStatus === 'paused' || sessionStatus === 'finished') return

      // Auto-initialize baseline wrist angle on first detected hand so natural arm angle is 0 deg
      const evalOptions = { baselineWristAngle: baselineWristAngleRef.current }
      let rawEval
      if (exerciseType === 'finger_spread') {
        rawEval = evaluateFingerSpread(landmarks, evalOptions)
      } else if (exerciseType === 'thumb_to_tips') {
        rawEval = evaluateThumbOpposition(landmarks, 8, evalOptions)
      } else {
        rawEval = evaluateFistCurl(landmarks, evalOptions)
      }

      if (!rawEval.isHandDetected) {
        smoothRomRef.current = null
        smoothWristDevRef.current = null
        stateRef.current.peakHoldStartTime = 0
        stateRef.current.neutralStartTime = 0
        setHoldProgress(0)
        setLiveMetrics(rawEval)
        return
      }

      latestRawHandAngleRef.current = rawEval.rawHandAngle

      if (baselineWristAngleRef.current === null && rawEval.rawHandAngle !== null) {
        baselineWristAngleRef.current = rawEval.rawHandAngle
        setIsCalibrated(true)
        rawEval.wristDeviation = 0
      }

      // Apply EMA smoothing to suppress single-frame jitter
      const smoothedRom = smoothValue(smoothRomRef.current, rawEval.romValue, 0.35)
      const smoothedWristDev = Math.round(
        smoothValue(smoothWristDevRef.current, rawEval.wristDeviation, 0.35)
      )
      smoothRomRef.current = smoothedRom
      smoothWristDevRef.current = smoothedWristDev

      const displayRom =
        exerciseType === 'fist_curl'
          ? Math.round(smoothedRom)
          : parseFloat(smoothedRom.toFixed(3))

      // Re-evaluate quality using smoothed wrist deviation and smoothed ROM
      let smoothedQuality = rawEval.quality
      let feedbackMessage = rawEval.feedbackMessage

      if (smoothedWristDev > effectiveMaxWrist) {
        smoothedQuality = QUALITY_STATUS.COMPENSATORY
        feedbackMessage = `Pergelangan miring (${smoothedWristDev}°). Luruskan kembali ke posisi awal.`
      } else if (exerciseType === 'finger_spread' && !rawEval.isSymmetric) {
        smoothedQuality = QUALITY_STATUS.COMPENSATORY
        feedbackMessage = 'Bukaan antar jari belum merata. Ada jari yang tertinggal.'
      } else if (
        (exerciseType === 'finger_spread' && displayRom >= effectiveTargetRom) ||
        (exerciseType === 'thumb_to_tips' && displayRom <= effectiveTargetRom) ||
        (exerciseType === 'fist_curl' && displayRom <= effectiveTargetRom)
      ) {
        smoothedQuality = QUALITY_STATUS.CORRECT
        feedbackMessage = 'Bukaan jari optimal dan posisi tangan stabil'
      } else {
        smoothedQuality = QUALITY_STATUS.INCOMPLETE
      }

      // Preview-only mode before therapist clicks Start
      if (sessionStatus === 'ready') {
        setLiveMetrics({
          ...rawEval,
          romValue: displayRom,
          wristDeviation: smoothedWristDev,
          quality: smoothedQuality,
          feedbackMessage:
            'Posisi tangan terdeteksi. Atur posisi nyaman, lalu klik "Mulai Hitung Latihan".',
        })
        return
      }

      const now = performance.now()
      const state = stateRef.current

      const reachedTarget =
        exerciseType === 'fist_curl' || exerciseType === 'thumb_to_tips'
          ? displayRom <= effectiveTargetRom
          : displayRom >= effectiveTargetRom

      // Slight hysteresis threshold (90%) during peak hold to prevent tiny tremors from aborting
      const holdingTarget =
        exerciseType === 'fist_curl' || exerciseType === 'thumb_to_tips'
          ? displayRom <= effectiveTargetRom * 1.1
          : displayRom >= effectiveTargetRom * 0.9

      const isNeutralRest =
        exerciseType === 'fist_curl'
          ? displayRom >= 110
          : exerciseType === 'thumb_to_tips'
          ? displayRom >= effectiveTargetRom * 1.6
          : displayRom < effectiveTargetRom * 0.72

      if (state.phase === 'WAITING_NEUTRAL') {
        if (isNeutralRest) {
          if (state.neutralStartTime === 0) state.neutralStartTime = now
          if (now - state.neutralStartTime >= NEUTRAL_HOLD_MS) {
            state.phase = 'NEUTRAL'
            state.neutralStartTime = 0
            setSessionPhase('NEUTRAL')
          }
        } else {
          state.neutralStartTime = 0
          feedbackMessage = 'Rapatkan / rilekskan jari terlebih dahulu sebelum mulai membuka.'
        }
      } else if (state.phase === 'NEUTRAL') {
        if (reachedTarget && now - state.lastRepTimestamp > REP_COOLDOWN_MS) {
          state.phase = 'PEAK'
          state.peakHoldStartTime = now
          state.totalHoldFrames = 1
          state.compensatoryHoldFrames =
            smoothedQuality === QUALITY_STATUS.COMPENSATORY ? 1 : 0
          state.bestRomInRep = displayRom
          setSessionPhase('PEAK')
          setHoldProgress(10)
        }
      } else if (state.phase === 'PEAK') {
        if (!holdingTarget) {
          // Released too early before hold time completed; cancel without counting
          state.phase = 'NEUTRAL'
          state.peakHoldStartTime = 0
          state.totalHoldFrames = 0
          state.compensatoryHoldFrames = 0
          setSessionPhase('NEUTRAL')
          setHoldProgress(0)
          feedbackMessage = 'Tahan bukaan jari sedikit lebih lama (sekitar 0.7 detik).'
        } else {
          state.totalHoldFrames += 1
          if (smoothedQuality === QUALITY_STATUS.COMPENSATORY) {
            state.compensatoryHoldFrames += 1
          }
          if (displayRom > state.bestRomInRep) {
            state.bestRomInRep = displayRom
          }

          const elapsed = now - state.peakHoldStartTime
          const progress = Math.min(100, Math.round((elapsed / effectiveHoldDurationMs) * 100))
          setHoldProgress(progress)
          feedbackMessage = `Tahan posisi bukaan jari... (${progress}%)`

          if (elapsed >= effectiveHoldDurationMs) {
            const compRatio = state.compensatoryHoldFrames / Math.max(1, state.totalHoldFrames)
            const finalQuality =
              compRatio > 0.35 ? QUALITY_STATUS.COMPENSATORY : QUALITY_STATUS.CORRECT

            const completedRepNumber = currentRepsRef.current + 1
            currentRepsRef.current = completedRepNumber

            // Capture webcam & skeleton snapshot at the peak ROM moment
            let capturedSnapshot = null
            if (typeof onCaptureSnapshot === 'function') {
              try {
                capturedSnapshot = onCaptureSnapshot()
              } catch (snapErr) {
                console.warn('Gagal menangkap snapshot repetisi:', snapErr)
              }
            }

            const finalRepRecord = {
              repNumber: completedRepNumber,
              quality: finalQuality,
              romValue: state.bestRomInRep,
              wristDeviation: smoothedWristDev,
              snapshotUrl: capturedSnapshot,
              timestamp: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
            }

            setCurrentReps(completedRepNumber)
            setRepetitionHistory((prev) => [...prev, finalRepRecord])
            setHoldProgress(0)

            if (audioFeedbackEnabled) {
              playChime(finalQuality === QUALITY_STATUS.CORRECT)
            }

            state.phase = 'RETURNING'
            state.neutralStartTime = 0
            state.lastRepTimestamp = now
            setSessionPhase('RETURNING')

            if (completedRepNumber >= targetRepetitions) {
              setSessionStatus('finished')
              setIsSummaryModalOpen(true)
            }
          }
        }
      } else if (state.phase === 'RETURNING') {
        feedbackMessage = 'Latihan tercatat! Rapatkan jari kembali untuk latihan berikutnya.'
        if (isNeutralRest) {
          if (state.neutralStartTime === 0) state.neutralStartTime = now
          if (now - state.neutralStartTime >= NEUTRAL_HOLD_MS) {
            state.phase = 'NEUTRAL'
            state.neutralStartTime = 0
            setSessionPhase('NEUTRAL')
          }
        } else {
          state.neutralStartTime = 0
        }
      }

      setLiveMetrics({
        ...rawEval,
        romValue: displayRom,
        wristDeviation: smoothedWristDev,
        quality: smoothedQuality,
        feedbackMessage,
      })
    },
    [sessionStatus, exerciseType, targetRepetitions, audioFeedbackEnabled]
  )

  const togglePause = useCallback(() => {
    setSessionStatus((prev) => (prev === 'running' ? 'paused' : 'running'))
  }, [])

  const finishSessionEarly = useCallback(() => {
    setSessionStatus('finished')
    setIsSummaryModalOpen(true)
  }, [])

  const resetSession = useCallback(() => {
    currentRepsRef.current = 0
    baselineWristAngleRef.current = null
    smoothRomRef.current = null
    smoothWristDevRef.current = null
    setCurrentReps(0)
    setRepetitionHistory([])
    setSessionStatus('ready')
    setSessionPhase('READY')
    setHoldProgress(0)
    setIsCalibrated(false)
    setIsSummaryModalOpen(false)
    stateRef.current = {
      phase: 'READY',
      peakHoldStartTime: 0,
      neutralStartTime: 0,
      lastRepTimestamp: 0,
      totalHoldFrames: 0,
      compensatoryHoldFrames: 0,
      bestRomInRep: 0,
    }
  }, [])

  return {
    patientData,
    sessionStatus,
    sessionPhase,
    holdProgress,
    isCalibrated,
    currentReps,
    targetRepetitions,
    repetitionHistory,
    liveMetrics,
    therapistNotes,
    setTherapistNotes,
    isSummaryModalOpen,
    setIsSummaryModalOpen,
    startSession,
    calibrateNeutralPosition,
    processHandLandmarks,
    togglePause,
    finishSessionEarly,
    resetSession,
  }
}
