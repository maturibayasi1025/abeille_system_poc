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

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}