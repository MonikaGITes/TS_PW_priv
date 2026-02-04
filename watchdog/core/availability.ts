import { Page } from 'playwright';

export async function checkAvailability(page: Page): Promise<boolean> {
    try {
        return await page.evaluate(() => {
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
        return false;
    }
}
