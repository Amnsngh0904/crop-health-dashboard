"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Upload, Download, Settings, Play } from "lucide-react"
import { Input } from "@/components/ui/input"

interface UploadedImage {
  file: File
  url: string
  name: string
}

interface TopBarProps {
  onImagesUploaded?: (images: UploadedImage[]) => void
  onStartAnalysis?: () => void
  hasUploadedImages?: boolean
  isAnalyzing?: boolean
}

export default function TopBar({ onImagesUploaded, onStartAnalysis, hasUploadedImages, isAnalyzing }: TopBarProps) {
  const [selectedProject, setSelectedProject] = useState("field-alpha-01")
  const [dateRange, setDateRange] = useState("last-7-days")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const uploadedImages: UploadedImage[] = []

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      uploadedImages.push({
        file,
        url,
        name: file.name,
      })
    })

    console.log(
      "[v0] Images uploaded:",
      uploadedImages.map((img) => img.name),
    )

    if (onImagesUploaded) {
      onImagesUploaded(uploadedImages)
    }
  }

  const handleStartAnalysis = () => {
    if (onStartAnalysis) {
      onStartAnalysis()
    }
  }

  return (
    <Card className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CH</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Crop Health Monitor</h1>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field-alpha-01">Field Alpha-01</SelectItem>
                  <SelectItem value="field-beta-02">Field Beta-02</SelectItem>
                  <SelectItem value="field-gamma-03">Field Gamma-03</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*,.tiff,.tif,.TIFF,.TIF"
              className="hidden"
              id="image-upload"
              multiple
              onChange={handleImageUpload}
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </label>
            </Button>

            <Button 
              variant="default" 
              size="sm" 
              onClick={handleStartAnalysis}
              disabled={!hasUploadedImages || isAnalyzing}
            >
              <Play className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Start Analysis"}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}