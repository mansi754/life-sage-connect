
import { Alert } from "@/types/user";
import { delay } from "@/utils/helpers";

// Simulated alerts data
const alerts: Alert[] = [
  {
    id: "1",
    patientId: "5",
    type: "emergency",
    message: "Reported chest pain and shortness of breath",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    isResolved: false
  },
  {
    id: "2",
    patientId: "2",
    type: "vitals",
    message: "Blood sugar reading above threshold (250 mg/dL)",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    isResolved: false
  }
];

export const getAlerts = async (resolved: boolean = false): Promise<Alert[]> => {
  // Simulate API delay
  await delay(800);
  return alerts.filter(alert => alert.isResolved === resolved);
};

export const resolveAlert = async (alertId: string): Promise<Alert> => {
  await delay(600);
  
  const alertIndex = alerts.findIndex(a => a.id === alertId);
  
  if (alertIndex === -1) {
    throw new Error("Alert not found");
  }
  
  alerts[alertIndex] = {
    ...alerts[alertIndex],
    isResolved: true
  };
  
  return alerts[alertIndex];
};

export const createAlert = async (alert: Omit<Alert, "id" | "timestamp" | "isResolved">): Promise<Alert> => {
  await delay(500);
  
  const newAlert: Alert = {
    ...alert,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    isResolved: false
  };
  
  alerts.push(newAlert);
  
  return newAlert;
};
