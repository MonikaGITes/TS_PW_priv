# Walkthrough: Stage 3.2 Architecture Design

**Status**: COMPLETE  
**Goal**: Design the Playwright lifecycle for the backend server without writing implementation code.

---

## 1. Core Decisions

### Browser Strategy: Singleton
We chose a **Singleton Browser Instance** over per-request launching.
-   **Why**: Headful browsers are resource-heavy. Launching a new GUI window for every request would crash the server under load and make the local dev environment unusable.
-   **Trade-off**: A browser crash affects all active requests. We accept this risk and mitigate it with auto-restart logic.

### Context Strategy: Per-Request Isolation
We maintain strict isolation by creating a **New Context** for every request.
-   **Why**: Stage 2 logic assumes a fresh state (no cookies, no storage). We must preserve this behavior to avoid data cross-contamination or anti-fraud triggers.
-   **Flow**: `Receive Request` -> `Get Singleton Browser` -> `Create Context` -> `Run Logic` -> `Close Context`.

### Concurrency: Semaphores
We act conservatively with resources.
-   **Limit**: Max `3` concurrent browser contexts.
-   **Queue**: Excess requests wait.
-   **Timeout**: 30s execution limit (Playwright default), 5s queue limit.

---

## 2. Constraints Preserved

-   **Headful Execution**: The architecture explicitly supports and manages a headful browser instance.
-   **No Core Logic Change**: The design wraps `watchdog/core` modules without modifying them.
-   **Stage 2 Behavior**: By ensuring fresh contexts, we replicate the CLI batch behavior in a server environment.

---

## 3. File Structure Proposal

The following files will be created in the implementation phase:

1.  `watchdog/api/browser-manager.ts`:
    -   Singleton class.
    -   Manages `browser` instance.
    -   Handles `launch()`, `close()`, and `restart`.
    -   Implements concurrency semaphore.
2.  `watchdog/api/validation.ts`:
    -   Validates URLs against `selectors.ts` whitelist.

---

## 4. Next Steps

The architecture is defined. We are ready to proceed to **Implementation**.

**Upcoming Tasks**:
1.  Install `playwright` (already present, but verify types).
2.  Implement `BrowserManager`.
3.  Implement `/v1/analyze` using the manager.
