import {Request} from 'express';

export function extractJwt(req: Request): string {
    if (req.headers['authorization']?.startsWith('Bearer ')) {
        return req.headers['authorization']?.replace('Bearer ', '');
    }
    return '';
}
