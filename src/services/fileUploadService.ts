
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { mongoClient } from '@/lib/mongodb';
import { Readable } from 'stream';

const DB_NAME = 'healthcare_app';
const BUCKET_NAME = 'doctor_verification';

// Helper to get gridfs bucket
const getBucket = (client: MongoClient): GridFSBucket => {
  const db = client.db(DB_NAME);
  return new GridFSBucket(db, {
    bucketName: BUCKET_NAME
  });
};

// Convert File to Buffer
const fileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// Upload degree document
export const uploadDegreeDocument = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique file path for the degree document
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_degree_${Date.now()}.${fileExtension}`;
    
    // Get buffer from file
    const buffer = await fileToBuffer(file);
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // EOF
    
    // Get GridFS bucket
    const bucket = getBucket(mongoClient);
    
    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(fileName, {
      metadata: {
        userId,
        contentType: file.type,
        uploadDate: new Date()
      }
    });
    
    // Create a promise to handle upload
    return new Promise((resolve, reject) => {
      readable.pipe(uploadStream)
        .on('error', (error) => {
          console.error('Error uploading to GridFS:', error);
          reject(error);
        })
        .on('finish', () => {
          const fileId = uploadStream.id.toString();
          resolve(fileId);
        });
    });
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

// Get file URL for a file stored in GridFS
export const getFileUrl = async (fileId: string): Promise<string | null> => {
  try {
    // In a real implementation, you'd create a route to serve the file
    // Here we're returning a mock URL, as we'd need a server endpoint to serve files
    const mockUrl = `/api/files/${fileId}`;
    return mockUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

// Download file from GridFS
export const downloadFile = async (fileId: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket(mongoClient);
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    const chunks: Buffer[] = [];
    
    downloadStream
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('error', (error) => {
        console.error('Error downloading file:', error);
        reject(error);
      })
      .on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
  });
};
