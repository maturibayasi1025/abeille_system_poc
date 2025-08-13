'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Visit } from '@/types'

interface MenuSalesChartProps {
  visits: Visit[]
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#ec4899', // pink
  '#6b7280'  // gray
]

export function MenuSalesChart({ visits }: MenuSalesChartProps) {
  const menuSalesData = useMemo(() => {
    // メニュー別売上を集計
    const menuSales = new Map<string, { sales: number; count: number }>()
    
    visits.forEach(visit => {
      visit.menuItems.forEach(menu => {
        const current = menuSales.get(menu.name) || { sales: 0, count: 0 }
        menuSales.set(menu.name, {
          sales: current.sales + menu.price,
          count: current.count + 1
        })
      })
    })
    
    // データを配列に変換してソート
    const sortedData = Array.from(menuSales.entries())
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        count: data.count,
        percentage: 0 // 後で計算
      }))
      .sort((a, b) => b.sales - a.sales)
    
    // 合計売上を計算
    const totalSales = sortedData.reduce((sum, item) => sum + item.sales, 0)
    
    // パーセンテージを計算
    return sortedData.map(item => ({
      ...item,
      percentage: totalSales > 0 ? (item.sales / totalSales) * 100 : 0
    }))
  }, [visits])
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">
            売上: ¥{data.sales.toLocaleString()}
          </p>
          <p className="text-green-600">
            利用回数: {data.count}回
          </p>
          <p className="text-purple-600">
            構成比: {data.percentage.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }
  
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null // 5%未満は表示しない
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    )
  }
  
  if (menuSalesData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        データがありません
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={menuSalesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="sales"
            >
              {menuSalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Menu List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">メニュー別詳細</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {menuSalesData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.count}回利用 • {item.percentage.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">¥{item.sales.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}