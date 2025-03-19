'use client'

import { RegistrationLayout } from '@/components/layout/RegistrationLayout'
import { useInitialFormStore, useBasicInfoStore, useGlobalStore } from '@/store/registration'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ContactForm } from '@/components/forms/ContactForm'

export default function ContactPage() {
  const { formData: initialFormData } = useInitialFormStore()
  const { formData: basicInfoData } = useBasicInfoStore()
  const { currentStep } = useGlobalStore()
  const router = useRouter()

  useEffect(() => {
    console.log('Contact Page - Initial Form Data:', initialFormData)
    console.log('Contact Page - Basic Info Data:', basicInfoData)
    console.log('Contact Page - Current Step:', currentStep)

    // 如果没有初始信息，重定向到首页
    if (!initialFormData.studentId || !initialFormData.name) {
      console.log('Contact Page - No initial info, redirecting to home')
      router.push('/')
      return
    }

    // 如果没有基本信息，重定向到基本信息页面
    if (!basicInfoData.year || !basicInfoData.gender || !basicInfoData.college || !basicInfoData.major || !basicInfoData.techGroup) {
      console.log('Contact Page - No basic info, redirecting to registration')
      router.push('/registration')
      return
    }

    // 如果当前步骤小于1，重定向到基本信息页面
    if (currentStep < 1) {
      console.log('Contact Page - Current step < 1, redirecting to registration')
      router.push('/registration')
      return
    }
  }, [initialFormData, basicInfoData, currentStep, router])

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">常联系</h1>
          <p className="text-base md:text-xl text-gray-600">
            请填写您的联系方式
          </p>
        </div>
      }
    >
      <ContactForm />
    </RegistrationLayout>
  )
} 