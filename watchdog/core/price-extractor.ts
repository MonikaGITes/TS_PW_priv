import { Page } from 'playwright';

export interface ProductConfig {
    name: string;
    selector: string;
}

export async function extractPrice(page: Page, product: ProductConfig): Promise<number | null> {
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
            return null;
        }

        normalizedPrice = parseFloat(
            priceText.replace(/[^\d,]/g, '').replace(',', '.')
        );
    }

    if (normalizedPrice === null || Number.isNaN(normalizedPrice)) {
        console.error(`❌ Nie udało się sparsować ceny dla: ${product.name}`);
        return null;
    }

    return normalizedPrice;
}
