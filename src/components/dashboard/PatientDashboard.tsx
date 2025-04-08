
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Activity, Calendar, Heart, Bell, Video, MessageSquare, AlertTriangle, FileText, PlusCircle, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SymptomChecker from "@/components/patient/SymptomChecker";
import MedicationList from "@/components/patient/MedicationList";

const vitals = [
  { name: "Heart Rate", value: 72, unit: "bpm", icon: Heart, color: "text-red-500", bgColor: "bg-red-50", change: "+2", trend: "up" },
  { name: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Activity, color: "text-health-blue-500", bgColor: "bg-health-blue-50", change: "Normal", trend: "stable" },
  { name: "Oxygen Level", value: 98, unit: "%", icon: Activity, color: "text-health-green-500", bgColor: "bg-health-green-50", change: "+1", trend: "up" },
  { name: "Temperature", value: 98.6, unit: "°F", icon: Activity, color: "text-orange-500", bgColor: "bg-orange-50", change: "Normal", trend: "stable" },
];

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Williams",
    specialty: "Cardiology",
    date: "Apr 10, 2025",
    time: "10:00 AM",
    type: "Video Consultation"
  },
  {
    id: 2,
    doctor: "Dr. James Chen",
    specialty: "General Medicine",
    date: "Apr 15, 2025",
    time: "2:30 PM",
    type: "Video Consultation"
  }
];

const PatientDashboard = () => {
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergencyAlert = () => {
    setEmergencyLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Emergency Alert Sent",
        description: "Your healthcare provider has been notified. They will contact you shortly.",
        variant: "default",
      });
      setEmergencyLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
          <p className="text-health-neutral-600">Welcome back, John. Here's your health overview.</p>
        </div>
        <Button 
          className="bg-red-500 hover:bg-red-600 transition-colors flex items-center"
          onClick={handleEmergencyAlert}
          disabled={emergencyLoading}
        >
          {emergencyLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Alert...
            </span>
          ) : (
            <span className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" /> Emergency Alert
            </span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((vital, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-health-neutral-500">{vital.name}</CardTitle>
                <div className={`${vital.bgColor} ${vital.color} p-2 rounded-full`}>
                  <vital.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vital.value} <span className="text-sm font-normal text-health-neutral-500">{vital.unit}</span>
              </div>
              <div className={`text-xs ${
                vital.trend === "up" ? "text-health-green-500" : 
                vital.trend === "down" ? "text-health-alert-error" : 
                "text-health-neutral-500"
              }`}>
                {vital.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="records">Health Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-health-blue-500" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-start pb-4 border-b border-health-neutral-100 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{appointment.doctor}</div>
                          <div className="text-sm text-health-neutral-500">{appointment.specialty}</div>
                          <div className="text-sm text-health-neutral-500">
                            {appointment.date} at {appointment.time}
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm" className="flex items-center">
                          <Link to={`/consultation/${appointment.id}`}>
                            <Video className="mr-2 h-4 w-4" /> Join
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-health-neutral-500">No upcoming appointments.</p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link to="/appointments/schedule">
                        <PlusCircle className="mr-2 h-4 w-4" /> Schedule Appointment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/appointments">
                    View All Appointments
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-health-green-500" />
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Daily Step Goal</span>
                    <span className="text-sm text-health-neutral-500">6,543 / 10,000</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Water Intake</span>
                    <span className="text-sm text-health-neutral-500">5 / 8 cups</span>
                  </div>
                  <Progress value={63} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Sleep</span>
                    <span className="text-sm text-health-neutral-500">7.2 hours</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/health-tracking">
                    View Health Tracking
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-purple-500" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-health-neutral-500">Active medications</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link to="/medications">
                    View Medications
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-health-blue-500" />
                  Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-sm text-health-neutral-500">Health documents</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link to="/records">
                    View Records
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-green-500" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-health-neutral-600">Need someone to talk to? Access mental health support.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="btn-secondary w-full">
                  <Link to="/mental-health-chat">
                    Start Chat
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
              <CardDescription>
                Describe your symptoms to get preliminary guidance. This is not a replacement for professional medical advice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SymptomChecker />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medication Management</CardTitle>
              <CardDescription>
                Keep track of your medications, dosages, and schedules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicationList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>
                Access your secure health documents and test results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Your health records are securely stored and encrypted using blockchain technology. Only you and your authorized healthcare providers can access them.</p>
                
                <div className="bg-health-neutral-50 rounded-lg p-4">
                  <p className="text-health-neutral-700 font-medium mb-2">Recent Documents</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-health-neutral-500" />
                        <span>Blood Test Results</span>
                      </div>
                      <span className="text-sm text-health-neutral-500">Apr 2, 2025</span>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-health-neutral-500" />
                        <span>Annual Physical Exam</span>
                      </div>
                      <span className="text-sm text-health-neutral-500">Mar 15, 2025</span>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-health-neutral-500" />
                        <span>Vaccination Record</span>
                      </div>
                      <span className="text-sm text-health-neutral-500">Feb 27, 2025</span>
                    </li>
                  </ul>
                </div>
                
                <Button asChild className="btn-primary w-full">
                  <Link to="/records/all">
                    View All Health Records
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
