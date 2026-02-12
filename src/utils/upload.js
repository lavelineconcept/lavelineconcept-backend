import multer from 'multer';
import {
    TEMP_UPLOAD_DIR,
    UPLOAD_LIMITS,
    ALLOWED_MIME_TYPES,
} from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}_${file.originalname}`);
    },
});

const limits = {
    fileSize: UPLOAD_LIMITS.FILE_SIZE,
};

const fileFilter = (req, file, cb) => {
    if (
        ALLOWED_MIME_TYPES.includes(file.mimeType) ||
        ALLOWED_MIME_TYPES.includes(file.mimetype)
    ) {
        cb(null, true);
    } else {
        console.error('Unsupported file type:', file.mimetype || file.mimeType);
        cb(createHttpError(400, 'Unsupported file type'), false);
    }
};

export const upload = multer({
    storage,
    limits,
    fileFilter,
});
