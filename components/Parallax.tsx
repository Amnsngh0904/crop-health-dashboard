"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export default function Parallax({ amount = 20, className, children }: { amount?: number; className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const center = window.innerHeight / 2
        const offset = rect.top + rect.height / 2 - center
        const pct = Math.max(-1, Math.min(1, offset / center))
        el.style.transform = `translateY(${pct * amount}px)`
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [amount])

  return (
    <div ref={ref} className={cn("will-change-transform transition-transform duration-300", className)}>
      {children}
    </div>
  )
}