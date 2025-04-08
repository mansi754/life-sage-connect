
import { PatientVitals } from "@/types/user";
import { delay } from "@/utils/helpers";

// Simulated vitals data
const patientVitals: Record<string, PatientVitals[]> = {
  "1": [generateVitals("1", 0)],
  "2": [generateVitals("2", 0)],
  "3": [generateVitals("3", 0)],
  "4": [generateVitals("4", 0)],
  "5": [generateVitals("5", 0)]
};

// Helper function to generate random vitals for simulation
function generateVitals(patientId: string, hoursAgo: number): PatientVitals {
  // Random values within normal ranges
  const heartRate = Math.floor(Math.random() * 30) + 60; // 60-90 bpm
  const systolic = Math.floor(Math.random() * 40) + 100; // 100-140 mmHg
  const diastolic = Math.floor(Math.random() * 20) + 60; // 60-80 mmHg
  const bloodSugar = Math.floor(Math.random() * 50) + 80; // 80-130 mg/dL
  const oxygenLevel = Math.floor(Math.random() * 5) + 95; // 95-100%
  const temperature = Math.random() * 1 + 36.5; // 36.5-37.5°C
  
  const timestamp = new Date(Date.now() - hoursAgo * 3600000).toISOString();
  
  return {
    patientId,
    heartRate,
    bloodPressure: `${systolic}/${diastolic}`,
    bloodSugar,
    oxygenLevel,
    temperature,
    timestamp
  };
}

export const getPatientVitals = async (patientId: string): Promise<PatientVitals[]> => {
  // Simulate API delay
  await delay(1000);
  
  // If no vitals exist for this patient, generate some
  if (!patientVitals[patientId]) {
    patientVitals[patientId] = [generateVitals(patientId, 0)];
  }
  
  return patientVitals[patientId];
};

export const getLatestVitals = async (patientId: string): Promise<PatientVitals> => {
  const vitals = await getPatientVitals(patientId);
  return vitals[0]; // Assuming vitals are sorted by timestamp
};

export const simulateRealtimeVitals = (patientId: string, callback: (vitals: PatientVitals) => void): () => void => {
  // Create initial vitals
  let currentVitals = generateVitals(patientId, 0);
  callback(currentVitals);
  
  // Update vitals every 10 seconds
  const intervalId = setInterval(() => {
    // Slightly modify existing vitals to simulate changes
    currentVitals = {
      ...currentVitals,
      heartRate: Math.max(50, Math.min(100, currentVitals.heartRate + (Math.random() * 6 - 3))),
      bloodSugar: Math.max(70, Math.min(150, currentVitals.bloodSugar + (Math.random() * 10 - 5))),
      oxygenLevel: Math.max(90, Math.min(100, currentVitals.oxygenLevel + (Math.random() * 2 - 1))),
      temperature: Math.max(36, Math.min(38, currentVitals.temperature + (Math.random() * 0.2 - 0.1))),
      timestamp: new Date().toISOString()
    };
    
    // Extract systolic and diastolic from current bloodPressure
    const [systolic, diastolic] = currentVitals.bloodPressure.split('/').map(Number);
    const newSystolic = Math.max(90, Math.min(150, systolic + (Math.random() * 6 - 3)));
    const newDiastolic = Math.max(50, Math.min(90, diastolic + (Math.random() * 4 - 2)));
    currentVitals.bloodPressure = `${Math.round(newSystolic)}/${Math.round(newDiastolic)}`;
    
    callback(currentVitals);
  }, 10000);
  
  // Return a cleanup function
  return () => clearInterval(intervalId);
};
