"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, RotateCw, Download, ImageIcon } from "lucide-react"

interface UploadedImage {
  file: File
  url: string
  name: string
}

interface ProcessedImage {
  name: string
  url: string
  originalUrl: string
}

interface ImageViewerProps {
  uploadedImages: UploadedImage[]
}

export default function ImageViewer({ uploadedImages }: ImageViewerProps) {
  const [selectedBand, setSelectedBand] = useState("ndvi")
  const [zoom, setZoom] = useState(100)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  console.log("[v0] ImageViewer - uploadedImages array:", uploadedImages)
  console.log("[v0] ImageViewer - uploadedImages length:", uploadedImages.length)

  const processTiffFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            reject(new Error("Could not get canvas context"))
            return
          }

          // For now, create a simple visualization of TIFF data
          // In a real implementation, you'd use a TIFF decoder library
          canvas.width = 512
          canvas.height = 512

          // Create a simple grayscale visualization from the TIFF data
          const imageData = ctx.createImageData(512, 512)
          const data = new Uint8Array(arrayBuffer)

          for (let i = 0; i < imageData.data.length; i += 4) {
            const index = Math.floor(i / 4)
            const value = data[index % data.length] || 0
            imageData.data[i] = value // Red
            imageData.data[i + 1] = value // Green
            imageData.data[i + 2] = value // Blue
            imageData.data[i + 3] = 255 // Alpha
          }

          ctx.putImageData(imageData, 0, 0)

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              resolve(url)
            } else {
              reject(new Error("Failed to create blob from canvas"))
            }
          }, "image/png")
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
  }

  useEffect(() => {
    const processImages = async () => {
      if (uploadedImages.length === 0) {
        setProcessedImages([])
        return
      }

      setIsProcessing(true)
      console.log("[v0] Starting image processing...")

      try {
        const processed = await Promise.all(
          uploadedImages.map(async (image) => {
            if (image.file.type === "image/tiff" || image.name.endsWith(".tif") || image.name.endsWith(".tiff")) {
              console.log("[v0] Processing TIFF file:", image.name)
              try {
                const processedUrl = await processTiffFile(image.file)
                return {
                  name: image.name,
                  url: processedUrl,
                  originalUrl: image.url,
                }
              } catch (error) {
                console.error("[v0] Failed to process TIFF:", error)
                // Fallback to original URL
                return {
                  name: image.name,
                  url: image.url,
                  originalUrl: image.url,
                }
              }
            }
            // For non-TIFF files, use original URL
            return {
              name: image.name,
              url: image.url,
              originalUrl: image.url,
            }
          }),
        )

        setProcessedImages(processed)
        setCurrentImageIndex(0)
        console.log("[v0] Processed images:", processed.length)
      } catch (error) {
        console.error("[v0] Error processing images:", error)
      } finally {
        setIsProcessing(false)
      }
    }

    processImages()
  }, [uploadedImages])

  const bands = [{ id: "ndvi", name: "NDVI", color: "bg-green-500" }]
  const currentImage = processedImages.length > 0 ? processedImages[currentImageIndex] : null

  console.log("[v0] ImageViewer - currentImage:", currentImage?.name, currentImage?.url)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">NDVI Image Viewer</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Field Alpha-01</Badge>
            <Badge variant="outline">2024-01-15 14:30</Badge>
            {processedImages.length > 0 && <Badge variant="default">{processedImages.length} images uploaded</Badge>}
            {isProcessing && <Badge variant="secondary">Processing...</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {processedImages.length > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                disabled={currentImageIndex === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Image {currentImageIndex + 1} of {processedImages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentImageIndex(Math.min(processedImages.length - 1, currentImageIndex + 1))}
                disabled={currentImageIndex === processedImages.length - 1}
              >
                Next
              </Button>
            </div>
          )}

          {/* Band Selection */}
          <Tabs value={selectedBand} onValueChange={setSelectedBand}>
            <TabsList className="grid w-full grid-cols-1">
              {bands.map((band) => (
                <TabsTrigger key={band.id} value={band.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${band.color}`} />
                  {band.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedBand} className="mt-4">
              <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: "16/10" }}>
                {currentImage ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={currentImage.url || "/placeholder.svg"}
                      alt={`Uploaded image: ${currentImage.name}`}
                      className="w-full h-full object-contain"
                      style={{ transform: `scale(${zoom / 100})` }}
                      onLoad={() => console.log("[v0] Image loaded successfully:", currentImage.name)}
                      onError={(e) => {
                        console.log("[v0] Image failed to load:", currentImage.name, currentImage.url, e)
                        console.log("[v0] Error details:", e.currentTarget.src)
                      }}
                    />
                    {/* Image name overlay */}
                    <div className="absolute top-4 left-4 bg-background/80 px-3 py-2 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {currentImage.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-16 h-16 mb-4" />
                      <p className="text-lg font-medium">No Image Uploaded</p>
                      <p className="text-sm">Upload an image to view NDVI analysis</p>
                    </div>
                  </div>
                )}

                {/* Image Controls Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm bg-background/80 px-2 py-1 rounded">{zoom}%</span>
                  <Button size="sm" variant="secondary" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* Coordinates Display */}
                <div className="absolute bottom-4 left-4 bg-background/80 px-3 py-2 rounded text-sm">
                  <div>Lat: 40.7128° N</div>
                  <div>Lon: 74.0060° W</div>
                  <div>Pixel: (320, 240)</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
