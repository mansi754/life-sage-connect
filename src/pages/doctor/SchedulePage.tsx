
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Video, Clock, CalendarPlus, 
  Check, X, CalendarRange 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { Appointment } from "@/types/user";
import RescheduleModal from "@/components/appointment/RescheduleModal";

const SchedulePage = () => {
  const {
    loading,
    filteredPatients,
    appointments,
    handleUpdateAppointment
  } = useDoctorDashboard();

  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="health-container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-health-blue-500 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
            <p className="text-health-neutral-600">Manage your upcoming appointments and consultations.</p>
          </div>
          <Button className="flex items-center" onClick={() => setShowAddAppointment(true)}>
            <CalendarPlus className="mr-2 h-4 w-4" /> Add Appointment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your scheduled consultations for the upcoming days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appointments.map((appointment) => {
                const patientRecord = filteredPatients.find(p => p.patient.id === appointment.patientId);
                
                return (
                  <div key={appointment.id} className="flex justify-between items-start border-b border-health-neutral-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-health-blue-50 flex items-center justify-center mr-4 mt-1">
                        <Clock className="h-5 w-5 text-health-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-health-neutral-900">
                          {patientRecord 
                            ? `${patientRecord.patient.firstName} ${patientRecord.patient.lastName}` 
                            : `Patient #${appointment.patientId}`
                          }
                        </h4>
                        <p className="text-sm text-health-neutral-500">{appointment.type}</p>
                        <p className="text-sm text-health-neutral-500">
                          {appointment.date} at {appointment.time}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className={`h-2 w-2 rounded-full mr-1 ${
                            appointment.status === "Scheduled" 
                              ? "bg-green-500" 
                              : appointment.status === "Cancelled" 
                              ? "bg-red-500" 
                              : "bg-blue-500"
                          }`}></div>
                          <p className="text-xs text-health-neutral-500">{appointment.status}</p>
                        </div>
                        <p className="text-sm text-health-neutral-600 mt-1">{appointment.notes}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        asChild 
                        size="sm" 
                        className="btn-primary w-full"
                        disabled={appointment.status === "Cancelled"}
                      >
                        <Link to={`/consultation/${appointment.patientId}`}>
                          <Video className="mr-2 h-4 w-4" /> Start
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/patients/${appointment.patientId}`}>
                          View Patient
                        </Link>
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-amber-600 border-amber-200 hover:bg-amber-50 flex-1"
                          onClick={() => handleRescheduleClick(appointment)}
                          disabled={appointment.status === "Completed"}
                        >
                          <CalendarRange className="h-4 w-4 mr-1" /> Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                          onClick={() => handleUpdateAppointment(appointment.id, "Cancelled")}
                          disabled={appointment.status === "Cancelled" || appointment.status === "Completed"}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                      {appointment.status !== "Completed" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-200 hover:bg-green-50 w-full"
                          onClick={() => handleUpdateAppointment(appointment.id, "Completed")}
                          disabled={appointment.status === "Cancelled"}
                        >
                          <Check className="h-4 w-4 mr-1" /> Mark as Completed
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {appointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                  <p className="text-health-neutral-500">No upcoming appointments scheduled.</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" /> View Full Calendar
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Appointment scheduling dialog */}
        <Dialog open={showAddAppointment} onOpenChange={setShowAddAppointment}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment for a patient.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {/* Simple form would go here in a real app */}
              <p className="text-health-neutral-600 mb-4">
                In a complete application, this would include:
              </p>
              <ul className="list-disc pl-5 mb-4 text-health-neutral-600">
                <li>Patient selector</li>
                <li>Date and time selection</li>
                <li>Appointment type selection</li>
                <li>Notes field</li>
              </ul>
              <Button onClick={() => setShowAddAppointment(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reschedule modal */}
        <RescheduleModal 
          appointment={selectedAppointment} 
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onReschedule={handleUpdateAppointment}
        />
      </div>
    </Layout>
  );
};

export default SchedulePage;
