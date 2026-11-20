import React, { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionHeaderBar } from './components/SessionHeaderBar'
import { VideoWorkspace } from './components/VideoWorkspace'
import { KinematicFeedbackBanner } from './components/KinematicFeedbackBanner'
import { ROMGaugeCard } from './components/ROMGaugeCard'
import { QualityStatusCard } from './components/QualityStatusCard'
import { RepetitionTracker } from './components/RepetitionTracker'
import { CompensationMonitor } from './components/CompensationMonitor'
import { TherapistNotesCard } from './components/TherapistNotesCard'
import { SessionSummaryModal } from './components/SessionSummaryModal'
import { useMediaPipeHands } from './hooks/useMediaPipeHands'
import { useTherapySession } from './hooks/useTherapySession'
import { loadCalibrationConfig } from '@/features/calibration/calibrationConfig'
import { captureRepetitionSnapshot } from '@/lib/algorithms/snapshotCapture'
import { saveTherapySession } from '@/services/sessionStorage'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TherapySessionPage() {
  const navigate = useNavigate()
  const calibConfig = loadCalibrationConfig()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [selectedCameraId, setSelectedCameraId] = useState(
    calibConfig.selectedCameraId || ''
  )
  const [showLandmarks, setShowLandmarks] = useState(calibConfig.showLandmarks)
  const [audioEnabled, setAudioEnabled] = useState(calibConfig.audioFeedback)
  const [savedSuccessInfo, setSavedSuccessInfo] = useState(null)

  // Camera mirroring/inversion state (defaults to true for intuitive mirror movement)
  const [isMirrored, setIsMirrored] = useState(() => {
    const saved = localStorage.getItem('stroke_therapy_camera_mirrored')
    return saved !== null ? saved === 'true' : true
  })

  const handleToggleMirror = useCallback(() => {
    setIsMirrored((prev) => {
      const next = !prev
      localStorage.setItem('stroke_therapy_camera_mirrored', String(next))
      return next
    })
  }, [])

  // Snapshot capturer callback invoked at each peak repetition
  const handleCaptureSnapshot = useCallback(() => {
    return captureRepetitionSnapshot(videoRef.current, canvasRef.current, isMirrored)
  }, [isMirrored])

  // Initialize session state machine
  const session = useTherapySession({
    exerciseType: 'finger_spread',
    targetRepetitions: 10,
    audioFeedbackEnabled: audioEnabled,
    onCaptureSnapshot: handleCaptureSnapshot,
    patientData: {
      id: 'RM-2024-089',
      name: 'Tn. Budi Santoso',
      affectedHand: 'Kanan',
      age: 62,
    },
  })

  // Initialize MediaPipe camera and vision pipeline
  const camera = useMediaPipeHands({
    videoRef,
    canvasRef,
    showLandmarks,
    selectedDeviceId: selectedCameraId,
    onResults: (landmarks) => {
      session.processHandLandmarks(landmarks)
    },
  })

  const handleSaveToDatabase = () => {
    if (!session.repetitionHistory || session.repetitionHistory.length === 0) {
      const bestRom = session.maxSessionRom || session.liveMetrics.romValue || 0
      if (bestRom > 0.06) {
        const confirmSavePartial = window.confirm(
          `Belum ada repetisi yang mencapai target penuh (${session.targetRom.toFixed(3)}).\n\n` +
            `Namun pasien telah melakukan upaya gerakan dengan bukaan terbaik: ${bestRom.toFixed(3)}.\n\n` +
            `Apakah Anda ingin menyimpan sesi ini sebagai rekaman "Latihan Parsial" ke rekam medis pasien?`
        )
        if (confirmSavePartial) {
          let snap = null
          try {
            snap = handleCaptureSnapshot()
          } catch (e) {
            console.warn('Gagal menangkap snapshot parsial:', e)
          }

          const partialRep = {
            repNumber: 1,
            quality: 'incomplete',
            romValue: bestRom,
            wristDeviation: session.liveMetrics.wristDeviation || 0,
            snapshotUrl: snap,
            timestamp: new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          }

          const saved = saveTherapySession({
            patientData: session.patientData,
            exerciseType: 'finger_spread',
            exerciseName: 'Membuka Jari (Finger Spread) - Latihan Parsial',
            repetitionHistory: [partialRep],
            therapistNotes: session.therapistNotes
              ? `${session.therapistNotes} [Latihan parsial: bukaan maksimal ${bestRom.toFixed(3)}]`
              : `Latihan mandiri/terbimbing dengan rentang bukaan parsial (terbaik: ${bestRom.toFixed(3)}). Disimpan untuk evaluasi pemulihan.`,
            effectiveTargetRom: session.targetRom,
          })

          session.setIsSummaryModalOpen(false)
          session.resetSession()

          if (saved) {
            setSavedSuccessInfo({
              id: saved.id,
              totalReps: 1,
              snapCount: snap ? 1 : 0,
            })
          }
          return
        }
      }

      alert('Belum ada gerakan latihan yang terdeteksi untuk disimpan.')
      session.setIsSummaryModalOpen(false)
      return
    }

    const saved = saveTherapySession({
      patientData: session.patientData,
      exerciseType: 'finger_spread',
      exerciseName: 'Membuka Jari (Finger Spread)',
      repetitionHistory: session.repetitionHistory,
      therapistNotes: session.therapistNotes,
      effectiveTargetRom: session.targetRom,
    })

    session.setIsSummaryModalOpen(false)
    session.resetSession()

    if (saved) {
      const snapCount = saved.repetitions.filter((r) => r.snapshotUrl).length
      setSavedSuccessInfo({
        id: saved.id,
        totalReps: saved.totalReps,
        snapCount,
      })
    }
  }

  const handleStartSession = useCallback(() => {
    if (!camera.isCameraActive) {
      alert('Nyalakan webcam kamera terlebih dahulu sebelum memulai latihan.')
      return
    }
    session.startSession()
  }, [camera.isCameraActive, session])

  return (
    <div className="p-5 max-w-[1600px] mx-auto space-y-4">
      {/* Toast Alert Banner if session was just saved */}
      {savedSuccessInfo && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950">
                Sesi Terapi Berhasil Disimpan ke Rekam Medis!
              </div>
              <p className="text-xs text-emerald-800">
                Tercatat <strong>{savedSuccessInfo.totalReps} kali latihan</strong> dengan{' '}
                <strong>{savedSuccessInfo.snapCount} foto snapshot bukti klinis</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate('/history')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8"
            >
              Lihat di Riwayat & Laporan
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
            <button
              type="button"
              onClick={() => setSavedSuccessInfo(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs px-2 py-1 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Sesi Terpadu (Lengkap dengan Kontrol Utama di Baris Atas) */}
      <SessionHeaderBar
        patientName={session.patientData.name}
        rmNumber={session.patientData.id}
        affectedHand={session.patientData.affectedHand}
        exerciseName="Finger Spread (Bukaan Jari Tangan)"
        fps={camera.fps}
        latencyMs={camera.latencyMs}
        isCameraActive={camera.isCameraActive}
        sessionStatus={session.sessionStatus}
        currentReps={session.currentReps}
        targetReps={session.targetRepetitions}
        onStartSession={handleStartSession}
        onCalibrate={session.calibrateNeutralPosition}
        onTogglePause={session.togglePause}
        onCancel={session.resetSession}
        onFinish={session.finishSessionEarly}
      />

      {/* 2. Workspace Utama (Dua Kolom: 62% Kamera vs 38% Metrik) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Kolom Kiri: Panel Kamera dan Feedback Langsung (7 Kolom Grid) */}
        <div className="xl:col-span-7 space-y-3">
          <VideoWorkspace
            videoRef={videoRef}
            canvasRef={canvasRef}
            isCameraActive={camera.isCameraActive}
            isModelLoaded={camera.isModelLoaded}
            fps={camera.fps}
            cameraError={camera.cameraError}
            availableCameras={camera.availableCameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={setSelectedCameraId}
            showLandmarks={showLandmarks}
            onToggleLandmarks={setShowLandmarks}
            audioEnabled={audioEnabled}
            onToggleAudio={setAudioEnabled}
            isMirrored={isMirrored}
            onToggleMirror={handleToggleMirror}
            isHandDetected={session.liveMetrics.isHandDetected}
            quality={session.liveMetrics.quality}
            wristDeviation={session.liveMetrics.wristDeviation}
            onStartCamera={camera.startCamera}
            onStopCamera={camera.stopCamera}
          />

          <KinematicFeedbackBanner
            quality={session.liveMetrics.quality}
            feedbackMessage={session.liveMetrics.feedbackMessage}
            wristDeviation={session.liveMetrics.wristDeviation}
          />
        </div>

        {/* Kolom Kanan: Panel Metrik Real-Time & Target Klinis (5 Kolom Grid) */}
        <div className="xl:col-span-5 space-y-3">
          {/* Status Kualitas & Fase Gerakan */}
          <QualityStatusCard
            quality={session.liveMetrics.quality}
            sessionStatus={session.sessionStatus}
            sessionPhase={session.sessionPhase}
            holdProgress={session.holdProgress}
          />

          {/* Pengukur Rentang Gerak (ROM) Bukaan Jari & Penyesuaian Target Adaptif */}
          <ROMGaugeCard
            romValue={session.liveMetrics.romValue}
            targetRom={session.targetRom}
            minVal={0.06}
            maxVal={0.2}
            exerciseType="finger_spread"
            onUpdateTarget={session.updateTargetRom}
            onSetTargetFromCurrent={session.setTargetFromCurrentRom}
            isHandDetected={session.liveMetrics.isHandDetected}
          />

          {/* Target & Riwayat 10 Repetisi */}
          <RepetitionTracker
            currentReps={session.currentReps}
            targetReps={session.targetRepetitions}
            history={session.repetitionHistory}
          />

          {/* Monitor Kompensasi Sudut & Simetri */}
          <CompensationMonitor
            wristDeviation={session.liveMetrics.wristDeviation}
            maxWristThreshold={calibConfig.maxWristDeviation || 25}
            isSymmetric={session.liveMetrics.isSymmetric}
            history={session.repetitionHistory}
          />

          {/* Catatan Observasi Fisioterapis */}
          <TherapistNotesCard
            notes={session.therapistNotes}
            onChangeNotes={session.setTherapistNotes}
          />
        </div>
      </div>

      {/* 3. Modal Ringkasan Pasca-Sesi */}
      <SessionSummaryModal
        isOpen={session.isSummaryModalOpen}
        onClose={() => session.setIsSummaryModalOpen(false)}
        onConfirmSave={handleSaveToDatabase}
        patientName={session.patientData.name}
        exerciseName="Finger Spread"
        history={session.repetitionHistory}
        therapistNotes={session.therapistNotes}
      />
    </div>
  )
}
