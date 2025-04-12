
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarDays, Clock, FileText } from "lucide-react";
import { Appointment } from "@/types/user";
import { updateAppointmentStatus } from "@/services/appointmentService";

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (appointmentId: string, status: Appointment["status"]) => void;
}

const RescheduleModal = ({ appointment, isOpen, onClose, onReschedule }: RescheduleModalProps) => {
  const [date, setDate] = useState<Date | undefined>(
    appointment ? new Date(appointment.date) : undefined
  );
  const [timeSlot, setTimeSlot] = useState<string>(appointment?.time || "");
  const [notes, setNotes] = useState<string>(appointment?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Generate available time slots
  const getAvailableTimeSlots = () => {
    return [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
      "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
    ];
  };

  const handleReschedule = async () => {
    if (!appointment || !date || !timeSlot) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields to reschedule the appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you'd update the appointment with the new date/time
      // Here we just update the status back to "Scheduled"
      const updatedAppointment = await updateAppointmentStatus(appointment.id, "Scheduled");

      // Call the parent handler for UI updates
      onReschedule(appointment.id, "Scheduled");

      toast({
        title: "Appointment Rescheduled",
        description: `The appointment has been rescheduled for ${format(date, "MMMM d, yyyy")} at ${timeSlot}.`,
      });

      onClose();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast({
        title: "Rescheduling Failed",
        description: "There was an error rescheduling the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5" />
            Reschedule Appointment
          </DialogTitle>
          <DialogDescription>
            Select a new date and time for this appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <div className="mb-2 font-medium text-sm flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" /> New Date
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const day = date.getDay();
                return date < today || day === 0 || day === 6;
              }}
            />
          </div>
          <div>
            <div className="mb-2 font-medium text-sm flex items-center">
              <Clock className="mr-2 h-4 w-4" /> New Time Slot
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
              <FileText className="mr-2 h-4 w-4" /> Notes
            </div>
            <Textarea
              placeholder="Add any notes about the rescheduling..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReschedule} disabled={!date || !timeSlot || isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Processing...
              </div>
            ) : (
              "Confirm Reschedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
