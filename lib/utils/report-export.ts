import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

// 日本語フォント対応のためのヘルパー関数
const addJapaneseText = (pdf: jsPDF, text: string, x: number, y: number, options?: { 
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  align?: 'left' | 'center' | 'right'
}) => {
  const fontSize = options?.fontSize || 12
  const fontWeight = options?.fontWeight || 'normal'
  const align = options?.align || 'left'
  
  pdf.setFontSize(fontSize)
  if (fontWeight === 'bold') {
    pdf.setFont('helvetica', 'bold')
  } else {
    pdf.setFont('helvetica', 'normal')
  }
  
  pdf.text(text, x, y, { align })
}

export interface CustomerAnalysisData {
  id: string
  name: string
  ltv: number
  visitCount: number
  segment: string
  lastVisit: Date | null
}

export interface SalesAnalysisData {
  period: string
  totalSales: number
  visitCount: number
  customerCount: number
  avgOrderValue: number
}

export interface StaffPerformanceData {
  id: string
  name: string
  totalSales: number
  visitCount: number
  avgOrderValue: number
  targetAchievement: number
}

export interface MonthlySummaryData {
  totalSales: number
  totalVisits: number
  totalCustomers: number
  newCustomers: number
  repeatRate: number
  avgLTV: number
  topMenus: { name: string; sales: number; count: number }[]
  topStaff: { name: string; sales: number }[]
}

// 顧客分析レポート（PDF）
export const exportCustomerAnalysisPDF = (data: CustomerAnalysisData[]) => {
  const pdf = new jsPDF()
  
  // ヘッダー
  addJapaneseText(pdf, '顧客分析レポート', 20, 20, { fontSize: 16, fontWeight: 'bold' })
  addJapaneseText(pdf, `出力日: ${format(new Date(), 'yyyy年MM月dd日', { locale: ja })}`, 20, 30)
  
  // サマリー
  const totalCustomers = data.length
  const avgLTV = data.reduce((sum, c) => sum + c.ltv, 0) / totalCustomers
  const vipCustomers = data.filter(c => c.ltv >= 50000).length
  
  addJapaneseText(pdf, 'サマリー', 20, 50, { fontSize: 14, fontWeight: 'bold' })
  addJapaneseText(pdf, `総顧客数: ${totalCustomers}名`, 25, 60)
  addJapaneseText(pdf, `平均LTV: ¥${Math.round(avgLTV).toLocaleString()}`, 25, 70)
  addJapaneseText(pdf, `VIP顧客（5万円以上）: ${vipCustomers}名`, 25, 80)
  
  // 上位顧客リスト
  addJapaneseText(pdf, '上位顧客（LTV順）', 20, 100, { fontSize: 14, fontWeight: 'bold' })
  
  let y = 115
  data.slice(0, 15).forEach((customer, index) => {
    if (y > 270) {
      pdf.addPage()
      y = 20
    }
    
    const rank = index + 1
    const text = `${rank}. ${customer.name} - LTV: ¥${customer.ltv.toLocaleString()} (${customer.visitCount}回来店)`
    addJapaneseText(pdf, text, 25, y)
    y += 10
  })
  
  // セグメント分析
  const segments = ['Champions', 'Loyal Customers', 'New Customers', 'At Risk', 'Potential Loyalists', 'Lost']
  const segmentCounts = segments.map(segment => ({
    segment,
    count: data.filter(c => c.segment === segment).length
  }))
  
  if (y > 200) {
    pdf.addPage()
    y = 20
  }
  
  addJapaneseText(pdf, 'セグメント分析', 20, y, { fontSize: 14, fontWeight: 'bold' })
  y += 15
  
  segmentCounts.forEach(({ segment, count }) => {
    const segmentLabel = getSegmentLabel(segment)
    addJapaneseText(pdf, `${segmentLabel}: ${count}名`, 25, y)
    y += 10
  })
  
  pdf.save(`customer-analysis-${format(new Date(), 'yyyyMMdd')}.pdf`)
}

// 売上分析レポート（Excel）
export const exportSalesAnalysisExcel = (data: SalesAnalysisData[]) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map(item => ({
      '期間': item.period,
      '売上金額': item.totalSales,
      '来店数': item.visitCount,
      '顧客数': item.customerCount,
      '平均客単価': Math.round(item.avgOrderValue)
    }))
  )
  
  // ヘッダーのスタイリング
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!ws[cellAddress]) continue
    ws[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'CCCCCC' } }
    }
  }
  
  // 列幅の調整
  ws['!cols'] = [
    { wch: 12 }, // 期間
    { wch: 15 }, // 売上金額
    { wch: 10 }, // 来店数
    { wch: 10 }, // 顧客数
    { wch: 12 }  // 平均客単価
  ]
  
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '売上分析')
  
  // サマリーシートを追加
  const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0)
  const totalVisits = data.reduce((sum, item) => sum + item.visitCount, 0)
  const avgSales = totalSales / data.length
  
  const summaryData = [
    { '項目': '期間', '値': `${data[0]?.period} - ${data[data.length - 1]?.period}` },
    { '項目': '総売上', '値': `¥${totalSales.toLocaleString()}` },
    { '項目': '総来店数', '値': `${totalVisits}回` },
    { '項目': '月平均売上', '値': `¥${Math.round(avgSales).toLocaleString()}` }
  ]
  
  const summaryWs = XLSX.utils.json_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summaryWs, 'サマリー')
  
  XLSX.writeFile(wb, `sales-analysis-${format(new Date(), 'yyyyMMdd')}.xlsx`)
}

// スタッフ実績レポート（PDF）
export const exportStaffPerformancePDF = (data: StaffPerformanceData[]) => {
  const pdf = new jsPDF()
  
  // ヘッダー
  addJapaneseText(pdf, 'スタッフ実績レポート', 20, 20, { fontSize: 16, fontWeight: 'bold' })
  addJapaneseText(pdf, `出力日: ${format(new Date(), 'yyyy年MM月dd日', { locale: ja })}`, 20, 30)
  
  // 総合サマリー
  const totalSales = data.reduce((sum, s) => sum + s.totalSales, 0)
  const avgSales = totalSales / data.length
  const topPerformer = data.sort((a, b) => b.totalSales - a.totalSales)[0]
  
  addJapaneseText(pdf, '総合実績', 20, 50, { fontSize: 14, fontWeight: 'bold' })
  addJapaneseText(pdf, `総売上: ¥${totalSales.toLocaleString()}`, 25, 60)
  addJapaneseText(pdf, `スタッフ平均売上: ¥${Math.round(avgSales).toLocaleString()}`, 25, 70)
  addJapaneseText(pdf, `トップパフォーマー: ${topPerformer?.name}`, 25, 80)
  
  // スタッフ別詳細
  addJapaneseText(pdf, 'スタッフ別実績', 20, 100, { fontSize: 14, fontWeight: 'bold' })
  
  let y = 115
  data.sort((a, b) => b.totalSales - a.totalSales).forEach((staff, index) => {
    if (y > 260) {
      pdf.addPage()
      y = 20
    }
    
    const rank = index + 1
    addJapaneseText(pdf, `${rank}. ${staff.name}`, 25, y, { fontWeight: 'bold' })
    addJapaneseText(pdf, `   売上: ¥${staff.totalSales.toLocaleString()}`, 30, y + 8)
    addJapaneseText(pdf, `   来店対応: ${staff.visitCount}回`, 30, y + 16)
    addJapaneseText(pdf, `   平均客単価: ¥${Math.round(staff.avgOrderValue).toLocaleString()}`, 30, y + 24)
    addJapaneseText(pdf, `   目標達成率: ${staff.targetAchievement.toFixed(1)}%`, 30, y + 32)
    
    y += 45
  })
  
  pdf.save(`staff-performance-${format(new Date(), 'yyyyMMdd')}.pdf`)
}

// 月次サマリーレポート（PDF）
export const exportMonthlySummaryPDF = (data: MonthlySummaryData) => {
  const pdf = new jsPDF()
  
  // ヘッダー
  addJapaneseText(pdf, '月次サマリーレポート', 20, 20, { fontSize: 16, fontWeight: 'bold' })
  addJapaneseText(pdf, `出力日: ${format(new Date(), 'yyyy年MM月dd日', { locale: ja })}`, 20, 30)
  
  // 主要指標
  addJapaneseText(pdf, '主要指標', 20, 50, { fontSize: 14, fontWeight: 'bold' })
  addJapaneseText(pdf, `総売上: ¥${data.totalSales.toLocaleString()}`, 25, 65)
  addJapaneseText(pdf, `総来店数: ${data.totalVisits}回`, 25, 75)
  addJapaneseText(pdf, `総顧客数: ${data.totalCustomers}名`, 25, 85)
  addJapaneseText(pdf, `新規顧客: ${data.newCustomers}名`, 25, 95)
  addJapaneseText(pdf, `リピート率: ${data.repeatRate.toFixed(1)}%`, 25, 105)
  addJapaneseText(pdf, `平均LTV: ¥${Math.round(data.avgLTV).toLocaleString()}`, 25, 115)
  
  // 人気メニュー
  addJapaneseText(pdf, '人気メニューTOP5', 20, 135, { fontSize: 14, fontWeight: 'bold' })
  let y = 150
  data.topMenus.slice(0, 5).forEach((menu, index) => {
    addJapaneseText(pdf, `${index + 1}. ${menu.name} - ¥${menu.sales.toLocaleString()} (${menu.count}件)`, 25, y)
    y += 10
  })
  
  // トップスタッフ
  addJapaneseText(pdf, 'スタッフランキングTOP5', 20, y + 15, { fontSize: 14, fontWeight: 'bold' })
  y += 30
  data.topStaff.slice(0, 5).forEach((staff, index) => {
    addJapaneseText(pdf, `${index + 1}. ${staff.name} - ¥${staff.sales.toLocaleString()}`, 25, y)
    y += 10
  })
  
  pdf.save(`monthly-summary-${format(new Date(), 'yyyyMMdd')}.pdf`)
}

// CSV形式でのエクスポート
export const exportToCSV = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data)
  const csv = XLSX.utils.sheet_to_csv(ws)
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${format(new Date(), 'yyyyMMdd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// セグメントラベルのヘルパー関数
const getSegmentLabel = (segment: string): string => {
  const labels: Record<string, string> = {
    'Champions': 'チャンピオン',
    'Loyal Customers': 'ロイヤル顧客',
    'New Customers': '新規顧客',
    'At Risk': 'リスク顧客',
    'Potential Loyalists': '潜在ロイヤル',
    'Lost': '離脱顧客'
  }
  return labels[segment] || segment
}