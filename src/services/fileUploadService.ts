
import { MockStorage, delay } from "@/lib/mockDB";

// Mock file storage interface
interface StoredFile {
  id: string;
  userId: string;
  filename: string;
  contentType: string;
  fileData: string; // base64 encoded data
  uploadDate: string;
}

// Initialize mock file storage
const fileStorage = new MockStorage<StoredFile>("files");

// Convert File to Base64
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Upload degree document
export const uploadDegreeDocument = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Simulate network delay
    await delay(1000);
    
    // Create a unique file ID
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Store file metadata and data
    const storedFile: StoredFile = {
      id: fileId,
      userId,
      filename: file.name,
      contentType: file.type,
      fileData: base64Data,
      uploadDate: new Date().toISOString()
    };
    
    // Add to mock storage
    fileStorage.add(storedFile);
    
    console.log(`Mock file upload successful: ${file.name}`);
    return fileId;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

// Get file URL for a file stored in mock storage
export const getFileUrl = async (fileId: string): Promise<string | null> => {
  try {
    // Simulate network delay
    await delay(500);
    
    // Get file from mock storage
    const file = fileStorage.getById(fileId);
    
    if (!file) {
      throw new Error('File not found');
    }
    
    // In a real app, this would be a URL to the file on your server
    // Here we just return the base64 data directly
    return file.fileData;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

// Download file from mock storage
export const downloadFile = async (fileId: string): Promise<string | null> => {
  try {
    // Simulate network delay
    await delay(800);
    
    // Get file from mock storage
    const file = fileStorage.getById(fileId);
    
    if (!file) {
      throw new Error('File not found');
    }
    
    return file.fileData;
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};
