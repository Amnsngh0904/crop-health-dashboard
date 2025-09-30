"use client"

import React, { useEffect, useMemo, useState } from "react"

// Animated NDVI gauge + 7-day sparkline used on the landing page hero
export default function HeroStats() {
  // Simulated latest NDVI value with a gentle mount animation
  const [ndvi, setNdvi] = useState(0.52)
  const target = 0.62

  useEffect(() => {
    const t = setTimeout(() => setNdvi(target), 200)
    return () => clearTimeout(t)
  }, [])

  const ring = useMemo(() => {
    const size = 120
    const stroke = 12
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r
    const pct = Math.max(0, Math.min(1, ndvi))
    const dash = c * pct
    const offset = c - dash
    return { size, stroke, r, c, offset }
  }, [ndvi])

  // 7-day sparkline
  const data = useMemo(() => [0.42, 0.48, 0.51, 0.55, 0.53, 0.57, 0.6], [])
  const [animateStroke, setAnimateStroke] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setAnimateStroke(false), 800)
    return () => clearTimeout(t)
  }, [])

  const spark = useMemo(() => {
    const w = 240
    const h = 72
    const pad = 6
    const min = Math.min(...data)
    const max = Math.max(...data)
    const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / (data.length - 1))
    const ys = data.map((v) => {
      const t = (v - min) / (max - min || 1)
      return h - pad - t * (h - pad * 2)
    })
    const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ")
    const strokeLen = xs.reduce((acc, x, i) => (i ? acc + Math.hypot(x - xs[i - 1], ys[i] - ys[i - 1]) : 0), 0)
    return { w, h, pad, path: d, strokeLen }
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {/* NDVI Gauge */}
      <div className="rounded-xl border bg-card p-4 flex items-center gap-4 shadow-sm">
        <svg width={ring.size} height={ring.size} viewBox={`0 0 ${ring.size} ${ring.size}`} className="shrink-0">
          <circle
            cx={ring.size / 2}
            cy={ring.size / 2}
            r={ring.r}
            strokeWidth={ring.stroke}
            stroke="hsl(var(--muted-foreground))"
            opacity={0.25}
            fill="none"
          />
          <circle
            cx={ring.size / 2}
            cy={ring.size / 2}
            r={ring.r}
            strokeWidth={ring.stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={ring.c}
            strokeDashoffset={ring.offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
            style={{
              stroke: "url(#ndviGradient)",
            }}
          />
          <defs>
            <linearGradient id="ndviGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <div className="text-xs text-muted-foreground">NDVI</div>
          <div className="text-3xl font-semibold tabular-nums">{ndvi.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Current index</div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="md:col-span-2 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-muted-foreground">7‑day trend</div>
            <div className="text-sm">Field health</div>
          </div>
          <div className="text-sm font-medium">Last: {data[data.length - 1].toFixed(2)}</div>
        </div>
        <svg width={spark.w} height={spark.h} className="block">
          <defs>
            <linearGradient id="sparkStroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0.25)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0.0)" />
            </linearGradient>
          </defs>
          <path d={spark.path}
            fill="none"
            stroke="url(#sparkStroke)"
            strokeWidth={2}
            style={{
              strokeDasharray: spark.strokeLen,
              strokeDashoffset: animateStroke ? spark.strokeLen : 0,
              transition: "stroke-dashoffset 800ms ease-out",
            }}
          />
        </svg>
      </div>
    </div>
  )
}