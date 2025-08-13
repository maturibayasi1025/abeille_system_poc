import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff' | 'viewer'
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => boolean
}

// Demo users for authentication
const demoUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: '管理者',
    email: 'admin@salon.com',
    role: 'admin',
    password: 'admin'
  },
  {
    id: '2',
    name: 'マネージャー',
    email: 'manager@salon.com',
    role: 'manager',
    password: 'manager'
  },
  {
    id: '3',
    name: 'スタッフ',
    email: 'staff@salon.com',
    role: 'staff',
    password: 'staff'
  }
]

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const user = demoUsers.find(u => u.email === email && u.password === password)
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true })
          return true
        }
        
        return false
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      checkAuth: () => {
        return get().isAuthenticated
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)