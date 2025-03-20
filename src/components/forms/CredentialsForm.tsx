'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCredentialsStore, useGlobalStore, useInitialFormStore, usePersonalInfoStore, useBasicInfoStore, useContactStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { pinyin } from 'pinyin-pro'

const credentialsSchema = z.object({
  username: z.string().min(2, '用户名至少需要2个字符'),
  password: z.string().min(8, '密码至少需要8个字符'),
})

type CredentialsFormData = z.infer<typeof credentialsSchema>

export function CredentialsForm() {
  const { formData, setFormData } = useCredentialsStore()
  const { formData: initialFormData } = useInitialFormStore()
  const { formData: personalInfoData } = usePersonalInfoStore()
  const { formData: basicInfoData } = useBasicInfoStore()
  const { formData: contactData } = useContactStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // 生成默认用户名（使用姓名拼音首字母）
  const generateDefaultUsername = () => {
    if (initialFormData.name) {
      // 使用pinyin-pro获取拼音首字母
      const pinyinResult = pinyin(initialFormData.name, { 
        pattern: 'first', // 只获取首字母
        toneType: 'none', // 不带声调
        type: 'array' // 返回数组
      })
      
      // 将拼音首字母连接起来
      return pinyinResult.join('').toLowerCase()
    }
    return ''
  }
  
  // 生成用户全名的拼音（名在前，姓在后）
  const generatePinyinName = (chineseName: string) => {
    if (!chineseName) return '';
    
    // 假设中文名字的第一个字是姓，其余是名
    const surname = chineseName.charAt(0);
    const givenName = chineseName.substring(1);
    
    const surnamePinyin = pinyin(surname, { 
      toneType: 'none',
      type: 'string',
      v: true, 
    });
    
    const givenNamePinyin = pinyin(givenName, {
      toneType: 'none',
      type: 'string',
      v: true,
    });
    
    // 名在前，姓在后，每个部分作为整体首字母大写
    return `${capitalize(givenNamePinyin.replace(/\s+/g, ''))} ${capitalize(surnamePinyin)}`;
  }
  
  // 首字母大写，不再拆分空格
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      username: formData.username || '',
      password: formData.password || '',
    }
  })

  // 当组件加载时，如果用户名为空，则设置默认用户名
  useEffect(() => {
    if (!formData.username) {
      const defaultUsername = generateDefaultUsername()
      setValue('username', defaultUsername)
    }
  }, [formData.username, initialFormData.name, setValue])

  const onSubmit = async (data: CredentialsFormData) => {
    try {
      setFormData(data)
      setCurrentStep(4)
      setIsSubmitting(true)

      // 然后创建Authentik用户
      const authResponse = await fetch('/api/registration/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          name: generatePinyinName(initialFormData.name),
          email: contactData.email,
          studentId: initialFormData.studentId,
        }),
      })

      if (!authResponse.ok) {
        const errorData = await authResponse.json().catch(() => ({}))
        throw new Error(errorData.error || '创建用户失败')
      }

      // 构建完整的注册数据
      const registrationData = {
        studentId: initialFormData.studentId,
        name: initialFormData.name,
        basicInfo: {
          year: basicInfoData.year,
          gender: basicInfoData.gender,
          college: basicInfoData.college,
          major: basicInfoData.major,
          techGroup: basicInfoData.techGroup
        },
        contact: {
          phone: contactData.phone,
          email: contactData.email,
          qq: contactData.qq
        },
        personalInfo: {
          idCard: personalInfoData.idCard,
          birthday: personalInfoData.birthday,
          hometown: personalInfoData.hometown,
          currentResidence: personalInfoData.currentResidence,
          ethnicity: personalInfoData.ethnicity,
          dietaryRestrictions: personalInfoData.dietaryRestrictions,
          highSchool: personalInfoData.highSchool
        },
        credentials: {
          username: data.username
        }
      }

      // 提交注册数据到数据库
      const registerResponse = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
      
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json().catch(() => ({}))
        throw new Error(errorData.error || '保存用户信息失败')
      }

      router.push('/registration/success')
    } catch (err) {
      console.error('CredentialsForm - Submit error:', err)
      setError(err instanceof Error ? err.message : '注册失败')
      setIsSubmitting(false)
    }
  }

  const handlePrevStep = () => {
    router.push('/registration/experience')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div className="h-[76px]">
        <Label htmlFor="username" className="text-base text-gray-900">用户名</Label>
        <Input
          id="username"
          {...register('username')}
          placeholder="请输入用户名"
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
          placeholder="请设置密码"
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
          disabled={isSubmitting}
        >
          上一步
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-11 text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? '注册中...' : '完成注册'}
        </Button>
      </div>
    </form>
  )
} 