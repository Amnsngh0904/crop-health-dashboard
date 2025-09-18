"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react"

export default function ImageViewer() {
  const [selectedBand, setSelectedBand] = useState("rgb")
  const [zoom, setZoom] = useState(100)

  const bands = [
    { id: "rgb", name: "RGB", color: "bg-blue-500" },
    { id: "ndvi", name: "NDVI", color: "bg-green-500" },
    { id: "redge", name: "RedEdge", color: "bg-red-500" },
    { id: "swir", name: "SWIR", color: "bg-yellow-500" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Hyperspectral Image Viewer</CardTitle>
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
            <TabsList className="grid w-full grid-cols-4">
              {bands.map((band) => (
                <TabsTrigger key={band.id} value={band.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${band.color}`} />
                  {band.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedBand} className="mt-4">
              <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: "16/10" }}>
                {/* Placeholder for hyperspectral image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`/placeholder-58rv4.png?height=400&width=640&query=agricultural field hyperspectral ${selectedBand} analysis`}
                    alt={`${selectedBand.toUpperCase()} band visualization`}
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>

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
