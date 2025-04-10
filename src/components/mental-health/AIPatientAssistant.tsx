
import { useState, useRef, useEffect } from "react";
import { getPatientAssistance, initializeOpenAI } from "@/services/openaiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, User, Bot, Loader2, Shield } from "lucide-react";
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

        {/* API key is now pre-configured */}
        <div className="p-2 text-xs text-health-neutral-600 bg-health-neutral-50 rounded mb-4">
          OpenAI API key is configured
        </div>

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
      </CardFooter>
    </Card>
  );
};

export default AIPatientAssistant;
