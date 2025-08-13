'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { UserCheck, Plus, Search, Mail, Phone, Calendar, Award, TrendingUp, Clock } from 'lucide-react'
import { useStaffStore } from '@/lib/store/staffStore'
import { useSalesStore } from '@/lib/store/salesStore'
import { useReservationStore } from '@/lib/store/reservationStore'
import { StaffForm } from '@/components/forms/staff-form'
import { AttendanceManagement } from '@/components/staff/attendance-management'
import { ShiftManagement } from '@/components/staff/shift-management'
import { format, differenceInMonths } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function StaffPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('list')
  
  const { staff, loading: staffLoading, loadStaff } = useStaffStore()
  const { visits, loadVisits } = useSalesStore()
  const { reservations, loadReservations } = useReservationStore()
  
  useEffect(() => {
    Promise.all([loadStaff(), loadVisits(), loadReservations()])
  }, [loadStaff, loadVisits, loadReservations])
  
  const filteredStaff = useMemo(() => {
    if (!search) return staff
    const lowerSearch = search.toLowerCase()
    return staff.filter(s => 
      s.name.toLowerCase().includes(lowerSearch) ||
      s.email.toLowerCase().includes(lowerSearch) ||
      s.role.toLowerCase().includes(lowerSearch)
    )
  }, [staff, search])
  
  const staffMetrics = useMemo(() => {
    return staff.map(staffMember => {
      const staffVisits = visits.filter(visit => visit.staffId === staffMember.id)
      const staffReservations = reservations.filter(res => res.staffId === staffMember.id)
      const totalSales = staffVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      const experienceMonths = differenceInMonths(new Date(), staffMember.hireDate)
      
      return {
        ...staffMember,
        totalSales,
        visitCount: staffVisits.length,
        reservationCount: staffReservations.length,
        averageOrderValue: staffVisits.length > 0 ? totalSales / staffVisits.length : 0,
        experienceMonths
      }
    })
  }, [staff, visits, reservations])
  
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
  
  const getSkillColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800'
      case 'advanced':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-green-100 text-green-800'
      case 'beginner':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getSkillLabel = (level: string) => {
    switch (level) {
      case 'expert':
        return 'エキスパート'
      case 'advanced':
        return '上級'
      case 'intermediate':
        return '中級'
      case 'beginner':
        return '初級'
      default:
        return level
    }
  }
  
  const handleStaffClick = (staffId: string) => {
    setSelectedStaff(staffId)
    setShowForm(true)
  }
  
  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedStaff(null)
  }
  
  const activeStaff = filteredStaff.filter(s => s.isActive)
  const inactiveStaff = filteredStaff.filter(s => !s.isActive)
  
  if (staffLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">スタッフデータを読み込み中...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">スタッフ管理</h1>
          <p className="text-gray-600">スタッフ情報と勤怠管理</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規スタッフ登録
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">スタッフ一覧</TabsTrigger>
          <TabsTrigger value="attendance">勤怠管理</TabsTrigger>
          <TabsTrigger value="shift">シフト管理</TabsTrigger>
          <TabsTrigger value="performance">実績管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="スタッフ名、メールアドレス、役職で検索..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCheck className="h-4 w-4" />
                  アクティブ: {activeStaff.length}名
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Staff Grid - Active */}
          <div>
            <h2 className="text-xl font-semibold mb-4">アクティブスタッフ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeStaff.map((staffMember) => {
                const metrics = staffMetrics.find(m => m.id === staffMember.id)
                
                return (
                  <Card 
                    key={staffMember.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStaffClick(staffMember.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {staffMember.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{staffMember.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleColor(staffMember.role)}>
                              {getRoleLabel(staffMember.role)}
                            </Badge>
                            {!staffMember.isActive && (
                              <Badge variant="secondary">非アクティブ</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {staffMember.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {staffMember.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          入社: {format(staffMember.hireDate, 'yyyy/MM/dd', { locale: ja })}
                          <span className="text-xs">({metrics?.experienceMonths}ヶ月)</span>
                        </div>
                      </div>
                      
                      {/* Skills */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">スキル</p>
                        <div className="flex flex-wrap gap-1">
                          {staffMember.skills.slice(0, 3).map((skill) => (
                            <Badge 
                              key={skill.id} 
                              variant="outline" 
                              className={`text-xs ${getSkillColor(skill.level)}`}
                            >
                              {skill.name} ({getSkillLabel(skill.level)})
                            </Badge>
                          ))}
                          {staffMember.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{staffMember.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">売上</span>
                          </div>
                          <p className="text-lg font-bold">¥{(metrics?.totalSales || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-600">
                            <UserCheck className="h-4 w-4" />
                            <span className="text-sm font-medium">来店数</span>
                          </div>
                          <p className="text-lg font-bold">{metrics?.visitCount || 0}件</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
          
          {/* Staff Grid - Inactive */}
          {inactiveStaff.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-500">非アクティブスタッフ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                {inactiveStaff.map((staffMember) => (
                  <Card 
                    key={staffMember.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStaffClick(staffMember.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                            {staffMember.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-600">{staffMember.name}</CardTitle>
                          <Badge variant="secondary">非アクティブ</Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attendance">
          <AttendanceManagement />
        </TabsContent>
        
        <TabsContent value="shift">
          <ShiftManagement />
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                スタッフ実績管理
              </CardTitle>
              <CardDescription>スタッフの売上実績と評価管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMetrics
                  .filter(s => s.isActive)
                  .sort((a, b) => b.totalSales - a.totalSales)
                  .map((staff, index) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                        <Avatar>
                          <AvatarFallback>
                            {staff.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-gray-500">
                            {getRoleLabel(staff.role)} • 経験{staff.experienceMonths}ヶ月
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">¥{staff.totalSales.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {staff.visitCount}件 • 平均¥{Math.round(staff.averageOrderValue).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          staffId={selectedStaff}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}