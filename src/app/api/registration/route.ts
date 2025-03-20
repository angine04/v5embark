import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

interface ValidationError extends Error {
  name: string;
  errors: {
    [key: string]: {
      message: string;
    }
  }
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    
    console.log('Registration data received:', JSON.stringify(data, null, 2))

    // 添加详细的数据结构验证
    if (!data.studentId || !data.name) {
      console.error('数据验证失败: 缺少studentId或name字段')
      return NextResponse.json({ 
        error: '缺少必要信息', 
        message: '请提供学号和姓名',
        missing_fields: ['studentId', 'name'].filter(field => !data[field])
      }, { status: 400 })
    }
    
    if (!data.basicInfo || !data.contact || !data.personalInfo) {
      console.error('数据验证失败: 缺少基本信息、联系方式或个人信息字段', {
        hasBasicInfo: !!data.basicInfo,
        hasContact: !!data.contact,
        hasPersonalInfo: !!data.personalInfo
      })
      return NextResponse.json({ 
        error: '信息不完整', 
        message: '请完成所有注册步骤再提交',
        missing_sections: [
          !data.basicInfo ? '基本信息' : null,
          !data.contact ? '联系方式' : null,
          !data.personalInfo ? '个人信息' : null
        ].filter(Boolean)
      }, { status: 400 })
    }

    try {
      const userData = {
        studentId: data.studentId,
        name: data.name,
        basicInfo: data.basicInfo,
        contact: data.contact,
        personalInfo: data.personalInfo,
      }

      console.log('Attempting to save user, data structure:', {
        studentId: !!data.studentId,
        name: !!data.name,
        basicInfo: !!data.basicInfo,
        contact: !!data.contact,
        personalInfo: !!data.personalInfo,
      })
      
      // 使用findOneAndUpdate替代save，如果用户存在则更新，不存在则创建
      // 首先检查用户是否存在
      const existingUser = await User.findOne({ studentId: data.studentId });
      const isNewUser = !existingUser;
      
      await User.findOneAndUpdate(
        { studentId: data.studentId }, // 查询条件
        userData,                      // 更新内容
        { 
          new: true,                   // 返回更新后的文档
          upsert: true,                // 如果不存在则创建新文档
          runValidators: true,         // 运行验证
          setDefaultsOnInsert: true    // 插入时设置默认值
        }
      )
      
      console.log('User saved successfully with method:', isNewUser ? 'insert' : 'update')

      return NextResponse.json({ 
        success: true,
        operation: isNewUser ? 'inserted' : 'updated'
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
          message: '您提供的信息格式不正确',
          details: validationErrors 
        }, { status: 400 })
      }
      
      // MongoDB重复键错误
      if (saveError instanceof Error && 'code' in saveError && (saveError as MongoError).code === 11000) {
        return NextResponse.json({
          error: '用户已存在',
          message: '该学号已经注册，无需重复提交',
          studentId: data.studentId
        }, { status: 409 })
      }
      
      throw saveError; // 让外层catch处理
    }
  } catch (error) {
    console.error('Registration error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      data: error
    })
    return NextResponse.json({ 
      error: '注册失败', 
      message: '服务器处理请求时出错，请稍后再试',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 