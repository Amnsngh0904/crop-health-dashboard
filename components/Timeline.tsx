"use client"

import * as React from "react"
import InView from "@/components/InView"

export default function Timeline({ steps, showProgress = false }: { steps: { title: string; desc: string }[]; showProgress?: boolean }) {
  const [progress, setProgress] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!showProgress) return
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setProgress(100)
      })
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [showProgress])

  return (
    <div ref={containerRef} className="relative">
      {showProgress && (
        <>
          {/* Base track */}
          <div className="absolute left-0 right-0 top-5 h-px rounded-full bg-border" />
          {/* Progress */}
          <div
            className="absolute left-0 top-5 h-px rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-[width] duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center relative">
        {steps.map((s, i) => (
          <InView key={s.title} className="rounded-xl border bg-secondary/40 p-4" delay={i * 120} animation="animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="font-medium">{s.title}</div>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </InView>
        ))}
      </div>
    </div>
  )
}
