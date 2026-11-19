# shadcn/ui Setup Guide - Stroke Hand Therapy

## ✅ Setup Selesai!

shadcn/ui sudah berhasil diintegrasikan ke project dengan konfigurasi berikut:

### Installed Components:

- ✅ **button** - Tombol dengan berbagai variant (default, destructive, outline, ghost)
- ✅ **card** - Card component untuk dashboard & data display
- ✅ **input** - Text input field
- ✅ **label** - Label untuk form
- ✅ **select** - Dropdown select
- ✅ **textarea** - Multi-line text input
- ✅ **table** - Table untuk data pasien & riwayat sesi
- ✅ **badge** - Badge untuk status (correct, compensatory, incomplete)
- ✅ **dialog** - Modal dialog untuk form & confirmations
- ✅ **alert** - Alert messages untuk feedback

### File Structure:

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── select.jsx
│   │       ├── textarea.jsx
│   │       ├── table.jsx
│   │       ├── badge.jsx
│   │       ├── dialog.jsx
│   │       └── alert.jsx
│   ├── lib/
│   │   └── utils.js         # cn() utility function
│   └── index.css            # CSS variables untuk theming
├── components.json          # shadcn/ui config
├── tailwind.config.js       # Updated with shadcn theme
└── jsconfig.json            # Path aliases
```

---

## 🎨 Component Usage Examples

### 1. Button Component

```jsx
import { Button } from "@/components/ui/button"

// Variants
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="secondary">Secondary</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With Icon (using lucide-react)
import { Plus } from "lucide-react"
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Patient
</Button>
```

---

### 2. Card Component (untuk Dashboard Stats)

```jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function QuickStatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Pasien</CardTitle>
        <CardDescription>Pasien terdaftar aktif</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">24</div>
        <p className="text-xs text-muted-foreground">
          +2 dari bulan lalu
        </p>
      </CardContent>
    </Card>
  )
}
```

---

### 3. Input & Label (untuk Form)

```jsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function PatientForm() {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nama Lengkap</Label>
      <Input 
        id="name" 
        placeholder="Masukkan nama pasien" 
        type="text"
      />
    </div>
  )
}
```

---

### 4. Select Component (untuk Dropdown)

```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function ExerciseSelector() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Pilih jenis latihan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="finger_spread">Finger Spread</SelectItem>
        <SelectItem value="thumb_to_tips">Thumb-to-Fingertips</SelectItem>
        <SelectItem value="fist_curl">Fist Open-Close</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

---

### 5. Table Component (untuk Data Pasien)

```jsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function PatientTable({ patients }) {
  return (
    <Table>
      <TableCaption>Daftar pasien terdaftar</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Usia</TableHead>
          <TableHead>Tangan Terdampak</TableHead>
          <TableHead>Sesi Terakhir</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.affectedHand}</TableCell>
            <TableCell>{patient.lastSession}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

### 6. Badge Component (untuk Status Gerakan)

```jsx
import { Badge } from "@/components/ui/badge"

function QualityBadge({ quality }) {
  const variants = {
    correct: "default",      // green
    compensatory: "destructive",  // red
    incomplete: "secondary"  // gray/yellow
  }
  
  return (
    <Badge variant={variants[quality]}>
      {quality.toUpperCase()}
    </Badge>
  )
}

// Usage
<QualityBadge quality="correct" />
<QualityBadge quality="compensatory" />
<QualityBadge quality="incomplete" />
```

---

### 7. Dialog Component (untuk Modal)

```jsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function AddPatientDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah Pasien Baru</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pasien Baru</DialogTitle>
          <DialogDescription>
            Masukkan data pasien baru untuk memulai terapi
          </DialogDescription>
        </DialogHeader>
        {/* Form content here */}
      </DialogContent>
    </Dialog>
  )
}
```

---

### 8. Alert Component (untuk Feedback)

```jsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function ErrorAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Tangan tidak terdeteksi. Posisikan tangan di dalam frame kamera.
      </AlertDescription>
    </Alert>
  )
}
```

---

## 🎨 Custom Colors untuk Medical UI

Sudah dikonfigurasi di `tailwind.config.js`:

```js
colors: {
  success: '#10b981',  // Green untuk "Correct"
  warning: '#f59e0b',  // Yellow untuk "Incomplete"
  error: '#ef4444',    // Red untuk "Compensatory"
}
```

Usage:
```jsx
<div className="bg-success text-white">Gerakan Benar</div>
<div className="bg-warning text-white">Belum Lengkap</div>
<div className="bg-error text-white">Kompensasi Terdeteksi</div>
```

---

## 🔧 Utility Function: `cn()`

Untuk menggabungkan className dengan conditional logic:

```jsx
import { cn } from "@/lib/utils"

// Basic usage
<div className={cn("base-class", conditionalClass && "extra-class")} />

// Example: dynamic button state
<Button 
  className={cn(
    "w-full",
    isLoading && "opacity-50 cursor-not-allowed"
  )}
>
  Submit
</Button>
```

---

## 📦 Adding More Components

Jika butuh komponen lain:

```bash
# Avatar
npx shadcn@latest add avatar

# Dropdown Menu
npx shadcn@latest add dropdown-menu

# Toast Notifications
npx shadcn@latest add toast

# Progress Bar
npx shadcn@latest add progress

# Tabs
npx shadcn@latest add tabs

# Separator
npx shadcn@latest add separator
```

Full list: https://ui.shadcn.com/docs/components

---

## 🎯 Komponen yang Akan Kita Gunakan

### Dashboard Page:
- ✅ Card (untuk Quick Stats)
- ✅ Button (untuk "Mulai Sesi Terapi")
- ✅ Table (untuk Antrean Terapi Hari Ini)

### Data Pasien Page:
- ✅ Table (untuk daftar pasien)
- ✅ Button (untuk tambah/edit/delete)
- ✅ Dialog (untuk form tambah pasien)
- ✅ Input, Label, Select (untuk form fields)

### Sesi Terapi Page:
- ✅ Card (untuk panel metrics)
- ✅ Badge (untuk status kualitas gerakan)
- ✅ Button (untuk kontrol sesi)
- ✅ Alert (untuk pesan error/warning)

### History Page:
- ✅ Table (untuk riwayat sesi)
- ✅ Button (untuk export PDF/CSV)

---

## 🚀 Next Steps

1. ✅ shadcn/ui setup - DONE
2. Create layout components (Sidebar, Header, MainLayout)
3. Build Dashboard page dengan shadcn components
4. Build Patient Management page
5. Build Therapy Session page (core feature)

Mau lanjut bikin layout components (Sidebar & Header)?
