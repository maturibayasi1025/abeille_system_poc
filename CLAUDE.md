# CLAUDE 美容サロン統合管理システム フロントエンドPoC仕様書

このファイルは、美容サロン向け統合管理システムのフロントエンドPoC開発時のClaude Codeへのガイダンスを提供します。

## 1. プロジェクト概要

### 開発方針
* **フロントエンドのみ**: バックエンドなしで動作するプロトタイプ
* **データ保存**: LocalStorage / IndexedDB使用
* **モックデータ**: リアルなダミーデータで動作確認
* **目的**: UI/UXの検証と機能の可視化

### 機能一覧（29機能）

#### 顧客管理
1. **カルテ管理**: 顧客基本情報、体質、施術履歴、写真管理
2. **来店履歴**: 来店日時、利用メニュー、担当スタッフ、支払金額
3. **次回来店予測**: 来店周期から次回来店時期を予測
4. **メッセージ機能**: 顧客との個別チャット

#### 売上管理
5. **目標管理**: スタッフ別売上目標設定と進捗管理
6. **売上データ**: 年次・月次・日次の売上集計とグラフ表示
7. **原価管理**: メニュー別原材料費と粗利計算
8. **経費管理**: 固定費・変動費の登録と可視化

#### 予約管理
9. **予約受付**: 複数チャネルからの予約を一元管理
10. **予約キャンセル**: キャンセル記録と理由管理
11. **予約変更**: 日時・メニュー・担当者の変更
12. **カレンダー表示**: ドラッグ&ドロップ対応

#### スタッフ管理
13. **勤怠管理**: 出退勤打刻、勤務時間集計
14. **シフト管理**: 月間シフト作成と調整
15. **日報**: スタッフ個別の日報記録
16. **教育進捗**: 研修内容と習得状況管理

#### 分析・レポート
17. **LTV可視化**: 顧客生涯価値の算出と表示
18. **平均単価**: リアルタイム平均客単価表示
19. **施術売上分析**: スタッフ別・メニュー別分析
20. **次回予約率**: 予約率の集計と分析

#### 通知・リマインド
21. **来店リマインド**: 自動リマインド設定
22. **自動メッセージ**: キャンペーン一斉配信
23. **再販リマインド**: 商品再購入時期通知

#### 商品管理
24. **発注管理**: 在庫確認と発注管理
25. **受注管理**: 注文状況の記録

#### その他
26. **マニュアル管理**: 業務手順のデジタル保存
27. **ラベル作成**: 商品ラベル作成機能
28. **権限管理**: 管理者・スタッフ・閲覧者の権限設定
29. **ダッシュボード**: 店舗別・スタッフ別成績表示

## 2. 技術スタック

```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS + shadcn/ui",
  "state": "Zustand",
  "storage": "LocalStorage + IndexedDB (Dexie.js)",
  "charts": "Recharts",
  "calendar": "FullCalendar",
  "forms": "React Hook Form + Zod",
  "icons": "Lucide React",
  "date": "date-fns",
  "pdf": "jsPDF",
  "export": "xlsx"
}
```

## 開発タスク一覧

### Phase 1: プロジェクト初期設定（Day 1-2）

```bash
タスク1-1: Next.jsプロジェクト作成
npx create-next-app@latest salon-management-poc --typescript --tailwind --app
cd salon-management-poc

タスク1-2: 必要パッケージインストール
npm install zustand dexie react-hook-form @hookform/resolvers zod
npm install recharts @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
npm install date-fns jspdf xlsx lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog form input label select table tabs toast

タスク1-3: プロジェクト構造作成
mkdir -p app/(dashboard)/{customers,reservations,sales,staff,analytics,settings}
mkdir -p components/{ui,forms,charts,calendar,layout}
mkdir -p lib/{store,db,utils,mock}
mkdir -p types
```

### Phase 2: データ層実装（Day 3-4）

```bash
タスク2-1: IndexedDBスキーマ定義
# lib/db/schema.ts
- customers, visits, reservations, staff テーブル定義
- Dexie.jsでのデータベース初期化
- インデックス設定

タスク2-2: モックデータ生成
# lib/mock/generator.ts
- 顧客データ100件生成
- 過去1年分の来店履歴生成
- スタッフデータ10名生成
- 予約データ生成

タスク2-3: データストア実装
# lib/store/
- customerStore.ts（顧客管理）
- reservationStore.ts（予約管理）
- salesStore.ts（売上管理）
- staffStore.ts（スタッフ管理）
```

### Phase 3: レイアウト・認証（Day 5-6）

```bash
タスク3-1: ダッシュボードレイアウト
# app/(dashboard)/layout.tsx
- サイドバーナビゲーション
- ヘッダー（ユーザー情報、通知）
- レスポンシブ対応

タスク3-2: 簡易認証実装
# lib/auth/
- LocalStorageベースの認証
- ロール別アクセス制御
- ログイン/ログアウト画面

タスク3-3: ダッシュボードトップ
# app/(dashboard)/page.tsx
- 売上サマリーカード
- 本日の予約一覧
- お知らせ表示
```

### Phase 4: 顧客管理機能（Day 7-10）

```bash
タスク4-1: 顧客一覧画面
# app/(dashboard)/customers/page.tsx
- DataTableコンポーネント
- 検索・フィルタリング
- ページネーション
- 一括操作

タスク4-2: 顧客詳細・カルテ
# app/(dashboard)/customers/[id]/page.tsx
- 基本情報表示・編集
- 来店履歴タイムライン
- 施術写真ギャラリー
- メモ・タグ機能

タスク4-3: 顧客登録フォーム
# components/forms/customer-form.tsx
- バリデーション実装
- 写真アップロード（Base64）
- 自動保存機能

タスク4-4: メッセージ機能
# components/message/chat.tsx
- チャットUI実装
- メッセージ履歴管理
- テンプレート機能
```

### Phase 5: 予約管理機能（Day 11-14）

```bash
タスク5-1: カレンダービュー
# app/(dashboard)/reservations/page.tsx
- FullCalendar実装
- 月/週/日ビュー切替
- スタッフ別表示
- ドラッグ&ドロップ

タスク5-2: 予約登録モーダル
# components/forms/reservation-form.tsx
- 顧客選択（オートコンプリート）
- メニュー複数選択
- 時間スロット管理
- 料金自動計算

タスク5-3: 予約詳細・編集
# components/reservation/detail.tsx
- ステータス変更
- キャンセル理由記録
- 変更履歴表示

タスク5-4: 予約リマインド設定
# components/reservation/reminder.tsx
- リマインドルール設定
- プレビュー機能
```

### Phase 6: 売上管理機能（Day 15-18）

```bash
タスク6-1: 売上ダッシュボード
# app/(dashboard)/sales/page.tsx
- 期間別売上グラフ
- スタッフ別売上ランキング
- メニュー別売上構成
- 前年同期比較

タスク6-2: 売上入力
# components/forms/sales-form.tsx
- 日次売上入力
- レシート撮影（画像保存）
- 経費入力フォーム

タスク6-3: 目標管理
# app/(dashboard)/sales/targets/page.tsx
- 月次目標設定
- 進捗バー表示
- 達成率ランキング

タスク6-4: 原価・利益管理
# components/sales/profit.tsx
- メニュー別原価設定
- 粗利率計算
- 損益分岐点分析
```

### Phase 7: スタッフ管理機能（Day 19-22）

```bash
タスク7-1: スタッフ一覧
# app/(dashboard)/staff/page.tsx
- スタッフカード表示
- スキルバッジ
- 勤務状況インジケーター

タスク7-2: 勤怠管理
# app/(dashboard)/staff/attendance/page.tsx
- 打刻画面
- 勤怠一覧表
- 月次集計

タスク7-3: シフト管理
# app/(dashboard)/staff/shift/page.tsx
- シフト表作成
- 希望シフト入力
- シフト調整画面

タスク7-4: 日報・教育
# components/staff/daily-report.tsx
- 日報入力フォーム
- 教育カリキュラム表示
- スキル習得チェック
```

### Phase 8: 分析・レポート機能（Day 23-26）

```bash
タスク8-1: 分析ダッシュボード
# app/(dashboard)/analytics/page.tsx
- LTV分析グラフ
- リピート率推移
- 新規/既存比率
- 時間帯別来店分析

タスク8-2: カスタムレポート
# components/analytics/report-builder.tsx
- 指標選択UI
- 期間設定
- グラフタイプ選択
- PDF/Excel出力

タスク8-3: 顧客分析
# components/analytics/customer-analysis.tsx
- RFM分析
- 離脱予測
- 優良顧客抽出

タスク8-4: 予測機能
# lib/utils/prediction.ts
- 来店予測アルゴリズム
- 売上予測
- 在庫予測
```

### Phase 9: その他機能・最終調整（Day 27-30）

```bash
タスク9-1: 商品・在庫管理
# app/(dashboard)/products/page.tsx
- 商品マスタ管理
- 在庫数表示
- 発注アラート

タスク9-2: 設定画面
# app/(dashboard)/settings/page.tsx
- 店舗情報設定
- メニュー設定
- 通知設定
- データエクスポート/インポート

タスク9-3: モバイル対応
- レスポンシブデザイン調整
- タッチ操作最適化
- PWA設定

タスク9-4: テスト・デモ準備
- サンプルデータ充実
- デモシナリオ作成
- パフォーマンス最適化
```

## データモデル定義

```typescript
// types/index.ts

export interface Customer {
  id: string
  name: string
  kana: string
  phone: string
  email?: string
  birthDate?: Date
  gender?: 'male' | 'female' | 'other'
  physicalCondition?: string
  preferences?: string
  tags: string[]
  photos: string[] // Base64
  createdAt: Date
  updatedAt: Date
}

export interface Visit {
  id: string
  customerId: string
  staffId: string
  visitDate: Date
  menuItems: MenuItem[]
  totalAmount: number
  paymentMethod: 'cash' | 'card' | 'app'
  duration: number // minutes
  notes?: string
  photos?: string[]
  createdAt: Date
}

export interface Reservation {
  id: string
  customerId: string
  staffId: string
  scheduledAt: Date
  endAt: Date
  menuItems: MenuItem[]
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  source: 'web' | 'phone' | 'walk-in' | 'line'
  notes?: string
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface Staff {
  id: string
  name: string
  role: 'admin' | 'manager' | 'staff' | 'trainee'
  email: string
  phone: string
  hireDate: Date
  skills: Skill[]
  photo?: string
  isActive: boolean
  createdAt: Date
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  duration: number
  cost?: number
  description?: string
}
```

## ストア実装例

```typescript
// lib/store/customerStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer } from '@/types'

interface CustomerStore {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  getCustomer: (id: string) => Customer | undefined
  searchCustomers: (query: string) => Customer[]
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],
      
      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, {
          ...customer,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(c => 
          c.id === id 
            ? { ...c, ...updates, updatedAt: new Date() }
            : c
        )
      })),
      
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(c => c.id !== id)
      })),
      
      getCustomer: (id) => {
        return get().customers.find(c => c.id === id)
      },
      
      searchCustomers: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().customers.filter(c => 
          c.name.toLowerCase().includes(lowerQuery) ||
          c.kana.toLowerCase().includes(lowerQuery) ||
          c.phone.includes(query) ||
          c.email?.toLowerCase().includes(lowerQuery)
        )
      }
    }),
    {
      name: 'customer-storage'
    }
  )
)
```

## コンポーネント実装例

```typescript
// app/(dashboard)/customers/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useCustomerStore } from '@/lib/store/customerStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { CustomerForm } from '@/components/forms/customer-form'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { customers, searchCustomers } = useCustomerStore()
  
  const filteredCustomers = useMemo(() => {
    return search ? searchCustomers(search) : customers
  }, [search, customers, searchCustomers])
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">顧客管理</h1>
        <Button onClick={() => setShowForm(true)}>
          新規顧客登録
        </Button>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="顧客を検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <DataTable
        columns={customerColumns}
        data={filteredCustomers}
      />
      
      {showForm && (
        <CustomerForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            // 顧客登録処理
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}
```

## モックデータ生成

```typescript
// lib/mock/generator.ts
import { Customer, Visit, Staff, Reservation } from '@/types'

export function generateMockCustomers(count: number): Customer[] {
  const customers: Customer[] = []
  const names = ['田中', '佐藤', '鈴木', '高橋', '渡辺']
  const firstNames = ['太郎', '花子', '一郎', '美咲', '健太']
  
  for (let i = 0; i < count; i++) {
    customers.push({
      id: crypto.randomUUID(),
      name: `${names[i % names.length]}${firstNames[i % firstNames.length]}`,
      kana: `タナカタロウ`,
      phone: `090-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
      email: `customer${i}@example.com`,
      birthDate: new Date(1990 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as any,
      tags: ['VIP', 'リピーター', '新規'][Math.floor(Math.random() * 3)].split(''),
      photos: [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    })
  }
  
  return customers
}

// 初回起動時にモックデータを生成
export function initializeMockData() {
  if (typeof window !== 'undefined' && !localStorage.getItem('initialized')) {
    const customers = generateMockCustomers(100)
    const staff = generateMockStaff(10)
    const visits = generateMockVisits(customers, staff, 500)
    const reservations = generateMockReservations(customers, staff, 50)
    
    // LocalStorageに保存
    localStorage.setItem('customer-storage', JSON.stringify({ state: { customers } }))
    localStorage.setItem('staff-storage', JSON.stringify({ state: { staff } }))
    localStorage.setItem('visit-storage', JSON.stringify({ state: { visits } }))
    localStorage.setItem('reservation-storage', JSON.stringify({ state: { reservations } }))
    localStorage.setItem('initialized', 'true')
  }
}
```

## プロジェクト構造

```
salon-management-poc/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── reservations/
│   │   ├── sales/
│   │   ├── staff/
│   │   ├── analytics/
│   │   ├── products/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── ui/               # shadcn/ui
│   ├── forms/
│   ├── charts/
│   ├── calendar/
│   └── layout/
├── lib/
│   ├── store/            # Zustand stores
│   ├── db/              # IndexedDB
│   ├── mock/            # モックデータ
│   ├── utils/           # ユーティリティ
│   └── auth/            # 認証
├── types/
│   └── index.ts
├── public/
└── package.json
```

## 実行方法

```bash
# プロジェクト作成
npx create-next-app@latest salon-management-poc --typescript --tailwind --app
cd salon-management-poc

# 依存パッケージインストール
npm install zustand dexie react-hook-form @hookform/resolvers zod recharts date-fns jspdf xlsx lucide-react
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# shadcn/ui セットアップ
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog form input label select table tabs toast alert badge checkbox

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクション実行
npm run start
```

## デモシナリオ

### 1. 初回ログイン
- URL: http://localhost:3000
- ID: admin / PW: admin（ローカルストレージ認証）
- 初回起動時に100件の顧客データ自動生成

### 2. 基本操作フロー
1. ダッシュボード確認（売上・予約状況）
2. 新規顧客登録
3. 予約登録（カレンダーから）
4. 来店処理・会計
5. 売上確認・分析

### 3. 主要機能デモ
- 顧客検索・フィルタリング
- ドラッグ&ドロップ予約変更
- 売上グラフ表示
- スタッフシフト管理
- レポートPDF出力

## 注意事項

### データ永続化
- LocalStorage: 5MB制限
- IndexedDB: より大容量対応
- データエクスポート機能必須
- 定期的なバックアップ推奨

### パフォーマンス
- 仮想スクロール実装（大量データ）
- 画像はBase64圧縮
- Lazy Loading活用
- メモ化による再レンダリング防止

### ブラウザ対応
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 備考
- フロントエンドのみのPoCのため、本番移行時はバックエンド実装が必要
- データはブラウザローカルに保存されるため、端末間共有不可
- 実際の運用では、Supabase等のBaaSまたは独自APIサーバーを推奨
- モバイルアプリ化する場合は、React Native版を別途開発
