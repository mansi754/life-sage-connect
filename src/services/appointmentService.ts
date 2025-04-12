
import { Appointment } from "@/types/user";
import { delay } from "@/utils/helpers";
import { MockStorage } from "@/lib/mockDB";

// Initialize mock appointment storage
const appointmentStorage = new MockStorage<Appointment>("appointments");

// Check if we need to seed initial data
const initializeAppointments = () => {
  const existingAppointments = appointmentStorage.getAll();
  
  if (existingAppointments.length === 0) {
    // Seed with initial appointment data
    appointmentStorage.add({
      id: "1",
      doctorId: "2",
      patientId: "1",
      date: "2025-04-10",
      time: "10:00 AM",
      type: "Video Consultation",
      status: "Scheduled",
      notes: "Follow-up on blood pressure medication"
    });
    
    appointmentStorage.add({
      id: "2",
      doctorId: "2",
      patientId: "2",
      date: "2025-04-15",
      time: "2:30 PM",
      type: "Video Consultation",
      status: "Scheduled",
      notes: "Review latest blood sugar readings"
    });
    
    appointmentStorage.add({
      id: "3",
      doctorId: "2",
      patientId: "3",
      date: "2025-04-18",
      time: "11:15 AM",
      type: "Video Consultation",
      status: "Scheduled",
      notes: "Discuss physical therapy progress"
    });
  }
};

// Initialize appointment data
initializeAppointments();

export const getAppointments = async (doctorId: string): Promise<Appointment[]> => {
  // Simulate API delay
  await delay(1000);
  
  // Get all appointments
  const appointments = appointmentStorage.getAll();
  
  // Filter by doctor ID
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  // Simulate API delay
  await delay(1000);
  
  // Get all appointments
  const appointments = appointmentStorage.getAll();
  
  // Filter by patient ID
  return appointments.filter(appointment => appointment.patientId === patientId);
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  await delay(800);
  
  const appointment = appointmentStorage.getById(id);
  
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  
  return appointment;
};

export const createAppointment = async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
  await delay(1200);
  
  const newAppointment: Appointment = {
    ...appointment,
    id: Math.random().toString(36).substring(2, 11)
  };
  
  appointmentStorage.add(newAppointment);
  
  return newAppointment;
};

export const updateAppointmentStatus = async (id: string, status: Appointment["status"]): Promise<Appointment> => {
  await delay(800);
  
  const updatedAppointment = appointmentStorage.update(id, { status });
  
  if (!updatedAppointment) {
    throw new Error("Appointment not found");
  }
  
  return updatedAppointment;
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  await delay(800);
  
  const updatedAppointment = appointmentStorage.update(id, updates);
  
  if (!updatedAppointment) {
    throw new Error("Appointment not found");
  }
  
  return updatedAppointment;
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  await delay(800);
  
  return appointmentStorage.delete(id);
};
