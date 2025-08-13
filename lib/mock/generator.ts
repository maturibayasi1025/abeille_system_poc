import { Customer, Visit, Staff, Reservation, MenuItem, Skill } from '@/types'

const lastNames = ['田中', '佐藤', '鈴木', '高橋', '渡辺', '伊藤', '山本', '中村', '小林', '加藤']
const firstNames = ['太郎', '花子', '一郎', '美咲', '健太', '愛子', '翔太', '桃子', '大輔', '由美']
const kanaLastNames = ['タナカ', 'サトウ', 'スズキ', 'タカハシ', 'ワタナベ', 'イトウ', 'ヤマモト', 'ナカムラ', 'コバヤシ', 'カトウ']
const kanaFirstNames = ['タロウ', 'ハナコ', 'イチロウ', 'ミサキ', 'ケンタ', 'アイコ', 'ショウタ', 'モモコ', 'ダイスケ', 'ユミ']

const menuCategories = ['カット', 'カラー', 'パーマ', 'トリートメント', 'エクステ', 'ヘッドスパ', 'セット']
const menuNames: { [key: string]: string[] } = {
  'カット': ['カット', 'カット＋シャンプー', '前髪カット', 'キッズカット'],
  'カラー': ['フルカラー', 'リタッチカラー', 'ハイライト', 'ブリーチ', 'インナーカラー'],
  'パーマ': ['コールドパーマ', 'デジタルパーマ', 'ストレートパーマ', '縮毛矯正'],
  'トリートメント': ['クイックトリートメント', 'ディープトリートメント', '髪質改善トリートメント'],
  'エクステ': ['エクステ30本', 'エクステ50本', 'エクステ100本'],
  'ヘッドスパ': ['リラクゼーションスパ', '頭皮クレンジング', 'アロマヘッドスパ'],
  'セット': ['ヘアセット', 'アップスタイル', 'ハーフアップ']
}

export function generateMockCustomers(count: number): Customer[] {
  const customers: Customer[] = []
  
  for (let i = 0; i < count; i++) {
    const lastNameIdx = Math.floor(Math.random() * lastNames.length)
    const firstNameIdx = Math.floor(Math.random() * firstNames.length)
    const gender = ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as 'male' | 'female' | 'other'
    
    customers.push({
      id: crypto.randomUUID(),
      name: `${lastNames[lastNameIdx]}${firstNames[firstNameIdx]}`,
      kana: `${kanaLastNames[lastNameIdx]}${kanaFirstNames[firstNameIdx]}`,
      phone: `090-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      email: Math.random() > 0.3 ? `customer${i}@example.com` : undefined,
      birthDate: new Date(1960 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: gender,
      physicalCondition: Math.random() > 0.7 ? '敏感肌' : undefined,
      preferences: Math.random() > 0.5 ? 'ナチュラルな仕上がりを希望' : undefined,
      tags: ['VIP', 'リピーター', '新規', '要注意', '優良顧客'].slice(0, Math.floor(Math.random() * 3) + 1),
      photos: [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 2),
      updatedAt: new Date()
    })
  }
  
  return customers
}

export function generateMockStaff(count: number): Staff[] {
  const staff: Staff[] = []
  const roles: Array<'admin' | 'manager' | 'staff' | 'trainee'> = ['admin', 'manager', 'staff', 'trainee']
  const skills: Skill[] = [
    { id: '1', name: 'カット', level: 'expert' },
    { id: '2', name: 'カラー', level: 'advanced' },
    { id: '3', name: 'パーマ', level: 'intermediate' },
    { id: '4', name: 'セット', level: 'advanced' },
    { id: '5', name: 'メイク', level: 'beginner' }
  ]
  
  for (let i = 0; i < count; i++) {
    const lastNameIdx = Math.floor(Math.random() * lastNames.length)
    const firstNameIdx = Math.floor(Math.random() * firstNames.length)
    
    staff.push({
      id: crypto.randomUUID(),
      name: `${lastNames[lastNameIdx]}${firstNames[firstNameIdx]}`,
      role: i === 0 ? 'admin' : roles[Math.floor(Math.random() * roles.length)],
      email: `staff${i}@salon.com`,
      phone: `090-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      hireDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5),
      skills: skills.slice(0, Math.floor(Math.random() * skills.length) + 1),
      isActive: Math.random() > 0.1,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 2)
    })
  }
  
  return staff
}

export function generateMockMenuItems(): MenuItem[] {
  const menuItems: MenuItem[] = []
  let id = 1
  
  Object.entries(menuNames).forEach(([category, names]) => {
    names.forEach(name => {
      const basePrice = {
        'カット': 4000,
        'カラー': 7000,
        'パーマ': 8000,
        'トリートメント': 3000,
        'エクステ': 10000,
        'ヘッドスパ': 4000,
        'セット': 3000
      }[category] || 5000
      
      const baseDuration = {
        'カット': 45,
        'カラー': 90,
        'パーマ': 120,
        'トリートメント': 30,
        'エクステ': 60,
        'ヘッドスパ': 45,
        'セット': 30
      }[category] || 60
      
      menuItems.push({
        id: String(id++),
        name,
        category,
        price: basePrice + Math.floor(Math.random() * 3000) - 1500,
        duration: baseDuration + Math.floor(Math.random() * 30) - 15,
        cost: Math.floor((basePrice * 0.3) + Math.random() * 1000),
        description: `${name}の施術です`
      })
    })
  })
  
  return menuItems
}

export function generateMockVisits(customers: Customer[], staff: Staff[], count: number): Visit[] {
  const visits: Visit[] = []
  const menuItems = generateMockMenuItems()
  
  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const staffMember = staff.filter(s => s.isActive)[Math.floor(Math.random() * staff.filter(s => s.isActive).length)]
    const selectedMenuItems = menuItems.slice(0, Math.floor(Math.random() * 3) + 1)
    const totalAmount = selectedMenuItems.reduce((sum, item) => sum + item.price, 0)
    const totalDuration = selectedMenuItems.reduce((sum, item) => sum + item.duration, 0)
    
    visits.push({
      id: crypto.randomUUID(),
      customerId: customer.id,
      staffId: staffMember.id,
      visitDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      menuItems: selectedMenuItems,
      totalAmount,
      paymentMethod: ['cash', 'card', 'app'][Math.floor(Math.random() * 3)] as 'cash' | 'card' | 'app',
      duration: totalDuration,
      notes: Math.random() > 0.7 ? 'お客様のご要望に応じて施術しました' : undefined,
      photos: [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    })
  }
  
  return visits.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime())
}

export function generateMockReservations(customers: Customer[], staff: Staff[], count: number): Reservation[] {
  const reservations: Reservation[] = []
  const menuItems = generateMockMenuItems()
  const statuses: Array<'pending' | 'confirmed' | 'completed' | 'cancelled'> = ['pending', 'confirmed', 'completed', 'cancelled']
  const sources: Array<'web' | 'phone' | 'walk-in' | 'line'> = ['web', 'phone', 'walk-in', 'line']
  
  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const staffMember = staff.filter(s => s.isActive)[Math.floor(Math.random() * staff.filter(s => s.isActive).length)]
    const selectedMenuItems = menuItems.slice(0, Math.floor(Math.random() * 3) + 1)
    const totalDuration = selectedMenuItems.reduce((sum, item) => sum + item.duration, 0)
    const scheduledAt = new Date(Date.now() + (Math.random() * 30 - 15) * 24 * 60 * 60 * 1000)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    reservations.push({
      id: crypto.randomUUID(),
      customerId: customer.id,
      staffId: staffMember.id,
      scheduledAt,
      endAt: new Date(scheduledAt.getTime() + totalDuration * 60 * 1000),
      menuItems: selectedMenuItems,
      status,
      source: sources[Math.floor(Math.random() * sources.length)],
      notes: Math.random() > 0.7 ? '時間厳守でお願いします' : undefined,
      cancelReason: status === 'cancelled' ? '体調不良のため' : undefined,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    })
  }
  
  return reservations.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
}

export async function initializeMockData() {
  if (typeof window !== 'undefined') {
    const { db } = await import('@/lib/db/schema')
    
    const existingCustomers = await db.customers.count()
    if (existingCustomers > 0) {
      console.log('Mock data already exists')
      return
    }
    
    const customers = generateMockCustomers(100)
    const staff = generateMockStaff(10)
    const menuItems = generateMockMenuItems()
    const visits = generateMockVisits(customers, staff, 500)
    const reservations = generateMockReservations(customers, staff, 50)
    
    await db.customers.bulkAdd(customers)
    await db.staff.bulkAdd(staff)
    await db.menuItems.bulkAdd(menuItems)
    await db.visits.bulkAdd(visits)
    await db.reservations.bulkAdd(reservations)
    
    console.log('Mock data initialized successfully')
  }
}