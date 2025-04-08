
import { Alert } from "@/types/user";
import { delay } from "@/utils/helpers";
import { isValidAlertType } from "@/utils/typeHelpers";

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
  },
  {
    id: "3",
    patientId: "1",
    type: "medication",
    message: "Missed scheduled medication: Lisinopril",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    isResolved: false
  },
  {
    id: "4",
    patientId: "3",
    type: "emergency",
    message: "Fall detected, possible injury",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    isResolved: true
  }
];

export const getAlerts = async (resolved: boolean = false): Promise<Alert[]> => {
  // Simulate API delay
  await delay(800);
  return alerts.filter(alert => alert.isResolved === resolved);
};

export const getAlertsByPatientId = async (patientId: string): Promise<Alert[]> => {
  // Simulate API delay
  await delay(600);
  return alerts.filter(alert => alert.patientId === patientId && !alert.isResolved);
};

export const getAlertHistory = async (patientId: string): Promise<Alert[]> => {
  // Simulate API delay
  await delay(600);
  return alerts.filter(alert => alert.patientId === patientId && alert.isResolved);
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
  
  // Validate alert type
  if (!isValidAlertType(alert.type)) {
    throw new Error("Invalid alert type");
  }
  
  const newAlert: Alert = {
    ...alert,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    isResolved: false
  };
  
  alerts.push(newAlert);
  
  return newAlert;
};

export const getAllAlertsCount = async (): Promise<number> => {
  await delay(200);
  return alerts.filter(alert => !alert.isResolved).length;
};

export const getAlertsByType = async (type: Alert["type"]): Promise<Alert[]> => {
  await delay(500);
  return alerts.filter(alert => alert.type === type && !alert.isResolved);
};

export const batchResolveAlerts = async (alertIds: string[]): Promise<number> => {
  await delay(800);
  
  let resolvedCount = 0;
  
  alertIds.forEach(id => {
    const alertIndex = alerts.findIndex(a => a.id === id);
    if (alertIndex !== -1 && !alerts[alertIndex].isResolved) {
      alerts[alertIndex].isResolved = true;
      resolvedCount++;
    }
  });
  
  return resolvedCount;
};

export const getPatientAlertStats = async (patientId: string): Promise<{
  total: number;
  emergency: number;
  medication: number;
  vitals: number;
}> => {
  await delay(400);
  
  const patientAlerts = alerts.filter(alert => alert.patientId === patientId && !alert.isResolved);
  
  return {
    total: patientAlerts.length,
    emergency: patientAlerts.filter(a => a.type === "emergency").length,
    medication: patientAlerts.filter(a => a.type === "medication").length,
    vitals: patientAlerts.filter(a => a.type === "vitals").length
  };
};
