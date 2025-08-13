'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, CheckCircle, XCircle, Calendar, Timer } from 'lucide-react'
import { useStaffStore } from '@/lib/store/staffStore'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, addHours, setHours, setMinutes } from 'date-fns'
import { ja } from 'date-fns/locale'

interface AttendanceRecord {
  id: string
  staffId: string
  date: Date
  checkIn?: Date
  checkOut?: Date
  breakStart?: Date
  breakEnd?: Date
  status: 'present' | 'absent' | 'late' | 'early_leave'
  notes?: string
}

export function AttendanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [selectedStaff, setSelectedStaff] = useState<string>('all')
  
  const { staff } = useStaffStore()
  
  // モック勤怠データを生成
  const generateMockAttendance = (month: string): AttendanceRecord[] => {
    const monthStart = startOfMonth(new Date(month + '-01'))
    const monthEnd = endOfMonth(monthStart)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    const records: AttendanceRecord[] = []
    
    staff.filter(s => s.isActive).forEach(staffMember => {
      days.forEach(day => {
        if (!isWeekend(day)) { // 土日は除外
          const baseCheckIn = setHours(setMinutes(day, Math.floor(Math.random() * 15)), 9) // 9:00-9:15の間
          const workHours = 8 + Math.random() * 2 // 8-10時間勤務
          const baseCheckOut = addHours(baseCheckIn, workHours)
          
          const isLate = Math.random() < 0.1 // 10%の確率で遅刻
          const isEarlyLeave = Math.random() < 0.05 // 5%の確率で早退
          const isAbsent = Math.random() < 0.02 // 2%の確率で欠勤
          
          let status: AttendanceRecord['status'] = 'present'
          let checkIn = baseCheckIn
          let checkOut = baseCheckOut
          
          if (isAbsent) {
            status = 'absent'
            checkIn = undefined
            checkOut = undefined
          } else if (isLate) {
            status = 'late'
            checkIn = addHours(baseCheckIn, Math.random() * 2) // 最大2時間遅刻
          } else if (isEarlyLeave) {
            status = 'early_leave'
            checkOut = addHours(baseCheckOut, -Math.random() * 2) // 最大2時間早退
          }
          
          records.push({
            id: `${staffMember.id}-${format(day, 'yyyy-MM-dd')}`,
            staffId: staffMember.id,
            date: day,
            checkIn,
            checkOut,
            breakStart: checkIn ? addHours(checkIn, 4) : undefined, // 4時間後に休憩
            breakEnd: checkIn ? addHours(checkIn, 5) : undefined, // 1時間休憩
            status,
            notes: status === 'absent' ? '体調不良' : undefined
          })
        }
      })
    })
    
    return records
  }
  
  const attendanceData = useMemo(() => {
    return generateMockAttendance(selectedMonth)
  }, [selectedMonth, staff])
  
  const filteredData = useMemo(() => {
    if (selectedStaff === 'all') return attendanceData
    return attendanceData.filter(record => record.staffId === selectedStaff)
  }, [attendanceData, selectedStaff])
  
  const monthlyStats = useMemo(() => {
    const stats = new Map<string, {
      totalDays: number
      presentDays: number
      lateDays: number
      earlyLeaveDays: number
      absentDays: number
      totalHours: number
    }>()
    
    attendanceData.forEach(record => {
      const current = stats.get(record.staffId) || {
        totalDays: 0,
        presentDays: 0,
        lateDays: 0,
        earlyLeaveDays: 0,
        absentDays: 0,
        totalHours: 0
      }
      
      current.totalDays++
      
      switch (record.status) {
        case 'present':
          current.presentDays++
          break
        case 'late':
          current.lateDays++
          current.presentDays++
          break
        case 'early_leave':
          current.earlyLeaveDays++
          current.presentDays++
          break
        case 'absent':
          current.absentDays++
          break
      }
      
      if (record.checkIn && record.checkOut) {
        const workHours = (record.checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60)
        current.totalHours += workHours - 1 // 休憩時間1時間を除く
      }
      
      stats.set(record.staffId, current)
    })
    
    return stats
  }, [attendanceData])
  
  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">出勤</Badge>
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">遅刻</Badge>
      case 'early_leave':
        return <Badge className="bg-orange-100 text-orange-800">早退</Badge>
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">欠勤</Badge>
    }
  }
  
  const formatTime = (date: Date | undefined) => {
    return date ? format(date, 'HH:mm') : '--:--'
  }
  
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
            
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全スタッフ</SelectItem>
                {staff.filter(s => s.isActive).map(staffMember => (
                  <SelectItem key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly Summary */}
      {selectedStaff !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              月次サマリー
            </CardTitle>
            <CardDescription>
              {format(new Date(selectedMonth + '-01'), 'yyyy年MM月', { locale: ja })}の勤怠状況
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const stats = monthlyStats.get(selectedStaff)
              if (!stats) return <p>データがありません</p>
              
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalDays}</p>
                    <p className="text-sm text-gray-600">総勤務日数</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
                    <p className="text-sm text-gray-600">出勤日数</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.lateDays}</p>
                    <p className="text-sm text-gray-600">遅刻回数</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{stats.earlyLeaveDays}</p>
                    <p className="text-sm text-gray-600">早退回数</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
                    <p className="text-sm text-gray-600">欠勤日数</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(stats.totalHours)}</p>
                    <p className="text-sm text-gray-600">総労働時間</p>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
      
      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            勤怠記録
          </CardTitle>
          <CardDescription>
            {selectedStaff === 'all' ? '全スタッフ' : staff.find(s => s.id === selectedStaff)?.name}の勤怠記録
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.length === 0 ? (
              <p className="text-center py-8 text-gray-500">データがありません</p>
            ) : (
              filteredData.slice(0, 20).map((record) => {
                const staffMember = staff.find(s => s.id === record.staffId)
                
                return (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {selectedStaff === 'all' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {staffMember?.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          {selectedStaff === 'all' && (
                            <span className="font-medium">{staffMember?.name}</span>
                          )}
                          <span className="text-sm text-gray-600">
                            {format(record.date, 'MM/dd（E）', { locale: ja })}
                          </span>
                          {getStatusBadge(record.status)}
                        </div>
                        {record.notes && (
                          <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">出勤</p>
                        <p className="font-medium">{formatTime(record.checkIn)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">退勤</p>
                        <p className="font-medium">{formatTime(record.checkOut)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">労働時間</p>
                        <p className="font-medium">
                          {record.checkIn && record.checkOut
                            ? `${Math.round((record.checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60) - 1)}h`
                            : '--h'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}