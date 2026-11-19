import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

export function AddPatientModal({
  isOpen = false,
  onClose = () => {},
  onSave = () => {},
}) {
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    rmNumber: `RM-2024-${Math.floor(100 + Math.random() * 900)}`,
    age: '',
    gender: 'L',
    strokeDate: '',
    strokeType: 'Iskemik',
    affectedHand: 'Kanan',
    ashworthScale: 2,
    clinicalNotes: '',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name) {
      alert('Nama pasien wajib diisi!')
      return
    }

    const initials = formData.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('')

    const newPatient = {
      id: `#P-${Math.floor(100 + Math.random() * 900)}`,
      rmNumber: formData.rmNumber,
      name: formData.name,
      nik: formData.nik || '3174092408000000',
      age: Number(formData.age) || 50,
      gender: formData.gender,
      strokeDate: formData.strokeDate || '10 Jan 2024',
      strokeType: formData.strokeType,
      affectedHand: formData.affectedHand,
      ashworthScale: Number(formData.ashworthScale),
      ashworthLabel:
        formData.ashworthScale === 1
          ? 'Ringan'
          : formData.ashworthScale === 2
          ? 'Sedang'
          : formData.ashworthScale === 3
          ? 'Kaku'
          : formData.ashworthScale === 4
          ? 'Kaku Total'
          : 'Normal',
      lastSession: 'Belum ada',
      lastDuration: '0 Menit',
      currentRom: '0.000',
      romBaselineDelta: 'Data Awal Baru',
      avatarInitials: initials || 'PX',
      therapist: 'Aisyah Putri, S.Ft., Ftr.',
      program: `Latihan Gerak Jari Tangan ${formData.affectedHand}`,
      sessionsCompleted: 0,
      targetSessions: 16,
      attendanceRate: '100%',
      compensationRate: 0,
      initialCompensationRate: 30,
      initialAshworth: Number(formData.ashworthScale),
      currentAshworth: Number(formData.ashworthScale),
      evaluationNotes: formData.clinicalNotes || 'Pasien baru terdaftar untuk evaluasi awal.',
      recommendationLevel: 'Level 1 Awal',
      protocols: {
        fingerSpread: { delta: '0%', s1: 0, s12: 0, norm: 0.2 },
        thumbOpposition: { delta: '0%', s1: '-', s12: '-' },
        fistCurl: { delta: '0%', s1: '-', s12: '-' },
      },
    }

    onSave(newPatient)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <UserPlus className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Registrasi Pasien
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Tambah Data Rekam Medis Pasien Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs py-2">
          {/* Full Name & NIK */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Nama Lengkap Pasien *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Tn. Agus Raharjo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                NIK (16 Digit)
              </label>
              <input
                type="text"
                maxLength={16}
                placeholder="317409..."
                value={formData.nik}
                onChange={(e) => handleChange('nik', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Age, Gender & RM */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                No. Rekam Medis
              </label>
              <input
                type="text"
                value={formData.rmNumber}
                onChange={(e) => handleChange('rmNumber', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Usia (Tahun)
              </label>
              <input
                type="number"
                placeholder="60"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Jenis Kelamin
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Stroke Type & Hand Affected */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Tipe Stroke
              </label>
              <select
                value={formData.strokeType}
                onChange={(e) => handleChange('strokeType', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none"
              >
                <option value="Iskemik">Iskemik (Penyumbatan)</option>
                <option value="Hemoragik">Hemoragik (Pendarahan)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Sisi Tangan yang Dilatih
              </label>
              <select
                value={formData.affectedHand}
                onChange={(e) => handleChange('affectedHand', e.target.value)}
                className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none"
              >
                <option value="Kanan">Tangan Kanan</option>
                <option value="Kiri">Tangan Kiri</option>
              </select>
            </div>
          </div>

          {/* Ashworth Scale */}
          <div>
            <label className="font-semibold text-muted-foreground block mb-1">
              Tingkat Kekakuan Jari Awal (Skala Ashworth 0 - 4)
            </label>
            <select
              value={formData.ashworthScale}
              onChange={(e) => handleChange('ashworthScale', e.target.value)}
              className="w-full p-2 rounded-lg border border-input bg-background focus:outline-none"
            >
              <option value="0">Skala 0 - Normal (Tidak Kaku)</option>
              <option value="1">Skala 1 - Ringan (Sedikit kaku di ujung gerakan)</option>
              <option value="2">Skala 2 - Sedang (Kaku tapi masih bisa digerakkan)</option>
              <option value="3">Skala 3 - Kaku (Sangat kaku, sulit digerakkan mandiri)</option>
              <option value="4">Skala 4 - Kaku Total (Jari terkunci rapat)</option>
            </select>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="font-semibold text-muted-foreground block mb-1">
              Catatan Khusus Fisioterapis
            </label>
            <textarea
              rows={2}
              placeholder="Catatan riwayat keluhan atau kondisi tangan pasien..."
              value={formData.clinicalNotes}
              onChange={(e) => handleChange('clinicalNotes', e.target.value)}
              className="w-full p-2 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold"
            >
              Simpan Pasien
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
