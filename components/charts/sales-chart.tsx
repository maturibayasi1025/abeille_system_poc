'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Visit } from '@/types'
import { format, parseISO, eachDayOfInterval, startOfDay, endOfDay, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns'
import { ja } from 'date-fns/locale'

interface SalesChartProps {
  visits: Visit[]
  dateRange: '7days' | '30days' | '3months' | '1year'
}

export function SalesChart({ visits, dateRange }: SalesChartProps) {
  const chartData = useMemo(() => {
    if (visits.length === 0) return []
    
    // 日付範囲を決定
    const sortedVisits = visits.sort((a, b) => a.visitDate.getTime() - b.visitDate.getTime())
    const startDate = startOfDay(sortedVisits[0]?.visitDate || new Date())
    const endDate = endOfDay(sortedVisits[sortedVisits.length - 1]?.visitDate || new Date())
    
    let intervals: Date[]
    let formatString: string
    
    switch (dateRange) {
      case '7days':
      case '30days':
        intervals = eachDayOfInterval({ start: startDate, end: endDate })
        formatString = 'MM/dd'
        break
      case '3months':
        intervals = eachWeekOfInterval({ start: startDate, end: endDate })
        formatString = 'MM/dd'
        break
      case '1year':
        intervals = eachMonthOfInterval({ start: startDate, end: endDate })
        formatString = 'yyyy/MM'
        break
      default:
        intervals = eachDayOfInterval({ start: startDate, end: endDate })
        formatString = 'MM/dd'
    }
    
    // 各期間の売上を集計
    return intervals.map(interval => {
      let periodVisits: Visit[]
      
      if (dateRange === '1year') {
        // 月単位の集計
        periodVisits = visits.filter(visit => 
          visit.visitDate.getFullYear() === interval.getFullYear() &&
          visit.visitDate.getMonth() === interval.getMonth()
        )
      } else if (dateRange === '3months') {
        // 週単位の集計
        const weekEnd = new Date(interval.getTime() + 6 * 24 * 60 * 60 * 1000)
        periodVisits = visits.filter(visit => 
          visit.visitDate >= interval && visit.visitDate <= weekEnd
        )
      } else {
        // 日単位の集計
        periodVisits = visits.filter(visit => 
          format(visit.visitDate, 'yyyy-MM-dd') === format(interval, 'yyyy-MM-dd')
        )
      }
      
      const totalSales = periodVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      const visitCount = periodVisits.length
      const averageOrderValue = visitCount > 0 ? totalSales / visitCount : 0
      
      return {
        date: format(interval, formatString, { locale: ja }),
        fullDate: format(interval, 'yyyy/MM/dd', { locale: ja }),
        sales: totalSales,
        visits: visitCount,
        averageOrderValue: Math.round(averageOrderValue)
      }
    })
  }, [visits, dateRange])
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.fullDate}</p>
          <p className="text-blue-600">
            売上: ¥{data.sales.toLocaleString()}
          </p>
          <p className="text-green-600">
            来店数: {data.visits}件
          </p>
          <p className="text-purple-600">
            平均単価: ¥{data.averageOrderValue.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }
  
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        データがありません
      </div>
    )
  }
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}