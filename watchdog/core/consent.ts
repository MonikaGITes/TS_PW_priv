import { Page } from 'playwright';

export async function handleCookieConsent(page: Page): Promise<void> {
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
                } catch { }
            }
        }
    } catch { }
}
