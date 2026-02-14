# Stage 3: CI Delivery Layer

**Status**: IN PROGRESS  
**Goal**: Automate WatchDog using GitHub Actions as a scheduled execution engine.

---

## ⚠️ Architecture Pivot

**Date**: 2026-02-14

The strategy has shifted from a **Long-Running Backend Server** to a **Scheduled CI Execution Model**.

-   **OLD (Deprecated)**: Express API Server waiting for requests.
-   **NEW (Active)**: GitHub Actions job running `xvfb` headful browser and committing results to the repo.

See [Stage 3 CI Delivery Model](Stage_3_CI_Delivery_Model.md) for full details.

---

## Foundation (Preserved)

This stage builds upon the **immutable foundation** of Stage 2.

-   **Core Logic is Frozen**: The modules in `watchdog/core/` (`availability.ts`, `consent.ts`, `price-extractor.ts`) must NOT be modified.
-   **Headful Execution is Mandatory**: CI must use `xvfb`.

## Milestones

| Milestone | Name | Status | Description |
| :--- | :--- | :--- | :--- |
| **[3.0 (Legacy)](Milestone_3_0_API_Contract_DEPRECATED.md)** | **API Contract** | ⛔ DEPRECATED | *Historical reference only.* |
| **[3.1 (Legacy)](Milestone_3_1_API_Skeleton_DEPRECATED.md)** | **API Skeleton** | ⛔ DEPRECATED | *Historical reference only.* |
| **[3.2](Stage_3_CI_Delivery_Model.md)** | **CI Architecture** | ✅ DEFINED | Definition of the JSON-based data flow and CI lifecycle. |
| **[3.3](Walkthrough_3_3_Data_Migration.md)** | **Data Migration** | ✅ COMPLETE | Migrated hardcoded `products.ts` to `data/users/MonMar/products_MonMar.json`. |
| **[3.4](Walkthrough_3_4_CI_Implementation.md)** | **CI Implementation** | ✅ COMPLETE | Configuration of GitHub Actions for headful execution and branch persistence. |

## Current Status

-   **Architecture Defined**: The [CI Delivery Model](Stage_3_CI_Delivery_Model.md) is the source of truth.
-   **Milestone 3.4**: CI Implementation is COMPLETE.
-   **Stage 3 Status**: Stage 3 is now functionally COMPLETE.

---

## Completed Milestones

### Milestone 3.4 — CI Implementation (COMPLETE)

**Implemented**:
-   **Workflow**: `.github/workflows/check-price-headful.yml` created.
-   **Execution**: Runs `npm run watchdog` via `xvfb-run` (Headful simulation).
-   **Schedule**: Runs twice daily (4:00 AM & 4:00 PM UTC).
-   **Persistence**: Commits `results_MonMar.json` to isolated `data` branch.
-   **Cleanup**: Removed deprecated API server code and documentation.

**Branch Strategy**:
-   `main`: Contains source code and configuration.
-   `data`: target branch for CI updates (prevents merge loops).


### Milestone 3.3 — Data Migration (COMPLETE)

**Implemented**:
-   **JSON Data Store**: Created `data/users/MonMar/products_MonMar.json`.
-   **JSON Output**: Generates `data/users/MonMar/results_MonMar.json`.
-   **Orchestrator Update**: `watchdog/checkMyPrices.ts` now reads/writes JSON.
-   **Behavior**: Verified identical execution and results logic.

