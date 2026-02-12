import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';
import fs from 'node:fs';
import { TEMP_UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
    fs.mkdirSync(TEMP_UPLOAD_DIR);
  }
  await initMongoDB();
  startServer();
};

bootstrap();
