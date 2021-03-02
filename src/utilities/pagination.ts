import {RequestExtended} from '../types/express/request';
import Objection, {Model} from 'objection';

export const getPaginationQueryParams = (req: RequestExtended): Record<string, number> => {
    let page: number | string =
        typeof req.query.page === 'string' && /[\d]+/.test(req.query.page) ? req.query.page : '1';
    let perPage = Number(req.query.perPage || 50);

    page = parseInt(page, 10) - 1;
    if (page < 0) page = 0;
    if (![10, 20, 50, 100].find((v) => v === perPage)) perPage = 50;

    return {
        page,
        perPage,
    };
};

export const formatPaginationResults = (
    results: Objection.Page<Model>,
    page: number,
    perPage: number,
): Objection.Page<Model> | {page: number; perPage: number} => {
    return {...results, page: page + 1, perPage};
};
