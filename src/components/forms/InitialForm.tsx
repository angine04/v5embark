'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useInitialFormStore, useGlobalStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const initialSchema = z.object({
  studentId: z.string()
    .min(10, '请输入正确的学号')
    .max(10, '请输入正确的学号')
    .regex(/^\d{10}$/, '请输入正确的学号'),
  name: z.string().min(1, '请输入姓名'),
})

type InitialFormData = z.infer<typeof initialSchema>

export function InitialForm() {
  const { formData, setFormData } = useInitialFormStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitialFormData>({
    resolver: zodResolver(initialSchema),
    defaultValues: {
      studentId: formData.studentId || '',
      name: formData.name || '',
    }
  })

  const onSubmit = async (data: InitialFormData) => {
    try {
      console.log('Checking registration status for:', data.studentId)
      
      const response = await fetch(`/api/registration/check?studentId=${data.studentId}`)
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error:', errorData)
        throw new Error(errorData.error || '验证失败')
      }

      const result = await response.json()
      console.log('API result:', result)

      if (result.completed) {
        console.log('Registration already completed')
        // 清除所有 localStorage 数据
        localStorage.removeItem('registration-initial')
        localStorage.removeItem('registration-basic')
        localStorage.removeItem('registration-contact')
        localStorage.removeItem('registration-personal')
        localStorage.removeItem('registration-account')
        localStorage.removeItem('registration-global')
        
        // 设置用户数据并跳转到成功页面
        setFormData({
          studentId: result.user.studentId,
          name: result.user.name
        })
        router.push('/registration/success')
        return
      }

      if (!result.enrolled) {
        console.log('Student not enrolled')
        setError('您不在录取名单中')
        return
      }

      if (data.name !== result.name) {
        console.log('Name mismatch')
        setError('姓名与录取信息不符')
        return
      }

      console.log('Proceeding with registration')
      setFormData(data)
      setCurrentStep(1)
      router.push('/registration')
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : '验证失败，请稍后重试')
    }
  }

  console.log('InitialForm - Rendering with formData:', formData)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div className="h-[76px]">
        <Label htmlFor="studentId" className="text-base text-gray-900">学号</Label>
        <Input
          id="studentId"
          type="text"
          {...register('studentId')}
          placeholder="请输入您的学号"
          className={`h-11 text-base mt-2 ${errors.studentId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.studentId && (
          <p className="text-sm text-red-500 mt-1">{errors.studentId.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="name" className="text-base text-gray-900">姓名</Label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          placeholder="请输入您的姓名"
          className={`h-11 text-base mt-2 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-3">{error}</p>
      )}

      <Button 
        type="submit" 
        className="w-full h-11 text-base"
      >
        下一步
      </Button>
    </form>
  )
} 