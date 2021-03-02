import HttpException from './HttpException';

class UnauthorisedException extends HttpException {
    constructor() {
        super(401, 'You are not authorised to access this resource');
    }
}

export default UnauthorisedException;
