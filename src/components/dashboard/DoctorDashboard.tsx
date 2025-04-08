import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Search, Bell, Video, FileText, Clock, User, AlertTriangle } from "lucide-react";
import { PatientRecord, Alert, Appointment } from "@/types/user";

interface DoctorDashboardProps {
  filteredPatients: PatientRecord[];
  alerts: Alert[];
  appointments: Appointment[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleAlertRespond: (alertId: string) => void;
  handleUpdateAppointment: (appointmentId: string, status: Appointment["status"]) => void;
}

const DoctorDashboard = ({
  filteredPatients,
  alerts,
  appointments,
  searchQuery,
  setSearchQuery,
  handleAlertRespond,
  handleUpdateAppointment
}: DoctorDashboardProps) => {

  const getPatientStatusBadge = (patientRecord: PatientRecord) => {
    if (!patientRecord.vitals) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Unknown
        </Badge>
      );
    }

    const { heartRate, bloodPressure, bloodSugar, oxygenLevel, temperature } = patientRecord.vitals;
    const [systolic, diastolic] = bloodPressure.split('/').map(Number);

    if (
      heartRate > 100 || heartRate < 50 ||
      systolic > 140 || diastolic > 90 ||
      bloodSugar > 180 || bloodSugar < 70 ||
      oxygenLevel < 92 ||
      temperature > 38
    ) {
      return (
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
          Needs Review
        </Badge>
      );
    }

    if (
      (heartRate > 90 && heartRate <= 100) ||
      (heartRate >= 50 && heartRate < 60) ||
      (systolic > 130 && systolic <= 140) ||
      (diastolic > 85 && diastolic <= 90) ||
      (bloodSugar > 140 && bloodSugar <= 180) ||
      (bloodSugar >= 70 && bloodSugar < 80) ||
      (oxygenLevel >= 92 && oxygenLevel < 95) ||
      (temperature > 37.5 && temperature <= 38)
    ) {
      return (
        <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
          Improving
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Stable
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-health-neutral-600">Welcome back, Dr. Williams. You have {alerts.length} emergency alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
          <Button className="btn-primary flex items-center">
            <Video className="mr-2 h-4 w-4" /> Start Consultation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-health-neutral-500">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-health-blue-500 mr-2" />
              <div className="text-2xl font-bold">{filteredPatients.length}</div>
            </div>
            <p className="text-xs text-health-neutral-500 mt-1">+5 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-health-neutral-500">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-health-green-500 mr-2" />
              <div className="text-2xl font-bold">{appointments.length}</div>
            </div>
            <p className="text-xs text-health-neutral-500 mt-1">Next at 10:00 AM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-health-neutral-500">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">{filteredPatients.filter(p => getPatientStatusBadge(p).props.children === "Needs Review").length}</div>
            </div>
            <p className="text-xs text-health-neutral-500 mt-1">+3 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="space-y-4">
          <div className="flex items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-health-neutral-500" />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full rounded-md border border-health-neutral-200 pl-9 py-2 outline-none focus:border-health-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-health-neutral-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-health-neutral-500">Patient</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-health-neutral-500">Condition</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-health-neutral-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-health-neutral-500">Next Appointment</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-health-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patientRecord) => {
                      const patient = patientRecord.patient;
                      const matchingAppointment = appointments.find(a => a.patientId === patient.id);
                      
                      return (
                        <tr key={patient.id} className="border-b border-health-neutral-200 last:border-0 hover:bg-health-neutral-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-health-neutral-200 flex items-center justify-center mr-3">
                                <User className="h-4 w-4 text-health-neutral-500" />
                              </div>
                              <div>
                                <div className="font-medium text-health-neutral-900 flex items-center">
                                  {patient.firstName} {patient.lastName}
                                  {alerts.some(a => a.patientId === patient.id) && (
                                    <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                                  )}
                                </div>
                                <div className="text-sm text-health-neutral-500">Patient #{patient.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-health-neutral-700">
                            {patient.id === "1" ? "Hypertension" : 
                             patient.id === "2" ? "Type 2 Diabetes" :
                             patient.id === "3" ? "Arthritis" :
                             patient.id === "4" ? "Asthma" :
                             patient.id === "5" ? "Heart Disease" : "General Checkup"}
                          </td>
                          <td className="px-4 py-3">
                            {getPatientStatusBadge(patientRecord)}
                          </td>
                          <td className="px-4 py-3 text-health-neutral-700">
                            {matchingAppointment ? `${matchingAppointment.date} - ${matchingAppointment.time}` : "No upcoming appointment"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/patients/${patient.id}`}>
                                  View
                                </Link>
                              </Button>
                              <Button asChild size="sm" className="btn-primary">
                                <Link to={`/consultation/${patient.id}`}>
                                  <Video className="mr-1 h-3.5 w-3.5" /> Consult
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-health-neutral-200 py-3">
              <span className="text-sm text-health-neutral-500">Showing {filteredPatients.length} of {filteredPatients.length} patients</span>
              <Button asChild variant="ghost" size="sm">
                <Link to="/patients">
                  View All Patients
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-amber-500" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                Patient alerts that need your attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const patientRecord = filteredPatients.find(p => p.patient.id === alert.patientId);
                    
                    return (
                      <div key={alert.id} className={`p-4 rounded-lg ${
                        alert.type === 'emergency' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-medium ${
                              alert.type === 'emergency' ? 'text-red-700' : 'text-amber-700'
                            }`}>
                              {alert.type === 'emergency' ? 'Emergency Alert' : 'Vital Sign Alert'}
                            </h4>
                            <p className="font-medium mt-1">
                              {patientRecord 
                                ? `${patientRecord.patient.firstName} ${patientRecord.patient.lastName}` 
                                : `Patient #${alert.patientId}`
                              }
                            </p>
                            <p className="text-health-neutral-700 mt-1">{alert.message}</p>
                            <p className="text-sm text-health-neutral-500 mt-2">
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            className={alert.type === 'emergency' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}
                            onClick={() => handleAlertRespond(alert.id)}
                          >
                            Respond
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                  <p className="text-health-neutral-500">No active alerts at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
