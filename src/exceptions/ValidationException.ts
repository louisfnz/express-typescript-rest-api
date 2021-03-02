import HttpException from './HttpException';
import {ValidationError} from '../types/errors/validation';

class ValidationException extends HttpException {
    constructor(errors: ValidationError[]) {
        super(422, 'Validation error', errors);
    }
}

export default ValidationException;
