import HttpException from './HttpException';

class InvalidCredentialsException extends HttpException {
    constructor() {
        super(401, 'Invalid credentials');
    }
}

export default InvalidCredentialsException;
