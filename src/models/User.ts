import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  studentId: string
  name: string
  basicInfo: {
    year: string
    gender: string
    college: string
    major: string
    techGroup: string
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
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  basicInfo: {
    year: { type: String, required: true },
    gender: { type: String, required: true },
    college: { type: String, required: true },
    major: { type: String, required: true },
    techGroup: { type: String, required: true }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    qq: { type: String, required: true }
  },
  personalInfo: {
    idCard: { type: String, required: true },
    birthday: { type: String, required: true },
    hometown: { type: String, required: true },
    currentResidence: { type: String, required: true },
    ethnicity: { type: String, required: true },
    dietaryRestrictions: { type: String },
    highSchool: { type: String, required: true }
  }
}, {
  timestamps: true
})

delete mongoose.models.User

export default mongoose.model<IUser>('User', userSchema) 