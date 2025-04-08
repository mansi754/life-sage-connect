
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, AlertTriangle, Video, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";

const PatientsPage = () => {
  const {
    loading,
    filteredPatients,
    alerts,
    appointments,
    searchQuery,
    setSearchQuery,
  } = useDoctorDashboard();

  const getPatientStatusBadge = (patientRecord) => {
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
          <h1 className="text-2xl font-bold tracking-tight">My Patients</h1>
          <Button className="btn-primary flex items-center">
            <User className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
        </div>

        <div className="flex items-center mb-4">
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
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientsPage;
