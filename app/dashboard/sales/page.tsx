'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react'

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">売上管理</h1>
        <p className="text-gray-600">売上データの管理と分析</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              売上概要
            </CardTitle>
            <CardDescription>売上データの概要表示</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              売上データの一覧表示、期間別フィルタリング機能
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              売上分析
            </CardTitle>
            <CardDescription>グラフとチャートによる分析</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              月次・年次売上グラフ、スタッフ別売上比較
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              目標管理
            </CardTitle>
            <CardDescription>売上目標の設定と進捗管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              月次目標設定、達成率の可視化
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">売上管理機能</h3>
          <p className="text-gray-600">
            この機能は開発中です。完成版では詳細な売上データの管理と分析機能が利用できます。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}