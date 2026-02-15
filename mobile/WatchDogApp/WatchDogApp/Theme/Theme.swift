import SwiftUI

struct Theme {
    static let primary = Color(hex: "3C6FF7")
    static let secondary = Color(hex: "8448F7")
    static let backgroundDark = Color(hex: "0E0E16")
    static let textPrimary = Color(hex: "FFFFFF")
    static let textSecondary = Color(hex: "BEBEDC")
    
    static let mainGradient = LinearGradient(
        gradient: Gradient(colors: [primary, secondary]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let cardBackground = Color.white.opacity(0.08)
    static let cardBorder = secondary
    static let cardShadow = secondary.opacity(0.5) // Soft purple glow
}
