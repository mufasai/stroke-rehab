import React, { useState, useEffect } from 'react'
import {
  loadCalibrationConfig,
  saveCalibrationConfig,
  resetCalibrationConfig,
} from './calibrationConfig'
import { CalibrationSlidersPanel } from './components/CalibrationSlidersPanel'
import { CheckCircle2, SlidersHorizontal } from 'lucide-react'

export default function CalibrationPage() {
  const [config, setConfig] = useState(loadCalibrationConfig)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
        setToastMessage('')
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  const handleChangeConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const success = saveCalibrationConfig(config)
    if (success) {
      setSaveSuccess(true)
      setToastMessage(
        'Pengaturan berhasil disimpan! Ambang batas ini otomatis digunakan saat memulai Sesi Terapi.'
      )
    }
  }

  const handleReset = () => {
    const defaultConf = resetCalibrationConfig()
    setConfig(defaultConf)
    setSaveSuccess(true)
    setToastMessage('Semua ambang batas telah dikembalikan ke standar medis default.')
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <SlidersHorizontal className="size-4" />
            </span>
            <h1 className="text-2xl font-bold text-foreground">
              Kalibrasi & Pengaturan Sistem
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Sesuaikan ambang batas biomekanik gerakan dengan karakteristik fisik pasien. Pengaturan ini otomatis menjadi acuan saat memulai sesi terapi.
          </p>
        </div>
      </div>

      {/* Toast Alert Banner */}
      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Threshold Sliders Panel */}
      <CalibrationSlidersPanel
        config={config}
        onChangeConfig={handleChangeConfig}
        onSave={handleSave}
        onReset={handleReset}
        saveSuccess={saveSuccess}
      />
    </div>
  )
}
