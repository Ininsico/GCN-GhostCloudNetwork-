import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log(`MongoDB connected : ${conn.connection.host}`);
        mongoose.connection.on('error', err => {
            console.error("MongoDB connection failed", err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB Disconnected");
        });
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through App termination');
            process.exit(0);
        });
        return conn;
    } catch (error) {
        console.error(`Database Connection failed, ${error.message}`);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected succesfully');
    } catch (error) {
        console.log(`Error disconnecting, ${error.message}`);
    }
}
