import SwiftUI

struct ProductCardView: View {
    let product: ProductResult
    @Environment(\.openURL) var openURL
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: {
            if let url = URL(string: product.url) {
                openURL(url)
            }
        }) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(product.name)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.textColor)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    
                    if product.isAvailable {
                        Text("\(product.price ?? 0, specifier: "%.2f") zł")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(themeManager.primaryColor)
                    } else {
                        Text("UNAVAILABLE")
                            .font(.body)
                            .foregroundColor(themeManager.secondaryTextColor)
                    }
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 8) {
                    VerdictBadgeView(verdict: product.verdict)
                    
                    if product.discount != "brak" {
                        Text(product.discount)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.secondaryColor)
                            .padding(4)
                            .background(themeManager.secondaryColor.opacity(0.1))
                            .cornerRadius(4)
                    }
                }
            }
            .padding()
            .background(themeManager.cardBackground)
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(themeManager.cardBorder, lineWidth: 1)
            )
            .shadow(color: themeManager.cardShadow, radius: 10, x: 0, y: 4)
        }
        .buttonStyle(PlainButtonStyle()) // To avoid default List highlighting if used in List, though we are using ScrollView
    }
}
