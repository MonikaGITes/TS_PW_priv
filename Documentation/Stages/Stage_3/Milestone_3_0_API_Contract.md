# Milestone 3.0: API Contract Definition

**Status**: DRAFT  
**Scope**: Definition of the HTTP interface for WatchDog as a backend service.

---

## 1. Overview & Principles

WatchDog attempts to act as a **Stateless Analysis Service** for product URLs.
The Client (Mobile App, CLI, Web Frontend) provides the *intent* (URL, Threshold), and the Backend employs the Core Logic (Playwright, Selector Contracts) to execute the check.

### Key Rules
1.  **Selectors are Backend Secrets**: The Client NEVER transmits CSS selectors. Matches are resolved server-side based on domain strategies.
2.  **Explicit Availability**: `available: false` is a valid state, distinct from "Error".
3.  **Nullable Price**: A product can be `available: true` but have `price: null` (Parsing Error), or `available: false` and `price: null` (Standard Unavailable).
4.  **No Heuristics**: The backend does not guess. If a domain is not explicitly supported (no strategy), the request fails.

---

## 2. Endpoints

### 2.1 Analyze Product
**POST** `/v1/analyze`

Performs a live, on-demand check of a specific product URL using the headless browser engine.

#### Request Headers
- `Content-Type: application/json`
- `Accept: application/json`

#### Request Body
```json
{
  "url": "https://www.mediaexpert.pl/...",
  "targetPrice": 5000, 
  "name": "MacBook Pro M5" 
}
```
-   `url` (Required): The full absolute URL to scan.
-   `targetPrice` (Optional): The user's desired threshold price (in standard currency units, e.g., PLN/GROSZ depending on backend norm, here assuming logic uses integers/floats as in Stage 2). used to calculate `verdict`.
-   `name` (Optional): A cosmetic label for logging/result context.

#### Response Body (200 OK)
```json
{
  "meta": {
    "url": "https://www.mediaexpert.pl/...",
    "timestamp": "2026-02-04T12:00:00Z",
    "shop": "mediaexpert"
  },
  "result": {
    "isAvailable": true,
    "price": 4999.99,
    "currency": "PLN",
    "discount": "brak",
    "verdict": "BUY" 
  },
  "status": "SUCCESS"
}
```

#### Response Fields
-   `result.isAvailable`: Boolean. Derived from `core/availability.ts`.
-   `result.price`: Number | Null. Derived from `core/price-extractor.ts`.
-   `result.discount`: String. Derived from existing promo logic ("brak", "-20%", etc.).
-   `result.verdict`: String. One of `["BUY", "WAIT", "UNAVAILABLE"]`.
    -   If `!isAvailable` -> "UNAVAILABLE"
    -   Else if `price <= targetPrice` -> "BUY"
    -   Else -> "WAIT"

#### Error Responses

**422 Unprocessable Entity - Unsupported Domain**
Backend cannot map the URL to a known selector strategy.
```json
{
  "error": "UNSUPPORTED_DOMAIN",
  "message": "No strategy found for domain: example.com"
}
```

**500 Internal Server Error - Execution Failure**
Playwright crashed or timeout occurred.
```json
{
  "error": "EXECUTION_FAILED",
  "message": "Browser context timeout"
}
```

---

## 3. Behavior Semantics

### 3.1 Availability vs Price
This API strictly mirrors the Stage 2.4 logic:

| Scene | `isAvailable` | `price` | Semantics |
| :--- | :--- | :--- | :--- |
| **Normal** | `true` | `120.00` | Product is buyable at this price. |
| **OOS** | `false` | `null` | Product is Out of Stock. Price extraction skipped (Stage 2.4 behavior). |
| **Parse Error** | `true` | `null` | Product is Buyable, but price extraction failed (DOM change?). This is an error state in the result. |

### 3.2 Synchronous Nature
-   This endpoint is **Synchronous**.
-   **Timeout**: The client should expect a response time of **2–10 seconds** (typical Playwright navigation + DOM scan).
-   **Concurrency**: The backend limits concurrent browser contexts. Requests may queue.

---

## 4. Non-Goals
-   **Database Storage**: This API does not save the result. It is a "Calculator". The Client is responsible for saving history.
-   **User Management**: No auth defined in this contract layer.
-   **Batch Processing**: To scan 100 items, the Client calls this endpoint 100 times (serially or parallel within rate limits), or a future Batch API will be designed.

---

## 5. Security & Validation
-   URL Validation: Must be absolute HTTP/HTTPS.
-   Domain Whitelist: Application only processes URLs for which it has explicit Selector Contracts (`watchdog/config/selectors.ts` + specific product overrides).

