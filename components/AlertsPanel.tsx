"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Droplets, Bug, TrendingDown, Check, X, Clock } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  timestamp: string
  action: string
  acknowledged: boolean
  icon: React.ReactNode
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      title: "Low Soil Moisture Detected",
      description: "Soil moisture levels have dropped below 35% in Zone A-3",
      timestamp: "2 hours ago",
      action: "Schedule irrigation",
      acknowledged: false,
      icon: <Droplets className="w-4 h-4" />,
    },
    {
      id: "2",
      type: "critical",
      title: "High Pest Risk Alert",
      description: "Elevated pest activity detected in northern quadrant",
      timestamp: "4 hours ago",
      action: "Apply treatment",
      acknowledged: false,
      icon: <Bug className="w-4 h-4" />,
    },
    {
      id: "3",
      type: "warning",
      title: "NDVI Decline Trend",
      description: "Vegetation health showing downward trend over 7 days",
      timestamp: "6 hours ago",
      action: "Investigate cause",
      acknowledged: true,
      icon: <TrendingDown className="w-4 h-4" />,
    },
    {
      id: "4",
      type: "info",
      title: "Weather Advisory",
      description: "Heavy rainfall expected in next 48 hours",
      timestamp: "1 day ago",
      action: "Adjust irrigation",
      acknowledged: false,
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ])

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "border-l-red-500 bg-red-500/5"
      case "warning":
        return "border-l-yellow-500 bg-yellow-500/5"
      case "info":
        return "border-l-blue-500 bg-blue-500/5"
      default:
        return "border-l-gray-500 bg-gray-500/5"
    }
  }

  const getBadgeVariant = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged)
  const acknowledgedAlerts = alerts.filter((alert) => alert.acknowledged)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Alerts</CardTitle>
          <Badge variant="destructive" className="text-xs">
            {activeAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getAlertStyles(alert.type)}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{alert.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </div>
                      <div className="font-medium text-primary">Action: {alert.action}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => acknowledgeAlert(alert.id)} className="h-6 w-6 p-0">
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)} className="h-6 w-6 p-0">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {acknowledgedAlerts.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Recently Acknowledged ({acknowledgedAlerts.length})</p>
            {acknowledgedAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className="p-2 rounded border border-border/50 opacity-60 mb-2 last:mb-0">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium">{alert.title}</span>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
