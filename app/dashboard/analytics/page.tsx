'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, PieChart, LineChart, Target, TrendingUp, Users, Download, Calendar } from 'lucide-react'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useSalesStore } from '@/lib/store/salesStore'
import { useStaffStore } from '@/lib/store/staffStore'
import { CustomerLTVChart } from '@/components/charts/customer-ltv-chart'
import { RFMAnalysisChart } from '@/components/charts/rfm-analysis-chart'
import { SalesTrendChart } from '@/components/charts/sales-trend-chart'
import { format, subMonths, differenceInDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  exportCustomerAnalysisPDF,
  exportSalesAnalysisExcel,
  exportStaffPerformancePDF,
  exportMonthlySummaryPDF,
  type CustomerAnalysisData,
  type SalesAnalysisData,
  type StaffPerformanceData,
  type MonthlySummaryData
} from '@/lib/utils/report-export'

type AnalyticsTab = 'overview' | 'customer' | 'sales' | 'reports'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview')
  const [dateRange, setDateRange] = useState('6months')
  const [loading, setLoading] = useState(true)
  
  const { customers, loadCustomers } = useCustomerStore()
  const { visits, loadVisits } = useSalesStore()
  const { staff, loadStaff } = useStaffStore()
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadCustomers(), loadVisits(), loadStaff()])
      setLoading(false)
    }
    loadData()
  }, [loadCustomers, loadVisits, loadStaff])
  
  // LTV分析
  const customerLTV = useMemo(() => {
    return customers.map(customer => {
      const customerVisits = visits.filter(visit => visit.customerId === customer.id)
      const totalSpent = customerVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      const visitCount = customerVisits.length
      const averageOrderValue = visitCount > 0 ? totalSpent / visitCount : 0
      
      // 初回来店から最終来店までの期間（日数）
      if (customerVisits.length > 0) {
        const sortedVisits = customerVisits.sort((a, b) => a.visitDate.getTime() - b.visitDate.getTime())
        const firstVisit = sortedVisits[0].visitDate
        const lastVisit = sortedVisits[sortedVisits.length - 1].visitDate
        const daysSinceFirst = differenceInDays(lastVisit, firstVisit) || 1
        const frequency = visitCount / (daysSinceFirst / 30) // 月あたりの来店頻度
        
        return {
          ...customer,
          ltv: totalSpent,
          visitCount,
          averageOrderValue,
          frequency,
          daysSinceFirst,
          lastVisitDate: lastVisit
        }
      }
      
      return {
        ...customer,
        ltv: 0,
        visitCount: 0,
        averageOrderValue: 0,
        frequency: 0,
        daysSinceFirst: 0,
        lastVisitDate: null
      }
    }).sort((a, b) => b.ltv - a.ltv)
  }, [customers, visits])
  
  // RFM分析
  const rfmAnalysis = useMemo(() => {
    const now = new Date()
    
    return customerLTV.map(customer => {
      // Recency: 最終来店からの日数
      const recency = customer.lastVisitDate 
        ? differenceInDays(now, customer.lastVisitDate)
        : 999
      
      // Frequency: 来店頻度
      const frequency = customer.visitCount
      
      // Monetary: 総購入金額
      const monetary = customer.ltv
      
      // スコア計算（1-5のスケール）
      const recencyScore = recency <= 30 ? 5 : recency <= 90 ? 4 : recency <= 180 ? 3 : recency <= 365 ? 2 : 1
      const frequencyScore = frequency >= 10 ? 5 : frequency >= 5 ? 4 : frequency >= 3 ? 3 : frequency >= 2 ? 2 : 1
      const monetaryScore = monetary >= 100000 ? 5 : monetary >= 50000 ? 4 : monetary >= 20000 ? 3 : monetary >= 10000 ? 2 : 1
      
      // セグメント分類
      let segment = 'Lost'
      if (recencyScore >= 4 && frequencyScore >= 4 && monetaryScore >= 4) {
        segment = 'Champions'
      } else if (recencyScore >= 3 && frequencyScore >= 3 && monetaryScore >= 3) {
        segment = 'Loyal Customers'
      } else if (recencyScore >= 4 && frequencyScore <= 2) {
        segment = 'New Customers'
      } else if (recencyScore <= 2 && frequencyScore >= 3) {
        segment = 'At Risk'
      } else if (recencyScore >= 3 && monetaryScore <= 2) {
        segment = 'Potential Loyalists'
      }
      
      return {
        ...customer,
        recency,
        frequency,
        monetary,
        recencyScore,
        frequencyScore,
        monetaryScore,
        segment
      }
    })
  }, [customerLTV])
  
  // セグメント別集計
  const segmentStats = useMemo(() => {
    const segments = ['Champions', 'Loyal Customers', 'New Customers', 'At Risk', 'Potential Loyalists', 'Lost']
    return segments.map(segment => {
      const segmentCustomers = rfmAnalysis.filter(c => c.segment === segment)
      const totalRevenue = segmentCustomers.reduce((sum, c) => sum + c.ltv, 0)
      const avgLTV = segmentCustomers.length > 0 ? totalRevenue / segmentCustomers.length : 0
      
      return {
        segment,
        count: segmentCustomers.length,
        totalRevenue,
        avgLTV,
        percentage: customers.length > 0 ? (segmentCustomers.length / customers.length) * 100 : 0
      }
    })
  }, [rfmAnalysis, customers.length])
  
  // 売上トレンド分析
  const salesTrend = useMemo(() => {
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthVisits = visits.filter(visit => 
        visit.visitDate.getFullYear() === date.getFullYear() &&
        visit.visitDate.getMonth() === date.getMonth()
      )
      
      const totalSales = monthVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      const customerCount = new Set(monthVisits.map(visit => visit.customerId)).size
      const avgOrderValue = monthVisits.length > 0 ? totalSales / monthVisits.length : 0
      
      months.push({
        month: format(date, 'yyyy-MM'),
        monthLabel: format(date, 'yyyy年MM月', { locale: ja }),
        totalSales,
        visitCount: monthVisits.length,
        customerCount,
        avgOrderValue
      })
    }
    return months
  }, [visits])
  
  // 主要指標
  const keyMetrics = useMemo(() => {
    const totalRevenue = visits.reduce((sum, visit) => sum + visit.totalAmount, 0)
    const totalCustomers = customers.length
    const totalVisits = visits.length
    const avgLTV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
    const avgOrderValue = totalVisits > 0 ? totalRevenue / totalVisits : 0
    const repeatCustomers = customerLTV.filter(c => c.visitCount > 1).length
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0
    
    return {
      totalRevenue,
      totalCustomers,
      totalVisits,
      avgLTV,
      avgOrderValue,
      repeatRate
    }
  }, [visits, customers, customerLTV])
  
  // Export handlers
  const handleExportCustomerAnalysis = () => {
    const customerData: CustomerAnalysisData[] = customerLTV.map(customer => ({
      id: customer.id,
      name: customer.name,
      ltv: customer.ltv,
      visitCount: customer.visitCount,
      segment: rfmAnalysis.find(r => r.id === customer.id)?.segment || 'Unknown',
      lastVisit: customer.lastVisitDate
    }))
    exportCustomerAnalysisPDF(customerData)
  }
  
  const handleExportSalesAnalysis = () => {
    const salesData: SalesAnalysisData[] = salesTrend.map(trend => ({
      period: trend.monthLabel,
      totalSales: trend.totalSales,
      visitCount: trend.visitCount,
      customerCount: trend.customerCount,
      avgOrderValue: trend.avgOrderValue
    }))
    exportSalesAnalysisExcel(salesData)
  }
  
  const handleExportStaffPerformance = () => {
    const staffData: StaffPerformanceData[] = staff.filter(s => s.isActive).map(staffMember => {
      const staffVisits = visits.filter(visit => visit.staffId === staffMember.id)
      const totalSales = staffVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      const avgOrderValue = staffVisits.length > 0 ? totalSales / staffVisits.length : 0
      const targetAchievement = (totalSales / 100000) * 100 // 仮の目標額10万円
      
      return {
        id: staffMember.id,
        name: staffMember.name,
        totalSales,
        visitCount: staffVisits.length,
        avgOrderValue,
        targetAchievement
      }
    })
    exportStaffPerformancePDF(staffData)
  }
  
  const handleExportMonthlySummary = () => {
    const newCustomers = customers.filter(customer => {
      const firstVisit = visits
        .filter(visit => visit.customerId === customer.id)
        .sort((a, b) => a.visitDate.getTime() - b.visitDate.getTime())[0]
      return firstVisit && firstVisit.visitDate.getMonth() === new Date().getMonth()
    }).length
    
    // Top menus (mock data for now)
    const topMenus = [
      { name: 'カット', sales: 500000, count: 200 },
      { name: 'カラー', sales: 400000, count: 150 },
      { name: 'パーマ', sales: 300000, count: 100 },
      { name: 'トリートメント', sales: 200000, count: 80 },
      { name: 'ヘッドスパ', sales: 150000, count: 60 }
    ]
    
    const topStaff = staff.filter(s => s.isActive).map(staffMember => {
      const staffVisits = visits.filter(visit => visit.staffId === staffMember.id)
      const totalSales = staffVisits.reduce((sum, visit) => sum + visit.totalAmount, 0)
      return { name: staffMember.name, sales: totalSales }
    }).sort((a, b) => b.sales - a.sales)
    
    const summaryData: MonthlySummaryData = {
      totalSales: keyMetrics.totalRevenue,
      totalVisits: keyMetrics.totalVisits,
      totalCustomers: keyMetrics.totalCustomers,
      newCustomers,
      repeatRate: keyMetrics.repeatRate,
      avgLTV: keyMetrics.avgLTV,
      topMenus,
      topStaff
    }
    
    exportMonthlySummaryPDF(summaryData)
  }
  
  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Champions':
        return 'bg-purple-100 text-purple-800'
      case 'Loyal Customers':
        return 'bg-green-100 text-green-800'
      case 'New Customers':
        return 'bg-blue-100 text-blue-800'
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'Potential Loyalists':
        return 'bg-indigo-100 text-indigo-800'
      case 'Lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">分析データを読み込み中...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分析・レポート</h1>
          <p className="text-gray-600">データ分析とビジネスインサイト</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setActiveTab('reports')}
        >
          <Download className="h-4 w-4" />
          レポート出力
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalyticsTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="customer">顧客分析</TabsTrigger>
          <TabsTrigger value="sales">売上分析</TabsTrigger>
          <TabsTrigger value="reports">レポート</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">総売上</p>
                    <p className="text-2xl font-bold">¥{keyMetrics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均LTV</p>
                    <p className="text-2xl font-bold">¥{Math.round(keyMetrics.avgLTV).toLocaleString()}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">リピート率</p>
                    <p className="text-2xl font-bold">{keyMetrics.repeatRate.toFixed(1)}%</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>顧客セグメント分析</CardTitle>
              <CardDescription>RFM分析による顧客分類</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {segmentStats.map((stat) => (
                  <div key={stat.segment} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getSegmentColor(stat.segment)}>
                        {stat.segment}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {stat.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{stat.count}名</p>
                    <p className="text-sm text-gray-600">
                      平均LTV: ¥{Math.round(stat.avgLTV).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-6">
          <CustomerLTVChart customers={customerLTV.slice(0, 20)} />
          <RFMAnalysisChart rfmData={rfmAnalysis} />
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <SalesTrendChart salesData={salesTrend} />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                レポート出力
              </CardTitle>
              <CardDescription>
                各種レポートの出力とエクスポート機能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={handleExportCustomerAnalysis}
                >
                  <PieChart className="h-6 w-6" />
                  <span>顧客分析レポート</span>
                  <span className="text-xs text-gray-500">LTV・RFM分析（PDF）</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={handleExportSalesAnalysis}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>売上分析レポート</span>
                  <span className="text-xs text-gray-500">期間別・スタッフ別（Excel）</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={handleExportStaffPerformance}
                >
                  <Users className="h-6 w-6" />
                  <span>スタッフ実績レポート</span>
                  <span className="text-xs text-gray-500">個人別パフォーマンス（PDF）</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={handleExportMonthlySummary}
                >
                  <Calendar className="h-6 w-6" />
                  <span>月次サマリー</span>
                  <span className="text-xs text-gray-500">全体概要レポート（PDF）</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}