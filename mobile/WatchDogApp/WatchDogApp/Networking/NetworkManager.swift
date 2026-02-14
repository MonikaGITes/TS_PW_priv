import Foundation
import Combine

class NetworkManager: ObservableObject {
    @Published var products: [ProductResult] = []
    @Published var lastUpdated: String = ""
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil
    
    // Raw GitHub URL for MonMar's results
    // NOTE: using 'refs/heads/data' to target the data branch
    private let dataUrl = "https://raw.githubusercontent.com/MonikaGITes/TS_PW_priv/data/data/users/MonMar/results_MonMar.json"
    
    @MainActor
    func fetchData() async {
        isLoading = true
        errorMessage = nil
        
        guard let url = URL(string: dataUrl) else {
            errorMessage = "Invalid URL"
            isLoading = false
            return
        }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let decoded = try JSONDecoder().decode(WatchDogResult.self, from: data)
            
            self.products = decoded.results
            self.lastUpdated = decoded.timestamp
            self.isLoading = false
        } catch {
            self.errorMessage = "Failed to load data: \(error.localizedDescription)"
            self.isLoading = false
        }
    }
}
