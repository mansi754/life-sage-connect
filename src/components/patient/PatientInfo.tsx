
import { useState } from "react";
import { User } from "@/types/user";
import { formatDate } from "@/utils/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Pill, Activity, AlertTriangle, Edit, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PatientInfoProps {
  patient: User;
  isLoading?: boolean;
}

const PatientInfo = ({ patient, isLoading = false }: PatientInfoProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState({
    email: patient.email || "",
    allergies: "Penicillin, Peanuts",
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    oxygenLevel: "98%",
    temperature: "98.6°F",
    lastCheckupDate: "Apr 2, 2025",
    notes: "All vitals are within normal range and have been stable over the past 3 months."
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would save to the backend here
    setEditMode(false);
    toast({
      title: "Information Updated",
      description: "Patient information has been successfully updated.",
      variant: "default",
    });
  };

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
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{patient.firstName} {patient.lastName}</CardTitle>
          <CardDescription>
            Patient since {formatDate(patient.createdAt)}
          </CardDescription>
        </div>
        {!editMode ? (
          <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Information
          </Button>
        ) : (
          <Button className="bg-green-500 hover:bg-green-600" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        )}
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
                  {editMode ? (
                    <Input 
                      name="email"
                      value={editedFields.email} 
                      onChange={handleInputChange}
                      className="mt-1" 
                    />
                  ) : (
                    <p className="font-medium">{editedFields.email}</p>
                  )}
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
                    {editMode ? (
                      <div className="flex items-center">
                        <span>Last appointment: </span>
                        <Input 
                          name="lastAppointmentDate"
                          defaultValue="Apr 2, 2025"
                          className="ml-2 w-32 h-7 text-sm" 
                        />
                      </div>
                    ) : (
                      <span>Last appointment: Apr 2, 2025</span>
                    )}
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
                  <div className="w-full">
                    <p className="font-medium text-amber-800">Allergies</p>
                    {editMode ? (
                      <Input
                        name="allergies"
                        value={editedFields.allergies}
                        onChange={handleInputChange}
                        className="mt-1 bg-amber-50 border-amber-200"
                      />
                    ) : (
                      <p className="text-sm text-amber-700">{editedFields.allergies}</p>
                    )}
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
                    <div className="w-full">
                      <p className="text-sm text-health-neutral-500">Blood Pressure</p>
                      {editMode ? (
                        <Input 
                          name="bloodPressure"
                          value={editedFields.bloodPressure}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{editedFields.bloodPressure}</p>
                      )}
                      <p className="text-xs text-health-neutral-500">
                        Last checked: {editMode ? (
                          <Input 
                            name="lastCheckupDate"
                            value={editedFields.lastCheckupDate}
                            onChange={handleInputChange}
                            className="mt-1 text-xs h-6 inline-block w-28"
                          />
                        ) : (
                          editedFields.lastCheckupDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div className="w-full">
                      <p className="text-sm text-health-neutral-500">Heart Rate</p>
                      {editMode ? (
                        <Input 
                          name="heartRate"
                          value={editedFields.heartRate}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{editedFields.heartRate}</p>
                      )}
                      <p className="text-xs text-health-neutral-500">Last checked: {editedFields.lastCheckupDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div className="w-full">
                      <p className="text-sm text-health-neutral-500">Oxygen Level</p>
                      {editMode ? (
                        <Input 
                          name="oxygenLevel"
                          value={editedFields.oxygenLevel}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{editedFields.oxygenLevel}</p>
                      )}
                      <p className="text-xs text-health-neutral-500">Last checked: {editedFields.lastCheckupDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-health-blue-500 mr-2" />
                    <div className="w-full">
                      <p className="text-sm text-health-neutral-500">Temperature</p>
                      {editMode ? (
                        <Input 
                          name="temperature"
                          value={editedFields.temperature}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{editedFields.temperature}</p>
                      )}
                      <p className="text-xs text-health-neutral-500">Last checked: {editedFields.lastCheckupDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Vitals Trend</h4>
                {editMode ? (
                  <Textarea
                    name="notes"
                    value={editedFields.notes}
                    onChange={handleInputChange}
                    className="w-full mt-1"
                  />
                ) : (
                  <p className="text-sm text-health-neutral-500">
                    {editedFields.notes}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medications" className="pt-4">
            <div className="space-y-4">
              {editMode && (
                <Button variant="outline" className="w-full mb-2">
                  <Plus className="mr-2 h-4 w-4" /> Add New Medication
                </Button>
              )}
              <ul className="space-y-3">
                <li className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      {editMode ? (
                        <>
                          <Input defaultValue="Lisinopril" className="mb-1 font-medium" />
                          <Input defaultValue="10mg, Once daily" className="mb-1 text-sm" />
                          <Input defaultValue="For hypertension" className="text-sm" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Lisinopril</p>
                          <p className="text-sm text-health-neutral-500">10mg, Once daily</p>
                          <p className="text-sm text-health-neutral-500">For hypertension</p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      {editMode ? (
                        <>
                          <Input defaultValue="Jan 15, 2025" className="mb-1 text-xs w-32" />
                          <Input defaultValue="May 1, 2025" className="text-xs w-32 text-health-blue-500" />
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-health-neutral-500">Started: Jan 15, 2025</p>
                          <p className="text-xs text-health-blue-500">Refill due: May 1, 2025</p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      {editMode ? (
                        <>
                          <Input defaultValue="Metformin" className="mb-1 font-medium" />
                          <Input defaultValue="500mg, Twice daily" className="mb-1 text-sm" />
                          <Input defaultValue="For Type 2 Diabetes" className="text-sm" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Metformin</p>
                          <p className="text-sm text-health-neutral-500">500mg, Twice daily</p>
                          <p className="text-sm text-health-neutral-500">For Type 2 Diabetes</p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      {editMode ? (
                        <>
                          <Input defaultValue="Feb 20, 2025" className="mb-1 text-xs w-32" />
                          <Input defaultValue="Apr 20, 2025" className="text-xs w-32 text-health-blue-500" />
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-health-neutral-500">Started: Feb 20, 2025</p>
                          <p className="text-xs text-health-blue-500">Refill due: Apr 20, 2025</p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      {editMode ? (
                        <>
                          <Input defaultValue="Atorvastatin" className="mb-1 font-medium" />
                          <Input defaultValue="20mg, Once daily" className="mb-1 text-sm" />
                          <Input defaultValue="For cholesterol management" className="text-sm" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Atorvastatin</p>
                          <p className="text-sm text-health-neutral-500">20mg, Once daily</p>
                          <p className="text-sm text-health-neutral-500">For cholesterol management</p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      {editMode ? (
                        <>
                          <Input defaultValue="Mar 10, 2025" className="mb-1 text-xs w-32" />
                          <Input defaultValue="May 10, 2025" className="text-xs w-32 text-health-blue-500" />
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-health-neutral-500">Started: Mar 10, 2025</p>
                          <p className="text-xs text-health-blue-500">Refill due: May 10, 2025</p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="records" className="pt-4">
            <div className="space-y-4">
              {editMode && (
                <Button variant="outline" className="w-full mb-2">
                  <Plus className="mr-2 h-4 w-4" /> Upload New Record
                </Button>
              )}
              <p className="text-sm text-health-neutral-600">
                All health records are secured with blockchain encryption technology.
              </p>
              
              <ul className="space-y-3">
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div className="w-full">
                      {editMode ? (
                        <>
                          <Input defaultValue="Blood Test Results" className="mb-1 font-medium" />
                          <Input defaultValue="Apr 2, 2025" className="text-xs" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Blood Test Results</p>
                          <p className="text-xs text-health-neutral-500">Uploaded: Apr 2, 2025</p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div className="w-full">
                      {editMode ? (
                        <>
                          <Input defaultValue="Annual Physical Exam" className="mb-1 font-medium" />
                          <Input defaultValue="Mar 15, 2025" className="text-xs" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Annual Physical Exam</p>
                          <p className="text-xs text-health-neutral-500">Uploaded: Mar 15, 2025</p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div className="w-full">
                      {editMode ? (
                        <>
                          <Input defaultValue="Vaccination Record" className="mb-1 font-medium" />
                          <Input defaultValue="Feb 27, 2025" className="text-xs" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Vaccination Record</p>
                          <p className="text-xs text-health-neutral-500">Uploaded: Feb 27, 2025</p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
                
                <li className="border rounded-lg p-3 hover:bg-health-neutral-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-health-neutral-400 mr-3" />
                    <div className="w-full">
                      {editMode ? (
                        <>
                          <Input defaultValue="Chest X-Ray" className="mb-1 font-medium" />
                          <Input defaultValue="Jan 12, 2025" className="text-xs" />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Chest X-Ray</p>
                          <p className="text-xs text-health-neutral-500">Uploaded: Jan 12, 2025</p>
                        </>
                      )}
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
