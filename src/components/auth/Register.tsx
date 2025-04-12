
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, UserPlus, FileText, Upload, AlertCircle, X } from "lucide-react";
import { RegisterUser, UserRole } from "@/types/user";
import { registerUser } from "@/services/authService";

const Register = () => {
  const [formData, setFormData] = useState<RegisterUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    specialty: "",
    licenseNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDegreeFile(file);
      // Also add to form data
      setFormData(prev => ({ ...prev, degreeFile: file }));
    }
  };

  const clearSelectedFile = () => {
    setDegreeFile(null);
    setFormData(prev => {
      const newData = { ...prev };
      delete newData.degreeFile;
      return newData;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check if doctor role selected but no degree uploaded
    if (formData.role === "doctor" && !degreeFile) {
      toast({
        title: "Missing Document",
        description: "Please upload your medical degree for verification.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const user = await registerUser(formData);
      
      let successMessage = "Your account has been created. Welcome to LifeSage Health!";
      
      // Add verification message for doctors
      if (user.role === "doctor") {
        successMessage = "Your account has been created. Your medical credentials will be verified by our team before you can fully access the platform.";
      }
      
      toast({
        title: "Registration Successful",
        description: successMessage,
        variant: "default",
      });

      // Redirect based on user role
      if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-sm border border-health-neutral-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-health-neutral-900">Create an Account</h2>
        <p className="text-health-neutral-600 mt-2">Join LifeSage Health and get access to quality healthcare</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-health-neutral-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-health-neutral-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>I am a</Label>
          <RadioGroup 
            defaultValue="patient" 
            value={formData.role}
            onValueChange={handleRoleChange as (value: string) => void}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="patient" id="patient" />
              <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="doctor" id="doctor" />
              <Label htmlFor="doctor" className="cursor-pointer">Healthcare Provider</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Doctor specific fields - only show when doctor role is selected */}
        {formData.role === "doctor" && (
          <div className="space-y-4 p-4 bg-health-blue-50 rounded-md border border-health-blue-100">
            <div className="flex items-center gap-2 text-health-blue-700">
              <FileText size={18} />
              <h3 className="font-medium">Healthcare Provider Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <Input
                id="specialty"
                name="specialty"
                placeholder="e.g., Cardiology, General Practice"
                value={formData.specialty || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Medical License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                placeholder="License ID"
                value={formData.licenseNumber || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degreeFile">Upload Medical Degree (Required)</Label>
              <div className="mt-1">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-health-neutral-50 border-health-neutral-300 hover:bg-health-neutral-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {degreeFile ? (
                        <div className="flex flex-col items-center">
                          <FileText className="w-8 h-8 mb-2 text-health-blue-500" />
                          <p className="text-sm text-health-neutral-700 truncate max-w-[200px]">{degreeFile.name}</p>
                          <p className="text-xs text-health-neutral-500">
                            {(degreeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={clearSelectedFile}
                            className="mt-2 flex items-center text-xs text-health-red-600 hover:underline"
                          >
                            <X size={12} className="mr-1" /> Remove file
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-health-neutral-400" />
                          <p className="mb-2 text-sm text-health-neutral-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-health-neutral-500">PDF, PNG, or JPG (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                      id="degreeFile" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <Alert className="bg-health-blue-50 text-health-blue-800 border-health-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your documents will be reviewed by our team for verification. This process usually takes 1-2 business days.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Button type="submit" className="w-full btn-primary" disabled={loading}>
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" /> Create Account
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-health-neutral-600">
          Already have an account?{" "}
          <Link to="/login" className="text-health-blue-500 hover:text-health-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
