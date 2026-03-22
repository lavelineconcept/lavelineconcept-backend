import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: env(SMTP.SMTP_SECURE) === 'true',
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 60000,
  socketTimeout: 60000,
  greetingTimeout: 60000,
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
