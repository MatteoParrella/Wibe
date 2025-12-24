'use client'
import { useState, useEffect } from 'react'

export default function EventTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime()
      if (distance < 0) {
        clearInterval(timer)
        return
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: 'DD', val: timeLeft.days },
        { label: 'HH', val: timeLeft.hours },
        { label: 'MM', val: timeLeft.mins },
        { label: 'SS', val: timeLeft.secs },
      ].map((t) => (
        <div key={t.label} className="bg-zinc-900 border border-zinc-800 p-2 rounded-2xl text-center">
          <p className="text-xl font-black text-[#ccff00] italic leading-none">{t.val}</p>
          <p className="text-[8px] font-bold text-zinc-600 mt-1 uppercase">{t.label}</p>
        </div>
      ))}
    </div>
  )
}