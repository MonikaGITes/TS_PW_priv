# Stage 4.2: UI Architecture Fix (Hard Reset)

## Overview
This update corrects a fundamental architectural flaw in the previous UI implementation where "Theme" and "Wallpaper" were treated as separate states. This separation caused visual inconsistencies (e.g., light text on light backgrounds) and complex state management.

The new "Atomic Theme" architecture treats a Theme as a complete visual package: **Background + Color Palette + Assets**.

## 1. Architectural Changes

### 🚫 Wallpaper Toggle Removed
**Decision**: Removed the ability to toggle wallpapers independently of the theme.
**Why**:
- Prevents invalid states (e.g., Dark Theme colors on a Light Wallpaper).
- Simplifies `ThemeManager` state machine.
- Ensures the designer's intended look is always preserved.

### ⚛️ Atomic Themes
Top-level `AppTheme` enum now dictates everything:
```swift
enum AppTheme {
    case darkViolet // Uses "dark_violet_background" + White Text + Purple Accents
    case auroraGlass // Uses "aurora_background" + Black Text + Teal Accents
}
```

### 🖼️ Seamless Header
**Refactor**: `HeaderView` no longer has any background color.
**Implementation**: It sits in a `VStack` on top of the `BackgroundView` (via `ZStack`), allowing the transparent glass effect to work naturally without manual blurring or hacking navigation bars.

## 2. Technical details

### Asset Cleanup
Renamed malformed asset files:
- `aurora_backcground` -> `aurora_background`
- `dark_violet _backgriund` -> `dark_violet_background`

### Icon Usage
Header now uses `Image("icon")` directly, referencing the specific logo asset for the app header, separate from the system App Icon.

## 3. Verification
- **State Consistency**: Switching to "Aurora Glass" instantly changes background AND text color handling.
- **Visuals**: No black bars at the top. The background flows behind the status bar and header.
- **Performance**: Zero-cost theme switching (no re-rendering of complex view hierarchies, just state updates).
