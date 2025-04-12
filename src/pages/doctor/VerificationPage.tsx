
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Upload, Shield, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { getCurrentUser } from "@/services/authService";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import VerificationStatus from "@/components/doctor/VerificationStatus";
import { User, VerificationStatus as VerificationStatusType } from "@/types/user";

const VerificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [uploadingNewDocument, setUploadingNewDocument] = useState(false);
  const navigate = useNavigate();

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
      
      setCurrentUser(user);
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
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctor Verification</h1>
            <p className="text-health-neutral-600">
              Manage your healthcare provider verification status and documents.
            </p>
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
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1">
                <Link to="/doctor/verification" className={navigationMenuTriggerStyle() + " justify-center w-full font-bold text-health-blue-700"}>
                  Verification
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="space-y-6">
            {/* Verification Status Card */}
            <VerificationStatus status={currentUser?.verificationStatus} />
            
            {/* Document Management Card */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>
                  Manage the documents you've submitted for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser?.verificationStatus === "rejected" && (
                  <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md">
                    <h3 className="text-red-700 font-medium flex items-center gap-2 mb-2">
                      <ShieldAlert size={18} /> Verification Issue
                    </h3>
                    <p className="text-red-600 text-sm mb-4">
                      Your verification was rejected. This may be due to document quality issues or 
                      missing information. Please upload new documentation to complete the verification process.
                    </p>
                    <Button 
                      onClick={() => setUploadingNewDocument(true)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                    >
                      <Upload size={16} className="mr-2" /> Upload New Documentation
                    </Button>
                  </div>
                )}

                {currentUser?.verificationStatus === "pending" && (
                  <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-md">
                    <h3 className="text-amber-700 font-medium flex items-center gap-2 mb-2">
                      <RefreshCw size={18} /> Verification In Progress
                    </h3>
                    <p className="text-amber-600 text-sm">
                      Your documents are being reviewed by our verification team. This process usually takes 1-2 business days.
                      You'll receive an email notification once the review is complete.
                    </p>
                  </div>
                )}

                {/* List of submitted documents (mock for now) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center mr-3">
                        <File className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-health-neutral-800">Medical_Degree.pdf</h4>
                        <p className="text-xs text-health-neutral-500">Uploaded on {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {currentUser?.verificationStatus === "verified" ? "Verified" : "Under Review"}
                    </span>
                  </div>
                  
                  {uploadingNewDocument && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-health-neutral-700 mb-2">
                        Upload New Document
                      </label>
                      <div className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 cursor-pointer bg-health-neutral-50 border-health-neutral-300 hover:bg-health-neutral-100">
                        <Upload className="h-8 w-8 text-health-neutral-400 mb-2" />
                        <p className="mb-2 text-sm text-health-neutral-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-health-neutral-500">PDF, PNG, or JPG (MAX. 10MB)</p>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.png,.jpg,.jpeg"
                          // Handle file upload in a real implementation
                        />
                        <Button className="mt-4 btn-primary">
                          <Upload size={16} className="mr-2" /> Upload Document
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!uploadingNewDocument && currentUser?.verificationStatus !== "verified" && (
                    <Button 
                      onClick={() => setUploadingNewDocument(true)}
                      variant="outline"
                      className="mt-2"
                    >
                      <Upload size={16} className="mr-2" /> Upload Additional Document
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Process</CardTitle>
                <CardDescription>
                  Learn more about our healthcare provider verification process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-health-neutral-800">Document Submission</h4>
                      <p className="text-sm text-health-neutral-600">
                        Upload your medical degree, license, and any other relevant certification documents.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-health-neutral-800">Document Review</h4>
                      <p className="text-sm text-health-neutral-600">
                        Our verification team reviews your submitted documents and credentials.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-health-neutral-800">Background Check</h4>
                      <p className="text-sm text-health-neutral-600">
                        We verify your medical license with the appropriate licensing boards.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-health-neutral-800">Verification Complete</h4>
                      <p className="text-sm text-health-neutral-600">
                        Once verified, you'll gain full access to the platform and patient management features.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerificationPage;
