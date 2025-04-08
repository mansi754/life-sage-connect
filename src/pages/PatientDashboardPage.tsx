
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import { getCurrentUser } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { getPatientAlertStats } from "@/services/alertService";

const PatientDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [alertStats, setAlertStats] = useState<{
    total: number;
    emergency: number;
    medication: number;
    vitals: number;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      if (user.role !== "patient") {
        navigate("/doctor/dashboard");
        return;
      }
      
      setPatientId(user.id);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchAlertStats = async () => {
      if (patientId) {
        try {
          const stats = await getPatientAlertStats(patientId);
          setAlertStats(stats);
          
          if (stats.medication > 0) {
            toast({
              title: "Medication Reminder",
              description: `You have ${stats.medication} medication alerts.`,
              variant: "default",
            });
          }
        } catch (error) {
          console.error("Error fetching alert stats:", error);
        }
      }
    };
    
    if (!loading && patientId) {
      fetchAlertStats();
    }
  }, [loading, patientId, toast]);

  if (loading) {
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
        <PatientDashboard alertStats={alertStats} />
      </div>
    </Layout>
  );
};

export default PatientDashboardPage;
