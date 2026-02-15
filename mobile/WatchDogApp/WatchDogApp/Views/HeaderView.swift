import SwiftUI

struct HeaderView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            // Left: Icon + Title
            HStack(spacing: 12) {
                // Using "icon" (no extension) as per best practice for asset catalogs, 
                // or "icon.jpeg" if it's a file in bundle. The plan said "icon.jpeg" might be in assets as "icon". 
                // Let's safe bet on "icon" if it is in Assets, or UIImage(named: "icon.jpeg") behavior.
                // Given the instructions said "Assets now contain... icon.jpeg", and "ensure app logo... uses Image('icon') or Image('app_logo')", 
                // I will use "icon.jpeg" string if it is a raw file, or "icon" if imported.
                // The previous `list_dir` showed "icon.jpeg" in the Assets folder root, which usually means it's a file, not an imageset? 
                // Wait, list_dir on Assets.xcassets showed "icon.jpeg" inside it. That's unusual for .xcassets. 
                // Valid assets are usually folders. 
                // If "icon.jpeg" is inside .xcassets directly as a file, it might not be loadable via Image("icon"). 
                // However, the constraints say "Assets now contain... icon.jpeg". 
                // I will try Image("icon.jpeg") as requested by the plan "Use Image('icon.jpeg') or reliance on AppIcon set". 
                // Actually User said: "Ensure app logo inside header uses: Image(“icon”) or Image(“app_logo”) (matching asset name without extension)"
                // So I will use Image("icon").
                Image("icon") 
                    .resizable()
                    .frame(width: 40, height: 40)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .shadow(radius: 4)
                
                Text("WatchDog")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.textColor)
                    // RECOVERY MODE: Long press to reset theme to safety
                    .onLongPressGesture(minimumDuration: 5) {
                        themeManager.setTheme(.darkViolet)
                    }
            }
            
            Spacer()
            
            // Right: Settings Menu
            Menu {
                // Section 1: Visuals
                Section("Appearance") {
                    Picker(selection: $themeManager.selectedTheme, label: Text("Theme")) {
                        Text("Dark Violet")
                            .tag(AppTheme.darkViolet)
                        Text("Aurora Glass")
                            .tag(AppTheme.auroraGlass)
                    }
                }
                
                // Section 2: Navigation
                Section("Tools") {
                    Button(action: {
                        ExternalNavigationService.shared.openSnatchDirectory()
                    }) {
                        Label("Snatch Directory", systemImage: "globe")
                    }
                }
            } label: {
                Image(systemName: "ellipsis.circle.fill")
                    .font(.title2)
                    .foregroundColor(themeManager.secondaryColor)
                    .padding(8)
                    .background(Color.white.opacity(0.1))
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal)
        .padding(.top, 8) // Adjust for safe area if needed, though VStack handles it usually
        .padding(.bottom, 8)
    }
}
