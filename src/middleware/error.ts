import {NextFunction, Response} from 'express';
import HttpException from '../exceptions/HttpException';
import {RequestWithUser} from '../types/express/request';

function errorMiddleware(error: HttpException, req: RequestWithUser, res: Response, next: NextFunction): Response {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const errors = error?.errors;

    return res.status(status).json({
        message: message,
        status,
        errors,
    });
}

export default errorMiddleware;
