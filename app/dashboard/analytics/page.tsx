'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, PieChart, LineChart, Target } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">分析・レポート</h1>
        <p className="text-gray-600">データ分析とビジネスインサイト</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              売上分析
            </CardTitle>
            <CardDescription>売上トレンド分析</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              期間別売上推移、前年同期比較
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              顧客分析
            </CardTitle>
            <CardDescription>顧客行動分析</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              LTV分析、リピート率、RFM分析
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-purple-600" />
              予約分析
            </CardTitle>
            <CardDescription>予約動向分析</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              時間帯別予約数、予約率推移
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              パフォーマンス
            </CardTitle>
            <CardDescription>業績指標</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              スタッフ別売上、平均客単価
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>主要指標</CardTitle>
            <CardDescription>今月のビジネス指標</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">平均客単価</span>
              <span className="font-medium">¥8,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">リピート率</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">予約稼働率</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">月間新規顧客</span>
              <span className="font-medium">45名</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">詳細分析機能</h3>
            <p className="text-gray-600">
              この機能は開発中です。完成版では詳細なデータ分析とレポート機能が利用できます。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}