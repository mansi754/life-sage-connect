
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Info, MessageSquare, Users, Clock, ArrowRight } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot" | "counselor";
  timestamp: Date;
};

type SupportResource = {
  name: string;
  description: string;
  link: string;
};

const supportResources: SupportResource[] = [
  {
    name: "National Suicide Prevention Lifeline",
    description: "24/7, free and confidential support for people in distress",
    link: "https://suicidepreventionlifeline.org"
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a Crisis Counselor",
    link: "https://www.crisistextline.org"
  },
  {
    name: "SAMHSA's National Helpline",
    description: "Treatment referral and information service for individuals facing mental health or substance use disorders",
    link: "https://www.samhsa.gov/find-help/national-helpline"
  },
  {
    name: "Mental Health America",
    description: "Resources, screening tools, and support for a variety of mental health conditions",
    link: "https://www.mhanational.org"
  }
];

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Welcome to LifeSage Mental Health Support. I'm here to listen and help. How are you feeling today?",
    sender: "bot",
    timestamp: new Date()
  }
];

const MentalHealthChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "Thank you for sharing that. How long have you been feeling this way?",
        "I understand that must be difficult. What strategies have you tried to cope with these feelings?",
        "It's important to acknowledge those feelings. Have you spoken to anyone else about this?",
        "I'm here to support you. Would it help to talk about what might be triggering these feelings?",
        "You're not alone in feeling this way. Many people experience similar challenges. Would you like to explore some coping strategies?",
        "It sounds like you're going through a lot. Remember that seeking help is a sign of strength, not weakness.",
        "I appreciate you trusting me with this. Would it be helpful to connect you with additional resources?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleAnonymity = () => {
    setIsAnonymous(!isAnonymous);
    toast({
      title: isAnonymous ? "Identity Revealed" : "Anonymous Mode Enabled",
      description: isAnonymous 
        ? "Your real identity will now be shown to counselors." 
        : "Your identity will remain anonymous to counselors.",
      variant: "default",
    });
  };

  const requestCounselor = () => {
    toast({
      title: "Request Sent",
      description: "A mental health professional will join the chat shortly.",
      variant: "default",
    });
    
    // Simulate counselor joining
    setTimeout(() => {
      const counselorMessage: Message = {
        id: Date.now().toString(),
        content: "Hello, I'm Dr. Taylor, a licensed therapist. I've reviewed your conversation and I'm here to help. Would you like to continue our discussion?",
        sender: "counselor",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, counselorMessage]);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-health-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle>Mental Health Support Chat</CardTitle>
          <CardDescription>
            Talk about your feelings in a safe, confidential space. You can remain anonymous if you prefer.
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="chat">
          <div className="px-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center">
                <Info className="h-4 w-4 mr-2" /> Resources
              </TabsTrigger>
              <TabsTrigger value="support-groups" className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> Support Groups
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat">
            <CardContent className="pb-0">
              <div className="bg-health-neutral-50 p-4 rounded-lg mb-4 flex items-center">
                <div className="bg-health-blue-100 text-health-blue-500 p-2 rounded-full mr-3">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-health-neutral-700">
                    {isAnonymous 
                      ? "You're chatting anonymously. Your information will not be shared." 
                      : "You're chatting with your profile information visible to counselors."}
                  </p>
                  <div className="mt-2 flex items-center">
                    <Button variant="link" className="p-0 h-auto text-health-blue-500" onClick={toggleAnonymity}>
                      {isAnonymous ? "Turn off anonymity" : "Go anonymous"}
                    </Button>
                    <span className="mx-2 text-health-neutral-300">|</span>
                    <Button variant="link" className="p-0 h-auto text-health-blue-500" onClick={requestCounselor}>
                      Request a counselor
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender !== "user" && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                          message.sender === "bot" 
                            ? "bg-health-blue-100 text-health-blue-500" 
                            : "bg-health-green-100 text-health-green-500"
                        }`}>
                          {message.sender === "bot" ? "LS" : "DT"}
                        </div>
                      )}
                      <div 
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          message.sender === "user" 
                            ? "bg-health-blue-500 text-white" 
                            : message.sender === "counselor"
                              ? "bg-health-green-500 text-white"
                              : "bg-health-neutral-100 text-health-neutral-800"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                            {message.sender === "user" 
                              ? "You" 
                              : message.sender === "counselor"
                                ? "Dr. Taylor"
                                : "LifeSage Support"
                            }
                          </span>
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-health-neutral-200 flex items-center justify-center ml-2 flex-shrink-0">
                          {isAnonymous ? "A" : "You"}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full bg-health-blue-100 text-health-blue-500 flex items-center justify-center mr-2 flex-shrink-0">
                        LS
                      </div>
                      <div className="bg-health-neutral-100 text-health-neutral-800 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-health-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-health-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-health-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="mb-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                  />
                  <Button type="submit" className="btn-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-health-neutral-500 mt-2">
                  Your conversation is encrypted and confidential. In crisis? Call 988 for immediate help.
                </p>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="resources">
            <CardContent>
              <div className="space-y-4">
                <p className="text-health-neutral-700">
                  These trusted resources offer additional support for mental health concerns:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportResources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-health-neutral-900">{resource.name}</h3>
                      <p className="text-sm text-health-neutral-600 mt-1">{resource.description}</p>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-health-blue-500 hover:text-health-blue-700 text-sm font-medium mt-2 inline-flex items-center"
                      >
                        Visit Website <ArrowRight className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
                
                <div className="bg-health-blue-50 border border-health-blue-200 rounded-lg p-4 mt-6">
                  <h3 className="font-medium text-health-blue-900 mb-2">Emergency Resources</h3>
                  <p className="text-health-blue-800 mb-2">
                    If you're experiencing a mental health emergency or having thoughts of suicide:
                  </p>
                  <ul className="list-disc pl-5 text-health-blue-800 space-y-1">
                    <li>Call or text 988 to reach the Suicide and Crisis Lifeline</li>
                    <li>Text HOME to 741741 to reach the Crisis Text Line</li>
                    <li>Call 911 or go to your nearest emergency room</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="support-groups">
            <CardContent>
              <div className="space-y-6">
                <p className="text-health-neutral-700">
                  Connect with others who understand what you're going through in our moderated support groups:
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-health-neutral-900">Anxiety Support</h3>
                        <p className="text-sm text-health-neutral-600 mt-1">
                          A safe space to discuss anxiety, panic attacks, and coping strategies.
                        </p>
                        <div className="flex items-center mt-2 text-health-neutral-500 text-sm">
                          <Users className="h-4 w-4 mr-1" /> 
                          <span>243 members</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" /> 
                          <span>Next session: Tomorrow, 7:00 PM</span>
                        </div>
                      </div>
                      <Button className="btn-primary">Join Group</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-health-neutral-900">Depression Support</h3>
                        <p className="text-sm text-health-neutral-600 mt-1">
                          Share experiences and support for depression and mood disorders.
                        </p>
                        <div className="flex items-center mt-2 text-health-neutral-500 text-sm">
                          <Users className="h-4 w-4 mr-1" /> 
                          <span>187 members</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" /> 
                          <span>Next session: Today, 8:00 PM</span>
                        </div>
                      </div>
                      <Button className="btn-primary">Join Group</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-health-neutral-900">Stress Management</h3>
                        <p className="text-sm text-health-neutral-600 mt-1">
                          Learn techniques for managing stress in daily life.
                        </p>
                        <div className="flex items-center mt-2 text-health-neutral-500 text-sm">
                          <Users className="h-4 w-4 mr-1" /> 
                          <span>156 members</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" /> 
                          <span>Next session: Friday, 6:30 PM</span>
                        </div>
                      </div>
                      <Button className="btn-primary">Join Group</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-health-neutral-900">Rural Healthcare Access</h3>
                        <p className="text-sm text-health-neutral-600 mt-1">
                          Support for those facing barriers to healthcare in rural areas.
                        </p>
                        <div className="flex items-center mt-2 text-health-neutral-500 text-sm">
                          <Users className="h-4 w-4 mr-1" /> 
                          <span>98 members</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" /> 
                          <span>Next session: Saturday, 10:00 AM</span>
                        </div>
                      </div>
                      <Button className="btn-primary">Join Group</Button>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline">View All Support Groups</Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <CardFooter className="flex justify-between border-t border-health-neutral-200 pt-4">
            <div className="text-sm text-health-neutral-500">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              Counselors available 24/7
            </div>
            <Button variant="outline" size="sm">
              End Session
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default MentalHealthChat;
