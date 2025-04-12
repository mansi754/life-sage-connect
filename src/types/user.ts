
export type UserRole = "patient" | "doctor";
export type VerificationStatus = "pending" | "verified" | "rejected";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  verificationStatus?: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  degreeFile?: File;
  specialty?: string;
  licenseNumber?: string;
}

// Add patient-specific types
export interface PatientVitals {
  patientId: string;
  heartRate: number;
  bloodPressure: string;
  bloodSugar: number;
  oxygenLevel: number;
  temperature: number;
  timestamp: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
}

export interface Symptom {
  id: string;
  patientId: string;
  description: string;
  severity: number;
  duration: string;
  timestamp: string;
}

// Add doctor-specific types
export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: "Video Consultation" | "In-Person" | "Phone Call";
  status: "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
}

export interface Alert {
  id: string;
  patientId: string;
  type: "emergency" | "vitals" | "medication";
  message: string;
  timestamp: string;
  isResolved: boolean;
}

export interface PatientRecord {
  patient: User;
  vitals?: PatientVitals;
  medications?: Medication[];
  symptoms?: Symptom[];
  appointments?: Appointment[];
}
