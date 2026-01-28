//selectors.ts
/**
 * Explicit shop selector contracts
 * 
 * This file documents all CSS selectors and extraction strategies
 * currently used for price monitoring across different e-commerce sites.
 */

/**
 * Shop-specific configuration for price extraction
 */
export interface ShopConfig {
    /** Unique shop identifier */
    shopId: string;

    /** Price extraction strategy */
    priceStrategy: 'standard' | 'split-price';

    /** CSS selector or XPath for price element */
    priceSelector: string;

    /** Optional: Selector for promotion info */
    promotionSelector?: string;
}

/**
 * Registry of shop-specific selector configurations
 */
export const SHOP_CONFIGS: Record<string, ShopConfig> = {
    'lurso': {
        shopId: 'lurso',
        priceStrategy: 'standard',
        priceSelector: '#box_productfull .basket .price em',
        promotionSelector: 'div.save-info',
    },

    'skin79': {
        shopId: 'skin79',
        priceStrategy: 'standard',
        priceSelector: 'div.price span.current',
    },

    'zalando': {
        shopId: 'zalando',
        priceStrategy: 'standard',
        priceSelector: 'xpath=//*[@data-testid="pdp-price-container"]//p//span[1]',
    },

    'mediaexpert': {
        shopId: 'mediaexpert',
        priceStrategy: 'split-price',
        priceSelector: 'div.main-price',
        promotionSelector: 'div.save-info',
    },
};

/**
 * Cookie consent handling configuration
 */
export const CONSENT_CONFIG = {
    /** Keywords to identify cookie consent buttons */
    keywords: ['akceptuj', 'zaakceptuj', 'accept', 'zgadzam', 'allow'],

    /** Whether to check iframes for consent buttons */
    checkIframes: true,
};

/**
 * Product availability detection configuration
 */
export const AVAILABILITY_CONFIG = {
    /** Keywords to identify "add to cart" buttons */
    buttonKeywords: ['do koszyka', 'dodaj do koszyka', 'kup teraz'],

    /** Button attributes to check for keywords */
    attributesToCheck: ['innerText', 'aria-label', 'title', 'img.alt'],
};

/**
 * Promotion detection configuration
 */
export const PROMOTION_CONFIG = {
    /** CSS selector for promotion information */
    selector: 'div.save-info',

    /** Regex pattern to extract discount percentage */
    discountPattern: /taniej\s*o\s*(\d+)%/i,
};
