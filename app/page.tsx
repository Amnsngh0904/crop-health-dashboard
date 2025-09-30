"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import InView from "@/components/InView"
import Timeline from "@/components/Timeline"

export default function Home(): JSX.Element {
  return (
    <div id="top" className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-[80vw] rounded-full bg-gradient-to-r from-green-300/30 via-emerald-200/20 to-lime-200/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-4rem] h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-200/30 to-green-300/40 blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          {/* Left copy */}
          <InView>
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-secondary/40">
              Smart agriculture • NDVI • IoT • AI
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-pretty bg-gradient-to-r from-emerald-700 to-sky-700 bg-clip-text text-transparent">
              AI‑Powered Precision Agriculture Platform
            </h1>
            <p className="mt-4 text-muted-foreground animate-in fade-in-0 slide-in-from-left-2">
              Combining hyperspectral imaging, IoT sensors, and AI to predict crop stress, soil health, and pest risks in real time.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 animate-bounce-in-up">
              <Button asChild size="lg" className="shadow-sm bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
                <Link href="/auth/signup" target="_blank" rel="noopener noreferrer">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover:scale-[1.02] transition-transform">
                <Link href="#demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </InView>

          {/* Right illustration */}
          <InView className="relative w-full aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/9]" animation="animate-in fade-in-0 slide-in-from-right-4">
            <div className="absolute inset-0 rounded-2xl border bg-card overflow-hidden animate-zoom-in-soft">
              {/* Decorative background */}
              <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-sky-200/50 blur-2xl" />
              {/* Placeholder hero image */}
              <div className="relative h-full w-full">
<Image src="/image.png" alt="Farm sensors and dashboard" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain opacity-90" />
              </div>
            </div>
          </InView>
        </section>

        {/* About */}
        <InView as="section" className="mt-20 max-w-7xl mx-auto">
          <section id="about">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative w-full aspect-[4/3] rounded-xl border bg-secondary/40 overflow-hidden">
<Image src="/why.png" alt="Farmer monitoring dashboard" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Why this platform?</h2>
                <p className="text-muted-foreground">
                  Traditional farming faces unpredictable crop failures, inefficient irrigation, and soil degradation. Our platform brings data‑driven insights using AI, drones, and IoT to empower farmers with precision agriculture.
                </p>
              </div>
            </div>
          </section>
        </InView>

        {/* Features */}
        <section id="features" className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InView className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]" delay={0}>
              <div className="text-lg font-medium">🌍 Hyperspectral Imaging</div>
              <p className="text-sm text-muted-foreground mt-1">Detect crop health and soil indices from satellite and aerial data.</p>
            </InView>
            <InView className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]" delay={100}>
              <div className="text-lg font-medium">💧 IoT Soil Sensors</div>
              <p className="text-sm text-muted-foreground mt-1">Real-time soil moisture, salinity, and temperature monitoring.</p>
            </InView>
            <InView className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]" delay={200}>
              <div className="text-lg font-medium">🤖 AI Predictions</div>
              <p className="text-sm text-muted-foreground mt-1">Stress, disease, and pest outbreak risk using ML models.</p>
            </InView>
            <InView className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]" delay={300}>
              <div className="text-lg font-medium">📊 Dashboard & Alerts</div>
              <p className="text-sm text-muted-foreground mt-1">Interactive maps, anomaly detection, and instant alerts.</p>
            </InView>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works">
          <InView as="section" className="mt-16 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">How It Works</h2>
            <Timeline
              showProgress={false}
              steps={[
                { title: 'Data Collection', desc: 'Drones, IoT sensors, satellites' },
                { title: 'AI Processing', desc: 'CNN/LSTM models analyze multi‑modal data' },
                { title: 'Fusion', desc: 'Combining sensor + image data' },
                { title: 'Insights & Alerts', desc: 'Delivered via web/mobile dashboard' },
              ]}
            />
          </InView>
        </section>

        {/* Impact */}
        <InView as="section" className="mt-20 max-w-7xl mx-auto">
          <section id="impact">
            <h2 className="text-2xl font-semibold text-center mb-6">Impact on Farmers & Agriculture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.01]">
                <div className="text-lg">🌾 Higher Yields</div>
                <p className="text-sm text-muted-foreground mt-1">Detect crop stress early, save crops.</p>
              </div>
              <div className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-lg">💰 Reduced Costs</div>
                <p className="text-sm text-muted-foreground mt-1">Targeted irrigation & fertilizer use.</p>
              </div>
              <div className="rounded-xl border bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-lg">🌱 Sustainable Farming</div>
                <p className="text-sm text-muted-foreground mt-1">Minimize wastage; improve soil health.</p>
              </div>
            </div>
          </section>
        </InView>

        {/* Demo section */}
        <section id="demo">
          <InView as="section" className="mt-20 md:max-w-7xl md:mx-auto -mx-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Product Demo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
              <div className="relative rounded-xl border bg-secondary/40 overflow-hidden animate-zoom-in-soft h-64 md:h-80">
                <Image src="/demo1.png" alt="Interactive map mockup" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
              </div>
              <div className="relative rounded-xl border bg-secondary/40 overflow-hidden animate-zoom-in-soft h-64 md:h-80" style={{ animationDelay: '120ms' }}>
                <Image src="/demo2.png" alt="AI alerts mockup" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white animate-glow">
                <Link href="/auth/signup" target="_blank" rel="noopener noreferrer">Try Live Demo</Link>
              </Button>
            </div>
          </InView>
        </section>

        {/* Final CTA */}
        <InView as="section" className="mt-24">
          <div className="max-w-6xl mx-auto rounded-2xl border p-8 text-center bg-secondary/40">
            <h3 className="text-2xl md:text-3xl font-semibold">Empowering Farmers with AI‑driven Insights</h3>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/auth/signup" target="_blank" rel="noopener noreferrer">🚀 Get Early Access</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login" target="_blank" rel="noopener noreferrer">🔑 Login / Signup</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="#contact">📩 Contact Us</Link>
              </Button>
            </div>
          </div>
        </InView>
      </div>

      {/* Contact footer anchor */}
      <footer id="contact" className="mt-16 text-center text-sm text-muted-foreground">
        <p>Contact: support@farmassist.local</p>
      </footer>
    </div>
  )
}
