'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, Clock, Calendar, Award } from 'lucide-react'

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">スタッフ管理</h1>
        <p className="text-gray-600">スタッフ情報と勤怠管理</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              スタッフ一覧
            </CardTitle>
            <CardDescription>スタッフ情報管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              スタッフの基本情報、スキル、役職管理
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              勤怠管理
            </CardTitle>
            <CardDescription>出退勤記録</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              打刻機能、勤務時間集計、月次レポート
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              シフト管理
            </CardTitle>
            <CardDescription>シフト作成・調整</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              月間シフト表、希望シフト入力
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              教育・スキル
            </CardTitle>
            <CardDescription>研修記録</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              研修履歴、スキル習得状況
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">スタッフ管理機能</h3>
          <p className="text-gray-600">
            この機能は開発中です。完成版では詳細なスタッフ管理と勤怠システムが利用できます。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}