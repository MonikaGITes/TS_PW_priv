import nodemailer from 'nodemailer';

export const sendEmail = async (products: Array<{ name: string, price: number, url: string, promo: string, available: boolean }>) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let emailText = '🔔 Codzienny raport produktów:\n\n';

    products.forEach(product => {
        emailText += `📦 ${product.name}: ${product.price} zł\n👉 Link do produktu: ${product.url}\n🏷️ Promocja: ${product.promo}\n📦 Dostępność: ${product.available ? 'Dostępny' : 'Niedostępny'}\n\n`;
    });

    await transporter.sendMail({
        from: `"Skin79 Watchdog" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: '📈 Codzienny raport o produktach na Skin79',
        text: emailText,
    });
};