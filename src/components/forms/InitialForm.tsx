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
    .min(7, '请输入正确的学号')
    .max(7, '请输入正确的学号')
    .regex(/^\d{7}$/, '请输入正确的学号'),
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
      console.log('InitialForm - Submitting data:', data)
      setFormData(data)
      setCurrentStep(1)
      router.push('/registration')
    } catch (err) {
      console.error('InitialForm - Submit error:', err)
      setError(err instanceof Error ? err.message : '保存失败')
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