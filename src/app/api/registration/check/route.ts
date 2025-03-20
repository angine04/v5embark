import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import EnrolledStudent from '@/models/EnrolledStudent'
import User from '@/models/User'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: '学号不能为空' }, { status: 400 })
    }

    // 检查是否在已录取名单中
    const enrolledStudent = await EnrolledStudent.findOne({ studentId })
    const enrolled = !!enrolledStudent
    
    // 检查是否已完成注册
    const existingUser = await User.findOne({ studentId })
    const completed = !!existingUser

    console.log('Checking studentId:', studentId, 'enrolled:', enrolled, 'completed:', completed)

    return NextResponse.json({
      completed,
      enrolled,
      name: enrolledStudent?.name,
      username: enrolledStudent?.username,
      initialPassword: enrolledStudent?.initialPassword,
      user: completed ? {
        studentId: existingUser?.studentId,
        name: existingUser?.name
      } : null
    })
  } catch (error) {
    console.error('Check registration error:', error)
    return NextResponse.json({ error: '验证失败' }, { status: 500 })
  }
} 