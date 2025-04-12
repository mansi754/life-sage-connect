
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, PhoneCall, MapPin, CalendarPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Appointment } from "@/types/user";
import { getCurrentUser } from "@/services/authService";
import { getPatientAppointments } from "@/services/appointmentService";
import AppointmentBooking from "@/components/appointment/AppointmentBooking";
import { format, parseISO, isPast, isToday } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AppointmentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const checkAuth = () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (currentUser.role !== "patient") {
        navigate("/doctor/dashboard");
        return;
      }
      
      fetchAppointments();
    };
    
    checkAuth();
  }, [navigate]);

  const fetchAppointments = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const fetchedAppointments = await getPatientAppointments(currentUser.id);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load your appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentIcon = (type: Appointment["type"]) => {
    switch (type) {
      case "Video Consultation":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "Phone Call":
        return <PhoneCall className="h-5 w-5 text-green-500" />;
      case "In-Person":
        return <MapPin className="h-5 w-5 text-purple-500" />;
      default:
        return <Calendar className="h-5 w-5 text-health-blue-500" />;
    }
  };

  // Filter appointments by type
  const upcomingAppointments = appointments.filter(a => 
    a.status === "Scheduled" && 
    (isToday(parseISO(a.date)) || !isPast(parseISO(a.date)))
  );
  
  const pastAppointments = appointments.filter(a => 
    (a.status === "Completed" || (a.status === "Scheduled" && isPast(parseISO(a.date)))) &&
    !isToday(parseISO(a.date))
  );
  
  const cancelledAppointments = appointments.filter(a => a.status === "Cancelled");

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
            <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-health-neutral-600">View and manage your healthcare appointments.</p>
          </div>
          <Button onClick={() => setShowBookingDialog(true)} className="flex items-center">
            <CalendarPlus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Upcoming
              {upcomingAppointments.length > 0 && (
                <span className="ml-2 bg-health-blue-100 text-health-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {upcomingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              <Clock className="mr-2 h-4 w-4" /> Past Appointments
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              <Clock className="mr-2 h-4 w-4" /> Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                      <p className="text-health-neutral-500">No upcoming appointments scheduled.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowBookingDialog(true)} 
                        className="mt-4"
                      >
                        Book an Appointment
                      </Button>
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-start border-b border-health-neutral-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-health-blue-50 flex items-center justify-center mr-4 mt-1">
                            {getAppointmentIcon(appointment.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-health-neutral-900">
                              {appointment.type}
                            </h4>
                            <p className="text-sm text-health-neutral-500 mb-1">
                              {format(parseISO(appointment.date), "MMM d, yyyy")} at {appointment.time}
                            </p>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                              <p className="text-xs text-health-neutral-500">{appointment.status}</p>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-health-neutral-600 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button asChild size="sm" className="btn-primary w-full">
                            <a href={`/consultation/${appointment.doctorId}`}>
                              {appointment.type === "Video Consultation" ? (
                                <>
                                  <Video className="mr-2 h-4 w-4" /> Join Call
                                </>
                              ) : appointment.type === "Phone Call" ? (
                                <>
                                  <PhoneCall className="mr-2 h-4 w-4" /> Call
                                </>
                              ) : (
                                <>
                                  <MapPin className="mr-2 h-4 w-4" /> Directions
                                </>
                              )}
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 w-full">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                      <p className="text-health-neutral-500">No past appointments.</p>
                    </div>
                  ) : (
                    pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-start border-b border-health-neutral-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-health-neutral-100 flex items-center justify-center mr-4 mt-1">
                            {getAppointmentIcon(appointment.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-health-neutral-900">
                              {appointment.type}
                            </h4>
                            <p className="text-sm text-health-neutral-500 mb-1">
                              {format(parseISO(appointment.date), "MMM d, yyyy")} at {appointment.time}
                            </p>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                              <p className="text-xs text-health-neutral-500">
                                {appointment.status === "Scheduled" ? "Completed" : appointment.status}
                              </p>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-health-neutral-600 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Book Follow-up
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cancelledAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                      <p className="text-health-neutral-500">No cancelled appointments.</p>
                    </div>
                  ) : (
                    cancelledAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-start border-b border-health-neutral-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-health-neutral-100 flex items-center justify-center mr-4 mt-1">
                            {getAppointmentIcon(appointment.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-health-neutral-900">
                              {appointment.type}
                            </h4>
                            <p className="text-sm text-health-neutral-500 mb-1">
                              {format(parseISO(appointment.date), "MMM d, yyyy")} at {appointment.time}
                            </p>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                              <p className="text-xs text-health-neutral-500">{appointment.status}</p>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-health-neutral-600 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Rebook
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Booking appointment dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
            </DialogHeader>
            <AppointmentBooking 
              doctorId="2" // In a real app, this would be selected by the user or determined by context
              onSuccess={() => {
                setShowBookingDialog(false);
                fetchAppointments();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AppointmentsPage;
