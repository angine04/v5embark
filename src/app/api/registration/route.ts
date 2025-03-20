import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import EnrolledStudent from '@/models/EnrolledStudent'
import User from '@/models/User'

interface ValidationError extends Error {
  name: string;
  errors: {
    [key: string]: {
      message: string;
    }
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    
    console.log('Registration data received:', JSON.stringify(data, null, 2))

    // 检查是否在已录取名单中
    const enrolledStudent = await EnrolledStudent.findOne({ studentId: data.studentId })
    console.log('Enrolled student check:', { studentId: data.studentId, found: !!enrolledStudent })
    
    if (!enrolledStudent) {
      return NextResponse.json({ error: '您不在录取名单中' }, { status: 403 })
    }

    // 检查是否已完成注册
    const existingUser = await User.findOne({ studentId: data.studentId })
    console.log('Existing user check:', { studentId: data.studentId, exists: !!existingUser })
    
    if (existingUser) {
      return NextResponse.json({ error: '您已完成注册' }, { status: 409 })
    }

    // 添加详细的数据结构验证
    if (!data.studentId || !data.name) {
      console.error('数据验证失败: 缺少studentId或name字段')
      return NextResponse.json({ error: '数据验证失败: 缺少必要信息' }, { status: 400 })
    }
    
    if (!data.basicInfo || !data.contact || !data.personalInfo) {
      console.error('数据验证失败: 缺少基本信息、联系方式或个人信息字段', {
        hasBasicInfo: !!data.basicInfo,
        hasContact: !!data.contact,
        hasPersonalInfo: !!data.personalInfo
      })
      return NextResponse.json({ error: '数据验证失败: 缺少必要信息' }, { status: 400 })
    }

    try {
      // 保存注册数据
      const user = new User({
        studentId: data.studentId,
        name: data.name,
        basicInfo: data.basicInfo,
        contact: data.contact,
        personalInfo: data.personalInfo,
      })

      console.log('Attempting to save user, data structure:', {
        studentId: !!data.studentId,
        name: !!data.name,
        basicInfo: !!data.basicInfo,
        contact: !!data.contact,
        personalInfo: !!data.personalInfo,
      })
      
      await user.save()
      console.log('User saved successfully')

      // 获取已录取学生的用户名和初始密码
      const credentials = {
        username: enrolledStudent.username,
        initialPassword: enrolledStudent.initialPassword
      }

      return NextResponse.json({ 
        success: true,
        credentials
      })
    } catch (saveError: unknown) {
      console.error('MongoDB save error:', {
        error: saveError instanceof Error ? saveError.message : saveError,
        stack: saveError instanceof Error ? saveError.stack : undefined,
      })
      
      // 检查是否是验证错误
      if (saveError instanceof Error && saveError.name === 'ValidationError') {
        const validationErrors: Record<string, string> = {};
        const validationError = saveError as ValidationError;
        
        for (const field in validationError.errors) {
          validationErrors[field] = validationError.errors[field].message;
        }
        
        console.error('MongoDB validation errors:', validationErrors)
        return NextResponse.json({ 
          error: '数据验证失败', 
          details: validationErrors 
        }, { status: 400 })
      }
      
      throw saveError; // 让外层catch处理
    }
  } catch (error) {
    console.error('Registration error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      data: error
    })
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
} 