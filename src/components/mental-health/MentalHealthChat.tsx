
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Info, Bot, User, Plus, Clock, Calendar, Smile, Frown, Meh } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

type MoodEntry = {
  id: string;
  date: Date;
  mood: "good" | "neutral" | "bad";
  notes: string;
};

const MentalHealthChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your mental health assistant. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [moodTracker, setMoodTracker] = useState<MoodEntry[]>([
    {
      id: "1",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      mood: "neutral",
      notes: "Feeling okay, but a bit stressed about work."
    },
    {
      id: "2",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      mood: "bad",
      notes: "Had trouble sleeping and felt anxious most of the day."
    },
    {
      id: "3",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      mood: "good",
      notes: "Went for a walk and felt much better afterward."
    },
    {
      id: "4",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      mood: "neutral",
      notes: "Average day, nothing special."
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [newMood, setNewMood] = useState<"good" | "neutral" | "bad">("neutral");
  const [newMoodNotes, setNewMoodNotes] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsSending(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand how you feel. Would you like to talk more about what's happening?",
        "That's interesting. Can you tell me more about why you feel this way?",
        "I'm here to listen. How long have you been feeling like this?",
        "Thank you for sharing. What strategies have helped you cope in the past?",
        "I appreciate you opening up. Have you discussed these feelings with anyone else?",
      ];

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsSending(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddMood = () => {
    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: newMood,
      notes: newMoodNotes
    };

    setMoodTracker([...moodTracker, moodEntry]);
    setNewMoodNotes("");
    toast({
      title: "Mood Tracked",
      description: "Your mood has been recorded in your health journal.",
      variant: "default",
    });
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMoodDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-health-blue-100 text-health-blue-600">
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">Mental Health Assistant</h2>
            <p className="text-sm text-health-neutral-500">Available 24/7 for support</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMoodTracker(!showMoodTracker)}
          className="flex items-center"
        >
          {showMoodTracker ? "Hide Mood Tracker" : "Show Mood Tracker"}
        </Button>
      </div>

      {showMoodTracker ? (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Mood Tracker</h3>
              <Button variant="outline" size="sm" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> View Calendar
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <h4 className="font-medium mb-3">How are you feeling today?</h4>
              <div className="flex space-x-4 mb-4">
                <button
                  className={`flex flex-col items-center p-3 rounded-lg flex-1 ${
                    newMood === "good" ? "bg-green-50 border border-green-200" : "bg-health-neutral-50 border border-health-neutral-200"
                  }`}
                  onClick={() => setNewMood("good")}
                >
                  <Smile className={`h-8 w-8 ${newMood === "good" ? "text-green-500" : "text-health-neutral-400"}`} />
                  <span className="mt-1 text-sm">Good</span>
                </button>
                <button
                  className={`flex flex-col items-center p-3 rounded-lg flex-1 ${
                    newMood === "neutral" ? "bg-blue-50 border border-blue-200" : "bg-health-neutral-50 border border-health-neutral-200"
                  }`}
                  onClick={() => setNewMood("neutral")}
                >
                  <Meh className={`h-8 w-8 ${newMood === "neutral" ? "text-blue-500" : "text-health-neutral-400"}`} />
                  <span className="mt-1 text-sm">Neutral</span>
                </button>
                <button
                  className={`flex flex-col items-center p-3 rounded-lg flex-1 ${
                    newMood === "bad" ? "bg-amber-50 border border-amber-200" : "bg-health-neutral-50 border border-health-neutral-200"
                  }`}
                  onClick={() => setNewMood("bad")}
                >
                  <Frown className={`h-8 w-8 ${newMood === "bad" ? "text-amber-500" : "text-health-neutral-400"}`} />
                  <span className="mt-1 text-sm">Challenging</span>
                </button>
              </div>
              <div className="mb-3">
                <Textarea
                  placeholder="Add some notes about how you're feeling..."
                  value={newMoodNotes}
                  onChange={(e) => setNewMoodNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button onClick={handleAddMood} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Mood Entry
              </Button>
            </div>
            
            <h4 className="font-medium mb-3">Recent Entries</h4>
            <div className="space-y-3">
              {moodTracker.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {entry.mood === "good" ? (
                        <Smile className="h-5 w-5 text-green-500 mr-2" />
                      ) : entry.mood === "neutral" ? (
                        <Meh className="h-5 w-5 text-blue-500 mr-2" />
                      ) : (
                        <Frown className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <div>
                        <div className="font-medium">
                          {entry.mood === "good" ? "Good" : 
                          entry.mood === "neutral" ? "Neutral" : "Challenging"}
                        </div>
                        <div className="text-sm text-health-neutral-500">
                          {entry.notes}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-health-neutral-500 text-sm">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {formatMoodDate(entry.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-health-blue-100 text-health-blue-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-health-blue-500 text-white"
                        : "bg-health-neutral-100 text-health-neutral-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : "text-health-neutral-500"
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-health-green-100 text-health-green-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center bg-health-neutral-100 text-health-neutral-800 rounded-lg p-3">
                  <span className="h-2 w-2 bg-health-neutral-400 rounded-full animate-pulse"></span>
                  <span className="h-2 w-2 bg-health-neutral-400 rounded-full animate-pulse ml-1"></span>
                  <span className="h-2 w-2 bg-health-neutral-400 rounded-full animate-pulse ml-1"></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[120px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            className="h-[60px] w-[60px] rounded-full p-2 flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-health-neutral-500 flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            This is an AI assistant. For emergencies, please call 911 or your local crisis hotline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChat;
