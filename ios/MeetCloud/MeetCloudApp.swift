import SwiftUI
import MapKit

@main
struct MeetCloudApp: App {
    var body: some Scene {
        WindowGroup {
            MeetCloudRootView()
                .preferredColorScheme(.dark)
        }
    }
}

private enum MeetCloudStyle {
    static let background = Color(red: 0.04, green: 0.06, blue: 0.12)
    static let surface = Color(red: 0.09, green: 0.12, blue: 0.20)
    static let violet = Color(red: 0.61, green: 0.24, blue: 0.94)
    static let magenta = Color(red: 0.88, green: 0.16, blue: 0.82)
}

private enum RootTab: Hashable {
    case clouds, chats, settings
}

struct MeetCloudRootView: View {
    @State private var selectedTab: RootTab = .clouds

    var body: some View {
        TabView(selection: $selectedTab) {
            CloudsHomeView()
                .tabItem { Label("Облака", systemImage: "cloud.fill") }
                .tag(RootTab.clouds)
            PlaceholderFeatureView(
                title: "Чаты",
                subtitle: "Твои разговоры — здесь",
                symbol: "paperplane.fill"
            )
            .tabItem { Label("Чаты", systemImage: "paperplane.fill") }
            .tag(RootTab.chats)
            PlaceholderFeatureView(
                title: "Настройки",
                subtitle: "Настрой приложение под себя",
                symbol: "gearshape.fill"
            )
            .tabItem { Label("Настройки", systemImage: "gearshape.fill") }
            .tag(RootTab.settings)
        }
        .tint(MeetCloudStyle.violet)
    }
}

private struct CloudsHomeView: View {
    @State private var showCreateCloud = false
    @State private var cameraPosition: MapCameraPosition = .automatic

    var body: some View {
        ZStack {
            MeetCloudStyle.background.ignoresSafeArea()
            VStack(spacing: 0) {
                HStack(spacing: 10) {
                    Image(systemName: "cloud.fill")
                        .font(.system(size: 26, weight: .bold))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [MeetCloudStyle.violet, MeetCloudStyle.magenta],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    Text("MeetCloud")
                        .font(.system(size: 25, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Spacer()
                    Image(systemName: "person.crop.circle")
                        .font(.system(size: 26))
                        .foregroundStyle(.white.opacity(0.8))
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 14)

                Map(position: $cameraPosition)
                    .mapStyle(.standard(elevation: .realistic))
                    .overlay(alignment: .top) {
                        Text("Карта облаков подключится к API")
                            .font(.footnote.weight(.medium))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .background(.ultraThinMaterial, in: Capsule())
                            .padding(.top, 14)
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                    .padding(.horizontal, 12)

                VStack(spacing: 12) {
                    Text("Найди компанию своему желанию")
                        .font(.system(size: 17, weight: .semibold, design: .rounded))
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)

                    Button { showCreateCloud = true } label: {
                        Label("Создать облако", systemImage: "plus")
                            .font(.system(size: 16, weight: .bold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 15)
                            .background(
                                LinearGradient(
                                    colors: [MeetCloudStyle.violet, MeetCloudStyle.magenta],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                ),
                                in: RoundedRectangle(cornerRadius: 14)
                            )
                    }
                    .foregroundStyle(.white)
                }
                .padding(18)
            }
        }
        .sheet(isPresented: $showCreateCloud) {
            CreateCloudPlaceholder()
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
    }
}

private struct CreateCloudPlaceholder: View {
    @Environment(\.dismiss) private var dismiss
    @State private var wish = ""

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 18) {
                Text("Опиши, чем хочешь заняться")
                    .font(.title2.bold())
                TextField("Например: хочу выпить кофе", text: $wish, axis: .vertical)
                    .lineLimit(3...5)
                    .textFieldStyle(.roundedBorder)
                Text("Публикация появится после подключения авторизации и API.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                Spacer()
                Button("Продолжить") { dismiss() }
                    .buttonStyle(.borderedProminent)
                    .tint(MeetCloudStyle.violet)
                    .disabled(wish.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding(20)
            .navigationTitle("Новое облако")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Закрыть") { dismiss() }
                }
            }
        }
    }
}

private struct PlaceholderFeatureView: View {
    let title: String
    let subtitle: String
    let symbol: String

    var body: some View {
        ZStack {
            MeetCloudStyle.background.ignoresSafeArea()
            VStack(spacing: 14) {
                Image(systemName: symbol)
                    .font(.system(size: 34, weight: .medium))
                    .foregroundStyle(MeetCloudStyle.violet)
                Text(title)
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                Text(subtitle)
                    .font(.body)
                    .foregroundStyle(.white.opacity(0.7))
            }
            .padding()
        }
    }
}
