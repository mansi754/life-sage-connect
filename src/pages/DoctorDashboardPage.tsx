
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import { getCurrentUser } from "@/services/authService";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { useToast } from "@/hooks/use-toast";
import { getAllAlertsCount, getAlertsByType } from "@/services/alertService";

const DoctorDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [alertsCount, setAlertsCount] = useState<number | null>(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState<number | null>(null);
  const navigate = useNavigate();
  const dashboardData = useDoctorDashboard();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      if (user.role !== "doctor") {
        navigate("/patient/dashboard");
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const count = await getAllAlertsCount();
        setAlertsCount(count);
        
        const emergencyList = await getAlertsByType("emergency");
        setEmergencyAlerts(emergencyList.length);
        
        if (emergencyList.length > 0) {
          toast({
            title: "Emergency Alerts",
            description: `You have ${emergencyList.length} unresolved emergency alerts.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    
    if (!loading) {
      fetchAlertData();
    }
  }, [loading, toast]);

  if (loading || dashboardData.loading) {
    return (
      <Layout>
        <div className="health-container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-health-blue-500 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="health-container py-8">
        <DoctorDashboard 
          filteredPatients={dashboardData.filteredPatients}
          alerts={dashboardData.alerts}
          appointments={dashboardData.appointments}
          searchQuery={dashboardData.searchQuery}
          setSearchQuery={dashboardData.setSearchQuery}
          handleAlertRespond={dashboardData.handleAlertRespond}
          handleUpdateAppointment={dashboardData.handleUpdateAppointment}
          alertsCount={alertsCount || 0}
          emergencyAlerts={emergencyAlerts || 0}
        />
      </div>
    </Layout>
  );
};

export default DoctorDashboardPage;
