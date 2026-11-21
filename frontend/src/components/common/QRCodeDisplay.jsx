import React, { useState } from 'react'

export function QRCodeDisplay({ url, size = 200 }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(
    url
  )}`

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-xs border border-slate-200">
      <div className="relative" style={{ width: size, height: size }}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg animate-pulse">
            <span className="text-xs text-slate-500 font-mono">Membuat QR Code...</span>
          </div>
        )}
        <img
          src={qrApiUrl}
          alt={`Scan QR Code: ${url}`}
          width={size}
          height={size}
          onLoad={() => setImageLoaded(true)}
          className={`rounded-lg transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  )
}
