import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const URI = process.env.DATABASE_URI
const database = async()=>{
    try {
        await mongoose.connect(URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error in connecting to database ',error);
    }
}

export default database;