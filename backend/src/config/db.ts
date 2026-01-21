import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
    // add connection to db
    try {
        let mongoUri = process.env.MONGO_URI;
        console.log(`Connecting to MongoDB with URI: ${mongoUri ? mongoUri.split('@')[1] : 'undefined'}`); // Log host only for security

        if (!mongoUri || mongoUri.includes('localhost')) {
            console.log('Attempting to connect to local MongoDB...');
            try {
                if (mongoUri) {
                    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
                    console.log(`MongoDB Connected: ${conn.connection.host}`);
                    return;
                }
            } catch (err) {
                console.log('Local MongoDB not running. Starting in-memory instance...');
            }

            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log(`In-memory MongoDB started at ${mongoUri}`);
        }

        if (mongoUri) {
            const conn = await mongoose.connect(mongoUri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
