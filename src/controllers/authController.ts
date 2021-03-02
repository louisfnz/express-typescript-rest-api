import {Response} from 'express';
import * as bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import {addHours, getUnixTime} from 'date-fns';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import Token from '../models/Token';
import {extractJwt} from '../utilities/auth';
import TokenPayload from '../types/auth/token';
import {RequestWithUser} from '../types/express/request';
import InvalidTokenException from '../exceptions/InvalidTokenException';
import {validateInput} from '../utilities/validate';
import InvalidJwtException from '../exceptions/InvalidJwtException';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import UserLogin from '../models/UserLogin';
import {mysqlDate} from '../utilities/date';

export default {
    me: async (req: RequestWithUser, res: Response): Promise<Response> => {
        return res.json(req.user);
    },

    login: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            email: 'email|max:254|required',
            password: 'string|required',
        };
        const messages = {
            'email.required': 'Email address is a required field',
            'email.email': 'Email address must be valid',
            'password.required': 'Password is a required field',
        };
        const {email, password} = await validateInput(req.body, schema, messages);

        const user = await User.query().findOne({email});

        if (user) {
            // User exists, check password
            const authorised = await bcrypt.compare(password, user.password);

            if (authorised) {
                // Create a refresh token and save to DB
                const refreshToken = uuid();

                await Token.query().insert({
                    user_id: user.id,
                    type: 'refresh_token',
                    token: refreshToken,
                    expires_at: mysqlDate(
                        addHours(new Date(), parseInt(process.env.JWT_REFRESH_VALID_HOURS || '720', 10)),
                    ),
                });

                // Create a JWT
                const expires = getUnixTime(addHours(new Date(), 2));
                const token = jwt.sign({id: user.id, uuid: uuid()}, process.env.JWT_SECRET || '', {
                    algorithm: 'HS256',
                    expiresIn: `${process.env.JWT_VALID_HOURS || '2'}h`,
                });

                // Save user login record
                await UserLogin.query().insert({
                    user_id: user.id,
                    token,
                    user_agent: (req.headers['user-agent'] || '').substr(0, 512),
                    ip_address: req.ip,
                    valid: true,
                });

                return res.json({token, refresh_token: refreshToken, expires});
            }
        }

        throw new InvalidCredentialsException();
    },

    logout: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const extractedJwt = extractJwt(req);

        // Invalidate user login record
        await UserLogin.query()
            .update({
                valid: false,
            })
            .where('token', extractedJwt);

        return res.json({});
    },

    refresh: async (req: RequestWithUser, res: Response): Promise<Response> => {
        const schema = {
            refresh_token: 'required',
        };
        const messages = {
            'refresh_token.required': 'Refresh token is required',
        };
        const {refresh_token} = await validateInput(req.body, schema, messages);

        const extractedJwt = extractJwt(req);
        let tokenPayload = null;

        // Check if the JWT is valid (ignore expiry)
        try {
            tokenPayload = jwt.verify(extractedJwt, process.env.JWT_SECRET || '', {
                ignoreExpiration: true,
            }) as TokenPayload;
        } catch (e) {
            throw new InvalidJwtException();
        }

        if (tokenPayload) {
            // Valid JWT - get the user
            const user = await User.query()
                .findById(tokenPayload.id)
                .withGraphFetched('tokens')
                .modifyGraph('tokens', (builder) => {
                    builder.where('token', refresh_token).where('type', 'refresh_token');
                })
                .withGraphFetched('user_logins')
                .modifyGraph('user_logins', (builder) => {
                    builder.where('valid', true).where('token', extractedJwt);
                });

            // Throw if user is undefined or no related tokens and valid logins could be found
            if (!user || !user.tokens.length || !user.user_logins.length) throw new InvalidTokenException();

            // Create a new refresh token and JWT
            const newRefreshToken = uuid();
            const expires = getUnixTime(addHours(new Date(), parseInt(process.env.JWT_VALID_HOURS || '2', 10)));
            const newJwt = jwt.sign({id: user.id, uuid: uuid()}, process.env.JWT_SECRET as string, {
                algorithm: 'HS256',
                expiresIn: `${process.env.JWT_VALID_HOURS || '2'}h`,
            });

            // Revoke old refresh token
            await Token.query()
                .patch({
                    is_revoked: true,
                })
                .where('user_id', user.id)
                .where('token', refresh_token);

            // Save new refresh token
            await Token.query().insert({
                user_id: user.id,
                type: 'refresh_token',
                token: newRefreshToken,
                expires_at: mysqlDate(addHours(new Date(), parseInt(process.env.JWT_REFRESH_VALID_HOURS || '720', 10))),
            });

            // Update user_logins entry
            await UserLogin.query()
                .patch({
                    token: newJwt,
                    updated_at: mysqlDate(new Date()),
                })
                .where('user_id', user.id)
                .where('token', extractedJwt);

            return res.json({token: newJwt, refresh_token: newRefreshToken, expires});
        } else {
            throw new InvalidTokenException();
        }
    },
};
