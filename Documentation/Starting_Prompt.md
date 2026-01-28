You are working on an existing TypeScript + Playwright repository called WatchDog.

THIS PROJECT ALREADY WORKS.
Your primary responsibility is to PRESERVE BEHAVIOR.

Before doing anything else, you MUST:

1. Read README.md
2. Read docs/ARCHITECTURE.md
3. Infer system intent ONLY from code and those documents

Do NOT assume missing context.
Do NOT invent alternative architectures.
Do NOT suggest OCR, screenshots, or heuristic parsing.
Those approaches are explicitly rejected.

---

PROJECT DEFINITION (NON-NEGOTIABLE)

WatchDog is:
- a backend data-reading system
- using Playwright with headful browser execution
- extracting prices deterministically via explicit CSS selector contracts
- prioritizing stability over abstraction

WatchDog is NOT:
- a test suite
- a crawler
- an OCR-based system
- a mobile application

CSS selectors are treated as FRONTEND CONTRACTS.
Breaking them silently is unacceptable.

---

CURRENT STATE (ALREADY COMPLETED)

- Stage 0: Validation of existing behavior – DONE
- Stage 1: Configuration & explicit contracts – DONE

Configuration lives in:
- watchdog/config/products.ts
- watchdog/config/selectors.ts
- watchdog/config/notifications.ts

Runtime behavior must remain IDENTICAL to the current implementation.

---

YOUR ONLY ALLOWED NEXT STEP

Stage 2 – Core Logic Extraction

You may ONLY:
- extract existing logic from checkMyPrices.ts into reusable modules
- do this line-for-line, behavior-preserving
- keep Playwright behavior, selectors, parsing, and output identical

Specifically:
- cookie consent handling
- availability detection
- price extraction

You may NOT:
- refactor for cleanliness
- introduce new abstractions
- change control flow
- optimize logic
- generalize selectors
- alter price parsing rules

---

WORKING MODE

Before writing any code:
- produce a short plan (bullet points)
- explicitly state what files will be created
- explicitly state what files will NOT change

After implementation:
- explain how behavior equivalence is preserved
- list risks, if any

If something is unclear:
STOP and ask questions.
Do NOT guess.

This repository is the single source of truth.
Behavior preservation is the highest priority.