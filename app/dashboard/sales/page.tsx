'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, Users, Calendar, Target, BarChart3 } from 'lucide-react'
import { useSalesStore } from '@/lib/store/salesStore'
import { useStaffStore } from '@/lib/store/staffStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { SalesChart } from '@/components/charts/sales-chart'
import { StaffSalesRanking } from '@/components/charts/staff-sales-ranking'
import { MenuSalesChart } from '@/components/charts/menu-sales-chart'
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'

type DateRange = '7days' | '30days' | '3months' | '1year'

export default function SalesPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30days')
  const [loading, setLoading] = useState(true)
  
  const { visits, loadVisits, getVisitsByDateRange } = useSalesStore()
  const { staff, loadStaff } = useStaffStore()
  const { customers, loadCustomers } = useCustomerStore()
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadVisits(), loadStaff(), loadCustomers()])
      setLoading(false)
    }
    loadData()
  }, [loadVisits, loadStaff, loadCustomers])
  
  const { startDate, endDate } = useMemo(() => {
    const end = endOfDay(new Date())
    let start: Date
    
    switch (dateRange) {
      case '7days':
        start = startOfDay(subDays(end, 6))
        break
      case '30days':
        start = startOfDay(subDays(end, 29))
        break
      case '3months':
        start = startOfMonth(subMonths(end, 2))
        break
      case '1year':
        start = startOfMonth(subMonths(end, 11))
        break
      default:
        start = startOfDay(subDays(end, 29))
    }
    
    return { startDate: start, endDate: end }
  }, [dateRange])
  
  const filteredVisits = useMemo(() => {
    return getVisitsByDateRange(startDate, endDate)
  }, [getVisitsByDateRange, startDate, endDate])
  
  const salesMetrics = useMemo(() => {
    const totalSales = filteredVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
    const totalCustomers = new Set(filteredVisits.map(visit => visit.customerId)).size
    const averageOrderValue = filteredVisits.length > 0 ? totalSales / filteredVisits.length : 0
    const repeatCustomers = customers.filter(customer => 
      filteredVisits.filter(visit => visit.customerId === customer.id).length > 1
    ).length
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0
    
    // 前期比較（同じ期間分前）
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const prevStartDate = subDays(startDate, daysDiff + 1)
    const prevEndDate = subDays(endDate, daysDiff + 1)
    const prevVisits = getVisitsByDateRange(prevStartDate, prevEndDate)
    const prevTotalSales = prevVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
    const salesGrowth = prevTotalSales > 0 ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 : 0
    
    return {
      totalSales,
      totalCustomers,
      averageOrderValue,
      repeatRate,
      salesGrowth,
      visitCount: filteredVisits.length
    }
  }, [filteredVisits, customers, startDate, endDate, getVisitsByDateRange])
  
  const dateRangeLabels = {
    '7days': '過去7日間',
    '30days': '過去30日間',
    '3months': '過去3ヶ月',
    '1year': '過去1年間'
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">売上データを読み込み中...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">売上管理</h1>
          <p className="text-gray-600">売上データの管理と分析</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(dateRangeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Sales Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{salesMetrics.totalSales.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {salesMetrics.salesGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                  )}
                  <span className={`text-sm ${salesMetrics.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {salesMetrics.salesGrowth >= 0 ? '+' : ''}{salesMetrics.salesGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">来店客数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salesMetrics.totalCustomers.toLocaleString()}人
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {salesMetrics.visitCount}回来店
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均客単価</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{Math.round(salesMetrics.averageOrderValue).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  1回あたり
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">リピート率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salesMetrics.repeatRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  複数回来店の割合
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              売上推移
            </CardTitle>
            <CardDescription>
              {format(startDate, 'yyyy/MM/dd', { locale: ja })} - {format(endDate, 'yyyy/MM/dd', { locale: ja })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart visits={filteredVisits} dateRange={dateRange} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              スタッフ別売上ランキング
            </CardTitle>
            <CardDescription>
              {dateRangeLabels[dateRange]}の実績
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StaffSalesRanking visits={filteredVisits} staff={staff} />
          </CardContent>
        </Card>
      </div>
      
      {/* Menu Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            メニュー別売上構成
          </CardTitle>
          <CardDescription>
            {dateRangeLabels[dateRange]}のメニュー別売上比率
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MenuSalesChart visits={filteredVisits} />
        </CardContent>
      </Card>
      
      {/* Recent Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>最近の売上記録</CardTitle>
          <CardDescription>最新20件の来店記録</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVisits.slice(0, 20).map((visit) => {
              const customer = customers.find(c => c.id === visit.customerId)
              const staffMember = staff.find(s => s.id === visit.staffId)
              
              return (
                <div key={visit.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{customer?.name || '不明な顧客'}</p>
                        <p className="text-sm text-gray-500">
                          {format(visit.visitDate, 'yyyy/MM/dd HH:mm', { locale: ja })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {visit.menuItems.map((menu, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {menu.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">¥{visit.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{staffMember?.name || '不明なスタッフ'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}