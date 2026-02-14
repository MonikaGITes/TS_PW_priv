# Stage 3: CI Delivery Model (Canonical)

**Status**: DEFINED  
**Type**: Architecture Decision Record (ADR)  
**Date**: 2026-02-14

---

## 1. Core Concept

WatchDog is a **Scheduled CI Engine**, not a backend server.

Instead of waiting for HTTP requests, WatchDog runs on a schedule (e.g., daily at 4:00 AM) inside GitHub Actions. It performs a full batch check of all configured products and commits the results back to the repository as JSON snapshots.

### The "Serverless" Data Flow
1.  **Trigger**: GitHub Actions Schedule (cron) or Manual Workflow Dispatch.
2.  **Execution**:
    -   Boots Ubuntu runner.
    -   Starts `xvfb` (Virtual Framebuffer) for **Headful Playwright**.
    -   Reads `products_{User}.json`.
    -   Runs `checkMyPrices.ts` logic.
3.  **Output**:
    -   Generates `results_{User}.json` (Snapshot).
    -   Sends Email/Push Notifications immediately.
4.  **Persistence**:
    -   `git commit && git push` the updated JSON files back to the repo.
    -   Mobile App pulls `results_{User}.json` raw from GitHub (or GitHub Pages).

---

## 2. Multiuser Data Structure

The system supports multiple users via directory isolation in `data/users/`.

```text
data/
└── users/
    ├── MonMar/                  # Active User
    │   ├── products_MonMar.json # INPUT: List of URLs & Thresholds
    │   └── results_MonMar.json  # OUTPUT: Full status snapshot
    │
    └── GuestUser/               # Future/Example User
        ├── products_GuestUser.json
        └── results_GuestUser.json
```

### JSON Schemas

**`products_{User}.json`** (Source of Truth)
```json
[
  {
    "id": "uuid-or-hash",
    "name": "MacBook Pro",
    "url": "https://mediaexpert.pl/...",
    "targetPrice": 5000,
    "shop": "mediaexpert"
  }
]
```

**`results_{User}.json`** (Generated Snapshot)
```json
{
  "timestamp": "2026-02-14T12:00:00Z",
  "results": [
    {
      "name": "MacBook Pro",
      "url": "https://mediaexpert.pl/...",
      "price": 4999,
      "isAvailable": true,
      "verdict": "BUY",
      "discount": "brak"
    }
  ]
}
```

---

## 3. Headful Execution in CI

**Constraint**: WatchDog must use **Headful Mode** to avoid bot detection.
**Solution**: Use `xvfb-run` in GitHub Actions.

```yaml
# .github/workflows/check-price.yml snippet
- name: Run WatchDog Headful
  run: |
    xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" \
    npm run watchdog
```

This simulates a real physical display, bypassing simple "headless" checks.

---

## 4. Mobile Integration

The Mobile App (SwiftUI) is a **Read-Only Dashboard**.

-   **Read**: Fetches `results_{User}.json` via HTTP (Raw GitHub User Content or GitHub Pages).
-   **Write**: currently NO write access. Product management is done via Git commits (editing `products.json`).
-   **Notifications**: The CI job sends the push/email. The app does not poll.

---

## 5. Migration Path (Future)

If the JSON model hits scaling limits (e.g., >1000 users or merge conflicts):

1.  **Repo -> DB**: Replace `data/users/` file reading with a database query (Supabase/Firebase).
2.  **Git Push -> API POST**: Replace `git commit` with an API call to save results.
3.  **App Read**: App switches from fetching JSON to querying the DB.

*Current decision: JSON-in-Repo is sufficient for < 10 users and zero-cost infrastructure.*

---

## 6. Deprecation Notice

The **HTTP Backend Server (Express)** approach (Milestones 3.0, 3.1) is **ABANDONED**.
-   Do not run `node server.ts`.
-   Do not implement `BrowserManager`.
-   Those files remain for historical reference but are not part of the active release.
