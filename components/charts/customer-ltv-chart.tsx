'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp } from 'lucide-react'

interface CustomerLTVData {
  id: string
  name: string
  ltv: number
  visitCount: number
  averageOrderValue: number
  frequency: number
  tags: string[]
}

interface CustomerLTVChartProps {
  customers: CustomerLTVData[]
}

export function CustomerLTVChart({ customers }: CustomerLTVChartProps) {
  const chartData = customers.map((customer, index) => ({
    name: customer.name,
    ltv: customer.ltv,
    visitCount: customer.visitCount,
    averageOrderValue: Math.round(customer.averageOrderValue),
    rank: index + 1
  }))
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            LTV: ¥{data.ltv.toLocaleString()}
          </p>
          <p className="text-green-600">
            来店数: {data.visitCount}回
          </p>
          <p className="text-purple-600">
            平均単価: ¥{data.averageOrderValue.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }
  
  const totalLTV = customers.reduce((sum, customer) => sum + customer.ltv, 0)
  const avgLTV = customers.length > 0 ? totalLTV / customers.length : 0
  const topCustomers = customers.slice(0, 5)
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            顧客LTV分析
          </CardTitle>
          <CardDescription>
            上位顧客の生涯価値（Lifetime Value）分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ltv" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Top Customers List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">上位顧客ランキング</h4>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{customer.name}</span>
                        {customer.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {customer.visitCount}回来店 • 平均¥{Math.round(customer.averageOrderValue).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">¥{customer.ltv.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* LTV Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            LTV統計サマリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">¥{Math.round(avgLTV).toLocaleString()}</p>
              <p className="text-sm text-gray-600">平均LTV</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">¥{customers[0]?.ltv.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">最高LTV</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => c.ltv >= 50000).length}
              </p>
              <p className="text-sm text-gray-600">5万円以上顧客</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {customers.filter(c => c.visitCount >= 5).length}
              </p>
              <p className="text-sm text-gray-600">5回以上来店</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}