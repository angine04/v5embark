'use client'

import { RegistrationLayout } from '@/components/layout/RegistrationLayout'
import { useInitialFormStore } from '@/store/registration'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const { formData: initialFormData } = useInitialFormStore()
  const router = useRouter()

  useEffect(() => {
    // 如果没有初始信息，重定向到首页
    if (!initialFormData.studentId || !initialFormData.name) {
      router.push('/')
      return
    }
  }, [initialFormData, router])

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">欢迎加入V5++</h1>
          <div className="space-y-4 text-base md:text-xl text-gray-600">
            <p>您已成功完成注册！接下来：</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>请加入战队招新群：123456789</li>
            </ol>
          </div>
        </div>
      }
    >
      <div className="space-y-6 p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">注册成功</h2>
            <p className="text-gray-600">您的信息已提交</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">姓名：{initialFormData.name}</p>
          <p className="text-gray-600">学号：{initialFormData.studentId}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>请保存此页面信息，并按照左侧说明继续操作</p>
        </div>
      </div>
    </RegistrationLayout>
  )
} 