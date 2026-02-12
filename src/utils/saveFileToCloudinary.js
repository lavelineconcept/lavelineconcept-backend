import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import fs from 'node:fs/promises';

cloudinary.config({
    cloud_name: env('CLOUDINARY_CLOUD_NAME'),
    api_key: env('CLOUDINARY_API_KEY'),
    api_secret: env('CLOUDINARY_API_SECRET'),
});

export const saveFileToCloudinary = async (file) => {
    const response = await cloudinary.uploader.upload(file.path, {
        folder: 'lavelineconcept',
    });

    try {
        await fs.unlink(file.path);
    } catch (err) {
        console.error("Temp file deletion failed:", err);
    }

    return response.secure_url;
};
