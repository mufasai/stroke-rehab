import React from 'react'
import { Search } from 'lucide-react'

export function PatientFilterBar({
  searchQuery,
  onSearchChange,
  handFilter,
  onHandFilterChange,
  strokeFilter,
  onStrokeFilterChange,
  ashworthFilter,
  onAshworthFilterChange,
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama pasien, NIK, atau No. Rekam Medis..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
          />
        </div>

        {/* Hand Affected Filter */}
        <div className="md:col-span-2">
          <select
            value={handFilter}
            onChange={(e) => onHandFilterChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
          >
            <option value="ALL">Sisi Tangan: Semua</option>
            <option value="Kanan">Tangan Kanan</option>
            <option value="Kiri">Tangan Kiri</option>
          </select>
        </div>

        {/* Stroke Type Filter */}
        <div className="md:col-span-2">
          <select
            value={strokeFilter}
            onChange={(e) => onStrokeFilterChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
          >
            <option value="ALL">Tipe Stroke: Semua</option>
            <option value="Iskemik">Iskemik (Sumbatan)</option>
            <option value="Hemoragik">Hemoragik (Pendarahan)</option>
          </select>
        </div>

        {/* Spasticity Ashworth Filter */}
        <div className="md:col-span-3">
          <select
            value={ashworthFilter}
            onChange={(e) => onAshworthFilterChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
          >
            <option value="ALL">Tingkat Kekakuan Jari: Semua</option>
            <option value="1">Skala 1 - Ringan</option>
            <option value="2">Skala 2 - Sedang</option>
            <option value="3">Skala 3 - Kaku</option>
            <option value="4">Skala 4 - Kaku Total</option>
          </select>
        </div>
      </div>
    </div>
  )
}
