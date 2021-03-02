import {Request} from 'express';
import {RequestUser} from '../auth/user';

export interface RequestExtended extends Request {
    user?: RequestUser;
    hasPermission?: (permission: string, throwOnFail: boolean) => boolean;
}
