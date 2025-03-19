'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useExperienceStore, useGlobalStore } from '@/store/registration'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const experienceSchema = z.object({
  skills: z.string()
    .min(1, '请填写您的技能特长')
    .max(1000, '技能特长不能超过1000字'),
  projects: z.string()
    .min(1, '请填写您的项目经历')
    .max(2000, '项目经历不能超过2000字'),
  awards: z.string()
    .min(1, '请填写您的获奖情况')
    .max(1000, '获奖情况不能超过1000字'),
  expectations: z.string()
    .min(1, '请填写您的期望')
    .max(1000, '期望不能超过1000字'),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

export function ExperienceForm() {
  const { formData, setFormData, resetForm } = useExperienceStore()
  const { setCurrentStep } = useGlobalStore()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      skills: formData.skills || '',
      projects: formData.projects || '',
      awards: formData.awards || '',
      expectations: formData.expectations || '',
    }
  })

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      console.log('ExperienceForm - Submitting data:', data)
      setFormData(data)
      setCurrentStep(3)
      router.push('/registration/review')
    } catch (err) {
      console.error('ExperienceForm - Submit error:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const handlePrevStep = () => {
    console.log('ExperienceForm - Prev button clicked, resetting experience data')
    resetForm()
    setCurrentStep(2)
    router.push('/registration/contact')
  }

  console.log('ExperienceForm - Rendering with formData:', formData)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-lato space-y-6">
      <div>
        <Label htmlFor="skills" className="text-base text-gray-900">技能特长</Label>
        <Textarea
          id="skills"
          {...register('skills')}
          placeholder="请详细描述您的技能特长，包括但不限于：编程语言、开发工具、技术框架等"
          className={`h-32 text-base mt-2 ${errors.skills ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.skills && (
          <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="projects" className="text-base text-gray-900">项目经历</Label>
        <Textarea
          id="projects"
          {...register('projects')}
          placeholder="请详细描述您参与过的项目，包括但不限于：项目名称、您的角色、主要工作内容、项目成果等"
          className={`h-48 text-base mt-2 ${errors.projects ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.projects && (
          <p className="text-sm text-red-500 mt-1">{errors.projects.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="awards" className="text-base text-gray-900">获奖情况</Label>
        <Textarea
          id="awards"
          {...register('awards')}
          placeholder="请详细描述您的获奖情况，包括但不限于：比赛名称、获奖等级、获奖时间等"
          className={`h-32 text-base mt-2 ${errors.awards ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.awards && (
          <p className="text-sm text-red-500 mt-1">{errors.awards.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="expectations" className="text-base text-gray-900">期望</Label>
        <Textarea
          id="expectations"
          {...register('expectations')}
          placeholder="请描述您加入战队的期望，包括但不限于：想要学习的内容、想要参与的项目、对自己的规划等"
          className={`h-32 text-base mt-2 ${errors.expectations ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.expectations && (
          <p className="text-sm text-red-500 mt-1">{errors.expectations.message}</p>
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