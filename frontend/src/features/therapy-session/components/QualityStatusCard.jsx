import React from 'react'
import { CheckCircle, AlertTriangle, HelpCircle, Hand, RotateCcw } from 'lucide-react'
import { QUALITY_STATUS } from '@/lib/algorithms/exerciseEvaluator'

export function QualityStatusCard({
  quality = QUALITY_STATUS.INCOMPLETE,
  sessionStatus = 'ready',
  sessionPhase = 'READY',
  holdProgress = 0,
}) {
  let config = {
    bgClass: 'bg-primary-600 text-white',
    icon: CheckCircle,
    label: 'BENAR',
    subText: 'Gerakan tepat, posisi tangan lurus',
    badgeText: 'Gerakan Sah',
  }

  if (sessionStatus === 'ready') {
    config = {
      bgClass: 'bg-slate-700 text-white',
      icon: Hand,
      label: 'SIAP LATIHAN',
      subText: 'Atur posisi tangan, lalu klik Mulai Hitung Latihan',
      badgeText: 'Pra-Sesi',
    }
  } else if (sessionPhase === 'WAITING_NEUTRAL') {
    config = {
      bgClass: 'bg-sky-600 text-white',
      icon: Hand,
      label: 'RAPATKAN JARI',
      subText: 'Rapatkan jari dahulu sebelum mulai membuka lebar',
      badgeText: 'Posisi Awal',
    }
  } else if (sessionPhase === 'RETURNING') {
    config = {
      bgClass: 'bg-emerald-600 text-white',
      icon: RotateCcw,
      label: 'TERCATAT',
      subText: 'Rapatkan jari kembali untuk latihan berikutnya',
      badgeText: 'Berhasil',
    }
  } else if (quality === QUALITY_STATUS.COMPENSATORY) {
    config = {
      bgClass: 'bg-rose-600 text-white',
      icon: AlertTriangle,
      label: 'POSISI MIRING',
      subText: 'Pergelangan tangan miring, luruskan tangan',
      badgeText: 'Miring >25°',
    }
  } else if (quality === QUALITY_STATUS.INCOMPLETE) {
    config = {
      bgClass: 'bg-amber-500 text-white',
      icon: HelpCircle,
      label: 'KURANG LEBAR',
      subText: 'Bukaan jari belum mencapai garis target',
      badgeText: 'Belum Penuh',
    }
  }

  const IconComponent = config.icon

  return (
    <div
      className={`rounded-xl p-4 shadow-sm transition-all duration-200 space-y-2.5 ${config.bgClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <IconComponent className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-white/80">
              Status Gerakan
            </div>
            <div className="text-2xl font-black tracking-wide leading-none my-0.5">
              {config.label}
            </div>
            <div className="text-[11px] font-medium text-white/90">
              {config.subText}
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/30">
            {config.badgeText}
          </span>
        </div>
      </div>

      {/* Hold Progress Bar during deliberate peak hold */}
      {sessionStatus === 'running' && sessionPhase === 'PEAK' && holdProgress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-semibold text-white/90">
            <span>Tahan posisi sebentar...</span>
            <span>{holdProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-75"
              style={{ width: `${holdProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
