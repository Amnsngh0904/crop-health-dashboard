import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Button } from '@/components/ui/button'
import SiteHeader from '@/components/SiteHeader'
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
        <SiteHeader />

        {children}
        <Analytics />
      </body>
    </html>
  )
}
