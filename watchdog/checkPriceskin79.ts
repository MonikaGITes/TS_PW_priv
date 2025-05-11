import { chromium } from 'playwright';
import { sendEmail } from './sendEmail';
import { products } from './products';

const checkPrices = async () => {
    const browser = await chromium.launch();
    //const browser = await chromium.launch({ headless: false });
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

// Sprawdzanie ceny i dostępności
        if (normalized <= product.threshold && available) {
            console.log(`✅ Bierzemy to! 🔥 ${product.name} - ${normalized} zł! 🏷️ ${promoText}\n👉 Link: ${product.url}`);

            //await sendEmail(product.name, normalized, product.url, promoText); //odkomentujesz w przyszłości

        } else if (!available) {
            console.log(`⛔ ${product.name} - NIEDOSTĘPNY 😞 Cena: ${normalized} zł 🏷️ ${promoText}\n👉 Link: ${product.url}`);
        } else {
            console.log(`⏳ ${product.name} jeszcze nie... Cena: ${normalized} zł 🏷️ ${promoText}\n👉 Link: ${product.url}`);
        }

        await page.close();
    }

    await browser.close();
};

checkPrices();