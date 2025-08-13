import { create } from 'zustand'
import { Reservation } from '@/types'
import { db } from '@/lib/db/schema'

interface ReservationStore {
  reservations: Reservation[]
  loading: boolean
  error: string | null
  
  // Actions
  loadReservations: () => Promise<void>
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateReservation: (id: string, reservation: Partial<Reservation>) => Promise<void>
  deleteReservation: (id: string) => Promise<void>
  getReservation: (id: string) => Reservation | undefined
  getReservationsByDate: (date: Date) => Reservation[]
  getReservationsByStaff: (staffId: string) => Reservation[]
  clearError: () => void
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: [],
  loading: false,
  error: null,
  
  loadReservations: async () => {
    set({ loading: true, error: null })
    try {
      const reservations = await db.reservations.orderBy('scheduledAt').toArray()
      set({ reservations, loading: false })
    } catch (error) {
      set({ error: 'Failed to load reservations', loading: false })
    }
  },
  
  addReservation: async (reservationData) => {
    set({ loading: true, error: null })
    try {
      const reservation: Reservation = {
        ...reservationData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.reservations.add(reservation)
      set(state => ({
        reservations: [...state.reservations, reservation],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to add reservation', loading: false })
    }
  },
  
  updateReservation: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedReservation = {
        ...updates,
        updatedAt: new Date()
      }
      
      await db.reservations.update(id, updatedReservation)
      
      set(state => ({
        reservations: state.reservations.map(r => 
          r.id === id 
            ? { ...r, ...updatedReservation }
            : r
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update reservation', loading: false })
    }
  },
  
  deleteReservation: async (id) => {
    set({ loading: true, error: null })
    try {
      await db.reservations.delete(id)
      set(state => ({
        reservations: state.reservations.filter(r => r.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete reservation', loading: false })
    }
  },
  
  getReservation: (id) => {
    return get().reservations.find(r => r.id === id)
  },
  
  getReservationsByDate: (date) => {
    const dateString = date.toDateString()
    return get().reservations.filter(r => 
      r.scheduledAt.toDateString() === dateString
    )
  },
  
  getReservationsByStaff: (staffId) => {
    return get().reservations.filter(r => r.staffId === staffId)
  },
  
  clearError: () => set({ error: null })
}))