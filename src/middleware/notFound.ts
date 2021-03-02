import {NextFunction, Response} from 'express';
import {RequestWithUser} from '../types/express/request';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';

function notFoundMiddleware(req: RequestWithUser, res: Response, next: NextFunction): void {
    throw new ResourceNotFoundException();
}

export default notFoundMiddleware;
