'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Visit, Staff } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface StaffSalesRankingProps {
  visits: Visit[]
  staff: Staff[]
}

export function StaffSalesRanking({ visits, staff }: StaffSalesRankingProps) {
  const rankingData = useMemo(() => {
    // スタッフ別売上を集計
    const staffSales = staff.map(staffMember => {
      const staffVisits = visits.filter(visit => visit.staffId === staffMember.id)
      const totalSales = staffVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      const visitCount = staffVisits.length
      const averageOrderValue = visitCount > 0 ? totalSales / visitCount : 0
      
      return {
        id: staffMember.id,
        name: staffMember.name,
        role: staffMember.role,
        sales: totalSales,
        visits: visitCount,
        averageOrderValue: Math.round(averageOrderValue),
        isActive: staffMember.isActive
      }
    })
    
    // 売上順にソート（アクティブなスタッフのみ）
    return staffSales
      .filter(staff => staff.isActive)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8) // 上位8名まで表示
  }, [visits, staff])
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
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
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'staff':
        return 'bg-green-100 text-green-800'
      case 'trainee':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理者'
      case 'manager':
        return 'マネージャー'
      case 'staff':
        return 'スタッフ'
      case 'trainee':
        return '研修生'
      default:
        return role
    }
  }
  
  if (rankingData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        データがありません
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rankingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            <Bar 
              dataKey="sales" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Detailed Ranking List */}
      <div className="space-y-2">
        {rankingData.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {item.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge className={getRoleColor(item.role)}>
                    {getRoleLabel(item.role)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {item.visits}件の来店 • 平均¥{item.averageOrderValue.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">¥{item.sales.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}