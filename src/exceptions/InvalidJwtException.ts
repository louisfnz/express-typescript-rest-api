import HttpException from './HttpException';

class InvalidJwtException extends HttpException {
    constructor() {
        super(401, 'Invalid authentication token');
    }
}

export default InvalidJwtException;
