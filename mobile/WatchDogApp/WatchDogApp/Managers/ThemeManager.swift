import SwiftUI
import Combine

enum AppTheme: String, CaseIterable {
    case darkViolet
    case auroraGlass
    
    var backgroundAssetName: String {
        switch self {
        case .darkViolet:
            return "dark_violet_background"
        case .auroraGlass:
            return "aurora_background"
        }
    }
}

class ThemeManager: ObservableObject {
    @AppStorage("selectedTheme") private var selectedThemeRaw: String = AppTheme.darkViolet.rawValue
    
    var selectedTheme: AppTheme {
        get { AppTheme(rawValue: selectedThemeRaw) ?? .darkViolet }
        set { selectedThemeRaw = newValue.rawValue }
    }
    
    // MARK: - Computed Colors
    
    var primaryColor: Color {
        switch selectedTheme {
        case .darkViolet:
            return Color(hex: "3C6FF7") // Strong Blue
        case .auroraGlass:
            return Color(hex: "007AFF") // Apple Blue
        }
    }
    
    var secondaryColor: Color {
        switch selectedTheme {
        case .darkViolet:
            return Color(hex: "8448F7") // Strong Purple
        case .auroraGlass:
            return Color(hex: "5AC8FA") // Teal/Blueish
        }
    }
    
    var textColor: Color {
        switch selectedTheme {
        case .darkViolet:
            return .white
        case .auroraGlass:
            return .black // High contrast for light theme
        }
    }
    
    var secondaryTextColor: Color {
        switch selectedTheme {
        case .darkViolet:
            return Color(hex: "BEBEDC")
        case .auroraGlass:
            return Color.gray
        }
    }
    
    var cardBackground: Color {
        switch selectedTheme {
        case .darkViolet:
            return Color.white.opacity(0.08)
        case .auroraGlass:
            return Color.white.opacity(0.6)
        }
    }
    
    var cardBorder: Color {
        switch selectedTheme {
        case .darkViolet:
            return secondaryColor
        case .auroraGlass:
            return Color.gray.opacity(0.3)
        }
    }
    
    var cardShadow: Color {
        switch selectedTheme {
        case .darkViolet:
            return secondaryColor.opacity(0.5)
        case .auroraGlass:
            return Color.black.opacity(0.1)
        }
    }
    
    // Helper to switch theme
    func setTheme(_ theme: AppTheme) {
        selectedTheme = theme
    }
}
