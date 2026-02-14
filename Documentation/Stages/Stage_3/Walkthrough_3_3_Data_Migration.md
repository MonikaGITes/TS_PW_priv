# Walkthrough: Milestone 3.3 - Data Migration

**Status**: COMPLETE  
**Goal**: Move product configuration to JSON to enable multi-user support and decouple data from code.

---

## 1. Why JSON?

In Stage 3 (CI Delivery Layer), we need a way to support multiple users without modifying the source code (`products.ts`).
JSON was chosen because:
-   **Simplicity**: Easy to read/write for both humans and CI scripts.
-   **Isolation**: Each user gets their own directory (`data/users/{User}/`).
-   **Git-friendly**: Results are committed back to the repo, creating a history trail (via git history, even if the file is overwritten).
-   **Mobile Integration**: The mobile app can fetch raw JSON files directly from GitHub.

## 2. Implementation

### Directory Structure
```text
data/
└── users/
    └── MonMar/
        ├── products_MonMar.json  # Input
        └── results_MonMar.json   # Output
```

### Orchestration Changes
`watchdog/checkMyPrices.ts` was refactored to:
1.  **Read**: Load `products_MonMar.json`.
2.  **Map**: Hydrate `selector` from `SHOP_CONFIGS` (in `selectors.ts`) based on the `shop` field.
3.  **Execute**: Run the standard Stage 2 core logic (`extractPrice`, `checkAvailability`).
4.  **Write**: Save `results_MonMar.json`.

### Behavior Preservation
-   **Core Logic**: `watchdog/core/` was **NOT** touched.
-   **Emails**: Notifications are still sent after JSON generation.
-   **Selectors**: The critical selector contracts remain in `watchdog/config/selectors.ts`.

## 3. Results Verification

Local execution confirmed:
-   4 products processed.
-   JSON output matches Stage 3 spec.
-   `UNAVAILABLE` status correctly handled.
-   `price: null` semantics preserved.

## 4. Migration Path to Database

If we ever need a real DB (PostgreSQL/Supabase):
1.  Replace `fs.readFileSync` with `db.query('SELECT * FROM products')`.
2.  Replace `fs.writeFileSync` with `db.query('INSERT INTO results...')`.
The *runtime product structure* used by the orchestration layer remains the same, making this future migration straightforward.

---

**Next Step**: Milestone 3.4 (GitHub Actions Configuration).
