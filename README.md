# 美容サロン統合管理システム - フロントエンドPoC

美容サロン向け統合管理システムのフロントエンドプロトタイプです。バックエンドなしで動作し、リアルなモックデータを使用してUI/UXの検証と機能の可視化を行います。

## 🎯 プロジェクト概要

### 開発方針
- **フロントエンドのみ**: バックエンドなしで動作するプロトタイプ
- **データ保存**: LocalStorage / IndexedDB使用
- **モックデータ**: リアルなダミーデータで動作確認
- **目的**: UI/UXの検証と機能の可視化

### 主要機能（29機能）

#### 📊 ダッシュボード
- 売上サマリー表示
- 本日の予約一覧
- 統計データの可視化

#### 👥 顧客管理
- 顧客基本情報管理
- カルテ機能（体質、施術履歴、写真管理）
- 来店履歴追跡
- 次回来店予測
- 顧客検索・フィルタリング
- タグ機能

#### 📅 予約管理
- カスタム予約カレンダー
- 予約受付・変更・キャンセル
- 複数チャネル対応（Web、電話、飛込み、LINE）
- ドラッグ&ドロップ操作
- 予約ステータス管理

#### 💰 売上管理
- 売上データ集計
- スタッフ別・メニュー別分析
- 目標管理機能
- 原価・利益計算

#### 👨‍💼 スタッフ管理
- スタッフ情報管理
- 勤怠管理
- シフト管理
- 教育進捗管理

#### 📈 分析・レポート
- LTV（顧客生涯価値）分析
- 平均単価計算
- リピート率分析
- 各種レポート出力

## 🛠️ 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand
- **フォーム**: React Hook Form + Zod
- **アイコン**: Lucide React

### データ管理
- **ローカルストレージ**: IndexedDB (Dexie.js)
- **永続化**: LocalStorage (認証情報)

### UI/UX
- **コンポーネント**: shadcn/ui
- **レスポンシブ**: Tailwind CSS
- **カレンダー**: カスタム実装
- **チャート**: Recharts (予定)

## 🚀 セットアップ手順

### 前提条件
- Node.js 18.0.0 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd abeille_system_poc

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

### アクセス
開発サーバー起動後、以下のURLにアクセス:
- http://localhost:3000

## 🔐 デモアカウント

以下のアカウントでログインできます:

| 役職 | メールアドレス | パスワード | 権限 |
|------|----------------|------------|------|
| 管理者 | admin@salon.com | admin | 全機能アクセス可能 |
| マネージャー | manager@salon.com | manager | 管理機能制限あり |
| スタッフ | staff@salon.com | staff | 基本機能のみ |

## 📱 主要画面

### 🏠 ダッシュボード (`/dashboard`)
- 総顧客数、本日の予約数、売上統計
- 本日の予約一覧
- アクティブスタッフ数

### 👥 顧客管理 (`/dashboard/customers`)
- 顧客一覧（カード表示）
- 検索・フィルタリング機能
- 顧客登録・編集フォーム
- タグ機能

### 📅 予約管理 (`/dashboard/reservations`)
- カスタム月次カレンダー
- 予約詳細表示
- 予約登録・編集フォーム
- ステータス管理

### その他の画面
- 売上管理 (`/dashboard/sales`)
- スタッフ管理 (`/dashboard/staff`)
- 分析・レポート (`/dashboard/analytics`)
- 商品管理 (`/dashboard/products`)
- 設定 (`/dashboard/settings`)

## 💾 データ構造

### 主要エンティティ

```typescript
// 顧客情報
interface Customer {
  id: string
  name: string           // 氏名
  kana: string           // フリガナ
  phone: string          // 電話番号
  email?: string         // メールアドレス
  birthDate?: Date       // 生年月日
  gender?: string        // 性別
  physicalCondition?: string  // 体質・アレルギー
  preferences?: string   // 希望・好み
  tags: string[]         // タグ
  photos: string[]       // 写真（Base64）
  createdAt: Date
  updatedAt: Date
}

// 予約情報
interface Reservation {
  id: string
  customerId: string     // 顧客ID
  staffId: string        // スタッフID
  scheduledAt: Date      // 予約日時
  endAt: Date           // 終了予定時間
  menuItems: MenuItem[]  // 施術メニュー
  status: string        // ステータス
  source: string        // 予約経路
  notes?: string        // 備考
  createdAt: Date
  updatedAt: Date
}
```

### モックデータ
- **顧客**: 100件の架空顧客データ
- **スタッフ**: 10名のスタッフデータ
- **来店履歴**: 500件の過去来店記録
- **予約**: 50件の予約データ

## 🧪 デモシナリオ

### 基本操作フロー
1. **ログイン**: 管理者アカウントでログイン
2. **ダッシュボード確認**: 統計情報と本日の予約を確認
3. **顧客登録**: 新規顧客を登録
4. **予約作成**: カレンダーから新規予約を作成
5. **顧客検索**: 検索機能で特定の顧客を検索
6. **予約変更**: 既存予約の編集・ステータス変更

### 主要機能のデモ
- **顧客管理**: 検索、フィルタリング、詳細編集
- **予約カレンダー**: 月次表示、予約作成、ステータス管理
- **レスポンシブ対応**: スマートフォン・タブレット表示

## 🏗️ プロジェクト構造

```
salon-management-poc/
├── app/                      # Next.js App Router
│   ├── dashboard/           # ダッシュボード関連ページ
│   │   ├── customers/       # 顧客管理
│   │   ├── reservations/    # 予約管理
│   │   ├── sales/          # 売上管理
│   │   ├── staff/          # スタッフ管理
│   │   ├── analytics/      # 分析・レポート
│   │   ├── products/       # 商品管理
│   │   └── settings/       # 設定
│   ├── login/              # ログインページ
│   └── layout.tsx          # ルートレイアウト
├── components/              # Reactコンポーネント
│   ├── ui/                 # shadcn/ui コンポーネント
│   ├── forms/              # フォームコンポーネント
│   ├── calendar/           # カレンダーコンポーネント
│   └── layout/             # レイアウトコンポーネント
├── lib/                    # ユーティリティ
│   ├── store/              # Zustand ストア
│   ├── db/                 # IndexedDB スキーマ
│   ├── mock/               # モックデータ生成
│   └── auth/               # 認証機能
├── types/                  # TypeScript型定義
└── hooks/                  # カスタムフック
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクション実行
npm run start

# 型チェック
npm run type-check

# リント
npm run lint
```

## 📊 パフォーマンス考慮事項

### データ管理
- **IndexedDB**: 大容量データ対応
- **仮想スクロール**: 大量リスト表示最適化
- **画像圧縮**: Base64画像の最適化
- **メモ化**: React.memo等による再レンダリング防止

### ブラウザ対応
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚠️ 制限事項

### 現在の制限
- **データ共有不可**: ブラウザローカルストレージのため端末間でのデータ共有不可
- **バックエンドなし**: リアルタイム同期、外部API連携なし
- **認証簡易版**: 本格的なセキュリティ機能なし
- **一部機能未実装**: 売上管理、スタッフ管理等は表示のみ

### 将来の拡張予定
- **バックエンド統合**: API サーバーとの連携
- **リアルタイム機能**: WebSocket によるリアルタイム更新
- **モバイルアプリ**: React Native版の開発
- **高度な分析**: より詳細なレポート機能

## 📈 本番移行時の推奨技術スタック

### バックエンド
- **API**: Node.js + Express / Next.js API Routes
- **データベース**: PostgreSQL / MySQL
- **認証**: NextAuth.js / Auth0
- **ホスティング**: Vercel / AWS / Google Cloud

### BaaS（Backend as a Service）
- **Supabase**: PostgreSQL + リアルタイム機能
- **Firebase**: NoSQL + リアルタイム機能
- **AWS Amplify**: フルスタックアプリ開発

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 📞 サポート

ご質問やご要望がございましたら、以下までお気軽にお問い合わせください:

- **Issue**: GitHub Issues
- **Email**: contact@example.com
- **ドキュメント**: [Wiki](https://github.com/your-repo/wiki)

---

**美容サロン統合管理システム** - 現代の美容サロン運営を効率化する次世代管理システム