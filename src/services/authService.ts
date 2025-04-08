
import { LoginUser, RegisterUser, User } from "@/types/user";

// Simulated users data
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Login service
export const loginUser = async (credentials: LoginUser): Promise<User> => {
  // Simulate server request
  await delay(1000);
  
  // Simplified auth for demo purposes - in a real app, this would be a server request
  const user = users.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Save user data to session/local storage
  localStorage.setItem("user", JSON.stringify(user));
  
  return user;
};

// Register service
export const registerUser = async (userData: RegisterUser): Promise<User> => {
  // Simulate server request
  await delay(1500);
  
  // Check if user already exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error("User with this email already exists");
  }
  
  // Create new user (in a real app, this would be a server request)
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 11),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to users array (simulating database save)
  users.push(newUser);
  
  // Save user data to session/local storage
  localStorage.setItem("user", JSON.stringify(newUser));
  
  return newUser;
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
