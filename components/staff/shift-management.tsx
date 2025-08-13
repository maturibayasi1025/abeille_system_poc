'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Users, Clock, Edit3 } from 'lucide-react'
import { useStaffStore } from '@/lib/store/staffStore'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ShiftSlot {
  id: string
  staffId: string
  date: Date
  startTime: string
  endTime: string
  type: 'morning' | 'afternoon' | 'full' | 'off'
  isHopeShift?: boolean // 希望シフトかどうか
}

export function ShiftManagement() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [viewMode, setViewMode] = useState<'current' | 'request'>('current')
  
  const { staff } = useStaffStore()
  
  // モックシフトデータを生成
  const generateMockShifts = (month: string, isRequest = false): ShiftSlot[] => {
    const monthStart = startOfMonth(new Date(month + '-01'))
    const monthEnd = endOfMonth(monthStart)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    const shifts: ShiftSlot[] = []
    const shiftTypes: Array<ShiftSlot['type']> = ['morning', 'afternoon', 'full', 'off']
    
    staff.filter(s => s.isActive).forEach(staffMember => {
      days.forEach(day => {
        const dayOfWeek = getDay(day)
        let shiftType: ShiftSlot['type']
        
        // 曜日によってシフトパターンを変更
        if (dayOfWeek === 0 || dayOfWeek === 6) { // 土日
          shiftType = Math.random() < 0.7 ? 'full' : 'off'
        } else { // 平日
          shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)]
        }
        
        let startTime = '10:00'
        let endTime = '19:00'
        
        switch (shiftType) {
          case 'morning':
            startTime = '09:00'
            endTime = '14:00'
            break
          case 'afternoon':
            startTime = '14:00'
            endTime = '20:00'
            break
          case 'full':
            startTime = '10:00'
            endTime = '19:00'
            break
          case 'off':
            startTime = '--'
            endTime = '--'
            break
        }
        
        shifts.push({
          id: `${staffMember.id}-${format(day, 'yyyy-MM-dd')}`,
          staffId: staffMember.id,
          date: day,
          startTime,
          endTime,
          type: shiftType,
          isHopeShift: isRequest
        })
      })
    })
    
    return shifts
  }
  
  const currentShifts = useMemo(() => {
    return generateMockShifts(selectedMonth, false)
  }, [selectedMonth, staff])
  
  const requestShifts = useMemo(() => {
    // 次月の希望シフト
    const nextMonth = format(addMonths(new Date(selectedMonth + '-01'), 1), 'yyyy-MM')
    return generateMockShifts(nextMonth, true)
  }, [selectedMonth, staff])
  
  const shifts = viewMode === 'current' ? currentShifts : requestShifts
  const displayMonth = viewMode === 'current' ? selectedMonth : format(addMonths(new Date(selectedMonth + '-01'), 1), 'yyyy-MM')
  
  const monthStart = startOfMonth(new Date(displayMonth + '-01'))
  const monthEnd = endOfMonth(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const getShiftBadge = (type: ShiftSlot['type']) => {
    switch (type) {
      case 'morning':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">午前</Badge>
      case 'afternoon':
        return <Badge className="bg-green-100 text-green-800 text-xs">午後</Badge>
      case 'full':
        return <Badge className="bg-purple-100 text-purple-800 text-xs">終日</Badge>
      case 'off':
        return <Badge variant="outline" className="text-xs">休み</Badge>
    }
  }
  
  const getShiftTime = (shift: ShiftSlot) => {
    if (shift.type === 'off') {
      return '休み'
    }
    return `${shift.startTime}-${shift.endTime}`
  }
  
  const activeStaff = staff.filter(s => s.isActive)
  
  // 日別のシフト状況を計算
  const dailyShiftStats = useMemo(() => {
    return days.map(day => {
      const dayShifts = shifts.filter(shift => 
        format(shift.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      const workingStaff = dayShifts.filter(shift => shift.type !== 'off').length
      const offStaff = dayShifts.filter(shift => shift.type === 'off').length
      
      return {
        date: day,
        workingStaff,
        offStaff,
        totalStaff: activeStaff.length,
        isWeekend: getDay(day) === 0 || getDay(day) === 6
      }
    })
  }, [days, shifts, activeStaff])
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-12">2024年12月</SelectItem>
                  <SelectItem value="2024-11">2024年11月</SelectItem>
                  <SelectItem value="2024-10">2024年10月</SelectItem>
                  <SelectItem value="2024-09">2024年9月</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={viewMode} onValueChange={(value: 'current' | 'request') => setViewMode(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">確定シフト</SelectItem>
                <SelectItem value="request">希望シフト</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="ml-auto">
              <Edit3 className="h-4 w-4 mr-2" />
              シフト編集
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {format(new Date(displayMonth + '-01'), 'yyyy年MM月', { locale: ja })}
            {viewMode === 'request' ? '希望シフト' : '確定シフト'}
          </CardTitle>
          <CardDescription>
            日別の出勤予定スタッフ数
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div key={day} className={`text-center font-medium p-2 ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
              }`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {dailyShiftStats.map((stat) => (
              <div 
                key={format(stat.date, 'yyyy-MM-dd')} 
                className={`p-3 border rounded-lg text-center ${
                  stat.isWeekend ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div className={`font-medium ${
                  stat.isWeekend ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(stat.date, 'd')}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  出勤: {stat.workingStaff}名
                </div>
                <div className="text-xs text-gray-400">
                  休み: {stat.offStaff}名
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Shift Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            詳細シフト表
          </CardTitle>
          <CardDescription>
            スタッフ別の詳細なシフト予定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeStaff.map((staffMember) => {
              const staffShifts = shifts.filter(shift => shift.staffId === staffMember.id)
              
              return (
                <div key={staffMember.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {staffMember.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{staffMember.name}</p>
                      <p className="text-sm text-gray-500">
                        {staffMember.role === 'admin' ? '管理者' :
                         staffMember.role === 'manager' ? 'マネージャー' :
                         staffMember.role === 'staff' ? 'スタッフ' : '研修生'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {staffShifts.slice(0, 7).map((shift) => (
                      <div key={shift.id} className="text-center p-2 border rounded">
                        <div className="text-sm font-medium">
                          {format(shift.date, 'd')}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          {format(shift.date, 'E', { locale: ja })}
                        </div>
                        {getShiftBadge(shift.type)}
                        <div className="text-xs mt-1">
                          {getShiftTime(shift)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    勤務予定: {staffShifts.filter(s => s.type !== 'off').length}日 / 
                    休み: {staffShifts.filter(s => s.type === 'off').length}日
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {viewMode === 'request' && (
        <Card>
          <CardHeader>
            <CardTitle>希望シフト提出状況</CardTitle>
            <CardDescription>
              来月のシフト希望の提出状況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeStaff.map((staffMember) => (
                <div key={staffMember.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {staffMember.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{staffMember.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">提出済み</Badge>
                    <span className="text-sm text-gray-500">
                      {format(new Date(), 'MM/dd HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}