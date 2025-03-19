'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useContactStore, useGlobalStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const contactSchema = z.object({
  phone: z.string()
    .min(11, '请输入正确的手机号')
    .max(11, '请输入正确的手机号')
    .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
  email: z.string()
    .min(1, '请输入邮箱')
    .email('请输入正确的邮箱'),
  qq: z.string()
    .min(5, '请输入正确的QQ号')
    .max(11, '请输入正确的QQ号')
    .regex(/^\d{5,11}$/, '请输入正确的QQ号'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const { formData, setFormData, resetForm } = useContactStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: formData.phone || '',
      email: formData.email || '',
      qq: formData.qq || '',
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log('ContactForm - Submitting data:', data)
      setFormData(data)
      setCurrentStep(2)
      router.push('/registration/experience')
    } catch (err) {
      console.error('ContactForm - Submit error:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const handlePrevStep = () => {
    console.log('ContactForm - Prev button clicked, resetting contact data')
    resetForm()
    setCurrentStep(1)
    router.push('/registration')
  }

  console.log('ContactForm - Rendering with formData:', formData)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div className="h-[76px]">
        <Label htmlFor="phone" className="text-base text-gray-900">手机号</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="请输入您的手机号"
          className={`h-11 text-base mt-2 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="email" className="text-base text-gray-900">邮箱</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="请输入您的邮箱"
          className={`h-11 text-base mt-2 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="qq" className="text-base text-gray-900">QQ号</Label>
        <Input
          id="qq"
          type="text"
          {...register('qq')}
          placeholder="请输入您的QQ号"
          className={`h-11 text-base mt-2 ${errors.qq ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.qq && (
          <p className="text-sm text-red-500 mt-1">{errors.qq.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-3">{error}</p>
      )}

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          className="flex-1 h-11 text-base text-gray-900"
          onClick={handlePrevStep}
        >
          上一步
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-11 text-base"
        >
          下一步
        </Button>
      </div>
    </form>
  )
} 