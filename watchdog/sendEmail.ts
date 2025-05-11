import nodemailer from 'nodemailer';

export const sendEmail = async (content: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Skin79 Watchdog" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: '📈 Codzienny raport o produktach na Skin79',
        text: `🔔 Codzienny raport produktów:\n\n${content}`,
    });
};