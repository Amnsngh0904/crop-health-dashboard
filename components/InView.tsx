"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Small intersection observer wrapper that adds entry animations when visible.
 */
export default function InView({
  as: Comp = "div",
  className,
  children,
  once = true,
  threshold = 0.15,
  delay = 0,
  animation = "animate-in fade-in-0 slide-in-from-bottom-4",
}: {
  as?: keyof JSX.IntrinsicElements
  className?: string
  children: React.ReactNode
  once?: boolean
  threshold?: number
  delay?: number
  animation?: string
}) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            if (once) obs.unobserve(e.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [once, threshold])

  return (
    <Comp
      // @ts-expect-error: HTML element ref typing
      ref={ref}
      className={cn(
        "transition-transform",
        visible ? animation : "opacity-0 translate-y-6",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  )
}