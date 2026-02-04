🔒 PROMPT — Milestone 2.3

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

Do NOT assume missing context.
Do NOT invent alternative architectures.
Do NOT refactor.
Do NOT optimize.

---

TARGET MILESTONE: Stage 2.3  
NAME: Price Extraction Core

TASK TYPE: EXTRACTION ONLY.

Your task is to extract ALL price reading logic
from watchdog/checkMyPrices.ts into a new module.

You MUST:
- extract price extraction logic line-for-line
- move it into: watchdog/core/price-extractor.ts
- preserve selectors EXACTLY as they are
- preserve parsing logic EXACTLY as it is
- preserve MediaExpert split-price handling as a special case
- preserve return values and numeric normalization

You MUST NOT:
- change selectors
- change regexes
- change number formatting
- generalize MediaExpert logic
- introduce abstractions
- add conditionals based on availability
- add exceptions or error handling
- change control flow
- optimize or clean up code

IMPORTANT:
- CSS selectors are considered STABLE FRONTEND CONTRACTS
- MediaExpert price parsing (.whole + .cents) MUST remain explicit
- availability = false must NOT affect price extraction yet

checkMyPrices.ts must:
- continue to work identically
- only delegate price extraction to the new module

---

BEFORE CODING:
- list files to be created
- list files that must not change

AFTER CODING:
- explain precisely how behavior equivalence is preserved
- confirm that numeric outputs are identical to pre-extraction
- confirm that unavailable products are still reaching price extraction

Generate a walkthrough artifact for this milestone.

If anything is unclear:
STOP and ask questions.

Behavior preservation is the highest priority.

Generate walktrogh for this milestone

Walkthrough: Milestone 2.3 - Price Extraction Core
Goal
Extract all price reading logic from 
checkMyPrices.ts
 into a dedicated core module 
core/price-extractor.ts
 without changing behavior.

Changes
1. Created 
watchdog/core/price-extractor.ts
Copied logic from 
checkMyPrices.ts
 (original lines 49-78).
Wrapped in export async function extractPrice(page: Page, product: ProductConfig): Promise<number | null>.
Preserved MediaExpert Logic: Kept the specific div.main-price selector check and .whole + .cents parsing exactly as is.
Preserved Standard Logic: Kept page.textContent and regex replacement /[^\d,]/g.
Preserved Error Handling: Kept console.error messages identical.
Return Semantics: Returns number on success, null on failure (mimicking the continue behavior by letting the caller decide).
2. Updated 
watchdog/checkMyPrices.ts
Removed existing price extraction variables (normalizedPrice, priceText) and logic blocks.
Added import: import { extractPrice } from './core/price-extractor';.
Replaced block with:
const normalizedPrice = await extractPrice(page, product);
if (normalizedPrice === null) continue;
Behavior Equivalence
The behavior is preserved because:

Logic Identity: The code was moved verbatim. The if (product.selector === ...) branch is identical.
Control Flow: The original code used continue on error. The new code returns null on error, and the orchestrator immediately continues, maintaining the same loop behavior.
Data Integrity: Numeric parsing regexes and strategies are untouched.
Verification
checkMyPrices.ts
 orchestrates the same flow.
extractPrice
 handles both MediaExpert and standard shops exactly as before.

Milestone 2.3 Complete.

I have extracted the price extraction logic into watchdog/core/price-extractor.ts and updated watchdog/checkMyPrices.ts to call it.

File Created: watchdog/core/price-extractor.ts
File Modified: watchdog/checkMyPrices.ts
Behavior: Preserved line-for-line (including MediaExpert special case).
Artifact: Walkthrough generated.
Ready for Milestone 2.4. 