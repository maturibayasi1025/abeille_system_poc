'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Truck, AlertTriangle } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
        <p className="text-gray-600">商品在庫と発注管理</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              商品一覧
            </CardTitle>
            <CardDescription>商品情報管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              商品マスタ、価格設定、カテゴリ管理
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              在庫管理
            </CardTitle>
            <CardDescription>在庫数の確認・更新</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              在庫数表示、在庫履歴、棚卸し機能
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              発注管理
            </CardTitle>
            <CardDescription>発注処理と納期管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              発注書作成、仕入先管理、納期追跡
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              アラート
            </CardTitle>
            <CardDescription>在庫不足通知</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              安全在庫設定、自動発注アラート
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>在庫状況</CardTitle>
            <CardDescription>現在の在庫状況</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">総商品数</span>
              <span className="font-medium">127品目</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">在庫切れ</span>
              <span className="font-medium text-red-600">3品目</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">要発注</span>
              <span className="font-medium text-yellow-600">8品目</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">適正在庫</span>
              <span className="font-medium text-green-600">116品目</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">商品管理機能</h3>
            <p className="text-gray-600">
              この機能は開発中です。完成版では詳細な商品・在庫管理機能が利用できます。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}