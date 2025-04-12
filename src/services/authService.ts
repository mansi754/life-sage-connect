
import { LoginUser, RegisterUser, User, VerificationStatus } from "@/types/user";
import { supabase } from "@/lib/supabase";
import { uploadDegreeDocument } from "@/services/fileUploadService";

// Simulated users data for fallback if Supabase is not configured
const users: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "patient@example.com",
    role: "patient",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    email: "doctor@example.com",
    role: "doctor",
    verificationStatus: "verified",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Login service
export const loginUser = async (credentials: LoginUser): Promise<User> => {
  try {
    // Try to use Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      // Get user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // If doctor, check verification status
      let verificationStatus: VerificationStatus | undefined;
      if (profileData.role === 'doctor') {
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('verification_status')
          .eq('id', authData.user.id)
          .single();
        
        if (!doctorError && doctorData) {
          verificationStatus = doctorData.verification_status;
        }
      }
      
      const user: User = {
        id: authData.user.id,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: authData.user.email!,
        role: profileData.role,
        verificationStatus,
        createdAt: profileData.created_at,
        updatedAt: profileData.updated_at
      };
      
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      return user;
    }
    
    throw new Error("Authentication failed");
  } catch (error) {
    console.error("Login error:", error);
    
    // Fallback to mock data for development
    await delay(1000);
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
};

// Register service
export const registerUser = async (userData: RegisterUser): Promise<User> => {
  try {
    // Try to use Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        }
      }
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      let verificationStatus: VerificationStatus | undefined;
      
      // If doctor, handle degree upload and set verification status
      if (userData.role === 'doctor' && userData.degreeFile) {
        // Upload degree document
        const filePath = await uploadDegreeDocument(userData.degreeFile, authData.user.id);
        
        if (filePath) {
          // Insert doctor-specific data
          const { error: doctorError } = await supabase
            .from('doctors')
            .upsert({
              id: authData.user.id,
              specialty: userData.specialty || 'General',
              license_number: userData.licenseNumber,
              degree_file_path: filePath,
              verification_status: 'pending'
            });
          
          if (doctorError) throw doctorError;
          
          verificationStatus = 'pending';
        }
      }
      
      const user: User = {
        id: authData.user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        verificationStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      return user;
    }
    
    throw new Error("Registration failed");
  } catch (error) {
    console.error("Registration error:", error);
    
    // Fallback to mock data for development
    await delay(1500);
    
    // Check if user already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error("User with this email already exists");
    }
    
    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      verificationStatus: userData.role === 'doctor' ? 'pending' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    return newUser;
  }
};

// Logout service
export const logoutUser = async (): Promise<void> => {
  // Clear user data from session/local storage
  localStorage.removeItem("user");
  
  await delay(500);
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};
