
import mongoose, { Document, Schema } from 'mongoose';
import { UserRole, VerificationStatus } from '@/types/user';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  verificationStatus?: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the User model
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
