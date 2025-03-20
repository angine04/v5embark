import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json')
const COMPLETED_FILE = path.join(DATA_DIR, 'completed.json')

export interface RegistrationData {
  studentId: string
  name: string
  basicInfo: {
    year: string
    gender: 'male' | 'female'
    college: string
    major: string
    techGroup: 'software' | 'hardware' | 'mechanical'
  }
  contact: {
    phone: string
    email: string
    qq: string
  }
  personalInfo: {
    idCard: string
    birthday: string
    hometown: string
    currentResidence: string
    ethnicity: string
    dietaryRestrictions: string
    highSchool: string
  }
  account: {
    username: string
    password: string // 实际应用中应该加密存储
  }
  registeredAt: string
}

export interface CompletedRegistration {
  studentId: string
  name: string
  completedAt: string
}

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// 初始化文件
if (!fs.existsSync(REGISTRATIONS_FILE)) {
  fs.writeFileSync(REGISTRATIONS_FILE, '[]')
}

if (!fs.existsSync(COMPLETED_FILE)) {
  fs.writeFileSync(COMPLETED_FILE, '[]')
}

export const storage = {
  // 保存注册数据
  saveRegistration: async (data: RegistrationData) => {
    const registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, 'utf-8'))
    registrations.push(data)
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2))
  },

  // 标记注册完成
  markRegistrationComplete: async (studentId: string, name: string) => {
    const completed = JSON.parse(fs.readFileSync(COMPLETED_FILE, 'utf-8'))
    completed.push({
      studentId,
      name,
      completedAt: new Date().toISOString()
    })
    fs.writeFileSync(COMPLETED_FILE, JSON.stringify(completed, null, 2))
  },

  // 检查学生是否已完成注册
  checkRegistrationComplete: async (studentId: string): Promise<boolean> => {
    try {
      const response = await fetch('/data/registrations.json')
      if (!response.ok) {
        console.error('Failed to fetch registrations:', response.statusText)
        return false
      }
      const data = await response.json()
      return data.completed.some((item: { studentId: string }) => item.studentId === studentId)
    } catch (error) {
      console.error('Error checking registration:', error)
      return false
    }
  },

  // 检查学生是否已报名（在配置的名单中）
  checkEnrolled: async (studentId: string): Promise<boolean> => {
    try {
      console.log('Checking enrollment for studentId:', studentId)
      const response = await fetch('/data/enrolled.json')
      if (!response.ok) {
        console.error('Failed to fetch enrolled students:', response.statusText)
        return false
      }
      const data = await response.json()
      console.log('Enrolled data:', data)  // 打印整个数据
      console.log('Students array:', data.students)  // 打印学生数组
      
      const found = data.students.some((student: { studentId: string }) => {
        console.log('Comparing:', student.studentId, 'with:', studentId)  // 打印每次比较
        return student.studentId === studentId
      })
      console.log('Found student:', found)  // 打印结果
      return found
    } catch (error) {
      console.error('Error checking enrolled status:', error)
      return false
    }
  }
} 