import crypto from 'crypto';

export const createHmac = (user_id: number, uuid: string, email: string): string => {
    return crypto
        .createHmac('sha256', process.env.CRYPTO_SECRET as string)
        .update(`user_id=${user_id}&uuid=${uuid}&email=${email}`)
        .digest('hex');
};
