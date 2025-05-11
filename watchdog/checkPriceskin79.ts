import { chromium } from 'playwright';
import { sendEmail } from './sendEmail';
import { products } from './products';

const checkPrices = async () => {
    const browser = await chromium.launch();
    const reportData = [];

    for (const product of products) {
        const page = await browser.newPage();
        await page.goto(product.url, { waitUntil: 'domcontentloaded' });

        // Akceptacja cookies, jeśli popup się pojawi
        try {
            const cookieButton = await page.waitForSelector('button.cookie-button-accept', { timeout: 3000 });
            await cookieButton.click();
            console.log('🍪 Ciasteczka zaakceptowane');
        } catch {
            console.log('🍪 Brak ciasteczek do akceptacji');
        }

        // Sprawdzenie dostępności
        let available = false;
        try {
            await page.waitForSelector('#addbasket > button', { timeout: 2000 });
            available = true;
            console.log(`🟢 ${product.name} jest dostępny`);
        } catch {
            console.log(`🔴 ${product.name} jest NIEDOSTĘPNY`);
        }

        // Pobranie ceny
        const priceText = await page.textContent(product.selector);
        if (!priceText) {
            console.error(`❌ Nie udało się odczytać ceny dla: ${product.name}`);
            await page.close();
            continue;
        }

        const normalized = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
        console.log(`🔍 ${product.name}: ${normalized} zł`);

        // Pobranie informacji o promocji
        let promoText = '';
        try {
            const promo = await page.textContent('div.save-info');
            if (promo) {
                promoText = promo.trim();
                console.log(`🏷️ Promocja: ${promoText}`);
            }
        } catch {
            console.log('🏷️ Brak informacji o promocji');
        }

        // Generowanie werdyktu
        let verdict = '';
        if (!available) {
            verdict = '⛔ NIEDOSTĘPNY 😞';
        } else if (normalized <= product.threshold) {
            verdict = `✅ Bierzemy to! Cena ${normalized} zł ≤ próg ${product.threshold} zł 🔥`;
        } else {
            verdict = `⏳ Jeszcze nie... Cena ${normalized} zł > próg ${product.threshold} zł`;
        }
        console.log(`📊 Werdykt: ${verdict}`);
        reportData.push({
            name: product.name,
            price: normalized,
            url: product.url,
            promo: promoText || 'brak',
            available,
            verdict
        });

        await page.close();
    }

    await browser.close();
    await sendEmail(reportData);
};

checkPrices();