🔒 PROMPT — Milestone 2.4

You are working on the WatchDog TypeScript + Playwright repository.

THIS PROJECT ALREADY WORKS.
Your responsibility is to PRESERVE BEHAVIOR.

Before doing anything else, you MUST:
1. Read README.md
2. Read Documentation/ARCHITECTURE.md
3. Read Documentation/Stages/Stage_0_1/summary.md
4. Read Documentation/Stages/Stage_2/Stage_2_overview.md
5. Read Documentation/Stages/Stage_2/Milestone_2_0.md
6. Read Documentation/Stages/Stage_2/Milestone_2_1.md
7. Read Documentation/Stages/Stage_2/Milestone_2_2.md
8. Read Documentation/Stages/Stage_2/Milestone_2_3.md

Do NOT assume missing context.
Do NOT invent alternative architectures.
Do NOT refactor core logic.
Do NOT optimize.

---

TARGET MILESTONE: Stage 2.4  
NAME: Orchestrator Thinning & Result Composition

TASK TYPE: ORCHESTRATION ONLY.

Your task is to refactor watchdog/checkMyPrices.ts so that it acts ONLY as:
- execution loop
- call sequence
- result composition
- output formatting

All domain logic MUST already live in core modules:
- core/consent.ts
- core/availability.ts
- core/price-extractor.ts

You MUST:
- keep execution order IDENTICAL
- keep output format IDENTICAL for available products
- keep email content IDENTICAL for available products
- keep looping and timing behavior IDENTICAL

---

CRITICAL NEW RESPONSIBILITY (ALLOWED IN THIS MILESTONE):

You MAY now:
- interpret the combination of:
  - availability result (boolean)
  - price extraction result (number | null)

Specifically:
- If availability === false:
  - DO NOT treat null price as a parsing error
  - DO NOT log "Nie udało się sparsować ceny"
  - DO NOT attempt to interpret price
  - Report the product as UNAVAILABLE (using existing messaging style)

- If availability === true AND price === null:
  - This remains a genuine parsing failure
  - Existing error logging behavior MUST be preserved

IMPORTANT:
- No new exceptions
- No throwing errors
- No retries
- No selector changes
- No parsing changes

---

YOU MUST NOT:
- change logic inside core modules
- change return types of core modules
- introduce new abstractions
- move logic back into core modules
- change business thresholds
- change product ordering
- change email sending behavior

---

BEFORE CODING:
- list files to be modified
- explicitly confirm that NO core module files will be changed

AFTER CODING:
- explain how behavior is preserved for available products
- explain why the "failed to parse price" message no longer appears for unavailable products
- confirm that selector stability assumptions remain unchanged

Generate a walkthrough artifact for this milestone.

If anything is unclear:
STOP and ask questions.

Behavior preservation is the highest priority.

Generate walktrogh for this milestone

Walkthrough: Milestone 2.4 - Orchestrator Thinning & Result Composition
Goal
Refactor 
checkMyPrices.ts
 to act purely as an orchestrator, composing results from core modules (availability, price-extractor, consent) and implementing business rules for result combination.

Changes
1. Updated 
watchdog/checkMyPrices.ts
Refactored the main execution loop.
Old Logic: Always checked availability, then always tried to extract price. specific "continue" on failure meant unavailable products often disappeared from the report if they also lacked a price.
New Logic:
Check available.
IF available === true:
Call 
extractPrice
. If it fails (logs error), continue (skip product).
Check promotions.
IF available === false:
Skip 
extractPrice
 (avoiding false "parsing error" logs).
Set normalizedPrice = 0.
Set discountPercent = 'brak'.
Format and report the product.
Behavior Analysis
Available Products:

Path: available -> 
checkAvailability()
 (true) -> 
extractPrice()
 (value) -> Formatting.
Result: Identical. Logic flow and outputs are exactly as before.
Unavailable Products (New Behavior):

Path: 
checkAvailability()
 (false) -> Skip Extraction -> Output "NIEDOSTĘPNY" with price 0 zł.
Result: Improved. Previously, if an unavailable product had no price (e.g. out of stock placeholder), the script might have errored on price extraction and skipped the product entirely. Now, it correctly reports it as "Unavailable" without logging an error.
Selector Stability:

No selectors were changed.
The 
extractPrice
 module is still the authority on price reading.
Core Module Integrity
watchdog/core/consent.ts
: Unchanged
watchdog/core/availability.ts
: Unchanged
watchdog/core/price-extractor.ts
: Unchanged
Conclusion
The orchestrator now cleanly separates flow control from domain logic. The "Failed to parse price" error is now correctly reserved for available products where a price should represent but is missing, removing noise from the logs.

Milestone 2.4 Complete.

I have refactored watchdog/checkMyPrices.ts to compose results from the core modules.

Logic: Now skips price extraction for unavailable products (defaulting to 0 zł), preventing false "parsing error" logs.
Reporting: Unavailable products are now explicitly reported in the email summary.
Core Modules: None were modified.
Artifact: Walkthrough generated.
Stage 2 is now technically complete (Milestones 2.0 - 2.4). I recommend running the full script to verify end-to-end behavior before marking the entire Stage as done.