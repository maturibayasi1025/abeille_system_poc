'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, BarChart3, Users, ShoppingCart } from 'lucide-react'

interface SalesTrendData {
  month: string
  monthLabel: string
  totalSales: number
  visitCount: number
  customerCount: number
  avgOrderValue: number
}

interface SalesTrendChartProps {
  salesData: SalesTrendData[]
}

type ChartType = 'sales' | 'visits' | 'customers' | 'aov' | 'combined'

export function SalesTrendChart({ salesData }: SalesTrendChartProps) {
  const [chartType, setChartType] = useState<ChartType>('combined')
  
  const formatCurrency = (value: number) => `¥${(value / 1000).toFixed(0)}k`
  const formatNumber = (value: number) => value.toLocaleString()
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = salesData.find(d => d.monthLabel === label)
      if (data) {
        return (
          <div className="bg-white p-4 border rounded-lg shadow-lg">
            <p className="font-medium mb-2">{label}</p>
            <div className="space-y-1 text-sm">
              <p className="text-blue-600">
                売上: ¥{data.totalSales.toLocaleString()}
              </p>
              <p className="text-green-600">
                来店数: {data.visitCount}回
              </p>
              <p className="text-purple-600">
                顧客数: {data.customerCount}名
              </p>
              <p className="text-orange-600">
                平均単価: ¥{Math.round(data.avgOrderValue).toLocaleString()}
              </p>
            </div>
          </div>
        )
      }
    }
    return null
  }
  
  // 前月比較
  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }
  
  const latestMonth = salesData[salesData.length - 1]
  const previousMonth = salesData[salesData.length - 2]
  
  const salesGrowth = previousMonth ? getGrowthRate(latestMonth?.totalSales || 0, previousMonth.totalSales) : 0
  const visitsGrowth = previousMonth ? getGrowthRate(latestMonth?.visitCount || 0, previousMonth.visitCount) : 0
  const customersGrowth = previousMonth ? getGrowthRate(latestMonth?.customerCount || 0, previousMonth.customerCount) : 0
  const aovGrowth = previousMonth ? getGrowthRate(latestMonth?.avgOrderValue || 0, previousMonth.avgOrderValue) : 0
  
  const renderChart = () => {
    switch (chartType) {
      case 'sales':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="totalSales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'visits':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="visitCount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'customers':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="customerCount" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'aov':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="avgOrderValue" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'combined':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesData} margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis yAxisId="left" orientation="left" tickFormatter={formatCurrency} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar yAxisId="left" dataKey="totalSales" fill="#3b82f6" opacity={0.7} radius={[4, 4, 0, 0]} />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="visitCount" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="customerCount" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )
    }
  }
  
  const getChartTitle = () => {
    switch (chartType) {
      case 'sales':
        return '月次売上推移'
      case 'visits':
        return '月次来店数推移'
      case 'customers':
        return '月次顧客数推移'
      case 'aov':
        return '平均客単価推移'
      case 'combined':
      default:
        return '総合売上トレンド分析'
    }
  }
  
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }
  
  return (
    <div className="space-y-6">
      {/* Growth Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">売上成長率</p>
                <p className={`text-lg font-bold ${getGrowthColor(salesGrowth)}`}>
                  {salesGrowth > 0 ? '+' : ''}{salesGrowth.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">来店数成長率</p>
                <p className={`text-lg font-bold ${getGrowthColor(visitsGrowth)}`}>
                  {visitsGrowth > 0 ? '+' : ''}{visitsGrowth.toFixed(1)}%
                </p>
              </div>
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">顧客数成長率</p>
                <p className={`text-lg font-bold ${getGrowthColor(customersGrowth)}`}>
                  {customersGrowth > 0 ? '+' : ''}{customersGrowth.toFixed(1)}%
                </p>
              </div>
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">客単価成長率</p>
                <p className={`text-lg font-bold ${getGrowthColor(aovGrowth)}`}>
                  {aovGrowth > 0 ? '+' : ''}{aovGrowth.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {getChartTitle()}
              </CardTitle>
              <CardDescription>
                過去12ヶ月の売上パフォーマンス分析
              </CardDescription>
            </div>
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="combined">総合ビュー</SelectItem>
                <SelectItem value="sales">売上推移</SelectItem>
                <SelectItem value="visits">来店数推移</SelectItem>
                <SelectItem value="customers">顧客数推移</SelectItem>
                <SelectItem value="aov">平均客単価</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {renderChart()}
          </div>
          
          {chartType === 'combined' && (
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded" />
                <span>売上（左軸）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded" />
                <span>来店数（右軸）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded" />
                <span>顧客数（右軸）</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}