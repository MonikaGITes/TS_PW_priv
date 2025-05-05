import { chromium } from 'playwright';

const URL = 'https://yepoda.pl/products/the-dewy-day';
const SELECTOR = '#price-template--24092769878322__main-product > div > span';
const THRESHOLD = 150;

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
    } else {
        console.log('⏳ Jeszcze nie...');
    }

    await browser.close();
};

checkPrice();