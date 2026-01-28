Stage 0 & Stage 1 – Summary (Canonical)

This document is the canonical summary of Stage 0 and Stage 1.
It replaces all previous walkthroughs, notes, and resolved artifacts for these stages.

⸻

Purpose of This Summary

Stages 0 and 1 were exploratory and stabilizing in nature. They generated multiple walkthroughs and intermediate artifacts. This file exists to:
	•	condense all prior material into a single source of truth
	•	preserve key architectural decisions
	•	clearly mark these stages as closed

Anything not reflected here is considered historical context only.

⸻

Stage 0 – Validation (COMPLETE)

Goal

Verify that the existing WatchDog implementation:
	•	works reliably
	•	uses the correct technical approach
	•	is worth further architectural investment

What Was Validated
	•	WatchDog runs successfully using TypeScript + Playwright
	•	Browser execution must be headful to reach final DOM state
	•	Prices are extracted deterministically via CSS selectors
	•	Cookie consent handling works in real-world conditions
	•	Product availability is detected via DOM button text
	•	Email notification flow works (with correct environment variables)

Explicitly Rejected Approaches

During validation, the following approaches were evaluated and rejected:
	•	OCR-based price reading
	•	Screenshot analysis
	•	Heuristic or regex-only parsing

These approaches were found to be unstable and are permanently out of scope.

Outcome

Stage 0 confirmed that the existing system:
	•	is technically sound
	•	follows the correct extraction model
	•	should be evolved rather than replaced

Stage 0 is closed.

⸻

Stage 1 – Configuration & Explicit Contracts (COMPLETE)

Goal

Stabilize the system by making all implicit assumptions explicit and separating configuration from execution logic.

What Was Done
	•	Introduced a dedicated configuration layer under watchdog/config
	•	Moved product definitions into configuration
	•	Made shop-specific selector and parsing rules explicit
	•	Centralized notification configuration in code
	•	Removed business configuration from CI/CD
	•	Preserved runtime behavior exactly

Key Files Introduced
	•	watchdog/config/products.ts
	•	watchdog/config/selectors.ts
	•	watchdog/config/notifications.ts

Architectural Impact

After Stage 1:
	•	CSS selectors are treated as explicit frontend contracts
	•	Business configuration lives in code, not infrastructure
	•	CI/CD is responsible only for execution and secrets
	•	The system is safe to consume by future API layers

Behavior Guarantee
	•	No logic changes were introduced
	•	No selector changes were introduced
	•	Output and execution flow remain identical to pre-Stage 1

Stage 1 is closed.

⸻

Final Status
	•	Stage 0: COMPLETE
	•	Stage 1: COMPLETE
	•	Stage 2: NOT STARTED

All future work must assume Stage 0 and Stage 1 as fixed and immutable.