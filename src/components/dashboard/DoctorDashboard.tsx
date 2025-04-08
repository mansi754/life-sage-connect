
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Search, Bell, Video, FileText, Clock, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const patients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    nextAppointment: "Apr 10, 2025 - 10:00 AM",
    condition: "Hypertension",
    status: "Stable",
    alert: false
  },
  {
    id: 2,
    name: "Emily Johnson",
    age: 32,
    nextAppointment: "Apr 15, 2025 - 2:30 PM",
    condition: "Type 2 Diabetes",
    status: "Needs Review",
    alert: true
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 58,
    nextAppointment: "Apr 18, 2025 - 11:15 AM",
    condition: "Arthritis",
    status: "Improving",
    alert: false
  },
  {
    id: 4,
    name: "Sarah Williams",
    age: 29,
    nextAppointment: "Apr 20, 2025 - 9:45 AM",
    condition: "Asthma",
    status: "Stable",
    alert: false
  },
  {
    id: 5,
    name: "Robert Garcia",
    age: 62,
    nextAppointment: "Apr 22, 2025 - 3:00 PM",
    condition: "Heart Disease",
    status: "Needs Review",
    alert: true
  }
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "10:00 AM",
    date: "Apr 10, 2025",
    type: "Video Consultation",
    notes: "Follow-up on blood pressure medication"
  },
  {
    id: 2,
    patient: "Emily Johnson",
    time: "2:30 PM",
    date: "Apr 15, 2025",
    type: "Video Consultation",
    notes: "Review latest blood sugar readings"
  },
  {
    id: 3,
    patient: "Michael Brown",
    time: "11:15 AM",
    date: "Apr 18, 2025",
    type: "Video Consultation",
    notes: "Discuss physical therapy progress"
  }
];

const alerts = [
  {
    id: 1,
    type: "emergency",
    patient: "Robert Garcia",
    message: "Reported chest pain and shortness of breath",
    time: "15 minutes ago"
  },
  {
    id: 2,
    type: "vitals",
    patient: "Emily Johnson",
    message: "Blood sugar reading above threshold (250 mg/dL)",
    time: "2 hours ago"
  }
];

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAlertRespond = (alertId: number) => {
    toast({
      title: "Alert Response",
      description: "You've marked this alert as being attended to.",
      variant: "default",
    });
    // In a real app, we would update the alerts list here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-health-neutral-600">Welcome back, Dr. Williams. You have 2 emergency alerts.</p>
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
              <div className="text-2xl font-bold">128</div>
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
              <div className="text-2xl font-bold">8</div>
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
              <div className="text-2xl font-bold">15</div>
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
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-health-neutral-200 last:border-0 hover:bg-health-neutral-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-health-neutral-200 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-health-neutral-500" />
                            </div>
                            <div>
                              <div className="font-medium text-health-neutral-900 flex items-center">
                                {patient.name}
                                {patient.alert && (
                                  <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div className="text-sm text-health-neutral-500">{patient.age} years</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-health-neutral-700">{patient.condition}</td>
                        <td className="px-4 py-3">
                          <Badge variant={
                            patient.status === "Stable" ? "outline" : 
                            patient.status === "Improving" ? "default" :
                            "secondary"
                          } className={
                            patient.status === "Stable" ? "bg-green-50 text-green-700 border-green-200" : 
                            patient.status === "Improving" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          }>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-health-neutral-700">{patient.nextAppointment}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-health-neutral-200 py-3">
              <span className="text-sm text-health-neutral-500">Showing {filteredPatients.length} of {patients.length} patients</span>
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
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-start border-b border-health-neutral-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-health-blue-50 flex items-center justify-center mr-4 mt-1">
                        <Clock className="h-5 w-5 text-health-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-health-neutral-900">{appointment.patient}</h4>
                        <p className="text-sm text-health-neutral-500">{appointment.type}</p>
                        <p className="text-sm text-health-neutral-500">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-health-neutral-600 mt-1">{appointment.notes}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button asChild size="sm" className="btn-primary w-full">
                        <Link to={`/consultation/${appointment.id}`}>
                          <Video className="mr-2 h-4 w-4" /> Start
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/patients/${appointment.id}`}>
                          View Patient
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
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
                  {alerts.map((alert) => (
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
                          <p className="font-medium mt-1">{alert.patient}</p>
                          <p className="text-health-neutral-700 mt-1">{alert.message}</p>
                          <p className="text-sm text-health-neutral-500 mt-2">{alert.time}</p>
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
                  ))}
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
