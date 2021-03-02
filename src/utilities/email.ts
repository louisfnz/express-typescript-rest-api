import Mailgun from 'mailgun-js';
import EmailTemplates from 'email-templates';

const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string,
});

const email = new EmailTemplates({
    views: {
        root: process.env.EMAIL_TEMPLATE_DIR,
    },
});

export const sendEmail = (to: string, subject: string, html: string): Promise<Mailgun.messages.SendResponse> => {
    return new Promise((resolve, reject) => {
        const data = {
            from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to,
            subject,
            html,
        };

        return mailgun.messages().send(data, function (err, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

export const renderEmailTemplate = (template: string, vars: Record<string, string>) => {
    return email.render(template, vars);
};
