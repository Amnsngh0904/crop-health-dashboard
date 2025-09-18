"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface GaugeProps {
  title: string
  value: number
  maxValue: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  trendValue: string
  description: string
}

function CircularGauge({ title, value, maxValue, unit, status, trend, trendValue, description }: GaugeProps) {
  const percentage = (value / maxValue) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const statusColors = {
    good: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-red-500",
  }

  const statusBgColors = {
    good: "stroke-green-500",
    warning: "stroke-yellow-500",
    critical: "stroke-red-500",
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={statusBgColors[status]}
              style={{
                transition: "stroke-dashoffset 0.5s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${statusColors[status]}`}>{value.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1">
            <TrendIcon className={`w-3 h-3 ${trendColor}`} />
            <span className={`text-xs ${trendColor}`}>{trendValue}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Gauges() {
  const gauges = [
    {
      title: "NDVI",
      value: 0.65,
      maxValue: 1.0,
      unit: "",
      status: "warning" as const,
      trend: "down" as const,
      trendValue: "-0.05",
      description: "Vegetation health index",
    },
    {
      title: "Soil Moisture",
      value: 32,
      maxValue: 100,
      unit: "%",
      status: "critical" as const,
      trend: "down" as const,
      trendValue: "-8%",
      description: "Volumetric water content",
    },
    {
      title: "Pest Risk",
      value: 75,
      maxValue: 100,
      unit: "%",
      status: "critical" as const,
      trend: "up" as const,
      trendValue: "+12%",
      description: "Disease probability",
    },
    {
      title: "Irrigation Status",
      value: 85,
      maxValue: 100,
      unit: "%",
      status: "good" as const,
      trend: "stable" as const,
      trendValue: "0%",
      description: "System efficiency",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Health Indicators</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time field health metrics</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {gauges.map((gauge, index) => (
            <CircularGauge key={index} {...gauge} />
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Field Health</span>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
              Moderate Risk
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Immediate attention needed for soil moisture and pest management. Consider irrigation scheduling and
            targeted treatment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
