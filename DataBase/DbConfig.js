import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () =>{
    const mongoURL = process.env.MONGODB_CONNECTION_STRING;
    console.log("Connecting MongoDb...");
    try {
        const connection = await mongoose.connect(mongoURL)
        console.log("MongoDB is connected !");
    } catch (error) {
        console.error("Failed to Connect MongoDB...",error);
    }
}

export default connectDB;