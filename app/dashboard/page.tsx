"use client"

import TopBar from "@/components/TopBar"
import ImageViewer from "@/components/ImageViewer"
import SpectralPlot from "@/components/SpectralPlot"
import FieldSummary from "@/components/FieldSummary"
import Gauges from "@/components/Gauges"
import AlertsPanel from "@/components/AlertsPanel"
import TimeSeriesPanel from "@/components/TimeSeriesPanel"
import DataTable from "@/components/DataTable"
import Footer from "@/components/Footer"
import CropAnalysisDashboard from "@/components/CropAnalysisDashboard"
import ChatBot from "@/components/ChatBot"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getFirebaseApp } from "@/lib/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth(getFirebaseApp())
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/")
      }
    })
    return () => unsub()
  }, [router])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle light green background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[90vw] rounded-full bg-gradient-to-r from-green-300/40 via-emerald-200/30 to-lime-200/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-6rem] h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200/40 to-green-300/50 blur-2xl" />
      </div>

      <TopBar />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-6">
            <ImageViewer />
            <SpectralPlot />
          </div>

          {/* Right Column - 40% */}
          <div className="lg:col-span-2 space-y-6">
            <FieldSummary />
            <Gauges />
            <AlertsPanel />
            <TimeSeriesPanel />
            <DataTable />
          </div>
        </div>

        <div className="mt-8">
          <CropAnalysisDashboard />
        </div>
      </main>

      <Footer />

      <ChatBot />
    </div>
  )
}
