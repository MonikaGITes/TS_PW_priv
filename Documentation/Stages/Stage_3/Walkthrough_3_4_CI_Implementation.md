# Walkthrough: Milestone 3.4 - CI Implementation

**Status**: COMPLETE  
**Goal**: Configure GitHub Actions to run WatchDog in a headful environment and persist data without polluting the codebase.

---

## 1. CI Strategy

### Headful Execution in CI
WatchDog requires a **Headful Browser** (GUI) to avoid bot detection and ensure correct DOM rendering.
GitHub Actions runners are headless (CLI only).

**Solution**: `xvfb` (X Virtual Framebuffer).
It creates a virtual screen in memory, fooling Playwright into thinking it has a real monitor.
```bash
xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run watchdog
```

### Data Persistence
We generating `results_MonMar.json` inside an ephemeral runner. If we do nothing, the data disappears when the job ends.
We must commit it.

**Constraint**: Committing to `main` triggers a loop and pollutes the source history.
**Solution**: **Orphan Data Branch**.
-   The CI workflow checks out a specific branch: `data`.
-   It force-pushes the JSON file there.
-   The mobile app will read from `raw.githubusercontent.com/.../data/users/MonMar/results_MonMar.json`.

---

## 2. Workflow Definition
File: `.github/workflows/check-price-headful.yml`

1.  **Trigger**: Schedule (4:00 AM/PM) + Manual.
2.  **Environment**: `ubuntu-latest`.
3.  **Steps**:
    -   Checkout repo.
    -   Setup Node.js & dependencies.
    -   Install Playwright browsers.
    -   **Run WatchDog with xvfb**.
    -   Switch to `data` branch.
    -   Commit & Push.

---

## 3. Cleanup

To ensure a clean architecture, we removed the failed "API Server" experiment:
-   Deleted `watchdog/server.ts`.
-   Removed `express` dependencies.
-   Removed deprecated documentation.

---

## 4. Final Status

Stage 3 is now **COMPLETE**.
The system is a fully automated, headful, scheduled monitoring engine.

**Next Steps**:
-   Connect the Mobile App (Stage 4) to the JSON data source.
