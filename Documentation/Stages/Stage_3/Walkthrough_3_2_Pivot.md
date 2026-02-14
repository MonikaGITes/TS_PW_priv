# Walkthrough: Stage 3 Pivot - CI Delivery Layer

**Status**: COMPLETE  
**Goal**: Explain the architectural shift from HTTP API to CI Delivery Model.

---

## 1. Why The Change?

The previous direction (Long-Running HTTP Server) was found to be:
-   **Over-engineered**: For a simple monitoring tool, a 24/7 server is wasteful.
-   **Resource Heavy**: Managing a persistent headful browser is unnecessarily complex.
-   **Bot Risk**: Constant probing from a single static IP server is risky.

The **CI Delivery Model** fits better:
-   **Ephemeral**: Runs only when needed (e.g. once a day).
-   **Clean Slate**: Each run gets a fresh VM and IP (via GitHub Actions).
-   **Zero Cost**: Uses free tier CI minutes.

## 2. Key Decisions

### Data as Code
We moved from a potential database back to **JSON-in-Repo**.
-   **Pros**: Version control, audit trail, zero infrastructure to manage.
-   **Cons**: Write conflicts (mitigated by single-thread CI).

### Mobile Integration
The Mobile App becomes a **Passive Viewer**.
-   It simply fetches the raw JSON from the repo.
-   No need to build an API authentication layer.
-   No need to manage user sessions.

## 3. Constraints Preserved

-   **Headful Execution**: We will use `xvfb` in CI to run the browser headfully.
-   **Core Logic**: `watchdog/core/` remains untouched.
-   **Extraction**: Still uses CSS selector contracts.

## 4. Readiness

The architecture is defined. We are ready to implement the **Data Migration** (Milestone 3.3).
