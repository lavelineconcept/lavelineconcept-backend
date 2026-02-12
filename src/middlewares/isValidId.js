import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
    // Collect all parameters that are 'id' or end with 'Id'
    const idParams = Object.keys(req.params).filter(
        (key) => key === 'id' || key.endsWith('Id'),
    );

    for (const paramName of idParams) {
        const idToCheck = req.params[paramName];
        if (idToCheck && !isValidObjectId(idToCheck)) {
            throw createHttpError(400, `Invalid ID format for ${paramName}`);
        }
    }

    next();
};
