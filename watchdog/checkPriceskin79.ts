import { chromium } from 'playwright';
import { sendEmail } from './sendEmail';
import { products } from './products';

const checkPrices = async () => {
    const browser = await chromium.launch();
    const results = [];

    for (const product of products) {
        const page = await browser.newPage();
        await page.goto(product.url, { waitUntil: 'domcontentloaded' });

        // Cookies
        try {
            const cookieButton = await page.waitForSelector('button.cookie-button-accept', { timeout: 3000 });
            await cookieButton.click();
        } catch {}

        // Dostępność
        let available = false;
        try {
            await page.waitForSelector('#addbasket > button', { timeout: 2000 });
            available = true;
        } catch {}

        // Cena
        const priceText = await page.textContent(product.selector);
        if (!priceText) {
            console.error(`❌ Nie udało się odczytać ceny: ${product.name}`);
            continue;
        }

        const normalized = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));

        // Promocja
        let promoText = '';
        try {
            const promo = await page.textContent('div.save-info');
            if (promo) promoText = promo.trim();
        } catch {}

        // Werdykt
        let verdict = '';
        if (!available) {
            verdict = '⛔ NIEDOSTĘPNY 😞';
        } else if (normalized <= product.threshold) {
            verdict = '🔥 Bierz!';
        } else {
            verdict = '⏳ Wstrzymaj się';
        }

        const formatted = `📦 ${product.name} - aktualna cena to: ${normalized} zł, aktualna promocja to: ${promoText || 'brak'} (threshold to: ${verdict})\n👉 ${product.url}`;

        console.log(formatted + '\n');

        results.push({
            name: product.name,
            price: normalized,
            url: product.url,
            promo: promoText,
            verdict,
        });

        await page.close();
    }

    await browser.close();
    //await sendEmail(results);
};

checkPrices();