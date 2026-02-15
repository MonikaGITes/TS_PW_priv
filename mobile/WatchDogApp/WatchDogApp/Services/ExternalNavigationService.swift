import UIKit
import SwiftUI

class ExternalNavigationService {
    static let shared = ExternalNavigationService()
    
    private init() {}
    
    func openUrl(_ url: URL) {
        UIApplication.shared.open(url)
    }
    
    func openSnatchDirectory() {
        // Placeholder for future Android parity / deep linking
        if let url = URL(string: "https://google.com") { // Temporary placeholder
            openUrl(url)
        }
    }
}
