"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock time series data
const timeSeriesData = [
  { date: "2024-01-08", ndvi: 0.72, ndwi: 0.15, evi: 0.45, predicted_ndvi: 0.75 },
  { date: "2024-01-09", ndvi: 0.71, ndwi: 0.14, evi: 0.44, predicted_ndvi: 0.74 },
  { date: "2024-01-10", ndvi: 0.69, ndwi: 0.12, evi: 0.42, predicted_ndvi: 0.73 },
  { date: "2024-01-11", ndvi: 0.68, ndwi: 0.11, evi: 0.41, predicted_ndvi: 0.72 },
  { date: "2024-01-12", ndvi: 0.66, ndwi: 0.1, evi: 0.39, predicted_ndvi: 0.71 },
  { date: "2024-01-13", ndvi: 0.65, ndwi: 0.09, evi: 0.38, predicted_ndvi: 0.7 },
  { date: "2024-01-14", ndvi: 0.64, ndwi: 0.08, evi: 0.37, predicted_ndvi: 0.69 },
  { date: "2024-01-15", ndvi: 0.65, ndwi: 0.09, evi: 0.38, predicted_ndvi: 0.68 },
]

export default function TimeSeriesPanel() {
  const [selectedMetric, setSelectedMetric] = useState("ndvi")
  const [aggregation, setAggregation] = useState("daily")

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case "ndvi":
        return {
          title: "NDVI Trend",
          description: "Normalized Difference Vegetation Index over time",
          dataKey: "ndvi",
          predictedKey: "predicted_ndvi",
          color: "hsl(var(--chart-1))",
          predictedColor: "hsl(var(--chart-2))",
          yDomain: [0, 1],
        }
      case "ndwi":
        return {
          title: "NDWI Trend",
          description: "Normalized Difference Water Index over time",
          dataKey: "ndwi",
          predictedKey: null,
          color: "hsl(var(--chart-3))",
          predictedColor: null,
          yDomain: [-0.5, 0.5],
        }
      case "evi":
        return {
          title: "EVI Trend",
          description: "Enhanced Vegetation Index over time",
          dataKey: "evi",
          predictedKey: null,
          color: "hsl(var(--chart-4))",
          predictedColor: null,
          yDomain: [0, 1],
        }
      default:
        return {
          title: "Metric Trend",
          description: "Metric over time",
          dataKey: metric,
          predictedKey: null,
          color: "hsl(var(--chart-1))",
          predictedColor: null,
          yDomain: [0, 1],
        }
    }
  }

  const config = getMetricConfig(selectedMetric)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Time Series Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">Historical trends and predictions</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value)}
              className="text-xs bg-background border border-border rounded px-2 py-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ndvi">NDVI</TabsTrigger>
            <TabsTrigger value="ndwi">NDWI</TabsTrigger>
            <TabsTrigger value="evi">EVI</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMetric} className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={config.yDomain} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(value) => formatDate(value as string)}
                  />
                  <Legend fontSize={12} />

                  <Line
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={2}
                    name="Observed"
                    dot={{ fill: config.color, strokeWidth: 2, r: 3 }}
                  />

                  {config.predictedKey && (
                    <Line
                      type="monotone"
                      dataKey={config.predictedKey}
                      stroke={config.predictedColor}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Current</p>
                <p className="font-medium text-lg">
                  {timeSeriesData[timeSeriesData.length - 1][config.dataKey as keyof (typeof timeSeriesData)[0]]}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">7-day Change</p>
                <p className="font-medium text-lg text-red-500">-0.07</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Trend</p>
                <p className="font-medium text-lg text-red-500">Declining</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
