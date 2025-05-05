import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://yepoda.pl/products/the-dewy-day', { waitUntil: 'domcontentloaded' });

    const priceText = await page.locator('#price-template--24092769878322__main-product > div > span').innerText();

    const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));

    console.log(`Aktualna cena: ${price} zł`);

    if (price < 100) {
        console.log('ALERT');
    }

    await browser.close();
})();