
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pill, Clock, Plus, Trash2, Edit, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  refillDate?: string;
  reminders: boolean;
};

const initialMedications: Medication[] = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    instructions: "Take with or without food.",
    timeOfDay: ["Morning"],
    startDate: "2025-01-15",
    refillDate: "2025-05-01",
    reminders: true
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    instructions: "Take with meals.",
    timeOfDay: ["Morning", "Evening"],
    startDate: "2025-02-20",
    refillDate: "2025-04-20",
    reminders: true
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    instructions: "Take in the evening.",
    timeOfDay: ["Evening"],
    startDate: "2025-03-10",
    refillDate: "2025-05-10",
    reminders: true
  }
];

const MedicationList = () => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [newMedication, setNewMedication] = useState<Omit<Medication, "id">>({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    timeOfDay: [],
    startDate: new Date().toISOString().split("T")[0],
    reminders: true
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeOfDayChange = (time: string) => {
    setNewMedication(prev => {
      const updatedTimeOfDay = prev.timeOfDay.includes(time)
        ? prev.timeOfDay.filter(t => t !== time)
        : [...prev.timeOfDay, time];
      return { ...prev, timeOfDay: updatedTimeOfDay };
    });
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Required Fields",
        description: "Please fill in the name and dosage of the medication.",
        variant: "destructive",
      });
      return;
    }

    if (editingId !== null) {
      // Update existing medication
      setMedications(medications.map(med => 
        med.id === editingId ? { ...newMedication, id: editingId } : med
      ));
      toast({
        title: "Medication Updated",
        description: `${newMedication.name} has been updated in your medication list.`,
        variant: "default",
      });
    } else {
      // Add new medication
      const newId = Math.max(0, ...medications.map(m => m.id)) + 1;
      setMedications([...medications, { ...newMedication, id: newId }]);
      toast({
        title: "Medication Added",
        description: `${newMedication.name} has been added to your medication list.`,
        variant: "default",
      });
    }

    // Reset form and close dialog
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      timeOfDay: [],
      startDate: new Date().toISOString().split("T")[0],
      reminders: true
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEditMedication = (medication: Medication) => {
    setNewMedication({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions,
      timeOfDay: medication.timeOfDay,
      startDate: medication.startDate,
      endDate: medication.endDate,
      refillDate: medication.refillDate,
      reminders: medication.reminders
    });
    setEditingId(medication.id);
    setIsDialogOpen(true);
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medication Removed",
      description: "The medication has been removed from your list.",
      variant: "default",
    });
  };

  const handleToggleReminder = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, reminders: !med.reminders } : med
    ));
    
    const medication = medications.find(med => med.id === id);
    
    toast({
      title: medication?.reminders ? "Reminders Disabled" : "Reminders Enabled",
      description: medication?.reminders 
        ? `Reminders for ${medication.name} have been turned off.`
        : `You will now receive reminders for ${medication?.name}.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">My Medications</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" /> Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId !== null ? "Edit Medication" : "Add New Medication"}</DialogTitle>
              <DialogDescription>
                Enter the details of your medication. Fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Lisinopril"
                    value={newMedication.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage" className="after:content-['*'] after:ml-0.5 after:text-red-500">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    placeholder="e.g., 10mg"
                    value={newMedication.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  name="frequency"
                  placeholder="e.g., Once daily"
                  value={newMedication.frequency}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Time of Day</Label>
                <div className="flex space-x-4">
                  {["Morning", "Noon", "Evening", "Bedtime"].map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`time-${time}`}
                        checked={newMedication.timeOfDay.includes(time)}
                        onChange={() => handleTimeOfDayChange(time)}
                        className="rounded text-health-blue-500 focus:ring-health-blue-500"
                      />
                      <label htmlFor={`time-${time}`} className="text-sm font-medium">
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  placeholder="e.g., Take with food"
                  value={newMedication.instructions}
                  onChange={handleInputChange}
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newMedication.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (if applicable)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newMedication.endDate || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refillDate">Refill Date</Label>
                <Input
                  id="refillDate"
                  name="refillDate"
                  type="date"
                  value={newMedication.refillDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reminders"
                  name="reminders"
                  checked={newMedication.reminders}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, reminders: e.target.checked }))}
                  className="rounded text-health-blue-500 focus:ring-health-blue-500"
                />
                <label htmlFor="reminders" className="text-sm font-medium">
                  Enable reminders for this medication
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setEditingId(null);
                setNewMedication({
                  name: "",
                  dosage: "",
                  frequency: "",
                  instructions: "",
                  timeOfDay: [],
                  startDate: new Date().toISOString().split("T")[0],
                  reminders: true
                });
              }}>
                Cancel
              </Button>
              <Button className="btn-primary" onClick={handleAddMedication}>
                {editingId !== null ? "Update" : "Add"} Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {medications.length === 0 ? (
        <div className="text-center py-8 bg-health-neutral-50 rounded-lg">
          <Pill className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
          <p className="text-health-neutral-500">No medications added yet.</p>
          <p className="text-health-neutral-500 text-sm mt-1">Click "Add Medication" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((medication) => (
            <div 
              key={medication.id} 
              className="bg-white rounded-lg border border-health-neutral-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="bg-health-blue-50 text-health-blue-500 p-2 rounded-full mr-4">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-health-neutral-900">{medication.name}</h4>
                    <p className="text-health-neutral-600">{medication.dosage} • {medication.frequency}</p>
                    {medication.timeOfDay.length > 0 && (
                      <div className="flex items-center text-sm text-health-neutral-500 mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {medication.timeOfDay.join(", ")}
                      </div>
                    )}
                    {medication.instructions && (
                      <p className="text-sm text-health-neutral-500 mt-1">{medication.instructions}</p>
                    )}
                    {medication.refillDate && (
                      <p className="text-sm text-health-blue-500 font-medium mt-2">
                        Refill due: {new Date(medication.refillDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`p-1.5 rounded-full ${
                      medication.reminders 
                        ? "bg-health-green-50 text-health-green-500" 
                        : "bg-health-neutral-100 text-health-neutral-500"
                    }`}
                    title={medication.reminders ? "Disable reminders" : "Enable reminders"}
                    onClick={() => handleToggleReminder(medication.id)}
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-full bg-health-blue-50 text-health-blue-500"
                    title="Edit medication"
                    onClick={() => handleEditMedication(medication)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-full bg-red-50 text-red-500"
                    title="Remove medication"
                    onClick={() => handleDeleteMedication(medication.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex space-x-4">
        <Button asChild variant="outline" className="flex-1">
          <a href="#" download="medication-list.pdf">
            Download Medication List
          </a>
        </Button>
        <Button asChild className="btn-primary flex-1">
          <a href="/medication-refill">
            Request Refill
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MedicationList;
