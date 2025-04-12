
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

// Your MongoDB connection string (replace with your actual MongoDB connection string)
const uri = "mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB with Mongoose
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB with Mongoose");
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return false;
  }
};

// Connect using MongoClient
export const connectWithClient = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB with client");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

// Export database
export const mongoClient = client;
export default mongoose;
