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
import CropAnalysisDashboard from "@/components/CropAnalysisDashboard"

interface UploadedImage {
  file: File
  url: string
  name: string
}

export default function Dashboard() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImagesUploaded = (images: UploadedImage[]) => {
    setUploadedImages(images)
    setHasStartedAnalysis(false) // Reset analysis state when new images are uploaded
    console.log("[v0] Dashboard received uploaded images:", images.length)
  }

  const handleStartAnalysis = async () => {
    if (uploadedImages.length === 0) return

    setIsAnalyzing(true)
    
    // Simulate analysis process
    console.log("[v0] Starting analysis...")
    
    // You can add actual analysis logic here
    // For now, we'll simulate a 3-second analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsAnalyzing(false)
    setHasStartedAnalysis(true)
    console.log("[v0] Analysis completed!")
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar 
        onImagesUploaded={handleImagesUploaded} 
        onStartAnalysis={handleStartAnalysis}
        hasUploadedImages={uploadedImages.length > 0}
        isAnalyzing={isAnalyzing}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-6">
            <ImageViewer 
              uploadedImages={uploadedImages} 
              showAnalysisOutput={hasStartedAnalysis}
            />
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

        {/* Analysis Results - Only show after analysis is started */}
        {hasStartedAnalysis && (
          <div className="mt-8">
            <CropAnalysisDashboard />
          </div>
        )}

        {/* Loading state during analysis */}
        {isAnalyzing && (
          <div className="mt-8 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <div className="text-lg font-medium">Analyzing your crop data...</div>
              <div className="text-sm text-muted-foreground">This may take a few moments</div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}