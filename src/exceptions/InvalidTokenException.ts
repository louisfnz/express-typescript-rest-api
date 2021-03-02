import HttpException from './HttpException';

class InvalidTokenException extends HttpException {
    constructor() {
        super(422, 'Invalid refresh token');
    }
}

export default InvalidTokenException;
