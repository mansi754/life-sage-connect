
import { supabase } from '@/lib/supabase';

export const uploadDegreeDocument = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique file path for the degree document
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_degree_${Date.now()}.${fileExtension}`;
    const filePath = `doctor_degrees/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('doctor_verification')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading degree:', error);
      throw new Error(error.message);
    }
    
    // Return the file path
    return data?.path || null;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

export const getFileUrl = (filePath: string): string | null => {
  try {
    const { data } = supabase.storage
      .from('doctor_verification')
      .getPublicUrl(filePath);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};
