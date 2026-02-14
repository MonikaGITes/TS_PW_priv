import SwiftUI

struct ContentView: View {
    @StateObject private var networkManager = NetworkManager()
    
    var body: some View {
        NavigationView {
            List(networkManager.products) { product in
                ProductRow(product: product)
            }
            .navigationTitle("WatchDog 🐶")
            .refreshable {
                await networkManager.fetchData()
            }
            .overlay {
                if networkManager.isLoading {
                    ProgressView("Fetching prices...")
                } else if let error = networkManager.errorMessage {
                    VStack {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundColor(.red)
                        Text(error)
                            .multilineTextAlignment(.center)
                            .padding()
                        Button("Retry") {
                            Task { await networkManager.fetchData() }
                        }
                    }
                }
            }
        }
        .task {
            await networkManager.fetchData()
        }
    }
}

struct ProductRow: View {
    let product: ProductResult
    
    var statusColor: Color {
        switch product.verdict {
        case "BUY": return .green
        case "WAIT": return .orange
        case "UNAVAILABLE": return .gray
        default: return .primary
        }
    }
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(product.name)
                    .font(.headline)
                    .lineLimit(2)
                
                if product.isAvailable {
                    Text("\(product.price ?? 0, specifier: "%.2f") zł")
                        .font(.title3)
                        .bold()
                        .foregroundColor(statusColor)
                } else {
                    Text("UNAVAILABLE")
                        .font(.body)
                        .foregroundColor(.gray)
                }
            }
            Spacer()
            
            VStack(alignment: .trailing) {
                Text(product.verdict)
                    .font(.caption)
                    .padding(6)
                    .background(statusColor.opacity(0.2))
                    .cornerRadius(8)
                
                if product.discount != "brak" {
                    Text(product.discount)
                        .font(.caption)
                        .foregroundColor(.red)
                }
            }
        }
        .padding(.vertical, 4)
    }
}
