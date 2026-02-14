# Milestone 3.2: Architecture - CI Delivery Model

**Status**: DEFINED  
**Goal**: Design the file structure and execution flow for the CI-based WatchDog engine.

---

## 1. Architectural Pivot

This milestone replaces the previous "Server + Browser Manager" design.
-   **Old**: `POST /v1/analyze` (Synchronous API)
-   **New**: `npm run watchdog` (Batch CLI) -> Commit JSON -> Push Notification

## 2. File Structure

We will restructure `data/` to support multi-user isolation.

```text
watchdog/
├── core/                  # (Frozen) Domain Logic
├── config/                # (Frozen) Global Config
├── checkMyPrices.ts       # (Active) CLI Entry Point
└── data/                  # [NEW] Data Layer
    └── users/
        └── {UserID}/
            ├── products_{UserID}.json
            └── results_{UserID}.json
```

## 3. Execution Flow

1.  **Input Reading**:
    -   `checkMyPrices.ts` will accept a `--user {UserID}` argument.
    -   It reads `data/users/{UserID}/products_{UserID}.json`.
2.  **Processing**:
    -   Iterates through products (Headful Playwright).
    -   Reuses `watchdog/core/` modules.
3.  **Output Generation**:
    -   Writes `data/users/{UserID}/results_{UserID}.json`.
4.  **Notification**:
    -   Sends email/push (using existing `notifications` config or per-user config).

## 4. Next Steps

-   **Refactor**: Modify `checkMyPrices.ts` to support JSON input instead of hardcoded `products.ts`.
-   **CI Config**: create `.github/workflows/check-price-xvfb.yml`.
