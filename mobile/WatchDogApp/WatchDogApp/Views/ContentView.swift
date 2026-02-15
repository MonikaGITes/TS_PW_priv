import SwiftUI

struct ContentView: View {
    @StateObject private var networkManager = NetworkManager()
    
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        ZStack {
            // Layer 1: Global Background
            BackgroundView()
            
            // Layer 2: Content
            VStack(spacing: 0) {
                // Unified Header (No system nav bar)
                HeaderView()
                
                if networkManager.isLoading && networkManager.products.isEmpty {
                    Spacer()
                    ProgressView("Fetching prices...")
                        .tint(themeManager.textColor)
                        .scaleEffect(1.5)
                    Spacer()
                } else if let error = networkManager.errorMessage, networkManager.products.isEmpty {
                    Spacer()
                    VStack {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundColor(themeManager.secondaryColor)
                        Text(error)
                            .multilineTextAlignment(.center)
                            .padding()
                            .foregroundColor(themeManager.textColor)
                        Button("Retry") {
                            Task { await networkManager.fetchData() }
                        }
                        .padding()
                        .background(themeManager.secondaryColor)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                    Spacer()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(networkManager.products) { product in
                                ProductCardView(product: product)
                            }
                        }
                        .padding()
                    }
                    .refreshable {
                        await networkManager.fetchData()
                    }
                }
            }
        }
        .task {
            await networkManager.fetchData()
        }
        // Force preferred scheme based on theme for system elements (like alerts)
        .preferredColorScheme(themeManager.selectedTheme == .darkViolet ? .dark : .light)
    }
}
