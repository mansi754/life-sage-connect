
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import { getCurrentUser } from "@/services/authService";

const PatientDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

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
        <PatientDashboard />
      </div>
    </Layout>
  );
};

export default PatientDashboardPage;
