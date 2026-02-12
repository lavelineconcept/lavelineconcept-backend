import mongoose from 'mongoose';

import { env } from '../utils/env.js';

export const initMongoDB = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const dbName = env('MONGODB_DB');
    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${dbName}?retryWrites=true&w=majority&appName=MemoryOrbsApp`;

    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
