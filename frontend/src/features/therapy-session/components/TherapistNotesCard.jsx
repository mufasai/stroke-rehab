import React from 'react'
import { FileText } from 'lucide-react'

export function TherapistNotesCard({
  notes = '',
  onChangeNotes = () => {},
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-primary-600" />
        <label
          htmlFor="therapist-notes"
          className="text-xs font-bold uppercase tracking-wider text-foreground"
        >
          Catatan Observasi Fisioterapis
        </label>
      </div>
      <textarea
        id="therapist-notes"
        value={notes}
        onChange={(e) => onChangeNotes(e.target.value)}
        placeholder="Ketik catatan klinis spontan (contoh: Pasien mulai kelelahan pada repetisi ke-6, ekstensi jari telunjuk belum optimal)..."
        rows={3}
        className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 resize-none"
      />
    </div>
  )
}
