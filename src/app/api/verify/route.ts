import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import EnrolledStudent from '@/models/EnrolledStudent'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: '请提供学号' },
        { status: 400 }
      )
    }

    // 检查是否在已录取名单中
    const enrolledStudent = await EnrolledStudent.findOne({ studentId })
    if (!enrolledStudent) {
      return NextResponse.json(
        { error: '您不在录取名单中' },
        { status: 403 }
      )
    }

    // 检查是否已经注册
    const existingUser = await User.findOne({ studentId })
    if (existingUser) {
      return NextResponse.json(
        { error: '您已经注册过了' },
        { status: 409 }
      )
    }

    return NextResponse.json({ 
      success: true,
      name: enrolledStudent.name
    })
  } catch (error) {
    console.error('Verify API error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 