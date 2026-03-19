import mongoose from 'mongoose';
import { env } from './src/utils/env.js';
import { sendOrderSuccessEmails } from './src/services/mailService.js';
import { OrdersCollection } from './src/db/models/order.js';

async function testOrderEmail() {
    try {
        console.log("Connecting to MongoDB...");
        const user = env('MONGODB_USER');
        const pass = env('MONGODB_PASSWORD');
        const cluster = env('MONGODB_URL');
        const dbName = env('MONGODB_DB');
        const uri = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=lavelineconcept`;
        
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");

        const latestOrder = await OrdersCollection.findOne().sort({ createdAt: -1 });
        if (!latestOrder) {
            console.log("No orders found in the database. Cannot test.");
            process.exit(0);
        }

        console.log(`Testing email for latest order: ${latestOrder._id}`);
        await sendOrderSuccessEmails(latestOrder._id);
        console.log("Test finished.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testOrderEmail();
