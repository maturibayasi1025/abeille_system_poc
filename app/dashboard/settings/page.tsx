'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600">システム設定とアカウント管理</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              プロフィール
            </CardTitle>
            <CardDescription>アカウント情報の管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              個人情報、パスワード変更、プロフィール写真
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              通知設定
            </CardTitle>
            <CardDescription>通知の設定</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              予約リマインダー、システム通知の設定
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              権限管理
            </CardTitle>
            <CardDescription>ユーザー権限の設定</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              スタッフの権限設定、アクセス制御
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              データ管理
            </CardTitle>
            <CardDescription>データのバックアップ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              データエクスポート、インポート機能
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-yellow-600" />
              外観設定
            </CardTitle>
            <CardDescription>テーマとレイアウト</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              ダークモード、カラーテーマの変更
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              システム設定
            </CardTitle>
            <CardDescription>一般設定</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              営業時間、店舗情報、基本設定
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">設定機能</h3>
          <p className="text-gray-600">
            この機能は開発中です。完成版では詳細なシステム設定機能が利用できます。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}