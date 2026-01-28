//sendEmail.ts
import nodemailer from 'nodemailer';
import { emailConfig } from './config/notifications';

export const sendEmail = async (content: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"${emailConfig.senderName}" <${process.env.EMAIL_USER}>`,
        to: emailConfig.recipients.join(', '),
        subject: emailConfig.subject,
        text: `🔔 Codzienny raport produktów:\n\n${content}`,
    });
};