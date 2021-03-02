import {ValidationError} from '../types/errors/validation';

class HttpException extends Error {
    public status: number;
    public message: string;
    public errors?: ValidationError[];

    constructor(status: number, message: string, errors?: ValidationError[]) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}

export default HttpException;
