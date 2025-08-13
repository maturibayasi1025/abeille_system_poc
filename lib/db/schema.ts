import Dexie, { Table } from 'dexie'
import { Customer, Visit, Reservation, Staff, MenuItem } from '@/types'

export class SalonDatabase extends Dexie {
  customers!: Table<Customer>
  visits!: Table<Visit>
  reservations!: Table<Reservation>
  staff!: Table<Staff>
  menuItems!: Table<MenuItem>

  constructor() {
    super('SalonManagementDB')
    
    this.version(1).stores({
      customers: '++id, name, kana, phone, email, createdAt, updatedAt',
      visits: '++id, customerId, staffId, visitDate, createdAt',
      reservations: '++id, customerId, staffId, scheduledAt, status, source, createdAt',
      staff: '++id, name, email, role, isActive, createdAt',
      menuItems: '++id, name, category, price'
    })
  }
}

export const db = new SalonDatabase()