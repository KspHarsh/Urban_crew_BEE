import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in environment variables');
    }

    const maxRetries = Number(process.env.DB_CONNECT_RETRIES || 3);
    const retryDelayMs = Number(process.env.DB_RETRY_DELAY_MS || 2000);

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
        try {
            const conn = await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000
            });

            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            console.log(`📦 Database: ${conn.connection.name}`);
            return conn;
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            console.error(`❌ MongoDB Connection Error (attempt ${attempt}/${maxRetries}): ${error.message}`);

            if (isLastAttempt) {
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
    }

    // If Atlas fails, try local fallback
    if (mongoUri.includes('mongodb+srv')) {
        console.log('🔄 Attempting local MongoDB fallback...');
        try {
            const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/urbancrew', {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000
            });
            console.log(`✅ Local MongoDB Connected: ${fallbackConn.connection.host}`);
            return fallbackConn;
        } catch (fallbackError) {
            console.error(`❌ Local MongoDB also failed: ${fallbackError.message}`);
        }
    }

    throw new Error('Unable to connect to MongoDB after retries and fallback attempt');
};

export default connectDB;
