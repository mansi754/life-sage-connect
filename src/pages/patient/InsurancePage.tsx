
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InsurancePage = () => {
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const { toast } = useToast();

  const toggleInsuranceForm = () => {
    setShowInsuranceForm(!showInsuranceForm);
  };

  const handleSubmitInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Insurance Information Updated",
      description: "Your insurance details have been updated successfully.",
      variant: "default",
    });
    setShowInsuranceForm(false);
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Insurance Information</h1>
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
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">$25 Copay</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Specialist Visit</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">$40 Copay</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Emergency Room</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">$250 Copay</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Prescription Drugs</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Tier 1: $10 / Tier 2: $25</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Hospital Stay</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">$300/day (max 5 days)</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">View Claims</Button>
                    <Button onClick={toggleInsuranceForm}>
                      Update Insurance Information
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InsurancePage;
