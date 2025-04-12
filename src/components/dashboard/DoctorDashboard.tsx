
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Search, Bell, Video, FileText, Clock, User, AlertTriangle } from "lucide-react";
import { PatientRecord, Alert, Appointment, User as UserType, VerificationStatus as VerificationStatusType } from "@/types/user";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import VerificationStatus from "@/components/doctor/VerificationStatus";

interface DoctorDashboardProps {
  filteredPatients: PatientRecord[];
  alerts: Alert[];
  appointments: Appointment[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleAlertRespond: (alertId: string) => void;
  handleUpdateAppointment: (appointmentId: string, status: Appointment["status"]) => void;
  alertsCount: number;
  emergencyAlerts: number;
  currentUser?: UserType;
}

const DoctorDashboard = ({
  filteredPatients,
  alerts,
  appointments,
  searchQuery,
  setSearchQuery,
  handleAlertRespond,
  handleUpdateAppointment,
  alertsCount,
  emergencyAlerts,
  currentUser
}: DoctorDashboardProps) => {

  const getPatientStatusBadge = (patientRecord: PatientRecord) => {
    if (!patientRecord.vitals) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Unknown
        </Badge>
      );
    }

    const { heartRate, bloodPressure, bloodSugar, oxygenLevel, temperature } = patientRecord.vitals;
    const [systolic, diastolic] = bloodPressure.split('/').map(Number);

    if (
      heartRate > 100 || heartRate < 50 ||
      systolic > 140 || diastolic > 90 ||
      bloodSugar > 180 || bloodSugar < 70 ||
      oxygenLevel < 92 ||
      temperature > 38
    ) {
      return (
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
          Needs Review
        </Badge>
      );
    }

    if (
      (heartRate > 90 && heartRate <= 100) ||
      (heartRate >= 50 && heartRate < 60) ||
      (systolic > 130 && systolic <= 140) ||
      (diastolic > 85 && diastolic <= 90) ||
      (bloodSugar > 140 && bloodSugar <= 180) ||
      (bloodSugar >= 70 && bloodSugar < 80) ||
      (oxygenLevel >= 92 && oxygenLevel < 95) ||
      (temperature > 37.5 && temperature <= 38)
    ) {
      return (
        <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
          Improving
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Stable
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-health-neutral-600">Welcome back, Dr. Williams. You have {alerts.length} emergency alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
          <Button className="btn-primary flex items-center">
            <Video className="mr-2 h-4 w-4" /> Start Consultation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-health-neutral-500">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-health-blue-500 mr-2" />
              <div className="text-2xl font-bold">{filteredPatients.length}</div>
            </div>
            <p className="text-xs text-health-neutral-500 mt-1">+5 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-health-neutral-500">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-health-green-500 mr-2" />
              <div className="text-2xl font-bold">{appointments.length}</div>
            </div>
            <p className="text-xs text-health-neutral-500 mt-1">Next at 10:00 AM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-health-neutral-500">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">{filteredPatients.filter(p => getPatientStatusBadge(p).props.children === "Needs Review").length}</div>
            </div>
            <p className="text-xs text-health-neutral-500 mt-1">+3 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <NavigationMenu className="max-w-none w-full justify-start">
        <NavigationMenuList className="w-full space-x-0">
          <NavigationMenuItem className="flex-1">
            <Link to="/doctor/dashboard" className={navigationMenuTriggerStyle() + " justify-center w-full"}>
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1">
            <Link to="/doctor/patients" className={navigationMenuTriggerStyle() + " justify-center w-full"}>
              Patients
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1">
            <Link to="/doctor/schedule" className={navigationMenuTriggerStyle() + " justify-center w-full"}>
              Schedule
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1">
            <Link to="/doctor/alerts" className={navigationMenuTriggerStyle() + " justify-center w-full"}>
              Alerts
              {alerts.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Doctor verification status card */}
      {currentUser?.role === "doctor" && (
        <div className="mb-4">
          <VerificationStatus status={currentUser?.verificationStatus} />
        </div>
      )}
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A summary of your recent patient interactions and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {alerts.length > 0 && (
                <div className="flex justify-between items-start pb-4 border-b border-health-neutral-100">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mr-4">
                      <Bell className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-health-neutral-900">New Alerts</h4>
                      <p className="text-sm text-health-neutral-600">
                        You have {alerts.length} alerts that need your attention, including {emergencyAlerts} emergency alerts.
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/doctor/alerts">
                      View Alerts
                    </Link>
                  </Button>
                </div>
              )}
              
              {appointments.length > 0 && (
                <div className="flex justify-between items-start pb-4 border-b border-health-neutral-100">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-health-neutral-900">Upcoming Appointments</h4>
                      <p className="text-sm text-health-neutral-600">
                        You have {appointments.length} appointments scheduled today.
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/doctor/schedule">
                      View Schedule
                    </Link>
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-health-neutral-900">Patient Overview</h4>
                    <p className="text-sm text-health-neutral-600">
                      You are currently managing {filteredPatients.length} patients.
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/doctor/patients">
                    View Patients
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
