# Walkthrough: Stage 3 Refinement - Products Deprecation

**Status**: COMPLETE  
**Goal**: Remove legacy configuration (`products.ts`) and enforce JSON-only architecture to support Professional Monitoring features.

---

## 1. Why Deprecate `products.ts`?

Originally, WatchDog was a single-user script with hardcoded products.
As we moved to the **CI Delivery Model** (Stage 3), we introduced per-user JSON files (`data/users/{User}/products_{User}.json`).

Keeping `products.ts` created ambiguity: "Where do I add a product?"
**Decision**: Delete `products.ts`. JSON is now the specific source of truth.

## 2. Professional Monitoring Toggle

We introduced a `disabled` flag in the JSON schema.
This allows a user to "pause" monitoring for a specific product without deleting it from the configuration.

### JSON Schema Update
```json
{
  "id": "...",
  "shop": "...",
  "disabled": true  // <--- NEW: If true, product is skipped
}
```

### Implementation
`checkMyPrices.ts` now filters the product list:
```typescript
jsonProducts.filter(p => p.disabled !== true)
```

## 3. Benefits

1.  **Clean Architecture**: No dead code.
2.  **User Control**: Users can pause/resume monitoring via JSON edits.
3.  **CI Efficiency**: Disabled products don't waste CI execution time.
