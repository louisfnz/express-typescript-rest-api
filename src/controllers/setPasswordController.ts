import {Response} from 'express';
import {v4 as uuid} from 'uuid';
import {RequestWithUser} from '../types/express/request';
import {validateInput} from '../utilities/validate';
import User from '../models/User';
import {createHmac} from '../utilities/crypto';
import {renderEmailTemplate, sendEmail} from '../utilities/email';
import Token from '../models/Token';
import {mysqlDate} from '../utilities/date';
import {addDays} from 'date-fns';
import * as bcrypt from 'bcrypt';
import InvalidTokenException from '../exceptions/InvalidTokenException';

export default {
    sendSetPasswordToken: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            email: 'email|max:254|required',
        };

        const {email} = await validateInput(req.body, schema);

        const user = await User.query().findOne({email});

        if (user) {
            const hmacUuid = uuid();
            const token = createHmac(user.id, hmacUuid, user.email);

            await Token.query().insert({
                user_id: user.id,
                token,
                type: 'email',
                expires_at: mysqlDate(addDays(new Date(), 1)),
            });

            const url = `${process.env.APP_FRONTEND_URL}/reset-password/${token}`;

            const html = await renderEmailTemplate('reset-password/html', {
                app_name: process.env.APP_NAME as string,
                first_name: user.first_name as string,
                url,
            });

            await sendEmail(user.email, `Reset your password for ${process.env.APP_NAME}`, html);
        }

        return res.json({});
    },

    verifySetPasswordToken: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            token: 'string|required',
        };

        const {token} = await validateInput(req.body, schema);

        const tokenRecord = await Token.query().findOne({token});

        if (tokenRecord) {
            const user = await User.query().findById(tokenRecord.user_id);
            if (user) return res.json({});
        }

        throw new InvalidTokenException();
    },

    setPassword: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            token: 'string|required',
            password: 'string|required|confirmed',
        };

        const {token, password} = await validateInput(req.body, schema);

        const tokenRecord = await Token.query().findOne({token});

        if (tokenRecord) {
            const user = await User.query().findById(tokenRecord.user_id);
            if (user) {
                const passwordHash = await bcrypt.hash(password, 12);
                await user.$query().patch({password: passwordHash});
                await Token.query().deleteById(tokenRecord.id);
                return res.json({});
            }
        }

        throw new InvalidTokenException();
    },
};
