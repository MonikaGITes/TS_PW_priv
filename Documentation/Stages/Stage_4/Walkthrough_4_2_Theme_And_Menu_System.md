# Stage 4.2: Theme & Menu System Walkthrough

## Overview
This update introduces a sophisticated UI architecture that breaks away from standard iOS navigation patterns to offer a fully custom, theme-able experience. The goal was to unify the header with the background and provide user customization while preparing the codebase for cross-platform feature parity.

## 1. Architecture Changes

### Removed System Navigation Bar
**Decision**: Replaced `NavigationView` title bar with a custom `HeaderView`.
**Why**:
- System bars have hard lines/backgrounds that break the immersive gradient feel.
- Allows the header to float over the background seamlessly.
- Provides total control over menu placement and styling.

### ThemeManager & MVVM
**New Component**: `ThemeManager` (ObservableObject)
**Role**: Single source of truth for all colors and assets.
- **Persistence**: Uses `@AppStorage` to save user preferences across launches.
- **Injection**: Injected via `.environmentObject` at the root (`WatchDogApp`), making it accessible to any view without passing props.

## 2. New Features

### 🎨 Theming System
Two distinct themes are now available:
1.  **Premium Dark** (Default): The signature dark gradient (#3C6FF7 → #8448F7).
2.  **Aurora Glass** (Light): A frosted, airy aesthetic with teal/purple pastel gradients and high-contrast dark text.

### 🖼️ Wallpapers
Users can now toggle between the generative gradient and a static `bg.jpeg` wallpaper. This logic is handled by `BackgroundView` which sits at the bottom of the `ZStack`.

### 🌐 External Navigation Service
**Component**: `ExternalNavigationService`
**Purpose**: Abstracts the logic of leaving the app.
- **Why**: Preparing for Android where intent handling differs.
- **Snatch Directory**: A placeholder menu item that prepares the UI for the future "Product Directory" feature, currently opening a browser link.

## 3. Directory Structure
```
WatchDogApp/
├── Managers/
│   └── ThemeManager.swift       <-- NEW
├── Services/
│   └── ExternalNavigationService.swift <-- NEW
├── Views/
│   ├── BackgroundView.swift     <-- NEW
│   ├── HeaderView.swift         <-- NEW
│   └── ContentView.swift        <-- UPDATED
└── Theme/
    └── Theme.swift              <-- PRESERVED (Base constants)
```

## 4. Verification
- **Compilation**: Clean build.
- **Data Safety**: `NetworkManager` was completely untouched.
- **UI Safety**:
    - Menu allows switching themes instantly.
    - App restarts maintain the selected theme.
    - Pull-to-refresh works under the custom header.
