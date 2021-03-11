import {Response} from 'express';
import {RequestExtended} from '../types/express/request';
import {validateInput} from '../utilities/validate';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';
import {formatPaginationResults, getPaginationQueryParams} from '../utilities/pagination';
import {hasPermission} from '../utilities/auth';
import Role from '../models/Role';

export default {
    index: async (req: RequestExtended, res: Response): Promise<Response> => {
        req?.user && hasPermission(req.user, 'roles.show');

        const {page, perPage} = getPaginationQueryParams(req);
        const results = await Role.query().page(page, perPage);
        return res.json(formatPaginationResults(results, page, perPage));
    },

    store: async (req: RequestExtended, res: Response): Promise<Response> => {
        req?.user && hasPermission(req.user, 'roles.store');

        const schema = {
            name: 'string|max:255|required|unique:roles,name',
        };
        const messages = {
            'name.required': 'Name is a required field',
        };
        const {name} = await validateInput(req.body, schema, messages);

        const role = await Role.query().insertAndFetch({
            name,
        });

        return res.status(201).json(role);
    },

    show: async (req: RequestExtended, res: Response): Promise<Response> => {
        req?.user && hasPermission(req.user, 'roles.show');

        const schema = {
            id: 'number|required',
        };
        const messages = {
            'id.required': 'Role ID is invalid',
            'id.number': 'Role ID is invalid',
        };
        const {id} = await validateInput({id: req.params.id}, schema, messages);

        const user = await Role.query().findById(id);

        if (!user) throw new ResourceNotFoundException();

        return res.json(user);
    },

    update: async (req: RequestExtended, res: Response): Promise<Response> => {
        req?.user && hasPermission(req.user, 'roles.update');

        const schema = {
            id: 'number|required',
            name: 'string|max:255|required|unique:roles,name',
        };
        const messages = {
            'id.required': 'Role ID is invalid',
            'id.number': 'Role ID is invalid',
            'name.required': 'Name is a required field',
        };
        const {id, name} = await validateInput({...req.body, ...req.params}, schema, messages);

        const existingRole = await Role.query().findById(id);

        if (!existingRole) throw new ResourceNotFoundException();

        const role = await Role.query().updateAndFetchById(id, {
            name,
        });

        return res.json(role);
    },

    destroy: async (req: RequestExtended, res: Response): Promise<Response> => {
        req?.user && hasPermission(req.user, 'roles.destroy');

        const schema = {
            id: 'number|required',
        };
        const messages = {
            'id.required': 'Role ID is invalid',
            'id.number': 'Role ID is invalid',
        };
        const {id} = await validateInput({id: req.params.id}, schema, messages);

        const deleted = await Role.query().deleteById(id);
        if (!deleted) throw new ResourceNotFoundException();

        return res.json({});
    },
};
