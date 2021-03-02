import {Response} from 'express';
import {v4 as uuid} from 'uuid';
import {RequestWithUser} from '../types/express/request';
import User from '../models/User';
import {validateInput} from '../utilities/validate';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';
import {formatPaginationResults, getPaginationQueryParams} from '../utilities/pagination';
import {renderEmailTemplate, sendEmail} from '../utilities/email';
import {createHmac} from '../utilities/crypto';
import Token from '../models/Token';

export default {
    index: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const {page, perPage} = getPaginationQueryParams(req);
        const results = await User.query().page(page, perPage);
        return res.json(formatPaginationResults(results, page, perPage));
    },

    store: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            email: 'email|max:254|required|unique:users,email',
            first_name: 'string|required',
            last_name: 'string|required',
        };
        const messages = {
            'email.required': 'Email address is a required field',
            'email.email': 'Email address must be valid',
            'first_name.required': 'First name is a required field',
            'last_name.required': 'Last name is a required field',
        };
        const {email, first_name, last_name} = await validateInput(req.body, schema, messages);

        const user = await User.query().insertAndFetch({
            email,
            first_name,
            last_name,
        });

        const token = createHmac(user.id, uuid(), user.email);
        const url = `${process.env.APP_FRONTEND_URL}/create-account/${token}`;

        await Token.query().insert({
            user_id: user.id,
            token,
            type: 'email',
        });

        const html = await renderEmailTemplate('user-invite/html', {
            app_name: process.env.APP_NAME as string,
            first_name: first_name,
            url,
        });

        await sendEmail(user.email, `You've been invited to join ${process.env.APP_NAME}`, html);

        return res.status(201).json(user);
    },

    show: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            id: 'number|required',
        };
        const messages = {
            'id.required': 'User ID is invalid',
            'id.number': 'User ID is invalid',
        };
        const {id} = await validateInput({id: req.params.id}, schema, messages);

        const user = await User.query().findById(id);

        if (!user) throw new ResourceNotFoundException();

        return res.json(user);
    },

    update: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            id: 'number|required',
            email: `email|max:254|required|unique:users,email,id,${req.params?.id}`,
            first_name: 'string|required',
            last_name: 'string|required',
        };
        const messages = {
            'id.required': 'User ID is invalid',
            'id.number': 'User ID is invalid',
            'email.required': 'Email address is a required field',
            'email.email': 'Email address must be valid',
            'first_name.required': 'First name is a required field',
            'last_name.required': 'Last name is a required field',
        };
        const {id, email, first_name, last_name} = await validateInput({...req.body, ...req.params}, schema, messages);

        const userExists = await User.query().findById(id);

        if (!userExists) throw new ResourceNotFoundException();

        const user = await User.query().updateAndFetchById(id, {
            email,
            first_name,
            last_name,
        });

        return res.json(user);
    },

    destroy: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            id: 'number|required',
        };
        const messages = {
            'id.required': 'User ID is invalid',
            'id.number': 'User ID is invalid',
        };
        const {id} = await validateInput({id: req.params.id}, schema, messages);

        const deleted = await User.query().deleteById(id);
        if (!deleted) throw new ResourceNotFoundException();

        return res.json({});
    },
};
