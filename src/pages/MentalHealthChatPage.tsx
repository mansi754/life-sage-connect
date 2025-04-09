
import Layout from "@/components/layout/Layout";
import MentalHealthChat from "@/components/mental-health/MentalHealthChat";
import AIPatientAssistant from "@/components/mental-health/AIPatientAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MentalHealthChatPage = () => {
  return (
    <Layout>
      <div className="health-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-health-neutral-900 mb-2">Mental Health Support</h1>
          <p className="text-health-neutral-600 max-w-2xl mx-auto">
            A safe space to discuss mental health concerns and receive support. 
            All conversations are confidential and you can choose to remain anonymous.
          </p>
        </div>
        
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="chat">Chat with Therapist</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <MentalHealthChat />
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="max-w-3xl mx-auto">
              <AIPatientAssistant />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MentalHealthChatPage;
