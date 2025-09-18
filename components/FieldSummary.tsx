import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Crop } from "lucide-react"

export default function FieldSummary() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Field Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Field ID</p>
            <p className="font-medium">Alpha-01</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-medium">24.5 hectares</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Crop Type</p>
            <div className="flex items-center gap-2">
              <Crop className="w-4 h-4" />
              <p className="font-medium">Corn (Maize)</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Growth Stage</p>
            <Badge variant="secondary">V8 - Vegetative</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">40.7128°N, 74.0060°W</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Last Survey</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <p className="font-medium">Jan 15, 2024</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weather</p>
            <p className="font-medium">22°C, Sunny</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Health</span>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
              Moderate
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
