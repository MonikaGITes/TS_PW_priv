WatchDog – Architecture Overview

Purpose

WatchDog is a TypeScript + Playwright–based backend system for automated price monitoring of e‑commerce products. It uses a real (headful) browser and explicit CSS selector contracts to extract prices deterministically from the DOM and deliver notifications via email.

This document is the single source of architectural truth for the project. It consolidates all walkthroughs, decisions, and constraints established so far, so that both humans and future AI agents (e.g. Gemini) can safely continue development without rediscovering context.

⸻

What WatchDog IS
	•	A DOM reader, not a scraper in the classical sense
	•	A backend service, not a test suite
	•	A deterministic system based on CSS selector contracts
	•	A headful browser automation workflow (cookies, JS, captcha tolerated)

What WatchDog IS NOT
	•	❌ An OCR-based system
	•	❌ A screenshot parser
	•	❌ A heuristic or regex-driven crawler
	•	❌ A mobile application

WatchDog does not guess prices. It reads them from explicitly defined locations in the DOM.

⸻

Core Design Principles
	1.	CSS Selectors as Contracts
CSS selectors are treated as frontend contracts. If a selector changes, it is a conscious breakage, not silent corruption.
	2.	Stability Over Abstraction
Working behavior is preserved above all else. No refactor is allowed if it risks altering runtime output.
	3.	Explicit Configuration
All implicit assumptions (selectors, availability logic, cookie consent, notifications) are documented explicitly in configuration files.
	4.	Headful Browser Execution
Headless-only approaches are insufficient. Real browser execution is required to reliably access final DOM state.
	5.	Single Source of Truth
Configuration lives in code. CI/CD provides execution and secrets, not business rules.

⸻

Current Architecture (Post Stage 1)

TS_PW_priv/
├── watchdog/
│   ├── checkMyPrices.ts        # Main orchestration (still monolithic)
│   ├── sendEmail.ts            # Email delivery service
│   └── config/                 # Explicit configuration layer
│       ├── products.ts         # Product definitions
│       ├── selectors.ts        # Shop-level selector & behavior contracts
│       └── notifications.ts   # Email recipients & metadata
│
├── .github/workflows/           # CI/CD automation
│   └── check-price.yml
│
├── playwright.config.ts
├── package.json
└── README.md

Configuration Layer

The watchdog/config/ folder is a critical architectural boundary:
	•	products.ts
Defines what is monitored (URLs, thresholds, associated shop config).
	•	selectors.ts
Defines how data is read per shop:
	•	price selectors
	•	parsing strategies (standard vs split price)
	•	availability detection
	•	cookie consent rules
	•	notifications.ts
Defines who is notified and with what metadata.

This layer exists to make implicit contracts explicit.

⸻

Price Reading Model

The current price-reading logic operates as follows:
	1.	Open product URL in a new isolated browser context
	2.	Handle cookie consent (DOM + iframes)
	3.	Determine product availability via button text heuristics
	4.	Read price using shop-specific CSS selector strategy:
	•	Standard text extraction
	•	Split-price extraction (e.g. MediaExpert .whole + .cents)
	5.	Normalize price value
	6.	Compare against threshold
	7.	Append result to email report

No OCR, screenshots, or heuristic price guessing is involved.

⸻

Completed Stages

Stage 0 – Validation (DONE)
	•	Existing WatchDog execution verified locally
	•	CSS-based price extraction confirmed working
	•	Playwright headful execution validated
	•	Email sending verified (with environment variables)

Stage 1 – Configuration & Explicit Contracts (DONE)
	•	Configuration separated into watchdog/config
	•	Product definitions moved out of orchestration
	•	Selector and shop behavior contracts documented
	•	Email recipients removed from CI/CD and moved to code
	•	README added with run instructions
	•	Runtime behavior preserved exactly

⸻

Known Constraints (DO NOT BREAK)
	•	Playwright must run in headful mode
	•	Existing CSS selectors must not be altered silently
	•	MediaExpert split-price logic is site-specific and required
	•	Availability detection relies on Polish e‑commerce conventions
	•	Email authentication credentials remain in environment variables

⸻

Failed Approaches (Historical Context)

The following approaches were tested earlier and intentionally abandoned:
	•	OCR-based price detection
	•	Screenshot parsing
	•	Heuristic DOM scanning without explicit selectors

These approaches were unstable, brittle, and are out of scope permanently.

⸻

Future Direction

Stage 2 – Core Extraction (NEXT)

Planned but not yet executed:
	•	Extract reusable core modules from checkMyPrices.ts:
	•	cookie consent handling
	•	availability detection
	•	price extraction
	•	Preserve logic line-for-line
	•	Enable reuse by:
	•	scheduled jobs
	•	API endpoints
	•	future mobile clients

Stage 3 – Backend API
	•	Expose WatchDog functionality via HTTP API
	•	Mobile app becomes a client, not a scraper

⸻

Key Statement for Future Contributors / AI Agents

WatchDog is a data-reading backend system, not a test suite and not a crawler.
Preserve behavior first. Abstract later.

Any change that alters runtime behavior must be intentional, documented, and validated against existing outputs.

⸻

Addendum – Configuration Layer Walkthrough (Consolidated)

This section supplements the architecture with concrete implementation facts extracted from the completed configuration-layer walkthrough.

Configuration Layer – Implemented Scope

The following configuration files are now authoritative sources of truth:
	•	watchdog/config/selectors.ts
	•	Defines ShopConfig interfaces and shop-specific selector contracts
	•	Contains registries for:
	•	price extraction strategies (standard text vs split price)
	•	cookie consent keywords
	•	availability button detection
	•	promotion detection selectors
	•	Encodes previously implicit assumptions explicitly
	•	watchdog/config/products.ts
	•	Holds the list of monitored products
	•	Each product binds:
	•	URL
	•	price threshold
	•	associated shop configuration
	•	This file is the only place where monitored products are defined
	•	watchdog/config/notifications.ts
	•	Centralizes email notification metadata
	•	Defines:
	•	recipients
	•	subject
	•	sender display name
	•	Email authentication credentials intentionally remain in environment variables

CI / Configuration Boundary
	•	CI/CD (.github/workflows/check-price.yml) is responsible only for:
	•	execution scheduling
	•	providing secrets (EMAIL_USER, EMAIL_PASS)
	•	CI/CD does not define business configuration (recipients, selectors, products)

This boundary is intentional and must be preserved.

Backward Compatibility Guarantee

All configuration changes were introduced with zero runtime behavior changes:
	•	checkMyPrices.ts logic remains functionally identical
	•	Playwright execution mode is unchanged
	•	CSS selectors and parsing logic are unchanged
	•	Output format and email content are unchanged

The system after Stage 1 is behaviorally equivalent to the pre-refactor version.

Architectural Implications

As of now, WatchDog:
	•	Has a stable, explicit configuration model
	•	Is no longer coupled to CI environment variables for business rules
	•	Can be safely consumed by:
	•	future API layers
	•	scheduled jobs
	•	mobile clients

Constraint Reinforcement

The following constraints are now architectural invariants:
	•	No OCR or screenshot-based extraction may be reintroduced
	•	All price extraction must be selector-driven
	•	Configuration must live in watchdog/config
	•	Runtime behavior preservation is mandatory for all refactors

Readiness Assessment

With the configuration layer completed:
	•	Stage 0 (Validation) – COMPLETE
	•	Stage 1 (Configuration & Explicit Contracts) – COMPLETE

The project is structurally ready for:
	•	Stage 2: Core logic extraction (without behavior changes)

No other intermediate stage is required or recommended.

⸻

Architectural Governance – Canonical Rules (“Architecture as Law”)

This document is binding. It is not descriptive only; it is normative.

Any future work on WatchDog must comply with the rules below. If code and this document conflict, this document wins.

⸻

1. What WatchDog IS (Present Tense)

WatchDog is a TypeScript + Playwright backend system whose sole responsibility is to read business-critical price data from e-commerce websites.

It operates by:
	•	running a real (headful) browser,
	•	waiting for the final DOM state,
	•	extracting prices using explicit, shop-specific CSS selector contracts,
	•	validating prices against defined thresholds,
	•	emitting results via notification channels (currently email).

WatchDog is deterministic. It does not infer, guess, or approximate prices.

⸻

2. What WatchDog MUST BECOME (Future Tense)

WatchDog must evolve into a general-purpose price-monitoring backend service that:
	•	exposes its functionality via a stable API,
	•	serves multiple clients (mobile app, web UI, CLI),
	•	keeps all extraction logic server-side,
	•	treats clients as read-only consumers, never as scrapers.

The mobile application is not WatchDog. It is a client of WatchDog.

At no point may extraction logic move into the client layer.

⸻

3. Milestones Between 1 and 2 (Non-Optional)

Evolution from the current system to the target system happens only through the milestones below. Skipping a milestone is forbidden.

Milestone 0 – Validation (COMPLETE)
	•	Existing behavior verified
	•	CSS-based price extraction confirmed
	•	Headful Playwright execution validated

Milestone 1 – Configuration & Explicit Contracts (COMPLETE)
	•	Configuration separated into watchdog/config
	•	Selector and shop behavior contracts made explicit
	•	CI/CD decoupled from business configuration

Milestone 2 – Core Logic Extraction (NEXT)
	•	Extract reusable core modules from orchestration:
	•	cookie consent handling
	•	availability detection
	•	price extraction
	•	Preserve behavior line-for-line
	•	No abstraction, no optimization

Milestone 3 – Backend API
	•	Introduce HTTP API layer
	•	Core logic reused without modification
	•	No new extraction logic introduced

Milestone 4 – Client Applications
	•	Mobile app and/or web UI consume API only
	•	No DOM access, no browser automation client-side

⸻

4. Current Position (Authoritative)

Current state:
	•	Milestone 0 – COMPLETE
	•	Milestone 1 – COMPLETE
	•	Milestone 2 – NOT STARTED

Any work performed must explicitly target Milestone 2 and must not assume later milestones.

⸻

5. Update Rule (Critical)

This document is append-only.

After completing any milestone:
	•	a new section must be added documenting:
	•	what was completed
	•	what files changed
	•	what constraints were preserved
	•	previous sections must NOT be rewritten or removed

This rule exists to preserve architectural continuity and prevent silent redefinition of system intent.

⸻

6. Absolute Prohibitions

The following are permanently forbidden:
	•	OCR-based extraction
	•	screenshot parsing
	•	heuristic price guessing
	•	silent selector generalization
	•	moving extraction logic into clients

Re-introducing any of the above constitutes an architectural violation.

⸻

7. Final Authority Statement

WatchDog is a backend data reader.
Stability precedes abstraction.
Behavior preservation precedes elegance.

All future decisions must be evaluated against this statement.