/**
 * Session storage service using localStorage for clinical history persistence.
 * Stores completed therapy sessions along with per-repetition kinematic metrics
 * and captured webcam snapshots.
 */

import { INITIAL_HISTORY_SESSIONS } from '@/features/history/data/mockSessions'

export const COMPLETED_SESSIONS_STORAGE_KEY = 'stroke_therapy_completed_sessions'

/**
 * Loads all therapy sessions: combines locally stored user sessions with initial mock sessions.
 * User-recorded sessions are ordered first (newest at the top).
 * @returns {Array} List of session objects
 */
export function getStoredTherapySessions() {
  try {
    const raw = localStorage.getItem(COMPLETED_SESSIONS_STORAGE_KEY)
    const userSessions = raw ? JSON.parse(raw) : []

    // Ensure user sessions have clean ids and don't duplicate mock data
    const userSessionIds = new Set(userSessions.map((s) => s.id))
    const nonDuplicatedMocks = INITIAL_HISTORY_SESSIONS.filter(
      (m) => !userSessionIds.has(m.id)
    )

    return [...userSessions, ...nonDuplicatedMocks]
  } catch (err) {
    console.error('Gagal membaca data sesi dari localStorage:', err)
    return INITIAL_HISTORY_SESSIONS
  }
}

/**
 * Saves a newly completed therapy session into localStorage.
 * Automatically formats date, time, ROM averages, and attaches captured snapshots.
 *
 * @param {Object} sessionInput
 * @returns {Object} Newly created session object
 */
export function saveTherapySession({
  patientData = { id: 'RM-2024-089', name: 'Tn. Budi Santoso' },
  exerciseType = 'finger_spread',
  exerciseName = 'Membuka Jari (Finger Spread)',
  repetitionHistory = [],
  therapistNotes = '',
  effectiveTargetRom = 0.15,
}) {
  try {
    const now = new Date()
    const sessionDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    const timeString = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const totalReps = repetitionHistory.length
    const correctReps = repetitionHistory.filter(
      (r) => r.quality === 'CORRECT' || r.quality === 'correct' || r.status === 'correct'
    ).length
    const compensatoryReps = totalReps - correctReps

    // Calculate average ROM
    const sumRom = repetitionHistory.reduce(
      (acc, r) => acc + (Number(r.romValue ?? r.rom) || 0),
      0
    )
    const avgRomNum = totalReps > 0 ? (sumRom / totalReps).toFixed(3) : '0.000'

    // Calculate average wrist deviation
    const sumWrist = repetitionHistory.reduce(
      (acc, r) => acc + (Number(r.wristDeviation ?? r.wrist) || 0),
      0
    )
    const avgWrist = totalReps > 0 ? Math.round(sumWrist / totalReps) : 0

    // Format repetitions with per-rep snapshots
    const formattedReps = repetitionHistory.map((r, index) => {
      const isCorrect =
        r.quality === 'CORRECT' || r.quality === 'correct' || r.status === 'correct'
      return {
        rep: r.repNumber || r.rep || index + 1,
        rom: r.romValue !== undefined ? r.romValue : r.rom,
        wrist: r.wristDeviation !== undefined ? r.wristDeviation : r.wrist,
        status: isCorrect ? 'correct' : 'compensatory',
        timestamp: r.timestamp || timeString,
        snapshotUrl: r.snapshotUrl || null,
      }
    })

    // Pick best snapshot (preferably correct rep with highest ROM)
    const bestRep =
      formattedReps.find((r) => r.status === 'correct' && r.snapshotUrl) ||
      formattedReps.find((r) => r.snapshotUrl) ||
      formattedReps[0]

    const bestSnapshotUrl =
      bestRep?.snapshotUrl ||
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'

    const newSession = {
      id: `SES-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`,
      date: sessionDate,
      timeRange: `${timeString} WIB`,
      patientName: patientData.name || 'Tn. Budi Santoso',
      patientId: patientData.id || 'RM-2024-089',
      diagnosis: 'Pasca Stroke (Hemiparesis)',
      avatarInitials: (patientData.name || 'BS')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      protocol: exerciseName,
      protocolCode: exerciseType,
      totalReps,
      correctReps,
      compensatoryReps,
      avgRom: `${avgRomNum} / ${Number(effectiveTargetRom).toFixed(3)}`,
      therapistNotes:
        therapistNotes || 'Latihan mandiri pasien melalui monitoring web camera.',
      wristDeviationAvg: avgWrist,
      snapshotUrl: bestSnapshotUrl,
      repetitions: formattedReps,
      isUserRecorded: true,
      createdAt: now.toISOString(),
    }

    // Prepend to localStorage
    const raw = localStorage.getItem(COMPLETED_SESSIONS_STORAGE_KEY)
    const existing = raw ? JSON.parse(raw) : []
    const updated = [newSession, ...existing]

    localStorage.setItem(COMPLETED_SESSIONS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('stroke_therapy_session_saved'))

    return newSession
  } catch (err) {
    console.error('Gagal menyimpan sesi terapi ke localStorage:', err)
    return null
  }
}

/**
 * Clears all user-recorded sessions and restores mock data.
 */
export function resetStoredTherapySessions() {
  localStorage.removeItem(COMPLETED_SESSIONS_STORAGE_KEY)
  window.dispatchEvent(new Event('stroke_therapy_session_saved'))
}
