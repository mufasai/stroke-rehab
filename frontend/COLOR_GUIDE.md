# Color Palette & Typography Documentation - Stroke Hand Therapy

Dokumentasi ini mencakup implementasi sistem tipografi dan palet warna yang diadaptasi dari **Rukana** (desain *Modern Healthcare & Calming Therapy*).

---

## 🔤 Tipografi (Typography)

* **Font Utama**: **`Lexend Deca`** (Google Fonts, weights 300, 400, 500, 600, 700)
* **Fallback**: `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
* **Karakteristik**: Sangat mudah dibaca pada layar monitor dan tablet, kurva modern yang ramah pasien (medical-friendly).

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🎨 Palet Warna Utama (Primary & Secondary)

### 1. Primary: Dark Green (`#34613A` / `bg-primary` / `bg-desa-dark-green`)
* **Penggunaan**: Tombol aksi utama, active states sidebar, branding, tombol mulai terapi.
* **Hover State**: `#2A5030` (`hover:bg-primary-700` atau `hover:bg-[#2A5030]`)
* **Karakter**: Sejuk, menenangkan detak jantung/stres pasien saat terapi, trustworthy.

```jsx
// Tombol Utama
<Button className="bg-primary hover:bg-primary-700 text-white">
  Mulai Sesi Terapi
</Button>

// Atau menggunakan class direct Rukana
<button className="bg-desa-dark-green hover:bg-[#2A5030] text-white px-5 py-3 rounded-2xl font-medium">
  Mulai Terapi
</button>
```

### 2. Secondary: Slate Teal (`#5A7A7E` / `text-secondary` / `text-desa-secondary`)
* **Penggunaan**: Subtitle, label input, teks bantuan, border sekunder, icon muted.

```jsx
<p className="text-secondary text-sm">Sesi terakhir: 2 hari yang lalu</p>
```

### 3. Background: Soft Mint Background (`#F2F9F6` / `bg-background` / `bg-desa-background`)
* **Penggunaan**: Background halaman utama dashboard dan aplikasi.
* **Keunggulan**: Mengurangi *eye-strain* (kelelahan mata) dibanding background putih murni selama sesi terapi panjang.

### 4. Foreshadow & Accent: Light Green Tint (`#F1FAE6` / `bg-muted` / `bg-desa-foreshadow`)
* **Penggunaan**: Background badge lembut, kartu highlight, active state subtle.

### 5. Foreground: Deep Forest Black (`#001B1A` / `text-foreground` / `text-desa-black`)
* **Penggunaan**: Heading teks utama, nama pasien, nilai metrik numerik.

---

## 🚦 Warna Semantik Indikator Kualitas Gerakan (Quality Indicators)

| Status Gerakan | Warna & Hex | Token Tailwind | Penggunaan |
| :--- | :--- | :--- | :--- |
| **CORRECT (Benar)** | `#8EBD55` (Soft Green) | `bg-success` / `bg-desa-soft-green` | Gerakan berhasil, ROM mencapai target |
| **INCOMPLETE (Belum Lengkap)** | `#FBAD4A` (Warm Yellow) | `bg-warning` / `bg-desa-yellow` | Gerakan belum tuntas, perlu dorongan |
| **COMPENSATORY (Kompensasi/Salah)** | `#FF5070` (Soft Red) | `bg-error` / `bg-destructive` / `bg-desa-red` | Gerakan kompensasi terdeteksi (otot bahu/tubuh ikut bergerak) |
| **INFO / METRIK** | `#005CAA` (Medical Blue) | `bg-info` / `bg-desa-blue` | Informasi perangkat & status koneksi kamera |

```jsx
// Contoh Badge Status Gerakan
function QualityBadge({ quality }) {
  const badgeMap = {
    correct: 'bg-success text-white',
    incomplete: 'bg-warning text-white',
    compensatory: 'bg-error text-white',
  }

  return (
    <Badge className={badgeMap[quality]}>
      {quality.toUpperCase()}
    </Badge>
  )
}
```

---

## 🌈 Gradien (Gradients)

Tersedia utility class untuk banner dashboard, hero card, atau header ringkasan terapi:

```css
/* Gradien Vertikal (Banner Profil/Terapi) */
.gradient-vertical {
  background: linear-gradient(209.83deg, #89B854 1.15%, #042F2B 100%);
}

/* Gradien Horizontal */
.gradient-horizontal {
  background: linear-gradient(272.68deg, #89B854 0%, #042F2B 100%);
}

/* Gradien Primary Modern */
.gradient-primary {
  background: linear-gradient(135deg, #89B854 0%, #34613A 100%);
}
```

---

## 🛠️ Ringkasan Token Tailwind

Anda dapat menggunakan salah satu dari dua pendekatan styling:

1. **Shadcn / Semantic Standard**:
   `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-success`, `bg-warning`, `bg-error`.

2. **Rukana Direct Token**:
   `bg-desa-dark-green`, `text-desa-dark-green`, `bg-desa-soft-green`, `bg-desa-foreshadow`, `bg-desa-background`, `text-desa-black`, `text-desa-secondary`, `bg-desa-yellow`, `bg-desa-red`, `bg-desa-blue`, `border-desa-grey`.
