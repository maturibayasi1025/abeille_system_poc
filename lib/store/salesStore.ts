import { create } from 'zustand'
import { Visit } from '@/types'
import { db } from '@/lib/db/schema'

interface SalesStore {
  visits: Visit[]
  loading: boolean
  error: string | null
  
  // Actions
  loadVisits: () => Promise<void>
  addVisit: (visit: Omit<Visit, 'id' | 'createdAt'>) => Promise<void>
  updateVisit: (id: string, visit: Partial<Visit>) => Promise<void>
  deleteVisit: (id: string) => Promise<void>
  getVisit: (id: string) => Visit | undefined
  getVisitsByCustomer: (customerId: string) => Visit[]
  getVisitsByStaff: (staffId: string) => Visit[]
  getVisitsByDateRange: (startDate: Date, endDate: Date) => Visit[]
  getDailySales: (date: Date) => number
  getMonthlySales: (year: number, month: number) => number
  clearError: () => void
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  visits: [],
  loading: false,
  error: null,
  
  loadVisits: async () => {
    set({ loading: true, error: null })
    try {
      const visits = await db.visits.orderBy('visitDate').reverse().toArray()
      set({ visits, loading: false })
    } catch (error) {
      set({ error: 'Failed to load visits', loading: false })
    }
  },
  
  addVisit: async (visitData) => {
    set({ loading: true, error: null })
    try {
      const visit: Visit = {
        ...visitData,
        id: crypto.randomUUID(),
        createdAt: new Date()
      }
      
      await db.visits.add(visit)
      set(state => ({
        visits: [visit, ...state.visits],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to add visit', loading: false })
    }
  },
  
  updateVisit: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await db.visits.update(id, updates)
      
      set(state => ({
        visits: state.visits.map(v => 
          v.id === id 
            ? { ...v, ...updates }
            : v
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update visit', loading: false })
    }
  },
  
  deleteVisit: async (id) => {
    set({ loading: true, error: null })
    try {
      await db.visits.delete(id)
      set(state => ({
        visits: state.visits.filter(v => v.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete visit', loading: false })
    }
  },
  
  getVisit: (id) => {
    return get().visits.find(v => v.id === id)
  },
  
  getVisitsByCustomer: (customerId) => {
    return get().visits.filter(v => v.customerId === customerId)
  },
  
  getVisitsByStaff: (staffId) => {
    return get().visits.filter(v => v.staffId === staffId)
  },
  
  getVisitsByDateRange: (startDate, endDate) => {
    return get().visits.filter(v => 
      v.visitDate >= startDate && v.visitDate <= endDate
    )
  },
  
  getDailySales: (date) => {
    const dateString = date.toDateString()
    return get().visits
      .filter(v => v.visitDate.toDateString() === dateString)
      .reduce((sum, v) => sum + v.totalAmount, 0)
  },
  
  getMonthlySales: (year, month) => {
    return get().visits
      .filter(v => 
        v.visitDate.getFullYear() === year && 
        v.visitDate.getMonth() === month
      )
      .reduce((sum, v) => sum + v.totalAmount, 0)
  },
  
  clearError: () => set({ error: null })
}))