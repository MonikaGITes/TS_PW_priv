🔒 PROMPT — Milestone 2.1

You are working on the WatchDog repository.

TARGET MILESTONE: Stage 2.1 – Cookie Consent Extraction

You MUST:
- extract cookie consent logic from checkMyPrices.ts
- move it into a new file: core/consent.ts
- preserve behavior line-for-line

You MUST NOT:
- change keywords
- change iframe handling
- refactor logic
- simplify code

checkMyPrices.ts must continue to work identically,
only calling the extracted function.

Before coding:
- list files to be created
- list files that must not change

After coding:
- explain how behavior equivalence is preserved

generate walktrogh for this milestone

Walkthrough: Milestone 2.1 - Cookie Consent Extraction
Goal
Extract cookie consent logic from 
checkMyPrices.ts
 into a dedicated core module 
core/consent.ts
 without changing behavior.

Changes
1. Created 
watchdog/core/consent.ts
Copied logic from 
checkMyPrices.ts
 lines 39-81.
Wrapped in export async function handleCookieConsent(page: Page): Promise<void>.
Preserved acceptWords array exactly: ['akceptuj', 'zaakceptuj', 'accept', 'zgadzam', 'allow'].
Preserved 
normalize
 helper function inside evaluate calls.
Preserved loop over main DOM and iframes.
Preserved try/catch error suppression blocks.
2. Updated 
watchdog/checkMyPrices.ts
Removed the inline try-catch block for cookies.
Added import: import { handleCookieConsent } from './core/consent';.
Added call: await handleCookieConsent(page); at the exact same location in the execution flow.
Behavior Equivalence
The behavior is preserved because:

Logic Identity: The code inside 
handleCookieConsent
 is a copy-paste of the original logic.
Context Identity: The function is called with the same page object at the same point in the script lifecycle (immediately after navigation).
Scope Containment: All variables used (acceptWords, 
normalize
) were local to the extracted block and are now local to the new function, preventing side effects.
Verification
checkMyPrices.ts
 orchestrates the same flow.
handleCookieConsent
 executes the same browser automation steps.

Status: COMPLETE  
normalize() scope verified manually.  
Runtime behavior preserved.  
Local run validated via npm run watchdog.