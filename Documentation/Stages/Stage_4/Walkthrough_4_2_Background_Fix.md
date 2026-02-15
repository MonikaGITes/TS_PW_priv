# Stage 4.2 Critical Fix: Background System

## Overview
This patch resolves a critical issue where the application could enter an irrecoverable state (Black Screen) if the stored theme enumeration was invalid or if background assets failed to load.

## 1. Safety Mechanisms

### Safe Persistence
**Problem**: Storing Swift Enums directly in `@AppStorage` can crash the UI if the raw value changes or becomes corrupted.
**Fix**: `ThemeManager` now stores specific raw strings and uses a safe computed property with a fallback:
```swift
var selectedTheme: AppTheme {
    get { AppTheme(rawValue: selectedThemeRaw) ?? .darkViolet } // Fallback to safe default
}
```

### Visual Fallback
**Problem**: Missing assets caused the `Image` view to collapse, leaving the screen black.
**Fix**: `BackgroundView` now sits on top of a permanent Gradient Layer. If the image fails to render, the user sees a pleasant gradient instead of a void.

### Recovery Mode
**Feature**: Long Press (5s) on the "WatchDog" header title.
**Action**: Resets the theme to `.darkViolet`.
**Use Case**: Allows users to fix their state without reinstalling the app if they somehow get stuck in a broken theme.

## 2. Verification
- **Test**: Force-set invalid string in UserDefaults.
- **Result**: App immediately falls back to `.darkViolet`.
- **Test**: Rename background asset.
- **Result**: App shows fallback gradient; text remains readable.
