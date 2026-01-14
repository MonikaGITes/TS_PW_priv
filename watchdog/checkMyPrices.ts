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
        try {
            const acceptWords = ['akceptuj', 'zaakceptuj', 'accept', 'zgadzam', 'allow'];

            const normalize = (s: string) =>
                s.replace(/\s+/g, ' ').trim().toLowerCase();

            // najpierw główny DOM
            const clicked = await page.evaluate(({ acceptWords }) => {
                const normalize = (s: string) =>
                    s.replace(/\s+/g, ' ').trim().toLowerCase();

                for (const btn of document.querySelectorAll('button')) {
                    const text = normalize(btn.innerText || '');
                    if (acceptWords.some(w => text.includes(w))) {
                        btn.click();
                        return true;
                    }
                }
                return false;
            }, { acceptWords });

            // jeśli nie kliknęło — iframe
            if (!clicked) {
                for (const frame of page.frames()) {
                    try {
                        await frame.evaluate(({ acceptWords }) => {
                            const normalize = (s: string) =>
                                s.replace(/\s+/g, ' ').trim().toLowerCase();

                            for (const btn of document.querySelectorAll('button')) {
                                const text = normalize(btn.innerText || '');
                                if (acceptWords.some(w => text.includes(w))) {
                                    btn.click();
                                    return true;
                                }
                            }
                            return false;
                        }, { acceptWords });
                    } catch {}
                }
            }
        } catch {}


// Sprawdzenie dostępności – deterministyczne CTA zakupowe
        let available = false;

        try {
            available = await page.evaluate(() => {
                const normalize = (s: string) =>
                    s.replace(/\s+/g, ' ')
                        .trim()
                        .toLowerCase();

                const allowed = new Set([
                    'do koszyka',
                    'dodaj do koszyka',
                    'kup teraz'
                ]);

                return Array.from(document.querySelectorAll('button')).some(btn => {
                    const text = [
                        btn.innerText,
                        btn.getAttribute('aria-label'),
                        btn.getAttribute('title'),
                        btn.querySelector('img')?.getAttribute('alt')
                    ]
                        .filter((v): v is string => typeof v === 'string')
                        .map(normalize)
                        .join(' ');

                    return Array.from(allowed).some(a => text.includes(a));
                });
            });
        } catch {
            available = false;
        }

        let normalizedPrice: number | null = null;
        let priceText: string | null = null;

        if (product.selector === 'div.main-price') {
            normalizedPrice = await page.evaluate(() => {
                const el = document.querySelector('div.main-price');
                if (!el) return null;

                const whole = el.querySelector('.whole')?.textContent ?? '0';
                const cents = el.querySelector('.cents')?.textContent ?? '00';

                const normalizedWhole = whole.replace(/[^\d]/g, '');
                return parseFloat(`${normalizedWhole}.${cents}`);
            });
        } else {
            priceText = await page.textContent(product.selector);
            if (!priceText) {
                console.error(`❌ Nie udało się odczytać ceny dla: ${product.name}`);
                continue;
            }

            normalizedPrice = parseFloat(
                priceText.replace(/[^\d,]/g, '').replace(',', '.')
            );
        }

        if (normalizedPrice === null || Number.isNaN(normalizedPrice)) {
            console.error(`❌ Nie udało się sparsować ceny dla: ${product.name}`);
            continue;
        }

        // Sprawdzenie promocji
        let promoText = '';
        try {
            const promoRaw = await page.textContent('div.save-info');
            if (promoRaw) promoText = promoRaw.trim();
        } catch {}

        const discountPercent = extractDiscountPercentage(promoText);
        //const normalizedPrice = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
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