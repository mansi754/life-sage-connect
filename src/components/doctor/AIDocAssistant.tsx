
import { useState, useRef, useEffect } from "react";
import { getDoctorAssistance, initializeOpenAI } from "@/services/openaiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, User, Bot, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const AIDocAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello doctor, I'm your AI assistant. I can help analyze patient information and suggest possible actions. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [patientData, setPatientData] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPatientPanel, setShowPatientPanel] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize OpenAI on component mount
    initializeOpenAI();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      const response = await getDoctorAssistance(patientData, input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting assistance:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble responding right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const samplePatientData = `Patient Name: John Doe
Age: 45
Gender: Male
Medical History: Hypertension (diagnosed 2018), Type 2 Diabetes (diagnosed 2020)
Current Medications: Lisinopril 10mg daily, Metformin 500mg twice daily
Allergies: Penicillin
Recent Vitals: BP 140/85, HR 76, Temp 98.6°F
Recent Labs: HbA1c 7.2%, Cholesterol 210 mg/dL, LDL 130 mg/dL, HDL 45 mg/dL
Chief Complaint: Fatigue, blurred vision, and occasional dizziness for past 2 weeks`;

  return (
    <Card className="w-full h-[700px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Doctor's AI Assistant
        </CardTitle>
        <CardDescription>
          Get insights and suggestions based on patient data
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-9rem)]">
        {/* API key is now pre-configured */}
        <div className="p-4">
          <div className="p-2 text-xs text-health-neutral-600 bg-health-neutral-50 rounded">
            OpenAI API key is configured
          </div>
        </div>

        <div className="flex h-[calc(100%-4rem)]">
          {showPatientPanel && (
            <div className="w-1/3 border-r p-4">
              <h3 className="font-medium mb-2">Patient Information</h3>
              <Tabs defaultValue="input">
                <TabsList className="w-full mb-2">
                  <TabsTrigger value="input" className="flex-1">Edit</TabsTrigger>
                  <TabsTrigger value="template" className="flex-1">Template</TabsTrigger>
                </TabsList>
                <TabsContent value="input">
                  <Textarea
                    placeholder="Enter patient information here..."
                    value={patientData}
                    onChange={(e) => setPatientData(e.target.value)}
                    className="h-[400px] resize-none"
                  />
                </TabsContent>
                <TabsContent value="template">
                  <div className="text-sm">
                    <p className="mb-2">Load sample patient data:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPatientData(samplePatientData)}
                      className="w-full mb-2"
                    >
                      Load Sample
                    </Button>
                    <div className="bg-health-neutral-50 p-2 rounded text-xs">
                      <pre className="whitespace-pre-wrap">{samplePatientData}</pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className={`${showPatientPanel ? "w-2/3" : "w-full"} flex flex-col`}>
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <span className="font-medium">Chat</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPatientPanel(!showPatientPanel)}
              >
                {showPatientPanel ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-health-primary-100 text-health-primary-900"
                          : "bg-health-neutral-100 text-health-neutral-900"
                      } p-3 rounded-lg`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this patient..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={loading || !input.trim()}
                  size="icon"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDocAssistant;
