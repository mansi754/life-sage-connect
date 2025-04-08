
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare, 
  Share, FileText, Copy, Users, X, Maximize, Minimize 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PatientInfo from "@/components/patient/PatientInfo";
import { useParams } from "react-router-dom";
import { getPatientById } from "@/services/patientService";
import { User } from "@/types/user";

const VideoConsultation = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load patient information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id, toast]);

  // Simulate connecting to the video call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      
      // Simulate getting access to the user's camera and microphone
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            
            // Simulate remote video after a delay
            setTimeout(() => {
              if (remoteVideoRef.current) {
                // In a real app, this would come from WebRTC
                remoteVideoRef.current.srcObject = stream;
              }
            }, 2000);
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error);
            toast({
              title: "Camera Access Error",
              description: "Could not access your camera or microphone. Please check permissions.",
              variant: "destructive",
            });
          });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    
    // In a real app, this would control the actual audio stream
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    // In a real app, this would control the actual video stream
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const endCall = () => {
    // In a real app, this would disconnect from WebRTC
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }
    
    toast({
      title: "Call Ended",
      description: "Your consultation has ended.",
      variant: "default",
    });
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      sender: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
    
    // Simulate response from the other participant
    if (patient) {
      setTimeout(() => {
        const responseMessage = {
          sender: patient.firstName,
          message: "I've received your message. Let me check on that.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, responseMessage]);
      }, 1500);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Consultation link copied to clipboard.",
      variant: "default",
    });
  };

  return (
    <div className="h-full min-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Video Consultation
          {patient && ` with ${patient.firstName} ${patient.lastName}`}
        </h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={toggleFullScreen}
          >
            {isFullScreen ? (
              <><Minimize className="h-4 w-4 mr-2" /> Exit Fullscreen</>
            ) : (
              <><Maximize className="h-4 w-4 mr-2" /> Fullscreen</>
            )}
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center" 
            onClick={endCall}
          >
            <Phone className="h-4 w-4 mr-2" /> End Call
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        <div className="lg:col-span-2 flex flex-col">
          {/* Main video area */}
          <div className="relative bg-health-neutral-900 rounded-lg flex-grow flex items-center justify-center overflow-hidden">
            {isConnected ? (
              <>
                <video 
                  ref={remoteVideoRef}
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                ></video>
                
                {/* Local video (self-view) */}
                <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-health-neutral-800 rounded-lg overflow-hidden shadow-lg">
                  <video 
                    ref={localVideoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  ></video>
                </div>
                
                {/* Connection status */}
                <div className="absolute top-4 left-4 bg-black/30 text-white text-sm py-1 px-3 rounded-full flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  Connected
                </div>
                
                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/30 rounded-full p-2">
                  <button 
                    onClick={toggleAudio}
                    className={`p-3 rounded-full ${isAudioEnabled ? 'bg-health-blue-500 text-white' : 'bg-health-neutral-700 text-white'}`}
                  >
                    {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                  <button 
                    onClick={toggleVideo}
                    className={`p-3 rounded-full ${isVideoEnabled ? 'bg-health-blue-500 text-white' : 'bg-health-neutral-700 text-white'}`}
                  >
                    {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>
                  <button 
                    onClick={copyInviteLink}
                    className="p-3 rounded-full bg-health-neutral-700 text-white"
                  >
                    <Share className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-500 text-white"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="animate-pulse text-white text-opacity-80 mb-2">
                  Connecting to the consultation...
                </div>
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-health-blue-500 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> Participants
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Notes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-grow flex flex-col">
              <Card className="flex-grow flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-8 text-health-neutral-500">
                        <MessageSquare className="h-10 w-10 mx-auto mb-2 text-health-neutral-300" />
                        <p>No messages yet.</p>
                        <p className="text-sm">Type below to start the conversation.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                        >
                          <div 
                            className={`max-w-[75%] rounded-lg px-4 py-2 ${
                              msg.sender === "You" 
                                ? "bg-health-blue-500 text-white" 
                                : "bg-health-neutral-100 text-health-neutral-800"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">{msg.sender}</span>
                              <span className="text-xs opacity-75">{msg.time}</span>
                            </div>
                            <p>{msg.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t p-3">
                    <form onSubmit={sendChatMessage} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-health-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" className="btn-primary">Send</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="participants" className="flex-grow">
              <Card className="h-full">
                <CardContent className="p-4 h-full">
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-health-blue-500 text-white flex items-center justify-center mr-3">
                          <span>DW</span>
                        </div>
                        <div>
                          <p className="font-medium">Dr. Williams</p>
                          <p className="text-sm text-health-neutral-500">Host (You)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mic className="h-4 w-4 text-health-neutral-500 mr-2" />
                        <Video className="h-4 w-4 text-health-neutral-500" />
                      </div>
                    </li>
                    {patient && (
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-health-neutral-200 text-health-neutral-700 flex items-center justify-center mr-3">
                            <span>{patient.firstName[0]}{patient.lastName[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                            <p className="text-sm text-health-neutral-500">Patient</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mic className="h-4 w-4 text-health-neutral-500 mr-2" />
                          <Video className="h-4 w-4 text-health-neutral-500" />
                        </div>
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-6 bg-health-neutral-50 rounded-lg p-4">
                    <p className="font-medium mb-2">Invite someone</p>
                    <div className="flex items-center bg-white border rounded-md p-2">
                      <input
                        type="text"
                        readOnly
                        value={window.location.href}
                        className="flex-grow border-0 focus:outline-none text-sm"
                      />
                      <Button size="sm" variant="ghost" onClick={copyInviteLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="flex-grow">
              <Card className="h-full">
                <CardContent className="p-4 h-full flex flex-col">
                  <textarea
                    placeholder="Take notes during the consultation..."
                    className="flex-grow border rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-health-blue-500"
                  ></textarea>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline">Clear</Button>
                    <Button className="btn-primary">Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
