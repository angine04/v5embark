'use client'

import { RegistrationLayout } from '@/components/layout/RegistrationLayout'
import { useInitialFormStore, useBasicInfoStore, useGlobalStore } from '@/store/registration'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BasicInfoForm } from '@/components/forms/BasicInfoForm'

export default function RegistrationPage() {
  const initialFormData = useInitialFormStore((state) => state.formData)
  const basicInfoData = useBasicInfoStore((state) => state.formData)
  const { currentStep } = useGlobalStore()
  const router = useRouter()

  useEffect(() => {
    console.log('Registration Page - Initial Form Data:', initialFormData)
    console.log('Registration Page - Basic Info Data:', basicInfoData)
    console.log('Registration Page - Current Step:', currentStep)
    
    // 如果没有初始信息，返回首页
    if (!initialFormData.studentId || !initialFormData.name) {
      console.log('Registration Page - Missing initial info, redirecting to home')
      router.push('/')
      return
    }

    // 只有当当前步骤大于1时才自动跳转到联系方式页面
    if (currentStep > 1 && basicInfoData.year && basicInfoData.gender && 
        basicInfoData.college && basicInfoData.major && 
        basicInfoData.techGroup) {
      console.log('Registration Page - Basic info already filled and step > 1, redirecting to contact')
      router.push('/registration/contact')
    }
  }, [initialFormData, basicInfoData, currentStep, router])

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">让我们更熟悉些</h1>
          <p className="text-base md:text-xl text-gray-600">
            请输入您的基本信息
          </p>
        </div>
      }
    >
      <BasicInfoForm />
    </RegistrationLayout>
  )
} 