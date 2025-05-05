import { chromium } from 'playwright';
import nodemailer from 'nodemailer';

const URL = 'https://yepoda.pl/products/the-dewy-day';
const SELECTOR = '#price-template--24092769878322__main-product > div > span';
const THRESHOLD = 150;

const sendEmail = async (price: number) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Yepoda Watchdog" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `🎉 Cena spadła! Dewy Day za ${price} zł`,
        text: `🔥 Cena na yepoda.pl to teraz ${price} zł!\n\n👉 Link: ${URL}`,
    });
};

const checkPrice = async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const priceText = await page.textContent(SELECTOR);
    if (!priceText) {
        console.error('❌ Nie udało się odczytać ceny.');
        await browser.close();
        return;
    }

    const normalized = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
    console.log(`🔍 Cena to: ${normalized} zł`);

    if (normalized < THRESHOLD) {
        console.log('✅ Bierzemy to! 🔥');
        await sendEmail(normalized);
    } else {
        console.log('⏳ Jeszcze nie...');
    }

    await browser.close();
};

checkPrice();