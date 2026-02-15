import SwiftUI

struct BackgroundView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        ZStack {
            // Fallback gradient (never black screen)
            LinearGradient(
                colors: [.black, .purple],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            Image(themeManager.selectedTheme.backgroundAssetName)
                .resizable()
                //.scaledToFill() // Ensure it covers the screen
                .ignoresSafeArea()
                .allowsHitTesting(false)
        }
    }
}
