
import { Appointment } from "@/types/user";
import { delay } from "@/utils/helpers";

// Simulated appointments data
const appointments: Appointment[] = [
  {
    id: "1",
    doctorId: "2",
    patientId: "1",
    date: "2025-04-10",
    time: "10:00 AM",
    type: "Video Consultation",
    status: "Scheduled",
    notes: "Follow-up on blood pressure medication"
  },
  {
    id: "2",
    doctorId: "2",
    patientId: "2",
    date: "2025-04-15",
    time: "2:30 PM",
    type: "Video Consultation",
    status: "Scheduled",
    notes: "Review latest blood sugar readings"
  },
  {
    id: "3",
    doctorId: "2",
    patientId: "3",
    date: "2025-04-18",
    time: "11:15 AM",
    type: "Video Consultation",
    status: "Scheduled",
    notes: "Discuss physical therapy progress"
  }
];

export const getAppointments = async (doctorId: string): Promise<Appointment[]> => {
  // Simulate API delay
  await delay(1000);
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  await delay(800);
  
  const appointment = appointments.find(a => a.id === id);
  
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
  
  appointments.push(newAppointment);
  
  return newAppointment;
};

export const updateAppointmentStatus = async (id: string, status: Appointment["status"]): Promise<Appointment> => {
  await delay(800);
  
  const appointmentIndex = appointments.findIndex(a => a.id === id);
  
  if (appointmentIndex === -1) {
    throw new Error("Appointment not found");
  }
  
  appointments[appointmentIndex] = {
    ...appointments[appointmentIndex],
    status
  };
  
  return appointments[appointmentIndex];
};
