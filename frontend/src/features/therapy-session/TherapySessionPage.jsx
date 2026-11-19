import React, { useRef, useState } from 'react'
import { SessionHeaderBar } from './components/SessionHeaderBar'
import { VideoWorkspace } from './components/VideoWorkspace'
import { KinematicFeedbackBanner } from './components/KinematicFeedbackBanner'
import { ROMGaugeCard } from './components/ROMGaugeCard'
import { QualityStatusCard } from './components/QualityStatusCard'
import { RepetitionTracker } from './components/RepetitionTracker'
import { CompensationMonitor } from './components/CompensationMonitor'
import { SessionActionPanel } from './components/SessionActionPanel'
import { SessionSummaryModal } from './components/SessionSummaryModal'
import { useMediaPipeHands } from './hooks/useMediaPipeHands'
import { useTherapySession } from './hooks/useTherapySession'
import { loadCalibrationConfig } from '@/features/calibration/calibrationConfig'

export default function TherapySessionPage() {
  const calibConfig = loadCalibrationConfig()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [selectedCameraId, setSelectedCameraId] = useState(
    calibConfig.selectedCameraId || ''
  )
  const [showLandmarks, setShowLandmarks] = useState(calibConfig.showLandmarks)
  const [audioEnabled, setAudioEnabled] = useState(calibConfig.audioFeedback)

  // Initialize session state machine
  const session = useTherapySession({
    exerciseType: 'finger_spread',
    targetRepetitions: 10,
    audioFeedbackEnabled: audioEnabled,
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
    session.setIsSummaryModalOpen(false)
    alert('Data sesi terapi berhasil disimpan ke database lokal!')
    session.resetSession()
  }

  return (
    <div className="p-5 max-w-[1600px] mx-auto space-y-4">
      {/* 1. Header Sesi Terpadu */}
      <SessionHeaderBar
        patientName={session.patientData.name}
        rmNumber={session.patientData.id}
        affectedHand={session.patientData.affectedHand}
        exerciseName="Finger Spread (Bukaan Jari Tangan)"
        fps={camera.fps}
        latencyMs={camera.latencyMs}
        isCameraActive={camera.isCameraActive}
        cameraName={
          camera.availableCameras.find((c) => c.deviceId === selectedCameraId)?.label ||
          'Webcam Meja USB (Top-Down 90°)'
        }
      />

      {/* 2. Workspace Utama (Dua Kolom: 62% Kamera vs 38% Metrik & Kontrol) */}
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
            onStartCamera={camera.startCamera}
            onStopCamera={camera.stopCamera}
          />

          <KinematicFeedbackBanner
            quality={session.liveMetrics.quality}
            feedbackMessage={session.liveMetrics.feedbackMessage}
            wristDeviation={session.liveMetrics.wristDeviation}
          />
        </div>

        {/* Kolom Kanan: Panel Metrik, Repetisi, dan Kontrol Klinis (5 Kolom Grid) */}
        <div className="xl:col-span-5 space-y-3">
          <QualityStatusCard
            quality={session.liveMetrics.quality}
            sessionStatus={session.sessionStatus}
            sessionPhase={session.sessionPhase}
            holdProgress={session.holdProgress}
          />

          <ROMGaugeCard
            romValue={session.liveMetrics.romValue}
            targetRom={session.liveMetrics.targetRom}
            minVal={0.06}
            maxVal={0.2}
            exerciseType="finger_spread"
          />

          <RepetitionTracker
            currentReps={session.currentReps}
            targetReps={session.targetRepetitions}
            history={session.repetitionHistory}
          />

          <CompensationMonitor
            wristDeviation={session.liveMetrics.wristDeviation}
            maxWristThreshold={calibConfig.maxWristDeviation || 25}
            isSymmetric={session.liveMetrics.isSymmetric}
            history={session.repetitionHistory}
          />

          <SessionActionPanel
            therapistNotes={session.therapistNotes}
            onChangeNotes={session.setTherapistNotes}
            sessionStatus={session.sessionStatus}
            onStartSession={session.startSession}
            onCalibrate={session.calibrateNeutralPosition}
            onTogglePause={session.togglePause}
            onCancel={session.resetSession}
            onFinish={session.finishSessionEarly}
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
