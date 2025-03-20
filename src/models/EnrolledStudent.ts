import mongoose from 'mongoose'

export interface IEnrolledStudent extends mongoose.Document {
  studentId: string
  name: string
  enrolledAt: Date
}

const enrolledStudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  enrolledAt: { type: Date, required: true, default: Date.now }
})

delete mongoose.models.EnrolledStudent

export default mongoose.model<IEnrolledStudent>('EnrolledStudent', enrolledStudentSchema) 