🔒 PROMPT — Milestone 2.2
You are working on the WatchDog repository.

THIS PROJECT ALREADY WORKS.
Your responsibility is to PRESERVE BEHAVIOR.

Before doing anything else, you MUST:
1. Read README.md
2. Read Documentation/ARCHITECTURE.md
3. Read Documentation/Stages/Stage_0_1/summary.md
4. Read Documentation/Stages/Stage_2/Stage_2_overview.md
5. Read Documentation/Stages/Stage_2/Milestone_2_0.md
6. Read Documentation/Stages/Stage_2/Milestone_2_1.md

Do NOT assume missing context.
Do NOT invent alternative architectures.
Do NOT refactor.
Do NOT optimize.

---

TARGET MILESTONE: Stage 2.2  
NAME: Availability Detection Extraction

TASK TYPE: EXTRACTION ONLY.

Your task is to extract the product availability detection logic
from watchdog/checkMyPrices.ts into a new module.

You MUST:
- extract availability detection logic line-for-line
- move it into: watchdog/core/availability.ts
- preserve keyword lists and attribute checks exactly
- preserve DOM scanning logic exactly
- preserve return semantics exactly

You MUST NOT:
- change keywords
- change text normalization
- change attribute priority
- introduce enums or abstractions
- change control flow
- introduce new conditions
- add error handling
- interpret availability differently

checkMyPrices.ts must:
- continue to work identically
- only delegate availability checking to the new module

---

BEFORE CODING:
- list files to be created
- list files that must not change

AFTER CODING:
- explain precisely how behavior equivalence is preserved
- confirm that availability = false does NOT change price extraction yet

IMPORTANT:
- Do NOT add logic for missing prices
- Do NOT short-circuit price extraction
- Do NOT add exceptions

This milestone extracts logic ONLY.
Behavior changes will be handled in later milestones.

If anything is unclear:
STOP and ask questions.

Behavior preservation is the highest priority.

Generate walktrogh for this milestone

Walkthrough: Milestone 2.2 - Availability Detection Extraction
Goal
Extract availability detection logic from 
checkMyPrices.ts
 into a dedicated core module 
core/availability.ts
 without changing behavior.

Changes
1. Created 
watchdog/core/availability.ts
Copied logic from 
checkMyPrices.ts
 (lines 45-76).
Wrapped in export async function checkAvailability(page: Page): Promise<boolean>.
Preserved 
normalize
 helper function inside evaluate call.
Preserved exact allowed Set: ['do koszyka', 'dodaj do koszyka', 'kup teraz'].
Preserved DOM querying logic (checking innerText, aria-label, title, img.alt).
Preserved return semantics: returns boolean directly, defaults to false on error.
2. Updated 
watchdog/checkMyPrices.ts
Removed the inline try-catch block for availability.
Added import: import { checkAvailability } from './core/availability';.
Replaced block with: const available = await checkAvailability(page);.
Behavior Equivalence
The behavior is preserved because:

Logic Identity: The code inside the new module is a literal copy of the original logic.
State Isolation: The logic only depends on the page object and local variables defined within the function scope.
Return Value: The available variable in 
checkMyPrices.ts
 receives the exact same boolean result as before.
Verification
checkMyPrices.ts
 logic flow remains unchanged.
checkAvailability
 executes the same browser evaluation.

Status: COMPLETE  
 