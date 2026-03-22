import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT || 465),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 5000,
});

async function main() {
  console.log('Testing SMTP connection...');
  console.log({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_USER,
    pass: typeof process.env.MAIL_PASS === 'string' ? '****' : 'missing',
  });
  
  try {
    const info = await transporter.verify();
    console.log('Server is ready to take our messages:', info);
    
    console.log('Attempting to send a test email...');
    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: 'Test Email',
      text: 'This is a test email to verify SMTP settings.'
    });
    console.log('Test email sent successfully!', result.messageId);
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}

main();
