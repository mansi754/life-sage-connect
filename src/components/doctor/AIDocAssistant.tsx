
import { useState, useRef, useEffect } from "react";
import { getDoctorAssistance, getOpenAIClient, initializeOpenAI } from "@/services/openaiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, Send, User, Bot, Loader2, PanelLeftClose, 
  PanelLeftOpen, AlertTriangle, Save, RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface SavedPatient {
  id: string;
  name: string;
  data: string;
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
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPatientPanel, setShowPatientPanel] = useState(true);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai-api-key") || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem("openai-api-key"));
  const [savedPatients, setSavedPatients] = useState<SavedPatient[]>(() => {
    const saved = localStorage.getItem("saved-patients");
    return saved ? JSON.parse(saved) : [];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if API key exists in localStorage on component mount
    const storedApiKey = localStorage.getItem("openai-api-key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      initializeOpenAI(storedApiKey);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Check if OpenAI client is initialized
    if (!getOpenAIClient()) {
      setShowApiKeyInput(true);
      return;
    }
    
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

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai-api-key", apiKey);
      initializeOpenAI(apiKey);
      setShowApiKeyInput(false);
    }
  };

  const handleSavePatient = () => {
    if (!patientData.trim() || !patientName.trim()) return;
    
    const newPatient: SavedPatient = {
      id: Date.now().toString(),
      name: patientName,
      data: patientData
    };
    
    const updatedPatients = [...savedPatients, newPatient];
    setSavedPatients(updatedPatients);
    localStorage.setItem("saved-patients", JSON.stringify(updatedPatients));
  };

  const handleLoadPatient = (id: string) => {
    const patient = savedPatients.find(p => p.id === id);
    if (patient) {
      setPatientData(patient.data);
      setPatientName(patient.name);
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
        {showApiKeyInput ? (
          <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-md m-4">
            <div className="flex items-start mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-700">API Key Required</h3>
                <p className="text-sm text-blue-600">
                  This feature requires an OpenAI API key to function. Your key is stored locally in your browser only.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="doc-api-key" className="text-sm font-medium">
                Enter your OpenAI API Key
              </label>
              <input
                id="doc-api-key"
                type="password"
                className="w-full p-2 border rounded"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <Button 
                onClick={handleSaveApiKey}
                size="sm"
                className="w-full"
                disabled={!apiKey.trim()}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowApiKeyInput(true)}
              className="text-xs"
            >
              Change API Key
            </Button>
            {apiKey && (
              <div className="text-xs text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                API Connected
              </div>
            )}
          </div>
        )}

        <div className="flex h-[calc(100%-4rem)]">
          {showPatientPanel && (
            <div className="w-1/3 border-r p-4">
              <h3 className="font-medium mb-2">Patient Information</h3>
              <Tabs defaultValue="input">
                <TabsList className="w-full mb-2">
                  <TabsTrigger value="input" className="flex-1">Edit</TabsTrigger>
                  <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
                  <TabsTrigger value="template" className="flex-1">Template</TabsTrigger>
                </TabsList>
                <TabsContent value="input">
                  <div className="space-y-2">
                    <Input
                      placeholder="Patient Name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="mb-2"
                    />
                    <Textarea
                      placeholder="Enter patient information here..."
                      value={patientData}
                      onChange={(e) => setPatientData(e.target.value)}
                      className="h-[350px] resize-none"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSavePatient}
                      className="w-full"
                      disabled={!patientData.trim() || !patientName.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" /> Save Patient Data
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="saved">
                  {savedPatients.length === 0 ? (
                    <div className="text-center py-6 text-health-neutral-500">
                      <p>No saved patient data</p>
                      <p className="text-xs mt-1">Save patient data for quick access</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedPatients.map((patient) => (
                        <div 
                          key={patient.id} 
                          className="border rounded-md p-2 cursor-pointer hover:bg-health-neutral-50"
                          onClick={() => handleLoadPatient(patient.id)}
                        >
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-health-neutral-500 truncate">
                            {patient.data.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="template">
                  <div className="text-sm">
                    <p className="mb-2">Load sample patient data:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPatientData(samplePatientData);
                        setPatientName("John Doe");
                      }}
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
              {!patientData.trim() && showPatientPanel && (
                <Alert className="mb-2 bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-600">No patient data</AlertTitle>
                  <AlertDescription className="text-amber-600 text-sm">
                    Please enter patient information in the left panel for more accurate insights.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this patient..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || showApiKeyInput}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={loading || !input.trim() || showApiKeyInput}
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
