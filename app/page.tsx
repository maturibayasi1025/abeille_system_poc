'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth/auth'

export default function Home() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const router = useRouter()
  
  useEffect(() => {
    if (checkAuth()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [checkAuth, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-500">リダイレクト中...</div>
    </div>
  )
}