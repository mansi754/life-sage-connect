
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

/**
 * Type guard to check if a value is a valid UserRole
 * @param role The role to check
 * @returns Boolean indicating if it's a valid UserRole
 */
export const isValidUserRole = (role: string): role is UserRole => {
  return role === "doctor" || role === "patient";
};

/**
 * Type guard to check if an alert type is valid
 * @param type The alert type to check
 * @returns Boolean indicating if it's a valid alert type
 */
export const isValidAlertType = (type: string): type is "emergency" | "vitals" | "medication" => {
  return type === "emergency" || type === "vitals" || type === "medication";
};
