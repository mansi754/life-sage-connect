
import { UserRole } from "@/types/user";

/**
 * Safely converts a string to UserRole type
 * @param role The string role to convert
 * @returns A valid UserRole
 */
export const parseUserRole = (role: string): UserRole => {
  if (role === "doctor" || role === "patient") {
    return role;
  }
  return "patient"; // Default to patient for safety
};
