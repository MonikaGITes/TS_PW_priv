import { chromium } from 'playwright';
import { sendEmail } from './sendEmail';
import { products } from './products';

const checkPrices = async () => {
    const browser = await chromium.launch();
    //const browser = await chromium.launch({ headless: false }); //odkomentuj, jeśli chcesz uruchomić z interfejsem graficznym
    const productDetails: Array<{ name: string, price: number, url: string, promo: string, available: boolean }> = [];

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

        // Pobranie ceny produktu
        const priceText = await page.textContent(product.selector);
        if (!priceText) {
            console.error(`❌ Nie udało się odczytać ceny dla: ${product.name}`);
            continue;
        }

        // Pobranie informacji o promocji
        let promoText = '';

        try {
            const promo = await page.textContent('div.save-info');
            if (promo) {
                promoText = promo.trim();
                console.log(`🏷️ Promocja: ${promoText}`);
            }
        } catch {
            console.log(`🏷️ Brak informacji o promocji`);
        }

        const normalized = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
        console.log(`🔍 ${product.name}: ${normalized} zł`);

        // Zbieranie danych do raportu
        productDetails.push({
            name: product.name,
            price: normalized,
            url: product.url,
            promo: promoText || 'Brak promocji',
            available: available
        });

        await page.close();
    }

    await browser.close();

    // Wysyłanie codziennego raportu e-mail
    await sendEmail(productDetails);
};

checkPrices();