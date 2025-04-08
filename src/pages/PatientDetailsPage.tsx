
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PatientInfo from "@/components/patient/PatientInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, PatientVitals, Appointment, Medication } from "@/types/user";
import { getPatientById } from "@/services/patientService";
import { getLatestVitals, simulateRealtimeVitals } from "@/services/vitalService";
import { Activity, Calendar, FileText, Heart, Clock, Pill } from "lucide-react";

const PatientDetailsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<User | null>(null);
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        if (patientId) {
          const patientData = await getPatientById(patientId);
          setPatient(patientData);
          
          try {
            const vitalsData = await getLatestVitals(patientId);
            setVitals(vitalsData);
          } catch (error) {
            console.error("Error fetching vitals:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
    
    // Setup realtime vitals simulation if needed
    let cleanup: (() => void) | undefined;
    
    if (patientId) {
      cleanup = simulateRealtimeVitals(patientId, (updatedVitals) => {
        setVitals(updatedVitals);
      });
    }
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [patientId]);

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

  if (!patient) {
    return (
      <Layout>
        <div className="health-container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
            <p className="mb-6">The patient you are looking for does not exist or you don't have permission to view their details.</p>
            <Button asChild>
              <Link to="/doctor/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{patient.firstName} {patient.lastName}</h1>
            <p className="text-health-neutral-600">Patient ID: {patient.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/doctor/dashboard">
                Back to Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/consultation/${patient.id}`}>
                Start Consultation
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-health-blue-500" />
                      Vital Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vitals ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Heart className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="text-sm text-health-neutral-500">Heart Rate</p>
                              <p className="font-medium">{vitals.heartRate} bpm</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm text-health-neutral-500">Blood Pressure</p>
                              <p className="font-medium">{vitals.bloodPressure} mmHg</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm text-health-neutral-500">Blood Sugar</p>
                              <p className="font-medium">{vitals.bloodSugar} mg/dL</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-teal-500" />
                            <div>
                              <p className="text-sm text-health-neutral-500">Oxygen Level</p>
                              <p className="font-medium">{vitals.oxygenLevel}%</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-orange-500" />
                            <div>
                              <p className="text-sm text-health-neutral-500">Temperature</p>
                              <p className="font-medium">{vitals.temperature.toFixed(1)}°C</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-health-neutral-500" />
                            <div>
                              <p className="text-sm text-health-neutral-500">Last Updated</p>
                              <p className="font-medium">
                                {new Date(vitals.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-health-neutral-500">No vitals data available for this patient.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Pill className="mr-2 h-5 w-5 text-purple-500" />
                        Current Medications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded">
                          <div>
                            <p className="font-medium">Lisinopril</p>
                            <p className="text-sm text-health-neutral-500">10mg - Once daily</p>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded">
                          <div>
                            <p className="font-medium">Metformin</p>
                            <p className="text-sm text-health-neutral-500">500mg - Twice daily</p>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded">
                          <div>
                            <p className="font-medium">Atorvastatin</p>
                            <p className="text-sm text-health-neutral-500">20mg - Once daily</p>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-health-blue-500" />
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded">
                          <div>
                            <p className="font-medium">Follow-up Appointment</p>
                            <p className="text-sm text-health-neutral-500">Apr 15, 2025 - 10:00 AM</p>
                          </div>
                          <Button size="sm">Confirm</Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded">
                          <div>
                            <p className="font-medium">Annual Physical</p>
                            <p className="text-sm text-health-neutral-500">May 20, 2025 - 2:30 PM</p>
                          </div>
                          <Button size="sm">Confirm</Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="records" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="p-3 border rounded-lg">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-health-neutral-500 mt-1 mr-3" />
                          <div>
                            <p className="font-medium">Hypertension</p>
                            <p className="text-sm text-health-neutral-500">Diagnosed: Jan 2023</p>
                            <p className="text-sm text-health-neutral-600 mt-1">
                              Patient has been managing hypertension with medication. Blood pressure has been well controlled with current regimen.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="p-3 border rounded-lg">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-health-neutral-500 mt-1 mr-3" />
                          <div>
                            <p className="font-medium">Type 2 Diabetes</p>
                            <p className="text-sm text-health-neutral-500">Diagnosed: Mar 2022</p>
                            <p className="text-sm text-health-neutral-600 mt-1">
                              A1C levels have improved from 8.2% to 6.8% over the past year with medication and lifestyle changes.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded border-b last:border-0">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-health-neutral-500 mr-3" />
                          <div>
                            <p className="font-medium">Complete Blood Count</p>
                            <p className="text-sm text-health-neutral-500">Apr 2, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded border-b last:border-0">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-health-neutral-500 mr-3" />
                          <div>
                            <p className="font-medium">Lipid Panel</p>
                            <p className="text-sm text-health-neutral-500">Mar 15, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-50 rounded border-b last:border-0">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-health-neutral-500 mr-3" />
                          <div>
                            <p className="font-medium">A1C Test</p>
                            <p className="text-sm text-health-neutral-500">Feb 27, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appointments" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-health-neutral-500 mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Follow-up Appointment</p>
                              <p className="text-sm text-health-neutral-500">Mar 1, 2025 - 11:30 AM</p>
                              <p className="text-sm text-health-neutral-600 mt-1">
                                Discussed medication adjustment and reviewed recent lab results. Patient reported improvement in symptoms.
                              </p>
                            </div>
                          </div>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">Completed</span>
                        </div>
                      </li>
                      <li className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-health-neutral-500 mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Video Consultation</p>
                              <p className="text-sm text-health-neutral-500">Feb 15, 2025 - 2:00 PM</p>
                              <p className="text-sm text-health-neutral-600 mt-1">
                                Patient reported mild headaches. Recommended increased hydration and sleep. Follow-up in two weeks if symptoms persist.
                              </p>
                            </div>
                          </div>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">Completed</span>
                        </div>
                      </li>
                      <li className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-health-neutral-500 mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Annual Physical</p>
                              <p className="text-sm text-health-neutral-500">Jan 10, 2025 - 9:15 AM</p>
                              <p className="text-sm text-health-neutral-600 mt-1">
                                Comprehensive physical examination completed. Ordered standard lab work. Overall health is stable.
                              </p>
                            </div>
                          </div>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">Completed</span>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule New Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-health-neutral-600">
                        Select from available appointment slots to schedule your next visit with this patient.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          <Calendar className="mr-2 h-4 w-4" /> Apr 20, 2025 - 9:00 AM
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Calendar className="mr-2 h-4 w-4" /> Apr 20, 2025 - 11:30 AM
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Calendar className="mr-2 h-4 w-4" /> Apr 21, 2025 - 2:00 PM
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Calendar className="mr-2 h-4 w-4" /> Apr 22, 2025 - 10:15 AM
                        </Button>
                      </div>
                      <Button className="w-full mt-4">
                        Schedule Custom Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <PatientInfo patient={patient} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetailsPage;
