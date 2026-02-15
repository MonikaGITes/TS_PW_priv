//checkMyPrices.ts
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { sendEmail } from './sendEmail';
import { SHOP_CONFIGS } from './config/selectors';
import { handleCookieConsent } from './core/consent';
import { checkAvailability } from './core/availability';
import { extractPrice } from './core/price-extractor';

// Data types for JSON migration
interface JsonProduct {
    id: string;
    name: string;
    url: string;
    targetPrice: number;
    shop: string;
    disabled?: boolean; // New Flag
}

interface RuntimeProduct extends JsonProduct {
    selector: string; // Hydrated from SHOP_CONFIGS
}

interface ResultSnapshot {
    timestamp: string;
    results: Array<{
        name: string;
        url: string;
        price: number | null;
        isAvailable: boolean;
        verdict: string;
        discount: string;
    }>;
}

const USER_ID = 'MonMar'; // Hardcoded for single-user pilot
const DATA_DIR = path.join(__dirname, '../data/users', USER_ID);
const PRODUCTS_FILE = path.join(DATA_DIR, `products_${USER_ID}.json`);
const RESULTS_FILE = path.join(DATA_DIR, `results_${USER_ID}.json`);

const loadProducts = (): RuntimeProduct[] => {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        throw new Error(`Products file not found: ${PRODUCTS_FILE}`);
    }
    const rawData = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const jsonProducts: JsonProduct[] = JSON.parse(rawData);

    return jsonProducts
        .filter(p => p.disabled !== true) // Filter disabled products
        .map(p => {
            const config = SHOP_CONFIGS[p.shop];
            if (!config) {
                throw new Error(`Unknown shop '${p.shop}' for product '${p.name}'`);
            }
            return {
                ...p,
                selector: config.priceSelector
            };
        });
};

const extractDiscountPercentage = (promo: string): string => {
    const match = promo.match(/taniej\s*o\s*(\d+)%/i);
    return match ? `${match[1]}%` : 'brak';
};

const formatVerdict = (price: number | null, available: boolean, startThreshold: number): string => {
    if (!available) return '⛔ NIEDOSTĘPNY 😞';
    return (price ?? Infinity) <= startThreshold ? '🔥 Bierz!' : '⏳ Wstrzymaj się';
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
    console.log(`🚀 Starting WatchDog for user: ${USER_ID}`);
    const products = loadProducts();
    console.log(`Loaded ${products.length} products.`);

    const browser = await chromium.launch({
        headless: false, // 👈 HEADFUL (Mandatory)
        slowMo: 100,
    });

    const emailLines: string[] = [];
    const resultsData: ResultSnapshot = {
        timestamp: new Date().toISOString(),
        results: []
    };

    for (const product of products) {
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            await page.goto(product.url, { waitUntil: 'domcontentloaded' });

            // Akceptacja cookies (timing + iframe)
            await handleCookieConsent(page);

            // Sprawdzenie dostępności
            const available = await checkAvailability(page);

            let normalizedPrice: number | null = null;
            let discountPercent = 'brak';

            if (available) {
                const price = await extractPrice(page, product);
                if (price !== null) {
                    normalizedPrice = price;

                    // Sprawdzenie promocji (tylko dla dostępnych)
                    // TODO: Move promotion selector to config in future cleanup if consistent across shops
                    // let promoText = '';
                    // try {
                    //     const promoRaw = await page.textContent('div.save-info');
                    //     if (promoRaw) promoText = promoRaw.trim();
                    // } catch { }
                    // discountPercent = extractDiscountPercentage(promoText);
                }
            }

            const verdict = formatVerdict(normalizedPrice, available, product.targetPrice);

            // 1. Email Line
            const productLine = formatProductInfo(
                product.name,
                normalizedPrice,
                discountPercent,
                product.targetPrice,
                verdict,
                product.url
            );
            console.log(productLine);
            emailLines.push(productLine);

            // 2. JSON Result
            resultsData.results.push({
                name: product.name,
                url: product.url,
                price: normalizedPrice,
                isAvailable: available,
                verdict: verdict.replace(/[^a-zA-Z0-9 ]/g, '').trim(), // Cleanup emojis for JSON if desired, or keep raw. Keeping raw for now but maybe simplified verdict code would be better for JSON. 
                // Wait, "verdict" in prompt example says "BUY" or "WAIT".
                // formatVerdict returns "🔥 Bierz!" or "⏳ Wstrzymaj się".
                // I should probably adhere to the prompt's JSON structure example "BUY"/"WAIT".
                // But formatProductInfo uses the emoji string.
                // Let's normalize for JSON.
                discount: discountPercent
            });
            // Overriding verdict for JSON to match Stage 3 spec if possible, but keeping logic identical.
            // Stage 3 model example says "BUY".
            // Let's map it.
            const resultVerdict = !available ? "UNAVAILABLE" : ((normalizedPrice ?? Infinity) <= product.targetPrice ? "BUY" : "WAIT");
            // Update the pushed object
            resultsData.results[resultsData.results.length - 1].verdict = resultVerdict;


        } catch (e) {
            console.error(`Error processing ${product.name}:`, e);
        } finally {
            await page.close();
            await context.close();
        }
    }

    await browser.close();

    // Save JSON Snapshot
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(resultsData, null, 2));
    console.log(`💾 Results saved to ${RESULTS_FILE}`);

    // Send Notification
    if (emailLines.length > 0) {
        await sendEmail(emailLines.join('\n'));
    }
};

checkPrices();