
import OpenAI from 'openai';

// API key is now hardcoded for demo purposes
// In a production environment, this would use environment variables or backend services
let openaiApiKey = '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';

// Initialize the OpenAI client
let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey?: string) => {
  // Use the provided key or the default one
  if (apiKey) {
    openaiApiKey = apiKey;
  }
  openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true // Only for demo purposes
  });
  return openai;
};

export const getOpenAIClient = () => {
  if (!openai) {
    openai = initializeOpenAI();
  }
  return openai;
};

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  const client = getOpenAIClient();
  
  if (!client) {
    return "Please enter your OpenAI API key in settings to use this feature.";
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a medical assistant AI. You analyze symptoms and provide possible conditions. Always remind the user that this is not a substitute for professional medical advice and they should consult a healthcare provider for proper diagnosis."
        },
        {
          role: "user",
          content: `Analyze these symptoms and provide potential conditions: ${symptoms}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || "Unable to analyze symptoms. Please try again.";
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    return "Error analyzing symptoms. Please try again later.";
  }
};

export const getPatientAssistance = async (query: string): Promise<string> => {
  const client = getOpenAIClient();
  
  if (!client) {
    return "Please enter your OpenAI API key in settings to use this feature.";
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful healthcare assistant for patients. You can provide general health information, medication reminders, and emotional support. Always remind users that you are not a substitute for professional medical advice."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || "I couldn't process your request. Please try again.";
  } catch (error) {
    console.error("Error getting patient assistance:", error);
    return "I'm having trouble responding right now. Please try again later.";
  }
};

export const getDoctorAssistance = async (patientData: string, query: string): Promise<string> => {
  const client = getOpenAIClient();
  
  if (!client) {
    return "Please enter your OpenAI API key in settings to use this feature.";
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a medical assistant AI for doctors. You analyze patient history and provide potential insights and suggested actions. Always maintain a professional tone and acknowledge the doctor's expertise and final judgment."
        },
        {
          role: "user",
          content: `Patient Data: ${patientData}\n\nDoctor's Query: ${query}`
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    return response.choices[0]?.message?.content || "Unable to process the request. Please try again.";
  } catch (error) {
    console.error("Error getting doctor assistance:", error);
    return "Error processing the request. Please try again later.";
  }
};
