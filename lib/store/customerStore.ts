import { create } from 'zustand'
import { Customer } from '@/types'
import { db } from '@/lib/db/schema'

interface CustomerStore {
  customers: Customer[]
  loading: boolean
  error: string | null
  
  // Actions
  loadCustomers: () => Promise<void>
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
  getCustomer: (id: string) => Customer | undefined
  searchCustomers: (query: string) => Customer[]
  clearError: () => void
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  
  loadCustomers: async () => {
    set({ loading: true, error: null })
    try {
      const customers = await db.customers.orderBy('createdAt').reverse().toArray()
      set({ customers, loading: false })
    } catch (error) {
      set({ error: 'Failed to load customers', loading: false })
    }
  },
  
  addCustomer: async (customerData) => {
    set({ loading: true, error: null })
    try {
      const customer: Customer = {
        ...customerData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.customers.add(customer)
      set(state => ({
        customers: [customer, ...state.customers],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to add customer', loading: false })
    }
  },
  
  updateCustomer: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedCustomer = {
        ...updates,
        updatedAt: new Date()
      }
      
      await db.customers.update(id, updatedCustomer)
      
      set(state => ({
        customers: state.customers.map(c => 
          c.id === id 
            ? { ...c, ...updatedCustomer }
            : c
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update customer', loading: false })
    }
  },
  
  deleteCustomer: async (id) => {
    set({ loading: true, error: null })
    try {
      await db.customers.delete(id)
      set(state => ({
        customers: state.customers.filter(c => c.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete customer', loading: false })
    }
  },
  
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
  },
  
  clearError: () => set({ error: null })
}))