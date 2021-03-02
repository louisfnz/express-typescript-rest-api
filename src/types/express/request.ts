import {Request} from 'express';
import RequestUser from '../auth/user';

export interface RequestWithUser extends Request {
    user?: RequestUser;
}
