
import mongoose, { Document, Schema } from 'mongoose';
import { VerificationStatus } from '@/types/user';

export interface IDoctor extends Document {
  userId: Schema.Types.ObjectId;
  specialty: string;
  licenseNumber: string;
  degreeFilePath: string;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  degreeFilePath: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the Doctor model
const DoctorModel = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default DoctorModel;
