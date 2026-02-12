import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

export const checkRoles =
    (...roles) =>
        async (req, res, next) => {
            const { user } = req;

            if (!user) {
                next(createHttpError(401, 'User not found'));
                return;
            }

            const rolesArray = [...roles];

            if (rolesArray.length === 0) {
                next();
                return;
            }

            const userRole = user.role;

            if (!rolesArray.includes(userRole)) {
                next(createHttpError(403, 'Forbidden'));
                return;
            }

            next();
        };
