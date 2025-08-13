'use client'

import { useState, useEffect } from 'react'
import { useReservationStore } from '@/lib/store/reservationStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useStaffStore } from '@/lib/store/staffStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Users, Clock } from 'lucide-react'
import { ReservationCalendar } from '@/components/calendar/reservation-calendar'
import { ReservationForm } from '@/components/forms/reservation-form'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null)
  
  const { reservations, loading, loadReservations, getReservationsByDate } = useReservationStore()
  const { customers, loadCustomers } = useCustomerStore()
  const { staff, loadStaff } = useStaffStore()
  
  useEffect(() => {
    Promise.all([loadReservations(), loadCustomers(), loadStaff()])
  }, [loadReservations, loadCustomers, loadStaff])
  
  const todayReservations = getReservationsByDate(selectedDate)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '確定'
      case 'pending':
        return '保留'
      case 'completed':
        return '完了'
      case 'cancelled':
        return 'キャンセル'
      default:
        return status
    }
  }
  
  const handleReservationClick = (reservationId: string) => {
    setSelectedReservation(reservationId)
    setShowForm(true)
  }
  
  const handleNewReservation = () => {
    setSelectedReservation(null)
    setShowForm(true)
  }
  
  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedReservation(null)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">予約データを読み込み中...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">予約管理</h1>
          <p className="text-gray-600">顧客の予約状況の管理とスケジュール調整</p>
        </div>
        <Button onClick={handleNewReservation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規予約
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                予約カレンダー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReservationCalendar
                reservations={reservations}
                customers={customers}
                staff={staff}
                onDateSelect={setSelectedDate}
                onReservationClick={handleReservationClick}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Selected Date Reservations */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {format(selectedDate, 'MM月dd日（E）', { locale: ja })}の予約
              </CardTitle>
              <CardDescription>
                {todayReservations.length}件の予約があります
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayReservations.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">この日の予約はありません</p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={handleNewReservation}
                  >
                    予約を追加
                  </Button>
                </div>
              ) : (
                todayReservations.map((reservation) => {
                  const customer = customers.find(c => c.id === reservation.customerId)
                  const staffMember = staff.find(s => s.id === reservation.staffId)
                  
                  return (
                    <div
                      key={reservation.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleReservationClick(reservation.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{customer?.name || '不明な顧客'}</p>
                          <p className="text-sm text-gray-600">
                            {format(reservation.scheduledAt, 'HH:mm')} - {format(reservation.endAt, 'HH:mm')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        担当: {staffMember?.name || '不明なスタッフ'}
                      </p>
                      <div className="text-xs text-gray-400">
                        メニュー: {reservation.menuItems.map(m => m.name).join(', ')}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                本日の統計
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">総予約数</span>
                <span className="font-medium">{todayReservations.length}件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">確定済み</span>
                <span className="font-medium text-green-600">
                  {todayReservations.filter(r => r.status === 'confirmed').length}件
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">保留中</span>
                <span className="font-medium text-yellow-600">
                  {todayReservations.filter(r => r.status === 'pending').length}件
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">完了</span>
                <span className="font-medium text-blue-600">
                  {todayReservations.filter(r => r.status === 'completed').length}件
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Reservation Form Modal */}
      {showForm && (
        <ReservationForm
          reservationId={selectedReservation}
          onClose={handleCloseForm}
          defaultDate={selectedDate}
        />
      )}
    </div>
  )
}