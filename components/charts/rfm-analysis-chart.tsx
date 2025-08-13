'use client'

import { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Target } from 'lucide-react'

interface RFMData {
  id: string
  name: string
  recency: number
  frequency: number
  monetary: number
  recencyScore: number
  frequencyScore: number
  monetaryScore: number
  segment: string
}

interface RFMAnalysisChartProps {
  rfmData: RFMData[]
}

export function RFMAnalysisChart({ rfmData }: RFMAnalysisChartProps) {
  // セグメント別の色とデータを準備
  const segmentColors = {
    'Champions': '#8b5cf6',
    'Loyal Customers': '#10b981',
    'New Customers': '#3b82f6',
    'At Risk': '#f59e0b',
    'Potential Loyalists': '#6366f1',
    'Lost': '#ef4444'
  }
  
  const segmentLabels = {
    'Champions': 'チャンピオン',
    'Loyal Customers': 'ロイヤル顧客',
    'New Customers': '新規顧客',
    'At Risk': 'リスク顧客',
    'Potential Loyalists': '潜在ロイヤル',
    'Lost': '離脱顧客'
  }
  
  // RFMスコア用のデータを準備（Recency vs Frequency）
  const rfScatterData = rfmData.map(customer => ({
    x: customer.recencyScore,
    y: customer.frequencyScore,
    z: customer.monetaryScore,
    name: customer.name,
    segment: customer.segment,
    monetary: customer.monetary,
    recency: customer.recency,
    frequency: customer.frequency
  }))
  
  // セグメント別統計
  const segmentStats = useMemo(() => {
    const segments = ['Champions', 'Loyal Customers', 'New Customers', 'At Risk', 'Potential Loyalists', 'Lost']
    return segments.map(segment => {
      const segmentCustomers = rfmData.filter(c => c.segment === segment)
      const totalRevenue = segmentCustomers.reduce((sum, c) => sum + c.monetary, 0)
      const avgLTV = segmentCustomers.length > 0 ? totalRevenue / segmentCustomers.length : 0
      const avgRecency = segmentCustomers.length > 0 
        ? segmentCustomers.reduce((sum, c) => sum + c.recency, 0) / segmentCustomers.length 
        : 0
      const avgFrequency = segmentCustomers.length > 0
        ? segmentCustomers.reduce((sum, c) => sum + c.frequency, 0) / segmentCustomers.length
        : 0
      
      return {
        segment,
        count: segmentCustomers.length,
        totalRevenue,
        avgLTV,
        avgRecency: Math.round(avgRecency),
        avgFrequency: Math.round(avgFrequency * 10) / 10,
        percentage: rfmData.length > 0 ? (segmentCustomers.length / rfmData.length) * 100 : 0
      }
    }).filter(stat => stat.count > 0)
  }, [rfmData])
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span className="font-medium" style={{ color: segmentColors[data.segment as keyof typeof segmentColors] }}>
              {segmentLabels[data.segment as keyof typeof segmentLabels]}
            </span>
          </p>
          <div className="text-xs mt-2 space-y-1">
            <p>Recency Score: {data.x} (最終来店: {data.recency}日前)</p>
            <p>Frequency Score: {data.y} (来店回数: {data.frequency}回)</p>
            <p>Monetary Score: {data.z} (LTV: ¥{data.monetary.toLocaleString()})</p>
          </div>
        </div>
      )
    }
    return null
  }
  
  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Champions':
        return 'bg-purple-100 text-purple-800'
      case 'Loyal Customers':
        return 'bg-green-100 text-green-800'
      case 'New Customers':
        return 'bg-blue-100 text-blue-800'
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'Potential Loyalists':
        return 'bg-indigo-100 text-indigo-800'
      case 'Lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            RFM分析マトリックス
          </CardTitle>
          <CardDescription>
            Recency（最新性）× Frequency（頻度）による顧客セグメント分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                data={rfScatterData}
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Recency Score"
                  domain={[0.5, 5.5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => `R${value}`}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Frequency Score"
                  domain={[0.5, 5.5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => `F${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="顧客" dataKey="z">
                  {rfScatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={segmentColors[entry.segment as keyof typeof segmentColors]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(segmentLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segmentColors[key as keyof typeof segmentColors] }}
                />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Segment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            セグメント詳細分析
          </CardTitle>
          <CardDescription>
            各顧客セグメントの詳細指標
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {segmentStats.map((stat) => (
              <div key={stat.segment} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getSegmentColor(stat.segment)}>
                      {segmentLabels[stat.segment as keyof typeof segmentLabels]}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {stat.count}名 ({stat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">¥{Math.round(stat.avgLTV).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">平均LTV</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-medium">{stat.avgRecency}</p>
                    <p className="text-gray-600">平均最終来店日数</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-medium">{stat.avgFrequency}</p>
                    <p className="text-gray-600">平均来店回数</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-medium">¥{(stat.totalRevenue / 1000).toFixed(0)}k</p>
                    <p className="text-gray-600">セグメント総売上</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}