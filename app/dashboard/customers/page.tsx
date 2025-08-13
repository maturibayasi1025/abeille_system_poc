'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCustomerStore } from '@/lib/store/customerStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CustomerForm } from '@/components/forms/customer-form'
import { Plus, Search, Users, Phone, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  
  const { customers, loading, loadCustomers, searchCustomers } = useCustomerStore()
  
  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])
  
  const filteredCustomers = useMemo(() => {
    return search ? searchCustomers(search) : customers
  }, [search, customers, searchCustomers])
  
  const handleCustomerClick = (customerId: string) => {
    setSelectedCustomer(customerId)
    setShowForm(true)
  }
  
  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedCustomer(null)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">顧客データを読み込み中...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">顧客管理</h1>
          <p className="text-gray-600">顧客情報の管理とカルテの閲覧・編集</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規顧客登録
        </Button>
      </div>
      
      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="顧客名、フリガナ、電話番号、メールアドレスで検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              {filteredCustomers.length}件
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card 
            key={customer.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCustomerClick(customer.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {customer.kana}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
              )}
              {customer.birthDate && (
                <div className="text-sm text-gray-600">
                  生年月日: {format(customer.birthDate, 'yyyy年MM月dd日', { locale: ja })}
                </div>
              )}
              <div className="text-xs text-gray-400">
                登録日: {format(customer.createdAt, 'yyyy/MM/dd', { locale: ja })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? '該当する顧客が見つかりません' : '顧客データがありません'}
            </h3>
            <p className="text-gray-600 mb-4">
              {search ? '検索条件を変更してお試しください' : '新規顧客を登録してください'}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新規顧客登録
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customerId={selectedCustomer}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}