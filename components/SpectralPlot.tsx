"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

// Mock spectral data
const spectralData = [
  { wavelength: 400, reflectance: 0.05, healthy: 0.06 },
  { wavelength: 450, reflectance: 0.04, healthy: 0.05 },
  { wavelength: 500, reflectance: 0.03, healthy: 0.04 },
  { wavelength: 550, reflectance: 0.08, healthy: 0.09 },
  { wavelength: 600, reflectance: 0.06, healthy: 0.07 },
  { wavelength: 650, reflectance: 0.04, healthy: 0.05 },
  { wavelength: 700, reflectance: 0.35, healthy: 0.45 },
  { wavelength: 750, reflectance: 0.42, healthy: 0.52 },
  { wavelength: 800, reflectance: 0.45, healthy: 0.55 },
  { wavelength: 850, reflectance: 0.43, healthy: 0.53 },
  { wavelength: 900, reflectance: 0.41, healthy: 0.51 },
]

export default function SpectralPlot() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spectral Signature Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Wavelength vs Reflectance for selected pixel (320, 240)</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spectralData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="wavelength"
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "Reflectance", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <ReferenceLine x={550} stroke="hsl(var(--warning))" strokeDasharray="2 2" label="Green Peak" />
              <ReferenceLine x={680} stroke="hsl(var(--destructive))" strokeDasharray="2 2" label="Red Edge" />
              <ReferenceLine x={800} stroke="hsl(var(--success))" strokeDasharray="2 2" label="NIR" />

              <Line
                type="monotone"
                dataKey="reflectance"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Current"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="healthy"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Healthy Reference"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Current Signature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-success rounded-full" />
            <span>Healthy Reference</span>
          </div>
          <div className="text-muted-foreground">
            NDVI: <span className="text-warning font-medium">0.65</span>
          </div>
          <div className="text-muted-foreground">
            Status: <span className="text-warning font-medium">Moderate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
