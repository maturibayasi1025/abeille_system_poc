'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useReservationStore } from '@/lib/store/reservationStore'
import { useSalesStore } from '@/lib/store/salesStore'
import { useStaffStore } from '@/lib/store/staffStore'
import { Users, Calendar, TrendingUp, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const { customers, loadCustomers } = useCustomerStore()
  const { reservations, loadReservations } = useReservationStore()
  const { visits, loadVisits, getDailySales } = useSalesStore()
  const { staff, loadStaff } = useStaffStore()
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCustomers(),
        loadReservations(),
        loadVisits(),
        loadStaff()
      ])
      setLoading(false)
    }
    
    loadData()
  }, [loadCustomers, loadReservations, loadVisits, loadStaff])
  
  const today = new Date()
  const todayReservations = reservations.filter(r => 
    format(r.scheduledAt, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  )
  const todaySales = getDailySales(today)
  const activeStaff = staff.filter(s => s.isActive)
  
  const stats = [
    {
      title: '総顧客数',
      value: customers.length.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '本日の予約',
      value: todayReservations.length.toString(),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '本日の売上',
      value: `¥${todaySales.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'アクティブスタッフ',
      value: activeStaff.length.toString(),
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">データを読み込み中...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600">美容サロン統合管理システム</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Today's Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            本日の予約一覧
            <Badge variant="secondary">{todayReservations.length}件</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayReservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">本日の予約はありません</p>
          ) : (
            <div className="space-y-4">
              {todayReservations.slice(0, 5).map((reservation) => {
                const customer = customers.find(c => c.id === reservation.customerId)
                const staffMember = staff.find(s => s.id === reservation.staffId)
                
                return (
                  <div key={reservation.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{customer?.name || '不明な顧客'}</p>
                      <p className="text-sm text-gray-600">
                        {format(reservation.scheduledAt, 'HH:mm', { locale: ja })} - {format(reservation.endAt, 'HH:mm', { locale: ja })}
                      </p>
                      <p className="text-sm text-gray-500">
                        担当: {staffMember?.name || '不明なスタッフ'}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        reservation.status === 'confirmed' ? 'default' :
                        reservation.status === 'pending' ? 'secondary' :
                        reservation.status === 'completed' ? 'outline' : 'destructive'
                      }
                    >
                      {reservation.status === 'confirmed' ? '確定' :
                       reservation.status === 'pending' ? '保留' :
                       reservation.status === 'completed' ? '完了' : 'キャンセル'}
                    </Badge>
                  </div>
                )
              })}
              {todayReservations.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  他 {todayReservations.length - 5} 件の予約があります
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}