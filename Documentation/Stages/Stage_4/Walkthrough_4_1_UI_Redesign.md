# Stage 4.1: UI Redesign Walkthrough

## Overview
This document details the transition from the basic SwiftUI List prototype to the "Premium Gradient" design system. The goal was to eliminate the generic system look and replace it with a custom, high-end aesthetic while maintaining the exact same data architecture.

## 1. Design Decisions

### Global Gradient Background
**Decision**: Replace the default `NavigationView` white/black background with a full-screen linear gradient.
**Why**:
- Creates a distinct "brand" feel immediately.
- Eliminates the "stock iOS app" appearance.
- **Implementation**: Used `ZStack` with `Theme.mainGradient.ignoresSafeArea()` as the bottom layer.

### Custom Card vs. List
**Decision**: Abandon `List` in favor of `ScrollView` + `LazyVStack`.
**Why**:
- `List` enforces system separators, cell insets, and selection styles that are hard to override cleanly.
- `ScrollView` provides complete control over spacing, padding, and animations.
- **Result**: `ProductCardView` now floats freely with its own shadows and border, rather than being a row in a table.

### Verdict Styling
**Decision**: Use distinct visual weights for different verdicts.
**Why**: user needs to scan quickly for "BUY".
- **BUY**: Gradient fill + White Text (High prominence).
- **WAIT**: Translucent purple background + Purple Text (Medium prominence).
- **UNAVAILABLE**: Gray/Transparent (Low prominence).

## 2. Technical Implementation

### Theme System
Introduced `Theme.swift` to centralize colors. No hardcoded hex values in views.
```swift
struct Theme {
    static let primary = Color(hex: "3C6FF7")
    static let secondary = Color(hex: "8448F7")
    static let mainGradient = LinearGradient(...)
}
```

### URL Handling
Added `openURL` environment capability to `ProductCardView`. This keeps the navigation stack clean (no push navigation to a detail view) and allows quick checking of the product in Safari.

### Architecture Preservation
**Crucial**: The `NetworkManager` and `ProductModel` were **untouched**. The UI layer simply consumes the same `products` array.
- **Data Flow**: `NetworkManager` -> `ContentView` -> `ScrollView` -> `ProductCardView`.

## 3. Verification
- **Build**: Compiles with Swift 6 / iOS 15+.
- **Data**: Still fetches from `raw.githubusercontent.com`.
- **UI**:
    - Safe areas are respected by the content but filled by the background.
    - Pull-to-refresh works natively in `ScrollView`.
    - Loading states overlay the content correctly.
