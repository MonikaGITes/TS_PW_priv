import Foundation

struct WatchDogResult: Codable {
    let timestamp: String
    let results: [ProductResult]
}

struct ProductResult: Codable, Identifiable {
    var id: String { url } // URL is unique enough for now, or use name+url
    let name: String
    let url: String
    let price: Double?
    let isAvailable: Bool
    let verdict: String
    let discount: String
}
