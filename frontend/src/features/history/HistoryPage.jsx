import React, { useState, useMemo } from 'react'
import { INITIAL_HISTORY_SESSIONS } from './data/mockSessions'
import { HistoryStatsCards } from './components/HistoryStatsCards'
import { HistoryFilterBar } from './components/HistoryFilterBar'
import { HistoryTable } from './components/HistoryTable'
import { SessionDetailModal } from './components/SessionDetailModal'

export default function HistoryPage() {
  const [sessions] = useState(INITIAL_HISTORY_SESSIONS)
  const [selectedSession, setSelectedSession] = useState(null)
  const [dateRange, setDateRange] = useState('1 Mar 2024 - 28 Mar 2024')
  const [patientFilter, setPatientFilter] = useState('ALL')
  const [protocolFilter, setProtocolFilter] = useState('ALL')

  // Filtered session records
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchPatient = patientFilter === 'ALL' || s.patientName === patientFilter
      const matchProtocol = protocolFilter === 'ALL' || s.protocolCode === protocolFilter
      return matchPatient && matchProtocol
    })
  }, [sessions, patientFilter, protocolFilter])

  const handlePrintPdf = (sessionToPrint = null) => {
    const target = sessionToPrint ? sessionToPrint.patientName : 'Semua Pasien Terpilih'
    alert(
      `Membuat Dokumen Laporan Rekam Medis PDF Resmi untuk: ${target}.\nDilengkapi kop klinik, data 21 landmark, dan kolom tanda tangan fisioterapis.`
    )
  }

  const handleExportCsv = () => {
    const headers = [
      'ID Sesi',
      'Tanggal',
      'Waktu',
      'Nama Pasien',
      'No RM',
      'Diagnosis',
      'Jenis Latihan',
      'Total Latihan',
      'Gerakan Benar',
      'Posisi Miring',
      'Rata-rata Bukaan',
      'Catatan Fisioterapis',
    ]

    const rows = filteredSessions.map((s) => [
      s.id,
      s.date,
      `"${s.timeRange}"`,
      `"${s.patientName}"`,
      s.patientId,
      `"${s.diagnosis}"`,
      `"${s.protocol}"`,
      s.totalReps,
      s.correctReps,
      s.compensatoryReps,
      `"${s.avgRom}"`,
      `"${s.therapistNotes}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'riwayat_sesi_terapi_stroke.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
      {/* Main Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Riwayat Terapi & Laporan Pasien
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-3xl">
          Arsip data hasil latihan pasien, evaluasi kestabilan posisi tangan, dan
          rekam medis fisioterapi.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <HistoryStatsCards
        totalSessions={48}
        totalRepetitions={480}
        correctRepetitions={412}
        compensatoryRepetitions={68}
      />

      {/* Filter and Actions Bar */}
      <HistoryFilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        patientFilter={patientFilter}
        onPatientFilterChange={setPatientFilter}
        protocolFilter={protocolFilter}
        onProtocolFilterChange={setProtocolFilter}
        onPrintPdf={() => handlePrintPdf(null)}
        onExportCsv={handleExportCsv}
      />

      {/* Detailed Session Logs Table */}
      <HistoryTable
        sessions={filteredSessions}
        onSelectSession={setSelectedSession}
      />

      {/* Session Detail Modal Popup */}
      <SessionDetailModal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
        onPrintPdf={handlePrintPdf}
      />
    </div>
  )
}
