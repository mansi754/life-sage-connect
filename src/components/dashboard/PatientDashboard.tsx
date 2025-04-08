
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Bell, Video, MessageSquare, AlertTriangle, FileText, PlusCircle, Pill, Clipboard, ShieldCheck, CalendarClock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SymptomChecker from "@/components/patient/SymptomChecker";
import MedicationList from "@/components/patient/MedicationList";

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
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
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

  const handleShareRecordsWithDoctor = () => {
    toast({
      title: "Records Shared",
      description: "Your health records have been securely shared with Dr. Williams.",
      variant: "default",
    });
  };

  const toggleInsuranceForm = () => {
    setShowInsuranceForm(!showInsuranceForm);
  };

  const handleSubmitInsurance = (e) => {
    e.preventDefault();
    toast({
      title: "Insurance Information Updated",
      description: "Your insurance details have been updated successfully.",
      variant: "default",
    });
    setShowInsuranceForm(false);
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-health-neutral-500">Upcoming Appointments</CardTitle>
              <div className="bg-health-blue-50 text-health-blue-500 p-2 rounded-full">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <div className="text-xs text-health-neutral-500">
              Next: {upcomingAppointments[0]?.date}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-health-neutral-500">Active Medications</CardTitle>
              <div className="bg-purple-50 text-purple-500 p-2 rounded-full">
                <Pill className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-health-neutral-500">
              Last updated: Apr 2, 2025
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-health-neutral-500">Health Records</CardTitle>
              <div className="bg-green-50 text-green-500 p-2 rounded-full">
                <FileText className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs text-health-neutral-500">
              Last updated: Mar 27, 2025
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-health-neutral-500">Insurance Status</CardTitle>
              <div className="bg-amber-50 text-amber-500 p-2 rounded-full">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">BlueCross</div>
            <div className="text-xs text-health-neutral-500">
              Policy #: BC1234567
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="records">Health Records</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
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
                  <Clipboard className="mr-2 h-5 w-5 text-health-green-500" />
                  Preventive Health Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Annual Physical</span>
                    <span className="text-sm text-health-green-500">Completed</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Vaccines</span>
                    <span className="text-sm text-health-blue-500">3/4 Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Cancer Screening</span>
                    <span className="text-sm text-amber-500">Due in 2 months</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Dental Checkup</span>
                    <span className="text-sm text-red-500">Overdue</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/preventive-care">
                    View Preventive Care Plan
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
                <Button asChild className="w-full">
                  <Link to="/mental-health-chat">
                    Start Chat
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 text-health-blue-500" />
                  Family Health Management
                </CardTitle>
                <CardDescription>
                  Manage health records for your family members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-health-blue-100 flex items-center justify-center mr-3">
                        <span className="text-health-blue-500 font-medium">SK</span>
                      </div>
                      <div>
                        <p className="font-medium">Sarah Kim</p>
                        <p className="text-sm text-health-neutral-500">Spouse</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-health-blue-100 flex items-center justify-center mr-3">
                        <span className="text-health-blue-500 font-medium">EK</span>
                      </div>
                      <div>
                        <p className="font-medium">Ethan Kim</p>
                        <p className="text-sm text-health-neutral-500">Child (8 yrs)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <Button variant="secondary" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Family Member
                  </Button>
                </div>
              </CardContent>
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
                
                <div className="flex flex-col md:flex-row gap-3">
                  <Button className="w-full" onClick={handleShareRecordsWithDoctor}>
                    Share Records with Doctor
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/records/all">
                      View All Health Records
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
              <CardDescription>
                Manage your insurance details and coverage information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {showInsuranceForm ? (
                  <form onSubmit={handleSubmitInsurance}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Insurance Provider</label>
                          <input 
                            type="text" 
                            defaultValue="BlueCross BlueShield"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-health-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Policy Number</label>
                          <input 
                            type="text" 
                            defaultValue="BC1234567"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-health-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Group Number</label>
                          <input 
                            type="text" 
                            defaultValue="GRP789012"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-health-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Member ID</label>
                          <input 
                            type="text" 
                            defaultValue="MEM456789"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-health-blue-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Coverage Type</label>
                        <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-health-blue-500">
                          <option>Individual</option>
                          <option>Family</option>
                          <option>Employee</option>
                          <option>Medicare Advantage</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <Button type="button" variant="outline" onClick={toggleInsuranceForm}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-health-neutral-50 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">Primary Insurance</h3>
                          <p className="text-health-neutral-600">BlueCross BlueShield</p>
                        </div>
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-3">
                        <div>
                          <p className="text-sm text-health-neutral-500">Policy Number</p>
                          <p className="font-medium">BC1234567</p>
                        </div>
                        <div>
                          <p className="text-sm text-health-neutral-500">Group Number</p>
                          <p className="font-medium">GRP789012</p>
                        </div>
                        <div>
                          <p className="text-sm text-health-neutral-500">Coverage Type</p>
                          <p className="font-medium">Family</p>
                        </div>
                        <div>
                          <p className="text-sm text-health-neutral-500">Effective Date</p>
                          <p className="font-medium">Jan 1, 2025</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Deductible Status</h3>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm">Individual ($1,500)</span>
                          <span className="text-sm">$850 / $1,500</span>
                        </div>
                        <Progress value={56} className="h-2" />
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Out-of-Pocket Maximum</h3>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm">Individual ($5,000)</span>
                          <span className="text-sm">$1,200 / $5,000</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Coverage Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Primary Care Visit</span>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm">$25 Copay</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Specialist Visit</span>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm">$40 Copay</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Emergency Room</span>
                          <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-sm">$250 Copay</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Prescription Drugs</span>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm">Tier 1: $10 / Tier 2: $25</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button asChild variant="outline">
                        <Link to="/insurance/claims">View Claims</Link>
                      </Button>
                      <Button onClick={toggleInsuranceForm}>
                        Update Insurance Information
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
