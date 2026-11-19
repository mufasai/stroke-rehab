import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Download, UserPlus } from 'lucide-react'
import { INITIAL_PATIENTS } from './data/mockPatients'
import { PatientStatsCards } from './components/PatientStatsCards'
import { PatientFilterBar } from './components/PatientFilterBar'
import { PatientTable } from './components/PatientTable'
import { PatientDetailView } from './components/PatientDetailView'
import { AddPatientModal } from './components/AddPatientModal'

export default function PatientsPage() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState(INITIAL_PATIENTS)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [handFilter, setHandFilter] = useState('ALL')
  const [strokeFilter, setStrokeFilter] = useState('ALL')
  const [ashworthFilter, setAshworthFilter] = useState('ALL')

  // Filtered patients calculation
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.rmNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nik.includes(searchQuery)

      const matchHand = handFilter === 'ALL' || p.affectedHand === handFilter
      const matchStroke = strokeFilter === 'ALL' || p.strokeType === strokeFilter
      const matchAshworth =
        ashworthFilter === 'ALL' || String(p.ashworthScale) === ashworthFilter

      return matchSearch && matchHand && matchStroke && matchAshworth
    })
  }, [patients, searchQuery, handFilter, strokeFilter, ashworthFilter])

  const handleStartTherapy = (patient) => {
    // Navigate to therapy workspace
    navigate('/therapy', { state: { patient } })
  }

  const handlePrintPdf = (patient) => {
    alert(
      `Memproses berkas PDF Rekam Terapi untuk ${patient.name} (${patient.rmNumber}). Fitur siap dicetak.`
    )
  }

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'No RM',
      'Nama Pasien',
      'NIK',
      'Usia',
      'Jenis Kelamin',
      'Tipe Stroke',
      'Sisi Tangan',
      'Skala Kekakuan',
      'Bukaan Jari Terkini',
    ]

    const rows = filteredPatients.map((p) => [
      p.id,
      p.rmNumber,
      `"${p.name}"`,
      p.nik,
      p.age,
      p.gender,
      p.strokeType,
      p.affectedHand,
      p.ashworthScale,
      p.currentRom,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'data_pasien_rehabilitasi_stroke.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSaveNewPatient = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev])
  }

  return (
    <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
      {/* Main Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mt-1">
            Manajemen Data Pasien
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Pencatatan rekam medis terapi rehabilitasi tangan pasien pascastroke dengan pemantauan kamera otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs h-9 bg-card"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Ekspor CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-9 font-semibold shadow-xs"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            + Tambah Pasien Baru
          </Button>
        </div>
      </div>

      {/* Conditional Rendering: List View vs Detail View */}
      {selectedPatient ? (
        <PatientDetailView
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onStartTherapy={handleStartTherapy}
          onPrintPdf={handlePrintPdf}
        />
      ) : (
        <div className="space-y-4">
          {/* 4 Summary Stat Cards */}
          <PatientStatsCards
            totalPatients={patients.length}
            avgProgress="+18.5%"
            dominantSpasticity="Skala 2 – 3"
            needsAttentionCount={2}
          />

          {/* Search & Filter Bar */}
          <PatientFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            handFilter={handFilter}
            onHandFilterChange={setHandFilter}
            strokeFilter={strokeFilter}
            onStrokeFilterChange={setStrokeFilter}
            ashworthFilter={ashworthFilter}
            onAshworthFilterChange={setAshworthFilter}
          />

          {/* Patient Table */}
          <PatientTable
            patients={filteredPatients}
            onSelectPatient={setSelectedPatient}
            onStartTherapy={handleStartTherapy}
          />
        </div>
      )}

      {/* Modal Add Patient */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewPatient}
      />
    </div>
  )
}
