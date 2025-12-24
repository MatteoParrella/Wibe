'use client'
import { QRCodeSVG } from 'qrcode.react'

interface QRProps {
  value: string;
  size?: number;
}

export default function QRCodeGenerator({ value, size = 120 }: QRProps) {
  return (
    <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
      <QRCodeSVG 
        value={value} 
        size={size}
        level="H" // Alta correzione d'errore (importante per i locali bui)
        includeMargin={false}
      />
    </div>
  )
}