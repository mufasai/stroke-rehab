import React from 'react'
import { Calendar, Users, Activity, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HistoryFilterBar({
  dateRange,
  onDateRangeChange,
  patientFilter,
  onPatientFilterChange,
  protocolFilter,
  onProtocolFilterChange,
  onPrintPdf,
  onExportCsv,
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* 1. Date Range Picker */}
          <div>
            <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
              Rentang Waktu Latihan
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                placeholder="1 Mar 2024 - 28 Mar 2024"
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 2. Patient Cohort */}
          <div>
            <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
              Pilih Pasien
            </label>
            <div className="relative">
              <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={patientFilter}
                onChange={(e) => onPatientFilterChange(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ALL">Semua Pasien</option>
                <option value="Tn. Budi Santoso">Tn. Budi Santoso (RM-2024-089)</option>
                <option value="Bambang Sutrisno">Bambang Sutrisno (RM-99201)</option>
                <option value="Siti Rahmawati">Siti Rahmawati (RM-99204)</option>
                <option value="Hendro Wijaya">Hendro Wijaya (RM-99182)</option>
                <option value="Dewi Lestari">Dewi Lestari (RM-99220)</option>
              </select>
            </div>
          </div>

          {/* 3. Kinematic Protocol */}
          <div>
            <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
              Jenis Latihan
            </label>
            <div className="relative">
              <Activity className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={protocolFilter}
                onChange={(e) => onProtocolFilterChange(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ALL">Semua Latihan (Buka Jari, Jempol, Mengepal)</option>
                <option value="finger_spread">Membuka Jari Lebar (Finger Spread)</option>
                <option value="thumb_to_tips">Sentuhan Jempol (Oposisi)</option>
                <option value="fist_curl">Mengepalkan Tangan (Fist Curl)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
          <Button
            size="sm"
            onClick={onPrintPdf}
            className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold h-9 px-3.5 flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </Button>

          <Button
            size="sm"
            onClick={onExportCsv}
            className="bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold h-9 px-3.5 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Excel</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
