"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Droplets, Bug, Leaf, MapPin, Calendar, Target } from 'lucide-react';

const CropAnalysisDashboard = () => {
  const [selectedZone, setSelectedZone] = useState('all');

  // Sample data - replace with your actual data
  const vegetationHealthData = {
    overall: 87,
    healthy: 87,
    stressed: 13,
    zones: [
      { name: 'Zone A', health: 92, area: 25, status: 'healthy' },
      { name: 'Zone B', health: 85, area: 30, status: 'warning' },
      { name: 'Zone C', health: 78, area: 20, status: 'stressed' },
      { name: 'Zone D', health: 91, area: 25, status: 'healthy' }
    ]
  };

  const stressDetectionData = [
    { type: 'Nitrogen Deficiency', zones: 2, severity: 'moderate', color: '#f59e0b' },
    { type: 'Water Stress', zones: 1, severity: 'high', color: '#ef4444' },
    { type: 'Fungal Risk', zones: 1, severity: 'low', color: '#84cc16' }
  ];

  const trendData = [
    { date: 'Jan 10', ndvi: 0.72, soilMoisture: 45, temperature: 22 },
    { date: 'Jan 11', ndvi: 0.70, soilMoisture: 42, temperature: 24 },
    { date: 'Jan 12', ndvi: 0.68, soilMoisture: 38, temperature: 26 },
    { date: 'Jan 13', ndvi: 0.66, soilMoisture: 35, temperature: 25 },
    { date: 'Jan 14', ndvi: 0.65, soilMoisture: 32, temperature: 23 },
    { date: 'Jan 15', ndvi: 0.63, soilMoisture: 30, temperature: 22 }
  ];

  const riskZoneData = [
    { zone: 'Zone A', riskScore: 85, priority: 'High', issues: ['Water stress', 'Pest activity'] },
    { zone: 'Zone B', riskScore: 72, priority: 'Medium', issues: ['Nutrient deficiency'] },
    { zone: 'Zone C', riskScore: 45, priority: 'Low', issues: ['Minor chlorophyll decline'] },
    { zone: 'Zone D', riskScore: 25, priority: 'Low', issues: ['Healthy'] }
  ];

  const yieldPrediction = {
    withAction: 4.1,
    withoutAction: 3.3,
    historical: 4.5,
    potential: 4.8
  };

  const COLORS = {
    healthy: '#22c55e',
    warning: '#f59e0b',
    stressed: '#ef4444',
    critical: '#dc2626'
  };

  const pieChartData = [
    { name: 'Healthy', value: vegetationHealthData.healthy, fill: COLORS.healthy },
    { name: 'Stressed', value: vegetationHealthData.stressed, fill: COLORS.stressed }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Vegetation Health Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Vegetation Health Status
            </CardTitle>
            <Badge variant={vegetationHealthData.overall > 80 ? "default" : "destructive"}>
              {vegetationHealthData.overall}% Healthy
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-lg">
                Your field is <span className="font-bold text-green-600">{vegetationHealthData.overall}% healthy</span>, 
                but <span className="font-bold text-orange-600">{vegetationHealthData.stressed}% of the area</span> shows signs of stress.
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Healthy Areas</span>
                  <span>{vegetationHealthData.healthy}%</span>
                </div>
                <Progress value={vegetationHealthData.healthy} className="h-3" />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Possible Stress Reasons:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Water stress in low-lying areas</li>
                  <li>• Nutrient deficiency (nitrogen)</li>
                  <li>• Early disease onset indicators</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-3">Zone-wise Health Map</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vegetationHealthData.zones.map((zone, index) => (
                <Card key={index} className={`border-l-4 ${
                  zone.status === 'healthy' ? 'border-l-green-500' : 
                  zone.status === 'warning' ? 'border-l-yellow-500' : 
                  'border-l-red-500'
                }`}>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium">{zone.name}</div>
                    <div className="text-lg font-bold">{zone.health}%</div>
                    <div className="text-xs text-muted-foreground">{zone.area}% of field</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Early Stress/Disease Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Early Stress & Disease Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stressDetectionData.map((stress, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: stress.color}}></div>
                  <div>
                    <div className="font-medium">
                      Potential <span className="font-bold">{stress.type}</span> detected in {stress.zones} zone(s)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stress.type === 'Nitrogen Deficiency' && "Chlorophyll levels below optimal range"}
                      {stress.type === 'Water Stress' && "NDVI + soil moisture correlation indicates drought stress"}
                      {stress.type === 'Fungal Risk' && "Spectral anomaly + rising humidity detected"}
                    </div>
                  </div>
                </div>
                <Badge variant={stress.severity === 'high' ? 'destructive' : stress.severity === 'moderate' ? 'secondary' : 'outline'}>
                  {stress.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="irrigation" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="protection">Protection</TabsTrigger>
            </TabsList>

            <TabsContent value="irrigation" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Zone 3 Critical Water Deficit</div>
                    <div className="text-sm text-muted-foreground">Low NDVI + low soil moisture detected → irrigate within 24h</div>
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Recommended Action:</strong> Apply 25-30mm irrigation focusing on Zone A and Zone C. Schedule for early morning (6-8 AM) to minimize evaporation.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Nitrogen Deficiency Detected</div>
                    <div className="text-sm text-muted-foreground">Chlorophyll index below normal in northern sections</div>
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Recommended Action:</strong> Apply NPK fertilizer (120-60-40 kg/ha) with focus on affected zones. Consider foliar spray for quick uptake.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protection" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
                  <Bug className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Fungal Outbreak Risk</div>
                    <div className="text-sm text-muted-foreground">High probability in next 3 days due to humidity + spectral anomaly</div>
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Recommended Action:</strong> Apply preventive fungicide spray. Monitor closely for 48-72 hours. Consider copper-based solution for organic approach.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Trend Analysis & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">-7%</div>
                  <div className="text-sm">Vegetation health drop (last 5 days)</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">3 days</div>
                  <div className="text-sm">Critical threshold warning</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">0.58</div>
                  <div className="text-sm">Predicted NDVI (1 week)</div>
                </CardContent>
              </Card>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[0, 1]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 50]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ndvi" stroke="#22c55e" strokeWidth={3} name="NDVI" />
                  <Line yAxisId="right" type="monotone" dataKey="soilMoisture" stroke="#3b82f6" strokeWidth={2} name="Soil Moisture (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-medium text-red-800">Prediction Alert</div>
              <div className="text-sm text-red-700 mt-1">
                If no action taken, NDVI will fall below healthy threshold (0.6) in approximately 1 week. Immediate intervention recommended.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-500" />
            Priority Risk Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Focus on <span className="font-bold text-red-600">Zone A</span> and <span className="font-bold text-orange-600">Zone B</span> first — they have the highest stress scores.
            </div>

            <div className="space-y-3">
              {riskZoneData.map((zone, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  zone.priority === 'High' ? 'border-l-red-500 bg-red-50' :
                  zone.priority === 'Medium' ? 'border-l-orange-500 bg-orange-50' :
                  'border-l-green-500 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{zone.zone}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={zone.priority === 'High' ? 'destructive' : zone.priority === 'Medium' ? 'secondary' : 'outline'}>
                        {zone.priority} Priority
                      </Badge>
                      <div className="text-sm font-medium">Risk Score: {zone.riskScore}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issues: {zone.issues.join(', ')}
                  </div>
                  <Progress value={zone.riskScore} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yield Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Yield Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{yieldPrediction.withAction}</div>
                    <div className="text-sm">tons/ha (with action)</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{yieldPrediction.withoutAction}</div>
                    <div className="text-sm">tons/ha (no action)</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Historical Average</span>
                  <span>{yieldPrediction.historical} tons/ha</span>
                </div>
                <Progress value={(yieldPrediction.historical / yieldPrediction.potential) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Potential Yield</span>
                  <span>{yieldPrediction.potential} tons/ha</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm">
                  <strong>Impact Analysis:</strong> Taking immediate action could increase yield by 
                  <span className="font-bold text-blue-600"> {((yieldPrediction.withAction - yieldPrediction.withoutAction) / yieldPrediction.withoutAction * 100).toFixed(1)}%</span>, 
                  potentially saving <span className="font-bold">₹{((yieldPrediction.withAction - yieldPrediction.withoutAction) * 25000).toLocaleString()}</span> per hectare.
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'No Action', value: yieldPrediction.withoutAction, fill: '#ef4444' },
                  { name: 'With Action', value: yieldPrediction.withAction, fill: '#22c55e' },
                  { name: 'Historical', value: yieldPrediction.historical, fill: '#6b7280' },
                  { name: 'Potential', value: yieldPrediction.potential, fill: '#3b82f6' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => [`${value} tons/ha`, 'Yield']} />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="font-medium">Seasonal Forecast</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on current conditions and weather patterns, optimal harvest window is projected for 
              <span className="font-medium"> March 15-25, 2024</span>. Continue monitoring for pest pressure and moisture levels.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Immediate Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="font-medium text-red-600">Priority 1 (24-48h)</div>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Irrigate Zone A & Zone C</li>
                    <li>• Apply fungicide preventively</li>
                    <li>• Monitor pest activity</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="font-medium text-orange-600">Priority 2 (3-7 days)</div>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Apply nitrogen fertilizer</li>
                    <li>• Soil testing in stressed areas</li>
                    <li>• Adjust irrigation schedule</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="font-medium text-green-600">Monitor (1-2 weeks)</div>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Weekly NDVI assessment</li>
                    <li>• Weather pattern tracking</li>
                    <li>• Growth stage monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Estimated Cost of Actions</div>
                  <div className="text-sm text-muted-foreground">Total investment for recommended interventions</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">₹8,500</div>
                  <div className="text-sm text-muted-foreground">per hectare</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropAnalysisDashboard;