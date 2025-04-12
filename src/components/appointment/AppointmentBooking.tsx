
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createAppointment } from "@/services/appointmentService";
import { getCurrentUser } from "@/services/authService";
import { format } from "date-fns";
import { CalendarDays, Clock, Video, User, FileText } from "lucide-react";

interface AppointmentBookingProps {
  doctorId: string;
  onSuccess?: () => void;
}

const AppointmentBooking = ({ doctorId, onSuccess }: AppointmentBookingProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<"Video Consultation" | "In-Person" | "Phone Call">("Video Consultation");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Generate available time slots (in a real app, these would come from the doctor's availability)
  const getAvailableTimeSlots = () => {
    return [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
      "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
    ];
  };

  const handleSubmit = async () => {
    if (!date || !timeSlot || !currentUser) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields to book your appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newAppointment = {
        doctorId,
        patientId: currentUser.id,
        date: format(date, "yyyy-MM-dd"),
        time: timeSlot,
        type: appointmentType,
        status: "Scheduled" as const,
        notes: notes.trim() || undefined
      };

      await createAppointment(newAppointment);

      toast({
        title: "Appointment Booked",
        description: `Your appointment has been scheduled for ${format(date, "MMMM d, yyyy")} at ${timeSlot}.`,
      });

      // Reset form
      setDate(undefined);
      setTimeSlot("");
      setNotes("");

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Book an Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 font-medium text-sm flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" /> Select Date
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3"
              disabled={(date) => {
                // Disable past dates and weekends in this example
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const day = date.getDay();
                return date < today || day === 0 || day === 6;
              }}
            />
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 font-medium text-sm flex items-center">
                <Clock className="mr-2 h-4 w-4" /> Select Time Slot
              </div>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-2 font-medium text-sm flex items-center">
                <Video className="mr-2 h-4 w-4" /> Appointment Type
              </div>
              <Select 
                value={appointmentType} 
                onValueChange={(value) => setAppointmentType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video Consultation">Video Consultation</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-2 font-medium text-sm flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Notes (optional)
              </div>
              <Textarea
                placeholder="Add any additional information or concerns..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={!date || !timeSlot || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Processing...
            </div>
          ) : (
            "Book Appointment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentBooking;
