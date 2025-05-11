import { chromium } from 'playwright';
import { sendEmail } from './sendEmail';
import { products } from './products';

const extractDiscountPercentage = (promo: string): string => {
    const match = promo.match(/taniej\s*o\s*(\d+)%/i);
    return match ? `${match[1]}%` : 'brak';
};

const formatVerdict = (price: number, available: boolean, threshold: number): string => {
    if (!available) return '⛔ NIEDOSTĘPNY 😞';
    return price <= threshold ? '🔥 Bierz!' : '⏳ Wstrzymaj się';
};

const formatProductInfo = (
    name: string,
    price: number,
    promoPercent: string,
    threshold: number,
    verdict: string,
    url: string
): string => {
    return `🍀 ${name} - aktualna cena 💰: ${price} zł, aktualna promocja ⭐ : ${promoPercent} (moja cena  💚 : ${threshold} zł ${verdict})\n👉 ${url}\n`;
};

const checkPrices = async () => {
    const browser = await chromium.launch();
    const emailProducts: string[] = [];

    for (const product of products) {
        const page = await browser.newPage();
        await page.goto(product.url, { waitUntil: 'domcontentloaded' });

        // Akceptacja cookies
        try {
            const cookieButton = await page.waitForSelector('button.cookie-button-accept', { timeout: 3000 });
            await cookieButton.click();
        } catch {}

        // Sprawdzenie dostępności
        let available = false;
        try {
            await page.waitForSelector('#addbasket > button', { timeout: 2000 });
            available = true;
        } catch {}

        const priceText = await page.textContent(product.selector);
        if (!priceText) {
            console.error(`❌ Nie udało się odczytać ceny dla: ${product.name}`);
            continue;
        }

        // Sprawdzenie promocji
        let promoText = '';
        try {
            const promoRaw = await page.textContent('div.save-info');
            if (promoRaw) promoText = promoRaw.trim();
        } catch {}

        const discountPercent = extractDiscountPercentage(promoText);
        const normalizedPrice = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
        const verdict = formatVerdict(normalizedPrice, available, product.threshold);
        const productLine = formatProductInfo(
            product.name,
            normalizedPrice,
            discountPercent,
            product.threshold,
            verdict,
            product.url
        );

        // Log i push do e-maila
        console.log(productLine);
        emailProducts.push(productLine);

        await page.close();
    }

    await browser.close();
    await sendEmail(emailProducts.join('\n'));
};

checkPrices();