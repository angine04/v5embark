'use client'

import { RegistrationLayout } from '@/components/layout/RegistrationLayout'
import { useInitialFormStore, useBasicInfoStore, useContactStore, useGlobalStore } from '@/store/registration'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm'

export default function PersonalInfoPage() {
  const { formData: initialFormData } = useInitialFormStore()
  const { formData: basicInfoData } = useBasicInfoStore()
  const { formData: contactData } = useContactStore()
  const { currentStep } = useGlobalStore()
  const router = useRouter()

  useEffect(() => {
    console.log('Personal Info Page - Initial Form Data:', initialFormData)
    console.log('Personal Info Page - Basic Info Data:', basicInfoData)
    console.log('Personal Info Page - Contact Data:', contactData)
    console.log('Personal Info Page - Current Step:', currentStep)

    // 如果没有初始信息，重定向到首页
    if (!initialFormData.studentId || !initialFormData.name) {
      console.log('Personal Info Page - No initial info, redirecting to home')
      router.push('/')
      return
    }

    // 如果没有基本信息，重定向到基本信息页面
    if (!basicInfoData.year || !basicInfoData.gender || !basicInfoData.college || !basicInfoData.major || !basicInfoData.techGroup) {
      console.log('Personal Info Page - No basic info, redirecting to registration')
      router.push('/registration')
      return
    }

    // 如果没有联系方式，重定向到联系方式页面
    if (!contactData.phone || !contactData.email || !contactData.qq) {
      console.log('Personal Info Page - No contact info, redirecting to contact')
      router.push('/registration/contact')
      return
    }

    // 如果当前步骤小于2，重定向到联系方式页面
    if (currentStep < 2) {
      console.log('Personal Info Page - Current step < 2, redirecting to contact')
      router.push('/registration/contact')
      return
    }
  }, [initialFormData, basicInfoData, contactData, currentStep, router])

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">个人信息</h1>
          <p className="text-base md:text-xl text-gray-600">
            请填写您的个人基本信息
          </p>
        </div>
      }
    >
      <PersonalInfoForm />
    </RegistrationLayout>
  )
} 