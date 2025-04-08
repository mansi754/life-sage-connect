
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, PatientRecord, Alert, Appointment } from "@/types/user";
import { getPatients, getPatientById } from "@/services/patientService";
import { getLatestVitals } from "@/services/vitalService";
import { getAlerts, resolveAlert } from "@/services/alertService";
import { getAppointments, updateAppointmentStatus } from "@/services/appointmentService";
import { getCurrentUser } from "@/services/authService";

export const useDoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<User[]>([]);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Current doctor info
  const currentUser = getCurrentUser();
  const doctorId = currentUser?.id;

  // Filtered patients based on search
  const filteredPatients = patientRecords.filter((record) =>
    `${record.patient.firstName} ${record.patient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch basic data
        const fetchedPatients = await getPatients();
        const fetchedAlerts = await getAlerts();
        const fetchedAppointments = doctorId ? await getAppointments(doctorId) : [];
        
        setPatients(fetchedPatients);
        setAlerts(fetchedAlerts);
        setAppointments(fetchedAppointments);
        
        // Create detailed patient records
        const records: PatientRecord[] = [];
        
        for (const patient of fetchedPatients) {
          try {
            const vitals = await getLatestVitals(patient.id);
            records.push({
              patient,
              vitals
            });
          } catch (error) {
            console.error(`Error fetching vitals for patient ${patient.id}`, error);
            records.push({ patient });
          }
        }
        
        setPatientRecords(records);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [doctorId, toast]);

  const handleAlertRespond = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
      
      // Update local state
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert Responded",
        description: "You've marked this alert as being attended to.",
      });
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast({
        title: "Error",
        description: "Failed to respond to alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppointment = async (appointmentId: string, status: Appointment["status"]) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status } 
            : appointment
        )
      );
      
      toast({
        title: "Appointment Updated",
        description: `Appointment status updated to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    patients,
    patientRecords,
    filteredPatients,
    alerts,
    appointments,
    searchQuery,
    setSearchQuery,
    handleAlertRespond,
    handleUpdateAppointment,
  };
};
