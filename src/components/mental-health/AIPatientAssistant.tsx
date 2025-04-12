
import { useState, useRef, useEffect } from "react";
import { getPatientAssistance, initializeOpenAI, getOpenAIClient } from "@/services/openaiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, User, Bot, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const AIPatientAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your healthcare assistant. I can help with general health questions, medication reminders, and provide emotional support. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai-api-key") || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem("openai-api-key"));
  
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
      const response = await getPatientAssistance(input);
      
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

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Health Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your health, medications, or get emotional support
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Alert className="mb-4 border-yellow-500 bg-yellow-50">
          <Shield className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Health disclaimer</AlertTitle>
          <AlertDescription>
            This AI assistant provides general information only and is not a substitute for professional medical advice.
          </AlertDescription>
        </Alert>

        {showApiKeyInput ? (
          <div className="space-y-2 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
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
              <label htmlFor="patient-api-key" className="text-sm font-medium">
                Enter your OpenAI API Key
              </label>
              <input
                id="patient-api-key"
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
          <div className="mb-4 flex justify-between items-center">
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

        <ScrollArea className="h-[350px] pr-4">
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
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Input
          placeholder="Type your message..."
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
      </CardFooter>
    </Card>
  );
};

export default AIPatientAssistant;
