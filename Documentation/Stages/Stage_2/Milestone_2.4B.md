🔒 PROMPT — Milestone 2.4B (Follow-Up Fix)

You are working on the WatchDog repository.

This is a FOLLOW-UP FIX to Stage 2.4.

Scope is EXTREMELY LIMITED.

You MUST:
- modify ONLY watchdog/checkMyPrices.ts
- adjust result formatting for unavailable products

New rule:
- If availability === false:
  - DO NOT assign price = 0
  - DO NOT format or display any price
  - Display ONLY the unavailable status line (existing style)
  - Keep URL output

You MUST NOT:
- change any core module
- change extractPrice behavior
- change availability detection
- change selectors
- change parsing
- change logging for available products

After change:
- unavailable products have NO price displayed
- available products behave IDENTICALLY

Generate a short walkthrough describing the fix.

---

# Walkthrough: Stage 2.4 Follow-up (Formatting Fix)

## Goal
Adjust the formatting of unavailable products to suppress price display entirely, rather than showing "0 zł".

## Changes in `watchdog/checkMyPrices.ts`

### 1. `formatProductInfo`
-   **Signature Update**: Accepting `price: number | null` instead of `number`.
-   **Logic Update**:
    -   If `price === null`: Returns short format `🍀 ${name} - ${verdict}\n👉 ${url}\n`.
    -   If `price !== null`: Returns standard format with price and promotion.

### 2. `formatVerdict`
-   **Signature Update**: Accepting `price: number | null`.
-   **Safe Fallback**: Uses `price ?? Infinity` for threshold check (though technically unreachable when `!available`, as it returns early).

### 3. Execution Loop
-   **Initialization**: `let normalizedPrice: number | null = null` (was `0`).
-   **Usage**: Wraps logic to ensure `normalizedPrice` remains `null` when `available` is false.

## Result
-   **Available**: `🍀 Name - aktualna cena 💰: 99 zł...` (Identical behavior)
-   **Unavailable**: `🍀 Name - ⛔ NIEDOSTĘPNY 😞` (Improved behavior, no misleading "0 zł")

## Constraints
-   No core modules were modified.
-   No logic flow changes for available products.

Status: COMPLETE
Behavior validated via code review.
