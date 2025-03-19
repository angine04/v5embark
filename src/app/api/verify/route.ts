import { NextResponse } from 'next/server'
import enrolledData from '@/data/enrolled.json'

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: '请提供学号' },
        { status: 400 }
      )
    }

    // 检查是否在已录取名单中
    if (!enrolledData.enrolled.includes(studentId)) {
      return NextResponse.json(
        { error: '您不在已录取名单中' },
        { status: 403 }
      )
    }

    // 检查是否已经注册
    if (enrolledData.registered.includes(studentId)) {
      return NextResponse.json(
        { error: '您已经注册过了' },
        { status: 409 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 