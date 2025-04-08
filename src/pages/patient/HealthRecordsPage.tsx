
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HealthRecordsPage = () => {
  const { toast } = useToast();
  
  const handleShareRecordsWithDoctor = () => {
    toast({
      title: "Records Shared",
      description: "Your health records have been securely shared with Dr. Williams.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Health Records</h1>
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
                  <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-health-neutral-500" />
                      <span>MRI Results</span>
                    </div>
                    <span className="text-sm text-health-neutral-500">Jan 18, 2025</span>
                  </li>
                  <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-health-neutral-500" />
                      <span>Specialist Consultation Report</span>
                    </div>
                    <span className="text-sm text-health-neutral-500">Jan 5, 2025</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <Button onClick={handleShareRecordsWithDoctor}>
                  Share Records with Doctor
                </Button>
                <Button variant="outline">
                  Upload New Record
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HealthRecordsPage;
