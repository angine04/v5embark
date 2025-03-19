'use client'

import { RegistrationLayout } from '@/components/layout/RegistrationLayout'
import { useInitialFormStore, useGlobalStore } from '@/store/registration'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InitialForm } from '@/components/forms/InitialForm'

export default function HomePage() {
  const { formData } = useInitialFormStore()
  const { currentStep } = useGlobalStore()
  const router = useRouter()

  useEffect(() => {
    console.log('Home Page - Initial Form Data:', formData)
    console.log('Home Page - Current Step:', currentStep)
    
    // 只有当当前步骤大于0时才自动跳转到基本信息页面
    if (currentStep > 0 && formData.studentId && formData.name) {
      console.log('Home Page - Initial info already filled and step > 0, redirecting to registration')
      router.push('/registration')
    }
  }, [formData, currentStep, router])

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">你好</h1>
          <p className="text-base md:text-xl text-gray-600">
            请填写学号和姓名
          </p>
        </div>
      }
    >
      <InitialForm />
    </RegistrationLayout>
  )
}
