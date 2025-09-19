"use client"

import { useState } from "react"
import TopBar from "@/components/TopBar"
import ImageViewer from "@/components/ImageViewer"
import SpectralPlot from "@/components/SpectralPlot"
import FieldSummary from "@/components/FieldSummary"
import Gauges from "@/components/Gauges"
import AlertsPanel from "@/components/AlertsPanel"
import TimeSeriesPanel from "@/components/TimeSeriesPanel"
import DataTable from "@/components/DataTable"
import Footer from "@/components/Footer"

interface UploadedImage {
  file: File
  url: string
  name: string
}

export default function Dashboard() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const handleImagesUploaded = (images: UploadedImage[]) => {
    setUploadedImages(images)
    console.log("[v0] Dashboard received uploaded images:", images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar onImagesUploaded={handleImagesUploaded} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-6">
            <ImageViewer uploadedImages={uploadedImages} />
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
      </main>

      <Footer />
    </div>
  )
}
