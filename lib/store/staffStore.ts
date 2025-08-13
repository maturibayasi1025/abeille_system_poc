import { create } from 'zustand'
import { Staff } from '@/types'
import { db } from '@/lib/db/schema'

interface StaffStore {
  staff: Staff[]
  loading: boolean
  error: string | null
  
  // Actions
  loadStaff: () => Promise<void>
  addStaff: (staff: Omit<Staff, 'id' | 'createdAt'>) => Promise<void>
  updateStaff: (id: string, staff: Partial<Staff>) => Promise<void>
  deleteStaff: (id: string) => Promise<void>
  getStaff: (id: string) => Staff | undefined
  getActiveStaff: () => Staff[]
  clearError: () => void
}

export const useStaffStore = create<StaffStore>((set, get) => ({
  staff: [],
  loading: false,
  error: null,
  
  loadStaff: async () => {
    set({ loading: true, error: null })
    try {
      const staff = await db.staff.orderBy('createdAt').toArray()
      set({ staff, loading: false })
    } catch (error) {
      set({ error: 'Failed to load staff', loading: false })
    }
  },
  
  addStaff: async (staffData) => {
    set({ loading: true, error: null })
    try {
      const staff: Staff = {
        ...staffData,
        id: crypto.randomUUID(),
        createdAt: new Date()
      }
      
      await db.staff.add(staff)
      set(state => ({
        staff: [...state.staff, staff],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to add staff', loading: false })
    }
  },
  
  updateStaff: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await db.staff.update(id, updates)
      
      set(state => ({
        staff: state.staff.map(s => 
          s.id === id 
            ? { ...s, ...updates }
            : s
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update staff', loading: false })
    }
  },
  
  deleteStaff: async (id) => {
    set({ loading: true, error: null })
    try {
      await db.staff.delete(id)
      set(state => ({
        staff: state.staff.filter(s => s.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete staff', loading: false })
    }
  },
  
  getStaff: (id) => {
    return get().staff.find(s => s.id === id)
  },
  
  getActiveStaff: () => {
    return get().staff.filter(s => s.isActive)
  },
  
  clearError: () => set({ error: null })
}))