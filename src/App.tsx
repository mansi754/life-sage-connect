
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import VideoConsultationPage from "./pages/VideoConsultationPage";
import MentalHealthChatPage from "./pages/MentalHealthChatPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import DemoComponentsPage from "./pages/DemoComponentsPage";

// Patient Tab Pages
import SymptomCheckerPage from "./pages/patient/SymptomCheckerPage";
import MedicationsPage from "./pages/patient/MedicationsPage";
import HealthRecordsPage from "./pages/patient/HealthRecordsPage";
import InsurancePage from "./pages/patient/InsurancePage";

// Doctor Tab Pages
import PatientsPage from "./pages/doctor/PatientsPage";
import SchedulePage from "./pages/doctor/SchedulePage";
import AlertsPage from "./pages/doctor/AlertsPage";
import VerificationPage from "./pages/doctor/VerificationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
          <Route path="/patients/:id" element={<PatientDetailsPage />} />
          <Route path="/consultation/:id" element={<VideoConsultationPage />} />
          <Route path="/mental-health-chat" element={<MentalHealthChatPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Patient Tab Pages */}
          <Route path="/patient/symptoms" element={<SymptomCheckerPage />} />
          <Route path="/patient/medications" element={<MedicationsPage />} />
          <Route path="/patient/records" element={<HealthRecordsPage />} />
          <Route path="/patient/insurance" element={<InsurancePage />} />
          
          {/* Doctor Tab Pages */}
          <Route path="/doctor/patients" element={<PatientsPage />} />
          <Route path="/doctor/schedule" element={<SchedulePage />} />
          <Route path="/doctor/alerts" element={<AlertsPage />} />
          <Route path="/doctor/verification" element={<VerificationPage />} />
          
          {/* Demo Components Page */}
          <Route path="/demo" element={<DemoComponentsPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
