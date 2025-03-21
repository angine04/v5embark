'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePersonalInfoStore, useGlobalStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const personalInfoSchema = z.object({
  idCard: z.string()
    .min(18, '请输入正确的身份证号')
    .max(18, '请输入正确的身份证号')
    .regex(/^\d{17}[\dX]$/, '请输入正确的身份证号'),
  birthday: z.string()
    .min(1, '请输入出生日期')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '请输入正确的日期格式（YYYY-MM-DD）'),
  hometown: z.string()
    .min(1, '请输入户籍所在地'),
  currentResidence: z.string()
    .min(1, '请输入常住地'),
  ethnicity: z.string()
    .min(1, '请输入民族'),
  dietaryRestrictions: z.string()
    .optional()
    .transform(val => val || '无'),
  highSchool: z.string()
    .min(1, '请输入生源高中'),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

export function PersonalInfoForm() {
  const { formData, setFormData, resetForm } = usePersonalInfoStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      idCard: formData.idCard || '',
      birthday: formData.birthday || '',
      hometown: formData.hometown || '',
      currentResidence: formData.currentResidence || '',
      ethnicity: formData.ethnicity || '',
      dietaryRestrictions: formData.dietaryRestrictions || '',
      highSchool: formData.highSchool || '',
    }
  })

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      console.log('PersonalInfoForm - Saving data:', data)
      setFormData(data)
      setCurrentStep(3)
      router.push('/registration/credentials')
    } catch (err) {
      console.error('PersonalInfoForm - Error:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const handlePrevStep = () => {
    console.log('PersonalInfoForm - Prev button clicked, resetting personal info data')
    resetForm()
    setCurrentStep(2)
    router.push('/registration/contact')
  }

  console.log('PersonalInfoForm - Rendering with formData:', formData)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div className="h-[76px]">
        <Label htmlFor="idCard" className="text-base text-gray-900">身份证号</Label>
        <Input
          id="idCard"
          type="text"
          {...register('idCard')}
          placeholder="请输入您的身份证号"
          className={`h-11 text-base mt-2 ${errors.idCard ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.idCard && (
          <p className="text-sm text-red-500 mt-1">{errors.idCard.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="birthday" className="text-base text-gray-900">出生日期</Label>
        <Input
          id="birthday"
          type="date"
          max={new Date().toISOString().split('T')[0]}
          min="1900-01-01"
          {...register('birthday')}
          className={`h-11 text-base mt-2 date-input ${errors.birthday ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.birthday && (
          <p className="text-sm text-red-500 mt-1">{errors.birthday.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="hometown" className="text-base text-gray-900">户籍所在地</Label>
        <Input
          id="hometown"
          type="text"
          {...register('hometown')}
          placeholder="请输入您的户籍所在地"
          className={`h-11 text-base mt-2 ${errors.hometown ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.hometown && (
          <p className="text-sm text-red-500 mt-1">{errors.hometown.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="currentResidence" className="text-base text-gray-900">常住地</Label>
        <Input
          id="currentResidence"
          type="text"
          {...register('currentResidence')}
          placeholder="请输入您的常住地"
          className={`h-11 text-base mt-2 ${errors.currentResidence ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.currentResidence && (
          <p className="text-sm text-red-500 mt-1">{errors.currentResidence.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="ethnicity" className="text-base text-gray-900">民族</Label>
        <Input
          id="ethnicity"
          type="text"
          {...register('ethnicity')}
          placeholder="请输入您的民族"
          className={`h-11 text-base mt-2 ${errors.ethnicity ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.ethnicity && (
          <p className="text-sm text-red-500 mt-1">{errors.ethnicity.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="dietaryRestrictions" className="text-base text-gray-900">忌口</Label>
        <Input
          id="dietaryRestrictions"
          type="text"
          {...register('dietaryRestrictions')}
          placeholder="如果没有忌口，请留空"
          className={`h-11 text-base mt-2 ${errors.dietaryRestrictions ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.dietaryRestrictions && (
          <p className="text-sm text-red-500 mt-1">{errors.dietaryRestrictions.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="highSchool" className="text-base text-gray-900">生源高中</Label>
        <Input
          id="highSchool"
          type="text"
          {...register('highSchool')}
          placeholder="请输入您的生源高中"
          className={`h-11 text-base mt-2 ${errors.highSchool ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.highSchool && (
          <p className="text-sm text-red-500 mt-1">{errors.highSchool.message}</p>
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