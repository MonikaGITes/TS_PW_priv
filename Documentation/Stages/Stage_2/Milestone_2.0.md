🔒 PROMPT — Milestone 2.0

You are working on the WatchDog TypeScript + Playwright repository.

THIS PROJECT ALREADY WORKS.
Your responsibility is to PRESERVE BEHAVIOR.

Before doing anything else, you MUST:
1. Read README.md
2. Read Documentation/ARCHITECTURE.md
3. Read Documentation/Stages/Stage_0_1/summary.md
4. Read Documentation/Stages/Stage_2/Stage_2_overview.md

Do NOT assume missing context.
Do NOT invent alternative architectures.
Do NOT suggest OCR, screenshots, or heuristic parsing.
Those approaches are explicitly rejected.

---

TARGET MILESTONE: Stage 2 – Milestone 2.0  
NAME: Boundary Identification

TASK TYPE: ANALYSIS ONLY. NO CODE CHANGES.

Your task is to analyze:
- watchdog/checkMyPrices.ts

And identify existing responsibility boundaries.

You MUST:
- read the file top to bottom
- group code into logical responsibility blocks
- give each block a clear name
- describe what the block does (1–2 sentences)
- specify exact line ranges for each block

Examples of responsibility blocks (do NOT limit yourself to these):
- browser lifecycle
- cookie consent handling
- availability detection
- price extraction
- promotion detection
- result formatting
- notification dispatch

You MUST NOT:
- refactor
- change code
- suggest improvements
- rename variables
- introduce abstractions
- reorder logic

This milestone is documentation-only.
It prepares the next extraction milestones.

---

OUTPUT FORMAT (STRICT):

- A bullet list of responsibility blocks
- For each block:
  - Name
  - Line range
  - Short description

If anything is unclear:
STOP and ask questions.
Do NOT guess.

Behavior preservation is the highest priority.

----------------
result:
Here is the boundary analysis for watchdog/checkMyPrices.ts as required for Milestone 2.0.

Imports & Configuration
Line range: 1–4
Short description: Imports system dependencies (Playwright, Nodemailer) and product configuration from the explicit config layer.
Helper Utilities (Formatting/Parsing)
Line range: 6–25
Short description: Pure functions for parsing discount text and formatting the final output string; no side effects.
Browser Lifecycle (Initialization)
Line range: 27–31
Short description: Launches the headful Chromium browser instance with specific configuration (slowMo, headless: false).
Orchestration (Loop & Navigation)
Line range: 34–37
Short description: Iterates through the product list, creates isolated browser contexts, and navigates to target URLs.
Cookie Consent Handling
Line range: 39–81
Short description: Heuristic logic to locate and click explicit consent buttons (e.g., "akceptuj", "zgadzam") in the main DOM and nested iframes.
Availability Detection
Line range: 84–116
Short description: Determines purchasability by scanning for specific "add to cart" button keywords (do koszyka, kup teraz).
Price Extraction
Line range: 118–147
Short description: Extracts and normalizes the price using selector contracts, including the specific split-price parsing logic for MediaExpert.
Promotion Detection
Line range: 149–156
Short description: Attempts to read promotion text from div.save-info if present, without failing on absence.
Result Formatting & Aggregation
Line range: 156–170
Short description: Calculates the final verdict, formats the product report line, logs it, and aggregates it for the email.
Browser Lifecycle (Cleanup)
Line range: 172–175 (specifically 172 and 175)
Short description: Closes the individual page context and finally the browser instance after the loop.
Notification Dispatch
Line range: 176
Short description: Sends the aggregated report text via the email service.
Execution Root
Line range: 179
Short description: Top-level async call to start the process.

Status: COMPLETE  
Validated against checkMyPrices.ts – no behavior changes.