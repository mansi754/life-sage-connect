
import { delay } from "@/utils/helpers";

interface SymptomCheckParams {
  description: string;
  bodyParts: string[];
  duration: string;
}

type Severity = "low" | "medium" | "high";

interface SymptomCheckResult {
  severity: Severity;
  message: string;
  recommendations: string[];
  seekMedicalAttention: boolean;
}

// Simple rule-based symptom checker (simulation)
export const checkSymptoms = async (params: SymptomCheckParams): Promise<SymptomCheckResult> => {
  // Simulate API call delay
  await delay(2000);
  
  const { description, bodyParts, duration } = params;
  const descLower = description.toLowerCase();
  
  // Check for emergency keywords
  const emergencyKeywords = [
    "chest pain", "severe pain", "can't breathe", "difficulty breathing", 
    "heart attack", "stroke", "unconscious", "suicide", "kill myself",
    "bleeding heavily", "seizure", "poisoning", "overdose"
  ];
  
  // Check for moderate concern keywords
  const moderateKeywords = [
    "fever", "persistent", "worsening", "dizziness", "fatigue", 
    "pain", "vomiting", "headache", "migraine", "infection"
  ];
  
  // Simple severity assessment
  let severity: Severity = "low";
  let seekMedicalAttention = false;
  
  // Check for emergency indicators
  if (emergencyKeywords.some(keyword => descLower.includes(keyword))) {
    severity = "high";
    seekMedicalAttention = true;
  } 
  // Check for moderate indicators
  else if (
    moderateKeywords.some(keyword => descLower.includes(keyword)) || 
    duration === "longer" || 
    bodyParts.includes("Chest") || 
    bodyParts.includes("Head")
  ) {
    severity = "medium";
    seekMedicalAttention = true;
  }
  
  // Generate appropriate message and recommendations
  let message = "";
  let recommendations: string[] = [];
  
  switch (severity) {
    case "high":
      message = "Your symptoms suggest that you may need immediate medical attention.";
      recommendations = [
        "Please contact emergency services or visit the nearest emergency room.",
        "Do not delay seeking professional medical help.",
        "If available, have someone stay with you until help arrives."
      ];
      break;
    
    case "medium":
      message = "Your symptoms suggest that you should consult with a healthcare provider.";
      recommendations = [
        "Schedule a consultation with your healthcare provider within 24-48 hours.",
        "Monitor your symptoms closely and seek immediate help if they worsen.",
        "Rest and stay hydrated while waiting for your appointment."
      ];
      break;
    
    case "low":
      message = "Based on your description, your symptoms appear to be mild.";
      recommendations = [
        "Rest and monitor your symptoms over the next few days.",
        "Stay hydrated and get adequate sleep.",
        "Over-the-counter medications may help alleviate symptoms, but follow package instructions."
      ];
      break;
  }
  
  // Add specific recommendations based on symptoms
  if (descLower.includes("headache") || bodyParts.includes("Head")) {
    recommendations.push("For headaches, consider resting in a dark, quiet room and applying a cold compress.");
  }
  
  if (descLower.includes("fever")) {
    recommendations.push("For fever, stay hydrated and consider appropriate fever-reducing medication if needed.");
  }
  
  if (bodyParts.includes("Joints") || descLower.includes("pain")) {
    recommendations.push("For joint or muscle pain, consider rest, gentle stretching, and cold/heat therapy as appropriate.");
  }
  
  return {
    severity,
    message,
    recommendations,
    seekMedicalAttention
  };
};
