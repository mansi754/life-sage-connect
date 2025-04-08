
import { User } from "@/types/user";
import { delay } from "@/utils/helpers";

// Simulated patients data
const patients: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    role: "patient",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@example.com",
    role: "patient",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    role: "patient",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    role: "patient",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Garcia",
    email: "robert.garcia@example.com",
    role: "patient",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getPatients = async (): Promise<User[]> => {
  await delay(1000);
  return patients;
};

export const getPatientById = async (id: string): Promise<User> => {
  await delay(800);
  
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    throw new Error("Patient not found");
  }
  
  return patient;
};
