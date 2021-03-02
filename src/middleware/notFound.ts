import {NextFunction, RequestHandler, Response} from 'express';
import {RequestExtended} from '../types/express/request';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';

const notFoundMiddleware = (req: RequestExtended, res: Response, next: NextFunction): void => {
    throw new ResourceNotFoundException();
};

export default notFoundMiddleware;
