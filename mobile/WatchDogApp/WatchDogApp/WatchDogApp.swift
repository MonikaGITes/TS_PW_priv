import SwiftUI
import Combine

@main
struct WatchDogApp: App {
    init() {
        UserDefaults.standard.removeObject(forKey: "selectedTheme")
    }
    @StateObject private var themeManager = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(themeManager)
        }
    }
}
