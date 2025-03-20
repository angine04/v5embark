'use client'

import { RegistrationLayout } from '@/components/layout/RegistrationLayout'
import { useInitialFormStore, useBasicInfoStore, useContactStore, usePersonalInfoStore, useGlobalStore } from '@/store/registration'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CredentialsForm } from '@/components/forms/CredentialsForm'

export default function CredentialsPage() {
  const { formData: initialFormData } = useInitialFormStore()
  const { formData: basicInfoData } = useBasicInfoStore()
  const { formData: contactData } = useContactStore()
  const { formData: personalInfoData } = usePersonalInfoStore()
  const { currentStep } = useGlobalStore()
  const router = useRouter()

  useEffect(() => {
    console.log('Credentials Page - Initial Form Data:', initialFormData)
    console.log('Credentials Page - Basic Info Data:', basicInfoData)
    console.log('Credentials Page - Contact Data:', contactData)
    console.log('Credentials Page - Personal Info Data:', personalInfoData)
    console.log('Credentials Page - Current Step:', currentStep)

    // 如果没有初始信息，重定向到首页
    if (!initialFormData.studentId || !initialFormData.name) {
      console.log('Credentials Page - No initial info, redirecting to home')
      router.push('/')
      return
    }

    // 如果没有基本信息，重定向到基本信息页面
    if (!basicInfoData.year || !basicInfoData.gender || !basicInfoData.college || !basicInfoData.major || !basicInfoData.techGroup) {
      console.log('Credentials Page - No basic info, redirecting to registration')
      router.push('/registration')
      return
    }

    // 如果没有联系方式，重定向到联系方式页面
    if (!contactData.phone || !contactData.email || !contactData.qq) {
      console.log('Credentials Page - No contact info, redirecting to contact')
      router.push('/registration/contact')
      return
    }

    // 如果没有个人信息，重定向到个人信息页面
    if (!personalInfoData.idCard || !personalInfoData.birthday || !personalInfoData.hometown || 
        !personalInfoData.currentResidence || !personalInfoData.ethnicity || 
        !personalInfoData.highSchool) {
      console.log('Credentials Page - No personal info, redirecting to experience')
      router.push('/registration/experience')
      return
    }

    // 如果当前步骤小于3，重定向到个人信息页面
    if (currentStep < 3) {
      console.log('Credentials Page - Current step < 3, redirecting to experience')
      router.push('/registration/experience')
      return
    }
  }, [initialFormData, basicInfoData, contactData, personalInfoData, currentStep, router])

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">设置账号</h1>
          <p className="text-base md:text-xl text-gray-600">
            请设置您的v5Key账号凭据
          </p>
        </div>
      }
    >
      <CredentialsForm />
    </RegistrationLayout>
  )
} 