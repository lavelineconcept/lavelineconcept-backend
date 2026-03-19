import { sendEmail } from './src/utils/sendMail.js';
import { env } from './src/utils/env.js';
import mongoose from 'mongoose';

async function testEmail() {
    console.log("Starting email test...");
    try {
        const from = `"La Véline Concept" <${env('MAIL_USER')}>`;
        console.log("From:", from);
        
        await sendEmail({
            from,
            to: 'lavelineconcept@gmail.com',
            subject: 'Test Email Server',
            html: '<h1>This is a test email</h1><p>If you see this, SMTP is working.</p>'
        });
        console.log("Email sent successfully!");
    } catch(err) {
        console.error("Test email failed:", err);
    }
    process.exit(0);
}

testEmail();
