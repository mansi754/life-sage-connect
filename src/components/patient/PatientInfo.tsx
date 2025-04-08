
import { User } from "@/types/user";
import { formatDate } from "@/utils/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Pill, Activity, AlertTriangle } from "lucide-react";

interface PatientInfoProps {
  patient: User;
  isLoading?: boolean;
}

const PatientInfo = ({ patient, isLoading = false }: PatientInfoProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-7 w-1/3 bg-health-neutral-200 animate-pulse rounded"></div>
          <div className="h-5 w-1/2 bg-health-neutral-200 animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-health-neutral-200 animate-pulse rounded"></div>
            <div className="h-6 bg-health-neutral-200 animate-pulse rounded"></div>
            <div className="h-6 w-3/4 bg-health-neutral-200 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{patient.firstName} {patient.lastName}</CardTitle>
        <CardDescription>
          Patient since {formatDate(patient.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-health-neutral-500">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-health-neutral-500">ID</p>
                  <p className="font-medium">{patient.id}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-health-neutral-500">Recent Activity</p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-health-neutral-400 mr-2" />
                    <span>Last appointment: Apr 2, 2025</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <FileText className="h-4 w-4 text-health-neutral-400 mr-2" />
                    <span>Lab results uploaded: Mar 27, 2025</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Pill className="h-4 w-4 text-health-neutral-400 mr-2" />
                    <span>Prescription renewed: Mar 15, 2025</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Allergies</p>
                    <p className="text-sm text-amber-700">Penicillin, Peanuts</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vitals" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-health-neutral-500">Blood Pressure</p>
                      <p className="font-medium">120/80 mmHg</p>
                      <p className="text-xs text-health-neutral-500">Last checked: Apr 2, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-health-neutral-500">Heart Rate</p>
                      <p className="font-medium">72 bpm</p>
                      <p className="text-xs text-health-neutral-500">Last checked: Apr 2, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-health-neutral-500">Oxygen Level</p>
                      <p className="font-medium">98%</p>
                      <p className="text-xs text-health-neutral-500">Last checked: Apr 2, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-health-neutral-500">Temperature</p>
                      <p className="font-medium">98.6°F</p>
                      <p className="text-xs text-health-neutral-500">Last checked: Apr 2, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Vitals Trend</h4>
                <p className="text-sm text-health-neutral-500">
                  All vitals are within normal range and have been stable over the past 3 months.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medications" className="pt-4">
            <div className="space-y-4">
              <ul className="space-y-3">
                <li className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Lisinopril</p>
                      <p className="text-sm text-health-neutral-500">10mg, Once daily</p>
                      <p className="text-sm text-health-neutral-500">For hypertension</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-health-neutral-500">Started: Jan 15, 2025</p>
                      <p className="text-xs text-health-blue-500">Refill due: May 1, 2025</p>
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Metformin</p>
                      <p className="text-sm text-health-neutral-500">500mg, Twice daily</p>
                      <p className="text-sm text-health-neutral-500">For Type 2 Diabetes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-health-neutral-500">Started: Feb 20, 2025</p>
                      <p className="text-xs text-health-blue-500">Refill due: Apr 20, 2025</p>
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Atorvastatin</p>
                      <p className="text-sm text-health-neutral-500">20mg, Once daily</p>
                      <p className="text-sm text-health-neutral-500">For cholesterol management</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-health-neutral-500">Started: Mar 10, 2025</p>
                      <p className="text-xs text-health-blue-500">Refill due: May 10, 2025</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="records" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-health-neutral-600">
                All health records are secured with blockchain encryption technology.
              </p>
              
              <ul className="space-y-3">
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div>
                      <p className="font-medium">Blood Test Results</p>
                      <p className="text-xs text-health-neutral-500">Uploaded: Apr 2, 2025</p>
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div>
                      <p className="font-medium">Annual Physical Exam</p>
                      <p className="text-xs text-health-neutral-500">Uploaded: Mar 15, 2025</p>
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div>
                      <p className="font-medium">Vaccination Record</p>
                      <p className="text-xs text-health-neutral-500">Uploaded: Feb 27, 2025</p>
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div>
                      <p className="font-medium">Chest X-Ray</p>
                      <p className="text-xs text-health-neutral-500">Uploaded: Jan 12, 2025</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
