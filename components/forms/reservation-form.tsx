'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useReservationStore } from '@/lib/store/reservationStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useStaffStore } from '@/lib/store/staffStore'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const reservationSchema = z.object({
  customerId: z.string().min(1, '顧客を選択してください'),
  staffId: z.string().min(1, 'スタッフを選択してください'),
  scheduledDate: z.string().min(1, '予約日を選択してください'),
  scheduledTime: z.string().min(1, '予約時間を選択してください'),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  source: z.enum(['web', 'phone', 'walk-in', 'line']),
  notes: z.string().optional(),
})

type ReservationFormData = z.infer<typeof reservationSchema>

interface ReservationFormProps {
  reservationId?: string | null
  onClose: () => void
  defaultDate?: Date
}

// Mock menu items for demo
const mockMenuItems = [
  { id: '1', name: 'カット', category: 'ヘア', duration: 45, price: 4000 },
  { id: '2', name: 'カラー', category: 'ヘア', duration: 90, price: 7000 },
  { id: '3', name: 'パーマ', category: 'ヘア', duration: 120, price: 8000 },
  { id: '4', name: 'トリートメント', category: 'ケア', duration: 30, price: 3000 },
  { id: '5', name: 'ヘッドスパ', category: 'ケア', duration: 45, price: 4000 },
]

export function ReservationForm({ reservationId, onClose, defaultDate }: ReservationFormProps) {
  const [selectedMenus, setSelectedMenus] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  const { reservations, addReservation, updateReservation, getReservation } = useReservationStore()
  const { customers } = useCustomerStore()
  const { staff } = useStaffStore()
  
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customerId: '',
      staffId: '',
      scheduledDate: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
      scheduledTime: '',
      status: 'pending',
      source: 'web',
      notes: '',
    }
  })
  
  useEffect(() => {
    if (reservationId) {
      const reservation = getReservation(reservationId)
      if (reservation) {
        form.reset({
          customerId: reservation.customerId,
          staffId: reservation.staffId,
          scheduledDate: format(reservation.scheduledAt, 'yyyy-MM-dd'),
          scheduledTime: format(reservation.scheduledAt, 'HH:mm'),
          status: reservation.status,
          source: reservation.source,
          notes: reservation.notes || '',
        })
        setSelectedMenus(reservation.menuItems.map(m => m.id))
      }
    }
  }, [reservationId, getReservation, form])
  
  const onSubmit = async (data: ReservationFormData) => {
    setLoading(true)
    try {
      const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`)
      const selectedMenuItems = mockMenuItems.filter(m => selectedMenus.includes(m.id))
      const totalDuration = selectedMenuItems.reduce((sum, item) => sum + item.duration, 0)
      const endAt = new Date(scheduledAt.getTime() + totalDuration * 60 * 1000)
      
      const reservationData = {
        customerId: data.customerId,
        staffId: data.staffId,
        scheduledAt,
        endAt,
        menuItems: selectedMenuItems,
        status: data.status,
        source: data.source,
        notes: data.notes,
      }
      
      if (reservationId) {
        await updateReservation(reservationId, reservationData)
      } else {
        await addReservation(reservationData)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save reservation:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleMenuToggle = (menuId: string) => {
    setSelectedMenus(prev => 
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }
  
  const totalDuration = mockMenuItems
    .filter(m => selectedMenus.includes(m.id))
    .reduce((sum, item) => sum + item.duration, 0)
  
  const totalPrice = mockMenuItems
    .filter(m => selectedMenus.includes(m.id))
    .reduce((sum, item) => sum + item.price, 0)
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reservationId ? '予約編集' : '新規予約登録'}
          </DialogTitle>
          <DialogDescription>
            予約の詳細情報を入力してください。
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>顧客 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="顧客を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>担当スタッフ *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="スタッフを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff.filter(s => s.isActive).map((staffMember) => (
                          <SelectItem key={staffMember.id} value={staffMember.id}>
                            {staffMember.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>予約日 *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>予約時間 *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">保留</SelectItem>
                        <SelectItem value="confirmed">確定</SelectItem>
                        <SelectItem value="completed">完了</SelectItem>
                        <SelectItem value="cancelled">キャンセル</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>予約経路</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web">ウェブ</SelectItem>
                        <SelectItem value="phone">電話</SelectItem>
                        <SelectItem value="walk-in">飛込み</SelectItem>
                        <SelectItem value="line">LINE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Menu Selection */}
            <div className="space-y-3">
              <Label>施術メニュー</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockMenuItems.map((menu) => (
                  <div key={menu.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={menu.id}
                      checked={selectedMenus.includes(menu.id)}
                      onCheckedChange={() => handleMenuToggle(menu.id)}
                    />
                    <label
                      htmlFor={menu.id}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <div className="flex justify-between">
                        <span>{menu.name}</span>
                        <span className="text-gray-500">
                          ¥{menu.price.toLocaleString()} ({menu.duration}分)
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              {selectedMenus.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>合計施術時間:</span>
                    <span className="font-medium">{totalDuration}分</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>合計金額:</span>
                    <span className="font-medium">¥{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="特記事項やお客様からの要望など"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit" disabled={loading || selectedMenus.length === 0}>
                {loading ? '保存中...' : (reservationId ? '更新' : '登録')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}