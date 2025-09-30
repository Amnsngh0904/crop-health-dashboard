"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SiteHeader() {
  const pathname = usePathname()
  const hide = pathname?.startsWith("/dashboard")

  if (hide) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-sky-500" />
          <span>FarmAssist</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#home" className="hover:text-foreground">Home</Link>
          <Link href="/#about" className="hover:text-foreground">About</Link>
          <Link href="/#features" className="hover:text-foreground">Features</Link>
          <Link href="/#how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link href="/#impact" className="hover:text-foreground">Impact</Link>
          <Link href="/#demo" className="hover:text-foreground">Demo</Link>
          <Link href="/#contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/auth/login" target="_blank" rel="noopener noreferrer">Login</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white shadow-sm hover:opacity-95 rounded-full px-5">
            <Link href="/auth/signup" target="_blank" rel="noopener noreferrer">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
