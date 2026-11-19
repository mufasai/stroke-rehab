import React from 'react'
import { Sliders, RotateCcw, Save, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CalibrationSlidersPanel({
  config,
  onChangeConfig = () => {},
  onSave = () => {},
  onReset = () => {},
  saveSuccess = false,
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600 border border-primary-200">
            <Sliders className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Pengaturan Ambang Batas Klinis
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Sesuaikan target latihan dengan ukuran fisik dan kekakuan tangan pasien.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in">
            <Check className="size-3" />
            Tersimpan
          </span>
        )}
      </div>

      {/* Sliders Container */}
      <div className="space-y-4 text-xs">
        {/* Slider 1: Finger Spread Threshold */}
        <div className="space-y-1.5 p-3 rounded-lg bg-secondary-50/50 border border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">
                1. Target Bukaan Jari (Finger Spread)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                [EX-01]
              </span>
            </div>
            <span className="font-mono font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded text-xs">
              {config.targetRomSpread.toFixed(3)}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1">
            <Info className="size-3.5 shrink-0 text-primary-600 mt-0.5" />
            <span>
              Batas minimal jari membuka lebar. Turunkan ke{' '}
              <strong className="text-foreground">0.100 - 0.120</strong> jika pasien memiliki tangan kecil atau jari kaku berat (Ashworth 3).
            </span>
          </p>

          <div className="pt-1">
            <input
              type="range"
              min="0.08"
              max="0.22"
              step="0.005"
              value={config.targetRomSpread}
              onChange={(e) =>
                onChangeConfig('targetRomSpread', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>0.080 (Ringan / Tangan Kecil)</span>
              <span className="text-foreground font-semibold">0.150 (Standar)</span>
              <span>0.220 (Maksimal)</span>
            </div>
          </div>
        </div>

        {/* Slider 2: Max Wrist Deviation Angle */}
        <div className="space-y-1.5 p-3 rounded-lg bg-secondary-50/50 border border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">
                2. Toleransi Kemiringan Tangan (Kompensasi)
              </span>
            </div>
            <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs">
              {config.maxWristDeviation}°
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1">
            <Info className="size-3.5 shrink-0 text-rose-600 mt-0.5" />
            <span>
              Batas maksimal pergelangan tangan boleh miring sebelum dinyatakan gerakan curang (*wrist drop*). Standar klinis: 25°.
            </span>
          </p>

          <div className="pt-1">
            <input
              type="range"
              min="15"
              max="40"
              step="1"
              value={config.maxWristDeviation}
              onChange={(e) =>
                onChangeConfig('maxWristDeviation', parseInt(e.target.value, 10))
              }
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>15° (Sangat Ketat)</span>
              <span className="text-foreground font-semibold">25° (Standar Klinis)</span>
              <span>40° (Toleran)</span>
            </div>
          </div>
        </div>

        {/* Slider 3: Peak Hold Duration */}
        <div className="space-y-1.5 p-3 rounded-lg bg-secondary-50/50 border border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">
                3. Durasi Tahan Posisi Puncak (Peak Hold)
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
              {config.holdDurationSeconds.toFixed(1)} Detik
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1">
            <Info className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
            <span>
              Lama pasien harus mempertahankan posisi bukaan jari agar terhitung 1 kali latihan sadar dan tidak terpicu oleh tremor tak sengaja.
            </span>
          </p>

          <div className="pt-1">
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.1"
              value={config.holdDurationSeconds}
              onChange={(e) =>
                onChangeConfig('holdDurationSeconds', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>0.3s (Cepat)</span>
              <span className="text-foreground font-semibold">0.7s (Stabil)</span>
              <span>1.5s (Latihan Isometrik)</span>
            </div>
          </div>
        </div>

        {/* Slider 4: Thumb-to-Tips Opposition Threshold */}
        <div className="space-y-1.5 p-3 rounded-lg bg-secondary-50/50 border border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">
                4. Jarak Sentuhan Jempol (Thumb Opposition)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                [EX-02]
              </span>
            </div>
            <span className="font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-xs">
              {config.targetRomThumb.toFixed(3)}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1">
            <Info className="size-3.5 shrink-0 text-teal-600 mt-0.5" />
            <span>
              Jarak kedekatan 3D ujung jempol ke ujung jari target agar dinyatakan menyentuh berhasil. Standar: 0.035.
            </span>
          </p>

          <div className="pt-1">
            <input
              type="range"
              min="0.02"
              max="0.06"
              step="0.005"
              value={config.targetRomThumb}
              onChange={(e) =>
                onChangeConfig('targetRomThumb', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>0.020 (Rapat Penuh)</span>
              <span className="text-foreground font-semibold">0.035 (Standar)</span>
              <span>0.060 (Toleran)</span>
            </div>
          </div>
        </div>

        {/* Slider 5: Fist Curl Target Angle */}
        <div className="space-y-1.5 p-3 rounded-lg bg-secondary-50/50 border border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">
                5. Sudut Kepalan Jari (Fist Curl)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                [EX-03]
              </span>
            </div>
            <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-xs">
              &le; {config.targetAngleFist}°
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1">
            <Info className="size-3.5 shrink-0 text-slate-600 mt-0.5" />
            <span>
              Sudut tekukan sendi saat jari mengepal penuh. Semakin kecil angkanya, semakin rapat kepalannya. Standar: 45°.
            </span>
          </p>

          <div className="pt-1">
            <input
              type="range"
              min="30"
              max="75"
              step="5"
              value={config.targetAngleFist}
              onChange={(e) =>
                onChangeConfig('targetAngleFist', parseInt(e.target.value, 10))
              }
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>30° (Sangat Rapat)</span>
              <span className="text-foreground font-semibold">45° (Standar)</span>
              <span>75° (Kepalan Longgar)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs h-9 text-muted-foreground hover:text-foreground"
          title="Kembalikan semua slider ke angka standar medis default"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset ke Standar Medis
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onSave}
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-9 font-semibold shadow-xs px-4"
        >
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  )
}
