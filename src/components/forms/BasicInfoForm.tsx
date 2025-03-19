'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useBasicInfoStore, useGlobalStore, useInitialFormStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const basicInfoSchema = z.object({
  year: z.string().min(1, '请选择年级'),
  gender: z.enum(['male', 'female'], {
    required_error: '请选择性别',
  }),
  college: z.string().min(1, '请输入学院'),
  major: z.string().min(1, '请输入专业'),
  techGroup: z.enum(['software', 'hardware', 'mechanical'], {
    required_error: '请选择技术组别',
  }),
})

type BasicInfoFormData = z.infer<typeof basicInfoSchema>

export function BasicInfoForm() {
  const { formData, setFormData, resetForm } = useBasicInfoStore()
  const { resetForm: resetInitialForm } = useInitialFormStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      year: formData.year || '',
      gender: formData.gender || undefined,
      college: formData.college || '',
      major: formData.major || '',
      techGroup: formData.techGroup || undefined,
    }
  })

  const onSubmit = async (data: BasicInfoFormData) => {
    try {
      setFormData(data)
      setCurrentStep(1)
      router.push('/registration/contact')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const handlePrevStep = () => {
    console.log('BasicInfoForm - Prev button clicked, resetting all data')
    resetForm()
    resetInitialForm()
    setCurrentStep(0)
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="h-[76px]">
          <Label htmlFor="year" className="text-base text-gray-900">年级</Label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className={`h-11 text-base mt-2 text-gray-900 ${errors.year ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                  <SelectValue placeholder="请选择年级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024" className="text-gray-900">2024级</SelectItem>
                  <SelectItem value="2023" className="text-gray-900">2023级</SelectItem>
                  <SelectItem value="2022" className="text-gray-900">2022级</SelectItem>
                  <SelectItem value="2021" className="text-gray-900">2021级</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="h-[76px]">
          <Label htmlFor="gender" className="text-base text-gray-900">性别</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className={`h-11 text-base mt-2 text-gray-900 ${errors.gender ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="text-gray-900">男</SelectItem>
                  <SelectItem value="female" className="text-gray-900">女</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="h-[76px]">
        <Label htmlFor="college" className="text-base text-gray-900">学院</Label>
        <Input
          id="college"
          {...register('college')}
          placeholder="请输入您的学院"
          className={`h-11 text-base mt-2 ${errors.college ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
      </div>

      <div className="h-[76px]">
        <Label htmlFor="major" className="text-base text-gray-900">专业</Label>
        <Input
          id="major"
          {...register('major')}
          placeholder="请输入您的专业"
          className={`h-11 text-base mt-2 ${errors.major ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
      </div>

      <div className="h-[76px]">
        <Label htmlFor="techGroup" className="text-base text-gray-900">技术组别</Label>
        <Controller
          name="techGroup"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className={`h-11 text-base mt-2 text-gray-900 ${errors.techGroup ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                <SelectValue placeholder="请选择技术组别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software" className="text-gray-900">软件组</SelectItem>
                <SelectItem value="hardware" className="text-gray-900">硬件组</SelectItem>
                <SelectItem value="mechanical" className="text-gray-900">机械组</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
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