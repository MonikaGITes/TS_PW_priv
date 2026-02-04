//checkMyPrices.ts
import { chromium } from 'playwright';
import { sendEmail } from './sendEmail';
import { products } from './config/products';
import { handleCookieConsent } from './core/consent';
import { checkAvailability } from './core/availability';
import { extractPrice } from './core/price-extractor';

const extractDiscountPercentage = (promo: string): string => {
    const match = promo.match(/taniej\s*o\s*(\d+)%/i);
    return match ? `${match[1]}%` : 'brak';
};

const formatVerdict = (price: number | null, available: boolean, threshold: number): string => {
    if (!available) return '⛔ NIEDOSTĘPNY 😞';
    return (price ?? Infinity) <= threshold ? '🔥 Bierz!' : '⏳ Wstrzymaj się';
};

const formatProductInfo = (
    name: string,
    price: number | null,
    promoPercent: string,
    threshold: number,
    verdict: string,
    url: string
): string => {
    if (price === null) {
        return `🍀 ${name} - ${verdict}\n👉 ${url}\n`;
    }
    return `🍀 ${name} - aktualna cena 💰: ${price} zł, aktualna promocja ⭐ : ${promoPercent} (moja cena  💚 : ${threshold} zł ${verdict})\n👉 ${url}\n`;
};

const checkPrices = async () => {
    const browser = await chromium.launch({
        headless: false, // 👈 HEADFUL
        slowMo: 100,     // 👈 opcjonalnie, bardzo polecam
    });
    const emailProducts: string[] = [];

    for (const product of products) {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(product.url, { waitUntil: 'domcontentloaded' });

        // Akceptacja cookies (timing + iframe)
        await handleCookieConsent(page);


        // Sprawdzenie dostępności – deterministyczne CTA zakupowe
        const available = await checkAvailability(page);

        let normalizedPrice: number | null = null;
        let discountPercent = 'brak';

        if (available) {
            const price = await extractPrice(page, product);
            if (price === null) continue;
            normalizedPrice = price;

            // Sprawdzenie promocji (tylko dla dostępnych)
            let promoText = '';
            try {
                const promoRaw = await page.textContent('div.save-info');
                if (promoRaw) promoText = promoRaw.trim();
            } catch { }
            discountPercent = extractDiscountPercentage(promoText);
        }

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