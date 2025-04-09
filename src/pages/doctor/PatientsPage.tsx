
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, FilePlus, MessageCircle, Search, UserRound, Users } from "lucide-react";
import AIDocAssistant from "@/components/doctor/AIDocAssistant";

const patients = [
  {
    id: "P-001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    condition: "Hypertension, Diabetes",
    lastVisit: "Apr 2, 2025",
    status: "Stable"
  },
  {
    id: "P-002",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    condition: "Asthma",
    lastVisit: "Mar 27, 2025",
    status: "Improving"
  },
  {
    id: "P-003",
    name: "Robert Johnson",
    age: 58,
    gender: "Male",
    condition: "Coronary Artery Disease",
    lastVisit: "Apr 5, 2025",
    status: "Needs Attention"
  },
  {
    id: "P-004",
    name: "Sarah Williams",
    age: 29,
    gender: "Female",
    condition: "Migraine",
    lastVisit: "Mar 15, 2025",
    status: "Stable"
  },
  {
    id: "P-005",
    name: "Michael Brown",
    age: 41,
    gender: "Male",
    condition: "Lower Back Pain",
    lastVisit: "Apr 1, 2025",
    status: "Improving"
  },
];

const PatientsPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPatientId, setCurrentPatientId] = useState("");
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) || 
    patient.condition.toLowerCase().includes(search.toLowerCase())
  );
  
  const statusFiltered = activeTab === "all" 
    ? filteredPatients 
    : activeTab === "needs-attention"
      ? filteredPatients.filter(p => p.status === "Needs Attention")
      : filteredPatients.filter(p => p.status !== "Needs Attention");

  const handlePatientSelect = (patientId: string) => {
    setCurrentPatientId(patientId);
  };
  
  return (
    <Layout>
      <div className="health-container py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-health-neutral-600">View and manage your patient records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Patients
                    </CardTitle>
                    <CardDescription>
                      Manage your patient list and medical records
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-health-neutral-500" />
                      <Input
                        type="search"
                        placeholder="Search patients..."
                        className="pl-8 w-[200px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Button>
                      <FilePlus className="mr-2 h-4 w-4" />
                      New Patient
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Patients</TabsTrigger>
                    <TabsTrigger value="needs-attention">
                      <AlertCircle className="mr-1 h-4 w-4 text-destructive" />
                      Needs Attention
                    </TabsTrigger>
                    <TabsTrigger value="stable">
                      <Check className="mr-1 h-4 w-4 text-green-500" />
                      Stable
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="m-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statusFiltered.map((patient) => (
                          <TableRow 
                            key={patient.id} 
                            className={patient.status === "Needs Attention" ? "bg-red-50" : ""}
                            onClick={() => handlePatientSelect(patient.id)}
                          >
                            <TableCell>{patient.id}</TableCell>
                            <TableCell>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-health-neutral-500">{patient.gender}</div>
                            </TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.condition}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                patient.status === "Stable" 
                                  ? "bg-green-100 text-green-800" 
                                  : patient.status === "Improving" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {patient.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <UserRound className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="needs-attention" className="m-0">
                    {/* Same table with filtered data */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statusFiltered.map((patient) => (
                          <TableRow 
                            key={patient.id} 
                            className={patient.status === "Needs Attention" ? "bg-red-50" : ""}
                            onClick={() => handlePatientSelect(patient.id)}
                          >
                            <TableCell>{patient.id}</TableCell>
                            <TableCell>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-health-neutral-500">{patient.gender}</div>
                            </TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.condition}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                patient.status === "Stable" 
                                  ? "bg-green-100 text-green-800" 
                                  : patient.status === "Improving" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {patient.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <UserRound className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="stable" className="m-0">
                    {/* Same table with filtered data */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statusFiltered.map((patient) => (
                          <TableRow 
                            key={patient.id} 
                            className={patient.status === "Needs Attention" ? "bg-red-50" : ""}
                            onClick={() => handlePatientSelect(patient.id)}
                          >
                            <TableCell>{patient.id}</TableCell>
                            <TableCell>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-health-neutral-500">{patient.gender}</div>
                            </TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.condition}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                patient.status === "Stable" 
                                  ? "bg-green-100 text-green-800" 
                                  : patient.status === "Improving" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {patient.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <UserRound className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="text-sm text-health-neutral-500">
                  Showing {statusFiltered.length} of {patients.length} patients
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <AIDocAssistant />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientsPage;
