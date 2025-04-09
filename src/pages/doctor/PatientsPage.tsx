
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const patients = [
  {
    id: "1",
    name: "John Smith",
    age: 45,
    lastVisit: "Apr 2, 2025",
    condition: "Hypertension",
    risk: "medium",
    nextAppointment: "Apr 15, 2025",
  },
  {
    id: "2",
    name: "Emily Johnson",
    age: 32,
    lastVisit: "Mar 28, 2025",
    condition: "Diabetes",
    risk: "high",
    nextAppointment: "Apr 10, 2025",
  },
  {
    id: "3",
    name: "Michael Brown",
    age: 58,
    lastVisit: "Mar 15, 2025",
    condition: "Arthritis",
    risk: "low",
    nextAppointment: "May 5, 2025",
  },
  {
    id: "4",
    name: "Sarah Williams",
    age: 29,
    lastVisit: "Apr 1, 2025",
    condition: "Asthma",
    risk: "medium",
    nextAppointment: "Apr 22, 2025",
  },
  {
    id: "5",
    name: "Robert Garcia",
    age: 67,
    lastVisit: "Mar 20, 2025",
    condition: "COPD",
    risk: "high",
    nextAppointment: "Apr 12, 2025",
  },
];

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patientsList, setPatientsList] = useState(patients);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    condition: "",
    notes: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredPatients = patientsList.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.age) {
      const id = (Math.max(...patientsList.map(p => parseInt(p.id))) + 1).toString();
      
      const patientToAdd = {
        id,
        name: newPatient.name,
        age: parseInt(newPatient.age),
        lastVisit: "N/A",
        condition: newPatient.condition || "Not specified",
        risk: "low",
        nextAppointment: "N/A",
      };
      
      if (editMode && editingPatientId) {
        setPatientsList(patientsList.map(p => 
          p.id === editingPatientId ? { ...p, name: newPatient.name, age: parseInt(newPatient.age), condition: newPatient.condition || p.condition } : p
        ));
        
        toast({
          title: "Patient Updated",
          description: `Patient details for ${newPatient.name} have been updated.`,
          variant: "default",
        });
      } else {
        setPatientsList([...patientsList, patientToAdd]);
        
        toast({
          title: "Patient Added",
          description: `${newPatient.name} has been added to your patients list.`,
          variant: "default",
        });
      }
      
      setNewPatient({
        name: "",
        age: "",
        condition: "",
        notes: ""
      });
      setEditMode(false);
      setEditingPatientId(null);
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Required Fields",
        description: "Please fill in the patient's name and age.",
        variant: "destructive",
      });
    }
  };

  const handleEditPatient = (patient: typeof patients[0]) => {
    setNewPatient({
      name: patient.name,
      age: patient.age.toString(),
      condition: patient.condition,
      notes: ""
    });
    setEditMode(true);
    setEditingPatientId(patient.id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setNewPatient({
      name: "",
      age: "",
      condition: "",
      notes: ""
    });
    setEditMode(false);
    setEditingPatientId(null);
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
            <p className="text-health-neutral-600">Manage and monitor your patients' health records.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editMode ? "Edit Patient" : "Add New Patient"}</DialogTitle>
                <DialogDescription>
                  {editMode ? "Update the patient's information below." : "Enter the patient's details to add them to your list."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={newPatient.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Primary Condition</Label>
                  <Input
                    id="condition"
                    name="condition"
                    value={newPatient.condition}
                    onChange={handleInputChange}
                    placeholder="e.g., Hypertension"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newPatient.notes}
                    onChange={handleInputChange}
                    placeholder="Additional information about the patient..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient}>
                  {editMode ? "Update Patient" : "Add Patient"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              View and manage all your patients in one place.
            </CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-neutral-400" />
              <Input
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Next Appt.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>
                          <Badge className={
                            patient.risk === "high" ? "bg-red-100 text-red-800 border-red-200" :
                            patient.risk === "medium" ? "bg-amber-100 text-amber-800 border-amber-200" :
                            "bg-green-100 text-green-800 border-green-200"
                          }>
                            {patient.risk === "high" ? "High" : 
                            patient.risk === "medium" ? "Medium" : "Low"}
                          </Badge>
                        </TableCell>
                        <TableCell>{patient.nextAppointment}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPatient(patient)}
                            className="h-8 px-2 text-health-blue-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2 text-health-green-500"
                          >
                            <Link to={`/patient/${patient.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-health-neutral-500">
                        No patients found matching "{searchTerm}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 text-center text-sm text-health-neutral-500">
              Showing {filteredPatients.length} of {patientsList.length} patients
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientsPage;
