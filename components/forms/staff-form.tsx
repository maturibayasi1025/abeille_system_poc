'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useStaffStore } from '@/lib/store/staffStore'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { X, Plus } from 'lucide-react'

const staffSchema = z.object({
  name: z.string().min(1, '氏名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(1, '電話番号は必須です'),
  role: z.enum(['admin', 'manager', 'staff', 'trainee']),
  hireDate: z.string().min(1, '入社日は必須です'),
  isActive: z.boolean().default(true),
})

type StaffFormData = z.infer<typeof staffSchema>

interface StaffFormProps {
  staffId?: string | null
  onClose: () => void
}

const availableSkills = [
  { id: '1', name: 'カット' },
  { id: '2', name: 'カラー' },
  { id: '3', name: 'パーマ' },
  { id: '4', name: 'トリートメント' },
  { id: '5', name: 'セット' },
  { id: '6', name: 'メイク' },
  { id: '7', name: 'ネイル' },
  { id: '8', name: 'アイラッシュ' },
  { id: '9', name: 'ヘッドスパ' },
  { id: '10', name: '接客' }
]

const skillLevels = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
  { value: 'expert', label: 'エキスパート' }
]

export function StaffForm({ staffId, onClose }: StaffFormProps) {
  const [skills, setSkills] = useState<Array<{ id: string; name: string; level: string }>>([])
  const [loading, setLoading] = useState(false)
  
  const { staff, addStaff, updateStaff, getStaff } = useStaffStore()
  
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      hireDate: '',
      isActive: true,
    }
  })
  
  useEffect(() => {
    if (staffId) {
      const staffMember = getStaff(staffId)
      if (staffMember) {
        form.reset({
          name: staffMember.name,
          email: staffMember.email,
          phone: staffMember.phone,
          role: staffMember.role,
          hireDate: staffMember.hireDate.toISOString().split('T')[0],
          isActive: staffMember.isActive,
        })
        setSkills(staffMember.skills)
      }
    }
  }, [staffId, getStaff, form])
  
  const onSubmit = async (data: StaffFormData) => {
    setLoading(true)
    try {
      const staffData = {
        ...data,
        hireDate: new Date(data.hireDate),
        skills,
      }
      
      if (staffId) {
        await updateStaff(staffId, staffData)
      } else {
        await addStaff(staffData)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save staff:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const addSkill = (skillId: string, skillName: string) => {
    if (!skills.find(s => s.id === skillId)) {
      setSkills([...skills, { id: skillId, name: skillName, level: 'beginner' }])
    }
  }
  
  const removeSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId))
  }
  
  const updateSkillLevel = (skillId: string, level: string) => {
    setSkills(skills.map(s => 
      s.id === skillId ? { ...s, level } : s
    ))
  }
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理者'
      case 'manager':
        return 'マネージャー'
      case 'staff':
        return 'スタッフ'
      case 'trainee':
        return '研修生'
      default:
        return role
    }
  }
  
  const getSkillColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800'
      case 'advanced':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-green-100 text-green-800'
      case 'beginner':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {staffId ? 'スタッフ情報編集' : '新規スタッフ登録'}
          </DialogTitle>
          <DialogDescription>
            スタッフの基本情報とスキルを入力してください。
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="田中太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス *</FormLabel>
                    <FormControl>
                      <Input placeholder="tanaka@salon.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号 *</FormLabel>
                    <FormControl>
                      <Input placeholder="090-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="trainee">研修生</SelectItem>
                        <SelectItem value="staff">スタッフ</SelectItem>
                        <SelectItem value="manager">マネージャー</SelectItem>
                        <SelectItem value="admin">管理者</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>入社日 *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      アクティブ（勤務中）
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Skills Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">スキル</Label>
                <Select onValueChange={(value) => {
                  const skill = availableSkills.find(s => s.id === value)
                  if (skill) addSkill(skill.id, skill.name)
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="スキルを追加" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills
                      .filter(skill => !skills.find(s => s.id === skill.id))
                      .map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <Select 
                      value={skill.level} 
                      onValueChange={(level) => updateSkillLevel(skill.id, level)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge className={getSkillColor(skill.level)}>
                      {skillLevels.find(l => l.value === skill.level)?.label}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {skills.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>スキルが登録されていません</p>
                    <p className="text-sm">上記のドロップダウンからスキルを追加してください</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : (staffId ? '更新' : '登録')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}