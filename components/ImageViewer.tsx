"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, RotateCw, Download, ImageIcon } from "lucide-react"

export default function ImageViewer() {
  const [selectedBand, setSelectedBand] = useState("ndvi")
  const [inputZoom, setInputZoom] = useState(100)
  const [outputZoom, setOutputZoom] = useState(100)

  const bands = [{ id: "ndvi", name: "NDVI", color: "bg-green-500" }]

  const inputImageUrl = "https://i.postimg.cc/wT3XPtR3/2025-08-19-00-00-2025-08-19-23-59-Sentinel-2-L2-A-NDVI.png"
  const outputImageUrl = "https://i.postimg.cc/YSBQhbnm/Whats-App-Image-2025-09-20-at-11-52-27.jpg"

  return (
    <div className="space-y-6">
      {/* Input Image Viewer */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Input Image</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Field Alpha-01</Badge>
              <Badge variant="outline">2024-01-15 14:30</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={inputImageUrl || "/placeholder.svg"}
                      alt="Input satellite image placeholder"
                      className="w-full h-full object-contain"
                      style={{ transform: `scale(${inputZoom / 100})` }}
                    />
                    {/* Image name overlay */}
                    <div className="absolute top-4 left-4 bg-background/80 px-3 py-2 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Input Satellite Image
                      </div>
                    </div>
                  </div>

                  {/* Image Controls Overlay */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setInputZoom(Math.max(50, inputZoom - 25))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm bg-background/80 px-2 py-1 rounded">{inputZoom}%</span>
                    <Button size="sm" variant="secondary" onClick={() => setInputZoom(Math.min(200, inputZoom + 25))}>
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

      {/* Output Analysis Display */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Analysis Output</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Processed Result</Badge>
              <Badge variant="outline">Field Alpha-01</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: "16/10" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={outputImageUrl || "/placeholder.svg"}
                  alt="NDVI Analysis Output placeholder"
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${outputZoom / 100})` }}
                />
                {/* Image name overlay */}
                <div className="absolute top-4 left-4 bg-background/80 px-3 py-2 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    NDVI Analysis Result
                  </div>
                </div>
              </div>

              {/* Image Controls Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setOutputZoom(Math.max(50, outputZoom - 25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm bg-background/80 px-2 py-1 rounded">{outputZoom}%</span>
                <Button size="sm" variant="secondary" onClick={() => setOutputZoom(Math.min(200, outputZoom + 25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Analysis Info */}
              <div className="absolute bottom-4 left-4 bg-background/80 px-3 py-2 rounded text-sm">
                <div>Analysis: NDVI Vegetation Health</div>
                <div>Resolution: High (10m/pixel)</div>
                <div>Status: Complete</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
