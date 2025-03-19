'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAccountStore, useGlobalStore, useInitialFormStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { pinyin } from 'pinyin-pro'

const accountSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '用户名必须以字母开头，只能包含字母、数字和下划线'),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(20, '密码最多20个字符')
    .regex(/^[A-Za-z0-9@$!%*?&_-]+$/, '密码只能包含字母、数字和常用特殊字符'),
})

type AccountFormData = z.infer<typeof accountSchema>

export function AccountForm() {
  const { formData, setFormData, resetForm } = useAccountStore()
  const { formData: initialFormData } = useInitialFormStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [suggestedUsername, setSuggestedUsername] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: formData.username || '',
      password: formData.password || '',
    }
  })

  // 生成推荐用户名
  useEffect(() => {
    if (initialFormData.name) {
      // 将中文名转换为拼音首字母
      const pinyinInitials = pinyin(initialFormData.name, { 
        pattern: 'first', 
        toneType: 'none',
        type: 'array'
      }).join('')
      
      // // 添加学号后四位作为后缀
      // const studentIdSuffix = initialFormData.studentId.slice(-4)
      const suggested = `${pinyinInitials}`
      
      setSuggestedUsername(suggested)
      if (!formData.username) {
        setValue('username', suggested)
      }
    }
  }, [initialFormData.name, initialFormData.studentId, formData.username, setValue])

  const onSubmit = async (data: AccountFormData) => {
    try {
      console.log('AccountForm - Submitting data:', data)
      setFormData(data)
      setCurrentStep(4)
      router.push('/registration/success')
    } catch (err) {
      console.error('AccountForm - Submit error:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const handlePrevStep = () => {
    console.log('AccountForm - Prev button clicked, resetting account data')
    resetForm()
    setCurrentStep(3)
    router.push('/registration/experience')
  }

  console.log('AccountForm - Rendering with formData:', formData)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div className="h-[76px]">
        <Label htmlFor="username" className="text-base text-gray-900">用户名</Label>
        <Input
          id="username"
          type="text"
          {...register('username')}
          placeholder={`推荐使用：${suggestedUsername}`}
          className={`h-11 text-base mt-2 ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="h-[76px]">
        <Label htmlFor="password" className="text-base text-gray-900">密码</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="请设置您的密码"
          className={`h-11 text-base mt-2 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
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