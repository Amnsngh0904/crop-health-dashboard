"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Filter, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface DataRow {
  site_id: string
  site_name: string
  timestamp: string
  ndvi: number
  ndwi: number
  evi: number
  redEdge: number
  swir: number
  pestRisk: number
  alertFlags: string[]
}

const mockData: DataRow[] = [
  {
    site_id: "A01",
    site_name: "North Field",
    timestamp: "2024-01-15 14:30",
    ndvi: 0.65,
    ndwi: 0.09,
    evi: 0.38,
    redEdge: 0.42,
    swir: 0.28,
    pestRisk: 75,
    alertFlags: ["LOW_MOISTURE", "HIGH_PEST_RISK"],
  },
  {
    site_id: "A02",
    site_name: "South Field",
    timestamp: "2024-01-15 14:25",
    ndvi: 0.72,
    ndwi: 0.12,
    evi: 0.45,
    redEdge: 0.48,
    swir: 0.31,
    pestRisk: 45,
    alertFlags: [],
  },
  {
    site_id: "A03",
    site_name: "East Field",
    timestamp: "2024-01-15 14:20",
    ndvi: 0.58,
    ndwi: 0.06,
    evi: 0.32,
    redEdge: 0.35,
    swir: 0.24,
    pestRisk: 82,
    alertFlags: ["LOW_NDVI", "HIGH_PEST_RISK"],
  },
  {
    site_id: "A04",
    site_name: "West Field",
    timestamp: "2024-01-15 14:15",
    ndvi: 0.78,
    ndwi: 0.15,
    evi: 0.52,
    redEdge: 0.55,
    swir: 0.35,
    pestRisk: 25,
    alertFlags: [],
  },
  {
    site_id: "A05",
    site_name: "Central Field",
    timestamp: "2024-01-15 14:10",
    ndvi: 0.61,
    ndwi: 0.08,
    evi: 0.35,
    redEdge: 0.38,
    swir: 0.26,
    pestRisk: 68,
    alertFlags: ["LOW_MOISTURE"],
  },
]

export default function DataTable() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof DataRow | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredData = mockData.filter(
    (row) =>
      row.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.site_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const handleSort = (field: keyof DataRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Site ID",
      "Site Name",
      "Timestamp",
      "NDVI",
      "NDWI",
      "EVI",
      "RedEdge",
      "SWIR",
      "Pest Risk",
      "Alert Flags",
    ]

    const csvContent = [
      headers.join(","),
      ...sortedData.map((row) =>
        [
          row.site_id,
          row.site_name,
          row.timestamp,
          row.ndvi,
          row.ndwi,
          row.evi,
          row.redEdge,
          row.swir,
          row.pestRisk,
          row.alertFlags.join(";"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `crop-health-data-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    alert("PDF export functionality would be implemented with a library like jsPDF")
  }

  const SortIcon = ({ field }: { field: keyof DataRow }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const getAlertBadge = (flags: string[]) => {
    if (flags.length === 0) return null

    const severity = flags.some((flag) => flag.includes("HIGH") || flag.includes("CRITICAL"))
      ? "destructive"
      : "secondary"

    return (
      <Badge variant={severity} className="text-xs">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {flags.length}
      </Badge>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Raw Data Table</CardTitle>
                <p className="text-sm text-muted-foreground">Detailed indices and measurements</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{mockData.length} records</Badge>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("site_id")}>
                      <div className="flex items-center gap-2">
                        Site ID
                        <SortIcon field="site_id" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("site_name")}>
                      <div className="flex items-center gap-2">
                        Site Name
                        <SortIcon field="site_name" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center gap-2">
                        Timestamp
                        <SortIcon field="timestamp" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right"
                      onClick={() => handleSort("ndvi")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        NDVI
                        <SortIcon field="ndvi" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right"
                      onClick={() => handleSort("ndwi")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        NDWI
                        <SortIcon field="ndwi" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right"
                      onClick={() => handleSort("evi")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        EVI
                        <SortIcon field="evi" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right"
                      onClick={() => handleSort("pestRisk")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Pest Risk
                        <SortIcon field="pestRisk" />
                      </div>
                    </TableHead>
                    <TableHead>Alerts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((row) => (
                    <TableRow key={row.site_id}>
                      <TableCell className="font-medium">{row.site_id}</TableCell>
                      <TableCell>{row.site_name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.timestamp}</TableCell>
                      <TableCell className="text-right font-mono">{row.ndvi.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">{row.ndwi.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">{row.evi.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">{row.pestRisk}%</TableCell>
                      <TableCell>{getAlertBadge(row.alertFlags)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {sortedData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No data found matching your search criteria.</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
