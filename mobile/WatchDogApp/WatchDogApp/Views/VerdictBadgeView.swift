import SwiftUI

struct VerdictBadgeView: View {
    let verdict: String
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Text(verdict)
            .font(.caption.weight(.bold))
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(backgroundForVerdict)
            .foregroundColor(foregroundForVerdict)
            .cornerRadius(12) // Capsule shape approx
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(borderColor, lineWidth: 1)
            )
    }
    
    @ViewBuilder
    private var backgroundForVerdict: some View {
        if verdict == "BUY" {
            // BUY uses a gradient or strong color depending on theme
            // ThemeManager doesn't have a specific 'buyGradient', so we might need to add one or use primary/secondary
            // For now, let's use a gradient constructed from theme colors or a specific style
            LinearGradient(colors: [themeManager.primaryColor, themeManager.secondaryColor], startPoint: .topLeading, endPoint: .bottomTrailing)
        } else if verdict == "WAIT" {
            themeManager.secondaryColor.opacity(0.25)
        } else {
            Color.gray.opacity(0.2)
        }
    }
    
    private var foregroundForVerdict: Color {
        if verdict == "BUY" {
            return .white
        } else if verdict == "WAIT" {
            return themeManager.secondaryColor
        } else {
            return themeManager.secondaryTextColor
        }
    }
    
    private var borderColor: Color {
        if verdict == "WAIT" {
            return themeManager.secondaryColor.opacity(0.5)
        }
        return .clear
    }
}
