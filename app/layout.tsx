import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Button } from '@/components/ui/button'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crop Health Dashboard',
  description: 'Monitor crop health with NDVI and smart insights',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold animate-in fade-in-0 slide-in-from-left-4">
              {/* Simple dual-tone logo: sustainability + tech */}
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-sky-500" />
              <span>FarmAssist</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-3">
              <Link href="#top" className="hover:text-foreground link-underline">Home</Link>
              <Link href="#about" className="hover:text-foreground link-underline">About</Link>
              <Link href="#features" className="hover:text-foreground link-underline">Features</Link>
              <Link href="#how-it-works" className="hover:text-foreground link-underline">How It Works</Link>
              <Link href="#impact" className="hover:text-foreground link-underline">Impact</Link>
              <Link href="#demo" className="hover:text-foreground link-underline">Demo</Link>
              <Link href="#contact" className="hover:text-foreground link-underline">Contact</Link>
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

        {children}
        <Analytics />
      </body>
    </html>
  )
}
