
import { LoginUser, RegisterUser, User, VerificationStatus } from "@/types/user";
import { MockStorage, delay } from "@/lib/mockDB";

// Initialize mock storages for users and doctor profiles
const userStorage = new MockStorage<User>("users");
const doctorStorage = new MockStorage<any>("doctorProfiles");

// Seed initial users if empty
const initializeMockUsers = () => {
  const existingUsers = userStorage.getAll();
  
  if (existingUsers.length === 0) {
    // Add default users
    userStorage.add({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "patient@example.com",
      role: "patient",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    userStorage.add({
      id: "2",
      firstName: "Sarah",
      lastName: "Williams",
      email: "doctor@example.com",
      role: "doctor",
      verificationStatus: "verified",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
};

// Initialize mock users
initializeMockUsers();

// Login service
export const loginUser = async (credentials: LoginUser): Promise<User> => {
  // Simulate API delay
  await delay(1000);
  
  // Get all users from mock database
  const users = userStorage.getAll();
  
  // Find user with matching email (in a real app, you would check password too)
  const user = users.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Store current user in localStorage
  localStorage.setItem("currentUser", JSON.stringify(user));
  
  return user;
};

// Register service
export const registerUser = async (userData: RegisterUser): Promise<User> => {
  // Simulate API delay
  await delay(1500);
  
  // Get all users from mock database
  const users = userStorage.getAll();
  
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
  
  // Add to mock database
  userStorage.add(newUser);
  
  // Store current user in localStorage
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  
  return newUser;
};

// Register doctor with additional details
export const registerDoctor = async (
  userData: RegisterUser,
  doctorData: {
    specialty: string;
    licenseNumber: string;
    degreeFile?: File;
  }
): Promise<User> => {
  // First register the user
  const user = await registerUser(userData);
  
  // Create doctor profile with mock file handling
  const doctorProfile = {
    userId: user.id,
    specialty: doctorData.specialty,
    licenseNumber: doctorData.licenseNumber,
    verificationStatus: "pending" as VerificationStatus,
    degreeFilePath: doctorData.degreeFile ? 
      `mock_file_path_${user.id}_${doctorData.degreeFile.name}` : 
      "no_file_uploaded",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Store doctor profile
  doctorStorage.add(doctorProfile);
  
  return user;
};

// Logout service
export const logoutUser = async (): Promise<void> => {
  // Clear user data from local storage
  localStorage.removeItem("currentUser");
  
  await delay(500);
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem("currentUser");
  return userData ? JSON.parse(userData) : null;
};
