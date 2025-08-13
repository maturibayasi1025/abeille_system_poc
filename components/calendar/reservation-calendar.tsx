'use client'

import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Customer, Reservation, Staff } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReservationCalendarProps {
  reservations: Reservation[]
  customers: Customer[]
  staff: Staff[]
  onDateSelect: (date: Date) => void
  onReservationClick: (reservationId: string) => void
}

export function ReservationCalendar({
  reservations,
  customers,
  staff,
  onDateSelect,
  onReservationClick
}: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const reservationsByDate = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    reservations.forEach(reservation => {
      const dateKey = format(reservation.scheduledAt, 'yyyy-MM-dd')
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(reservation)
    })
    return map
  }, [reservations])
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'yyyy年MM月', { locale: ja })}
        </h2>
        <Button variant="outline" size="sm" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={day} className={cn(
            "text-center py-2 text-sm font-medium",
            index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-700"
          )}>
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayReservations = reservationsByDate.get(dateKey) || []
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isTodayDate = isToday(day)
          
          return (
            <div
              key={dateKey}
              className={cn(
                "min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50",
                !isCurrentMonth && "opacity-50",
                isTodayDate && "bg-blue-100"
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className={cn(
                "text-sm font-medium mb-1",
                isTodayDate ? "text-blue-600" : "text-gray-900"
              )}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayReservations.slice(0, 3).map((reservation) => {
                  const customer = customers.find(c => c.id === reservation.customerId)
                  return (
                    <div
                      key={reservation.id}
                      className={cn(
                        "text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80",
                        getStatusColor(reservation.status)
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onReservationClick(reservation.id)
                      }}
                    >
                      <div className="truncate">
                        {format(reservation.scheduledAt, 'HH:mm')} {customer?.name}
                      </div>
                    </div>
                  )
                })}
                {dayReservations.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayReservations.length - 3}件
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>確定</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>保留</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>完了</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>キャンセル</span>
        </div>
      </div>
    </div>
  )
}