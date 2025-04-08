
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import MedicationList from "@/components/patient/MedicationList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, Calendar, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MedicationsPage = () => {
  const [activeTab, setActiveTab] = useState("current");
  const { toast } = useToast();

  const handleAddMedication = () => {
    toast({
      title: "Feature in development",
      description: "The add medication feature will be available soon.",
      variant: "default",
    });
  };

  const handleSetReminder = () => {
    toast({
      title: "Reminder set",
      description: "You will be notified when it's time to take your medication.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Medication Management</h1>
            <p className="text-health-neutral-600">Keep track of your medications, dosages, and schedules.</p>
          </div>
          <Button className="flex items-center" onClick={handleAddMedication}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Medication Management</CardTitle>
            <CardDescription>
              Keep track of your medications, dosages, and schedules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="pt-4">
                <MedicationList />
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex items-center" onClick={handleSetReminder}>
                    <Bell className="mr-2 h-4 w-4" /> Set Reminder
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" /> View Calendar
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="pt-4">
                <div className="space-y-4">
                  <p className="text-health-neutral-600">Your medication history helps your healthcare providers understand your treatment journey.</p>
                  
                  <div className="bg-health-neutral-50 rounded-lg p-4">
                    <p className="text-health-neutral-700 font-medium mb-2">Past Medications</p>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Metformin 500mg</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Jan - Mar 2025</span>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Amoxicillin 250mg</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Dec 2024</span>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Prednisone 10mg</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Oct 2024</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="pt-4">
                <div className="space-y-4">
                  <p className="text-health-neutral-600">Upcoming medication schedules and reminders.</p>
                  
                  <div className="bg-health-neutral-50 rounded-lg p-4">
                    <p className="text-health-neutral-700 font-medium mb-2">Today's Schedule</p>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 bg-health-blue-50 text-health-blue-700 rounded-md">
                        <div className="flex items-center">
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Lisinopril 10mg</span>
                        </div>
                        <span className="text-sm">8:00 AM</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-health-neutral-100 text-health-neutral-700 rounded-md">
                        <div className="flex items-center">
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Atorvastatin 20mg</span>
                        </div>
                        <span className="text-sm">8:00 PM</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-health-neutral-50 rounded-lg p-4">
                    <p className="text-health-neutral-700 font-medium mb-2">Tomorrow</p>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Lisinopril 10mg</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">8:00 AM</span>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Atorvastatin 20mg</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">8:00 PM</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MedicationsPage;
