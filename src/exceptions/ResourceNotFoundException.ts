import HttpException from './HttpException';

class ResourceNotFoundException extends HttpException {
    constructor() {
        super(404, 'Resource not found');
    }
}

export default ResourceNotFoundException;
