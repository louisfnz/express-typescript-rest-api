import {NextFunction, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import TokenPayload from '../types/auth/token';
import InvalidJwtException from '../exceptions/InvalidJwtException';
import {RequestExtended} from '../types/express/request';
import UserLogin from '../models/UserLogin';

const authMiddleware = async (req: RequestExtended, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const payload = jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;

            // JWT is valid, get the user
            const user = await User.query()
                .findOne({
                    id: payload.id,
                })
                .withGraphFetched('role')
                .modifyGraph('role', (builder) => {
                    builder.select(['name', 'slug']);
                })
                .withGraphFetched('permissions')
                .modifyGraph('permissions', (builder) => {
                    builder.select(['title', 'group', 'action']);
                });

            if (user) {
                // Check a valid login exists for the user
                const validLogin = await UserLogin.query().findOne({
                    user_id: user.id,
                    token,
                    valid: true,
                });

                // Login is valid, update request user and move on
                if (validLogin) {
                    req.user = user;
                    return next();
                }
            }
        }
        return next(new InvalidJwtException());
    } catch (e) {
        return next(new InvalidJwtException());
    }
};

export default authMiddleware;
