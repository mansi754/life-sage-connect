
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getCurrentUser } from "@/services/authService";
import { getPatientById } from "@/services/patientService";
import { getLatestVitals, simulateRealtimeVitals } from "@/services/vitalService";
import { User, PatientVitals } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Thermometer, Droplet, Activity, Lungs, User as UserIcon, FileText, Video, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<User | null>(null);
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      
      if (!user) {
        navigate("/login");
        return false;
      }
      
      if (user.role !== "doctor") {
        navigate("/patient/dashboard");
        return false;
      }
      
      return true;
    };
    
    const fetchPatientData = async () => {
      if (!id || !checkAuth()) return;
      
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);
        
        const vitalsData = await getLatestVitals(id);
        setVitals(vitalsData);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
    
    // Set up real-time vitals simulation
    let cleanup: (() => void) | null = null;
    
    if (id) {
      cleanup = simulateRealtimeVitals(id, (newVitals) => {
        setVitals(newVitals);
      });
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [id, navigate]);

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

  if (error || !patient) {
    return (
      <Layout>
        <div className="health-container py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error || "Patient not found"}</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/doctor/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getVitalStatus = (type: string, value: number | string): { color: string; status: string } => {
    switch (type) {
      case "heartRate": {
        const rate = value as number;
        if (rate < 60) return { color: "text-amber-500", status: "Low" };
        if (rate > 100) return { color: "text-red-500", status: "High" };
        return { color: "text-green-500", status: "Normal" };
      }
      case "bloodPressure": {
        const [systolic, diastolic] = (value as string).split('/').map(Number);
        if (systolic > 140 || diastolic > 90) return { color: "text-red-500", status: "High" };
        if (systolic < 90 || diastolic < 60) return { color: "text-amber-500", status: "Low" };
        return { color: "text-green-500", status: "Normal" };
      }
      case "bloodSugar": {
        const sugar = value as number;
        if (sugar > 140) return { color: "text-red-500", status: "High" };
        if (sugar < 70) return { color: "text-amber-500", status: "Low" };
        return { color: "text-green-500", status: "Normal" };
      }
      case "oxygenLevel": {
        const oxygen = value as number;
        if (oxygen < 92) return { color: "text-red-500", status: "Low" };
        if (oxygen < 95) return { color: "text-amber-500", status: "Borderline" };
        return { color: "text-green-500", status: "Normal" };
      }
      case "temperature": {
        const temp = value as number;
        if (temp > 38) return { color: "text-red-500", status: "High" };
        if (temp < 36) return { color: "text-amber-500", status: "Low" };
        return { color: "text-green-500", status: "Normal" };
      }
      default:
        return { color: "text-gray-500", status: "Unknown" };
    }
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="mr-4" 
              onClick={() => navigate("/doctor/dashboard")}
            >
              &larr; Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h1>
              <p className="text-health-neutral-600">Patient ID: {patient.id}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button asChild variant="outline">
              <Link to={`/patient/${patient.id}/history`}>
                <FileText className="mr-2 h-4 w-4" /> Medical History
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/calendar?patient=${patient.id}`}>
                <CalendarDays className="mr-2 h-4 w-4" /> Schedule
              </Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link to={`/consultation/${patient.id}`}>
                <Video className="mr-2 h-4 w-4" /> Start Consultation
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="vitals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vitals">Real-time Vitals</TabsTrigger>
            <TabsTrigger value="info">Patient Info</TabsTrigger>
            <TabsTrigger value="notes">Medical Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vitals && (
                <>
                  {/* Heart Rate Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" /> Heart Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{Math.round(vitals.heartRate)}</span>
                        <span className="ml-2 text-health-neutral-500">bpm</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className={`text-sm font-medium ${getVitalStatus('heartRate', vitals.heartRate).color}`}>
                          {getVitalStatus('heartRate', vitals.heartRate).status}
                        </span>
                        <span className="ml-2 text-xs text-health-neutral-500">
                          (Normal range: 60-100 bpm)
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Blood Pressure Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Activity className="h-5 w-5 text-blue-500 mr-2" /> Blood Pressure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{vitals.bloodPressure}</span>
                        <span className="ml-2 text-health-neutral-500">mmHg</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className={`text-sm font-medium ${getVitalStatus('bloodPressure', vitals.bloodPressure).color}`}>
                          {getVitalStatus('bloodPressure', vitals.bloodPressure).status}
                        </span>
                        <span className="ml-2 text-xs text-health-neutral-500">
                          (Normal range: 90/60 - 120/80 mmHg)
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Blood Sugar Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Droplet className="h-5 w-5 text-purple-500 mr-2" /> Blood Sugar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{Math.round(vitals.bloodSugar)}</span>
                        <span className="ml-2 text-health-neutral-500">mg/dL</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className={`text-sm font-medium ${getVitalStatus('bloodSugar', vitals.bloodSugar).color}`}>
                          {getVitalStatus('bloodSugar', vitals.bloodSugar).status}
                        </span>
                        <span className="ml-2 text-xs text-health-neutral-500">
                          (Normal range: 70-140 mg/dL)
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Oxygen Level Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Lungs className="h-5 w-5 text-cyan-500 mr-2" /> Oxygen Level
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{Math.round(vitals.oxygenLevel)}</span>
                        <span className="ml-2 text-health-neutral-500">%</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className={`text-sm font-medium ${getVitalStatus('oxygenLevel', vitals.oxygenLevel).color}`}>
                          {getVitalStatus('oxygenLevel', vitals.oxygenLevel).status}
                        </span>
                        <span className="ml-2 text-xs text-health-neutral-500">
                          (Normal range: 95-100%)
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Temperature Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Thermometer className="h-5 w-5 text-orange-500 mr-2" /> Temperature
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{vitals.temperature.toFixed(1)}</span>
                        <span className="ml-2 text-health-neutral-500">°C</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className={`text-sm font-medium ${getVitalStatus('temperature', vitals.temperature).color}`}>
                          {getVitalStatus('temperature', vitals.temperature).status}
                        </span>
                        <span className="ml-2 text-xs text-health-neutral-500">
                          (Normal range: 36.1-37.2°C)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {!vitals && (
                <div className="col-span-full bg-health-neutral-50 rounded-lg p-8 text-center">
                  <Activity className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                  <p className="text-health-neutral-500">No vital data available for this patient.</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm">
              <p className="font-medium">Note: Vital readings are being updated in real-time.</p>
              <p className="mt-1">The displayed values are simulated for demonstration purposes.</p>
            </div>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>
                  Basic information about {patient.firstName} {patient.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center p-4 bg-health-neutral-50 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-health-neutral-200 flex items-center justify-center mr-4">
                    <UserIcon className="h-8 w-8 text-health-neutral-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-health-neutral-600">{patient.email}</p>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Patient
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-health-neutral-500 mb-1">Date of Birth</h4>
                    <p>January 15, 1980</p>
                  </div>
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-health-neutral-500 mb-1">Gender</h4>
                    <p>Male</p>
                  </div>
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-health-neutral-500 mb-1">Phone</h4>
                    <p>(555) 123-4567</p>
                  </div>
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-health-neutral-500 mb-1">Address</h4>
                    <p>123 Main St, Anytown, USA</p>
                  </div>
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-health-neutral-500 mb-1">Emergency Contact</h4>
                    <p>Jane Smith (555) 987-6543</p>
                  </div>
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <h4 className="text-sm font-medium text-health-neutral-500 mb-1">Insurance</h4>
                    <p>HealthCare Plus (#12345678)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Medical Notes</CardTitle>
                <CardDescription>
                  Clinical notes and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Initial Consultation</h4>
                      <span className="text-sm text-health-neutral-500">April 1, 2025</span>
                    </div>
                    <p className="mt-2 text-health-neutral-700">
                      Patient presents with symptoms of hypertension. Initial readings show elevated blood pressure 
                      (145/90 mmHg). Recommended lifestyle changes including reduced sodium intake and regular exercise.
                      Will monitor for 2 weeks before considering medication.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-health-neutral-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Follow-up Visit</h4>
                      <span className="text-sm text-health-neutral-500">April 8, 2025</span>
                    </div>
                    <p className="mt-2 text-health-neutral-700">
                      Patient reports adherence to recommended lifestyle changes. Blood pressure has improved slightly 
                      (138/85 mmHg) but still elevated. Prescribed lisinopril 10mg once daily. Scheduled follow-up 
                      in 2 weeks to assess medication efficacy and tolerability.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatientDetailsPage;
