
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Clock, CalendarPlus } from "lucide-react";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";

const SchedulePage = () => {
  const {
    loading,
    filteredPatients,
    appointments,
    handleUpdateAppointment
  } = useDoctorDashboard();

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
          <Button className="flex items-center">
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
                        <p className="text-sm text-health-neutral-600 mt-1">{appointment.notes}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button asChild size="sm" className="btn-primary w-full">
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
                          onClick={() => handleUpdateAppointment(appointment.id, "Scheduled")}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                          onClick={() => handleUpdateAppointment(appointment.id, "Cancelled")}
                        >
                          Cancel
                        </Button>
                      </div>
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
      </div>
    </Layout>
  );
};

export default SchedulePage;
