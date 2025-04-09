
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SymptomChecker from "@/components/patient/SymptomChecker";
import SymptomAnalyzer from "@/components/patient/SymptomAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { History, Share, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SymptomCheckerPage = () => {
  const [activeTab, setActiveTab] = useState("check");
  const { toast } = useToast();

  const handleSaveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your symptom check results have been saved to your health records.",
      variant: "default",
    });
  };

  const handleShareWithDoctor = () => {
    toast({
      title: "Results Shared",
      description: "Your symptom check results have been shared with your doctor.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Symptom Checker</h1>
            <p className="text-health-neutral-600">Analyze your symptoms and get preliminary guidance.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Symptom Checker</CardTitle>
            <CardDescription>
              Describe your symptoms to get preliminary guidance. This is not a replacement for professional medical advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="check" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="check">Symptom Checker</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="check" className="pt-4">
                <SymptomChecker />
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex items-center" onClick={handleSaveResults}>
                    <Save className="mr-2 h-4 w-4" /> Save Results
                  </Button>
                  <Button variant="outline" className="flex items-center" onClick={handleShareWithDoctor}>
                    <Share className="mr-2 h-4 w-4" /> Share with Doctor
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-analysis" className="pt-4">
                <SymptomAnalyzer />
              </TabsContent>
              
              <TabsContent value="history" className="pt-4">
                <div className="space-y-4">
                  <p className="text-health-neutral-600">View your previous symptom checks and their results.</p>
                  
                  <div className="bg-health-neutral-50 rounded-lg p-4">
                    <p className="text-health-neutral-700 font-medium mb-2">Recent Symptom Checks</p>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <History className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Headache, Fatigue</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Apr 5, 2025</span>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <History className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Chest Pain, Shortness of Breath</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Mar 22, 2025</span>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <History className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Nausea, Abdominal Pain</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Feb 14, 2025</span>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-health-neutral-100 rounded-md">
                        <div className="flex items-center">
                          <History className="mr-2 h-4 w-4 text-health-neutral-500" />
                          <span>Rash, Itching</span>
                        </div>
                        <span className="text-sm text-health-neutral-500">Jan 30, 2025</span>
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

export default SymptomCheckerPage;
