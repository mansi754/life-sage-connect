
import { Medication } from "@/types/user";
import { delay } from "@/utils/helpers";

// Simulated medications data
const medications: Record<string, Medication[]> = {
  "1": [
    {
      id: "m1",
      patientId: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2025-04-01",
      instructions: "Take in the morning with food"
    },
    {
      id: "m2",
      patientId: "1",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: "2025-03-15",
      instructions: "Take in the evening"
    }
  ],
  "2": [
    {
      id: "m3",
      patientId: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2025-03-01",
      instructions: "Take with meals"
    },
    {
      id: "m4",
      patientId: "2",
      name: "Gliclazide",
      dosage: "30mg",
      frequency: "Once daily",
      startDate: "2025-03-10",
      instructions: "Take in the morning with breakfast"
    }
  ],
  "3": [
    {
      id: "m5",
      patientId: "3",
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "Three times daily",
      startDate: "2025-04-05",
      endDate: "2025-04-12",
      instructions: "Take with food as needed for pain"
    }
  ],
  "5": [
    {
      id: "m6",
      patientId: "5",
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      startDate: "2025-01-15",
      instructions: "Take in the morning with food"
    },
    {
      id: "m7",
      patientId: "5",
      name: "Atenolol",
      dosage: "50mg",
      frequency: "Once daily",
      startDate: "2025-02-10",
      instructions: "Take in the morning"
    },
    {
      id: "m8",
      patientId: "5",
      name: "Furosemide",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: "2025-03-05",
      instructions: "Take in the morning"
    }
  ]
};

export const getPatientMedications = async (patientId: string): Promise<Medication[]> => {
  // Simulate API delay
  await delay(800);
  
  return medications[patientId] || [];
};

export const addMedication = async (medication: Omit<Medication, "id">): Promise<Medication> => {
  await delay(1000);
  
  const newMedication: Medication = {
    ...medication,
    id: Math.random().toString(36).substring(2, 11)
  };
  
  if (!medications[medication.patientId]) {
    medications[medication.patientId] = [];
  }
  
  medications[medication.patientId].push(newMedication);
  
  return newMedication;
};

export const updateMedication = async (medication: Medication): Promise<Medication> => {
  await delay(1000);
  
  const patientMeds = medications[medication.patientId];
  
  if (!patientMeds) {
    throw new Error("Patient has no medications");
  }
  
  const index = patientMeds.findIndex(med => med.id === medication.id);
  
  if (index === -1) {
    throw new Error("Medication not found");
  }
  
  patientMeds[index] = medication;
  
  return medication;
};

export const deleteMedication = async (medicationId: string, patientId: string): Promise<void> => {
  await delay(800);
  
  const patientMeds = medications[patientId];
  
  if (!patientMeds) {
    throw new Error("Patient has no medications");
  }
  
  const index = patientMeds.findIndex(med => med.id === medicationId);
  
  if (index === -1) {
    throw new Error("Medication not found");
  }
  
  patientMeds.splice(index, 1);
};
