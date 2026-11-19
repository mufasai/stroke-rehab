import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Play, Hand } from 'lucide-react'

export function PatientTable({
  patients = [],
  onSelectPatient = () => {},
  onStartTherapy = () => {},
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">
            Daftar Pasien Terapi Aktif
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary-50/60 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            <TableRow>
              <TableHead className="w-[110px]">ID & No RM</TableHead>
              <TableHead className="min-w-[190px]">Nama Pasien</TableHead>
              <TableHead className="w-[100px]">Usia / Gender</TableHead>
              <TableHead className="w-[140px]">Tanggal & Tipe</TableHead>
              <TableHead className="w-[130px]">Sisi Tangan</TableHead>
              <TableHead className="w-[130px]">Tingkat Kekakuan</TableHead>
              <TableHead className="w-[130px]">Sesi Terakhir</TableHead>
              <TableHead className="w-[130px]">Bukaan Jari (ROM)</TableHead>
              <TableHead className="w-[130px] text-right pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-border/60">
            {patients.length > 0 ? (
              patients.map((p) => {
                const isRightHand = p.affectedHand === 'Kanan'

                return (
                  <TableRow
                    key={p.id}
                    className="hover:bg-secondary-50/40 transition-colors"
                  >
                    {/* ID & RM */}
                    <TableCell className="font-mono text-muted-foreground">
                      <div className="font-semibold text-foreground">{p.id}</div>
                      <div className="text-[10px]">{p.rmNumber}</div>
                    </TableCell>

                    {/* Patient Name & NIK */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {p.avatarInitials}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => onSelectPatient(p)}
                            className="font-bold text-foreground hover:text-primary-600 text-left transition-colors"
                          >
                            {p.name}
                          </button>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            NIK: {p.nik}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Age / Gender */}
                    <TableCell className="text-muted-foreground font-medium">
                      {p.age} th / {p.gender}
                    </TableCell>

                    {/* Date & Stroke Type */}
                    <TableCell>
                      <div className="text-foreground">{p.strokeDate}</div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 mt-0.5 font-bold ${
                          p.strokeType === 'Iskemik'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}
                      >
                        {p.strokeType.toUpperCase()}
                      </Badge>
                    </TableCell>

                    {/* Sisi Tangan */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isRightHand
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <Hand className="h-3 w-3" />
                        Tangan {p.affectedHand}
                      </span>
                    </TableCell>

                    {/* Ashworth Scale */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold ${
                          p.ashworthScale >= 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Skala {p.ashworthScale} ({p.ashworthLabel})
                      </Badge>
                    </TableCell>

                    {/* Last Session */}
                    <TableCell className="text-muted-foreground">
                      <div className="text-foreground font-medium">{p.lastSession}</div>
                      <div className="text-[10px]">Durasi: {p.lastDuration}</div>
                    </TableCell>

                    {/* ROM Current */}
                    <TableCell>
                      <div className="font-mono font-bold text-foreground">
                        Bukaan: {p.currentRom}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold font-mono">
                        {p.romBaselineDelta}
                      </div>
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectPatient(p)}
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                          title="Lihat Detail Profil & Grafik"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detail
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onStartTherapy(p)}
                          className="h-8 px-2.5 text-xs bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-xs"
                          title="Mulai Sesi Terapi Pasien Ini"
                        >
                          <Play className="h-3 w-3 mr-1 fill-white" />
                          Terapi
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground italic"
                >
                  Tidak ada data pasien yang cocok dengan filter pencarian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div>Halaman 1 dari 5 • Menampilkan daftar pasien terapi aktif</div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
            Sebelumnya
          </Button>
          <Button size="sm" className="h-7 w-7 text-xs p-0 bg-primary-600 text-white">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 text-xs p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 text-xs p-0">
            3
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2">
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
