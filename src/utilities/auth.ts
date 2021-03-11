import {Request} from 'express';
import UnauthorisedException from '../exceptions/UnauthorisedException';
import {Permission, RequestUser} from '../types/auth/user';

export function extractJwt(req: Request): string {
    if (req.headers['authorization']?.startsWith('Bearer ')) {
        return req.headers['authorization']?.replace('Bearer ', '');
    }
    return '';
}

export function hasPermission(user: RequestUser, permission: string, throwOnFail = true): boolean {
    if (user?.owner) return true;
    if (user?.permissions && user?.permissions.length) {
        const [group, action] = permission.split('.');
        if (
            user.permissions.findIndex(
                (permission: Permission) => permission.group === group && permission.action === action,
            ) !== -1
        ) {
            return true;
        }
    }
    if (throwOnFail) throw new UnauthorisedException();
    return false;
}
