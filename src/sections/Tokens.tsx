import { CodeBlock, Section } from '../components/doc'
import { feelings, neutrals, radii, spacing } from '../tokens'

const hex = (h: string) => `0x${h.slice(1).toUpperCase()}`

const swift = `import SwiftUI

// MARK: - Colour ———————————————————————————————————————————————

extension Color {
    /// Adaptive colour from light and dark sRGB hex values.
    init(light: UInt32, dark: UInt32) {
        self.init(uiColor: UIColor { trait in
            let v = trait.userInterfaceStyle == .dark ? dark : light
            return UIColor(red: CGFloat((v >> 16) & 0xFF) / 255,
                           green: CGFloat((v >> 8) & 0xFF) / 255,
                           blue: CGFloat(v & 0xFF) / 255, alpha: 1)
        })
    }
    init(_ v: UInt32) { self.init(light: v, dark: v) }
}

enum Palette {
${neutrals.map((c) => `    static let ${c.swift.padEnd(15)} = Color(light: ${hex(c.light)}, dark: ${hex(c.dark)})`).join('\n')}
    static let alert           = Color(light: 0xD92D20, dark: 0xFF5A4E)
}

/// Colour is reserved for feelings. Fills and glows only, never text.
enum Feeling: String, CaseIterable, Identifiable {
    case ${feelings.map((f) => f.key).join(', ')}
    var id: Self { self }

    var colors: (light: Color, base: Color, deep: Color) {
        switch self {
${feelings.map((f) => `        case .${f.key.padEnd(7)}: (Color(${hex(f.b)}), Color(${hex(f.a)}), Color(${hex(f.deep)}))`).join('\n')}
        }
    }

    var orb: RadialGradient {
        RadialGradient(colors: [colors.light, colors.base, colors.deep],
                       center: UnitPoint(x: 0.34, y: 0.28), startRadius: 0, endRadius: 90)
    }
}

// MARK: - Typography ————————————————————————————————————————————
// Always a text style, so Dynamic Type scales everything.

extension Font {
    static let tLargeTitle = Font.largeTitle.bold()
    static let tTitle      = Font.title.weight(.semibold)
    static let tTitle2     = Font.title2.weight(.semibold)
    static let tTitle3     = Font.title3.weight(.semibold)
}

/// Luminous text: lit from the top, with a faint glow in dark mode.
struct Lit: ViewModifier {
    @Environment(\\.colorScheme) private var scheme
    func body(content: Content) -> some View {
        content
            .foregroundStyle(.linearGradient(colors: [.primary, .primary.opacity(0.58)],
                                             startPoint: .init(x: 0.5, y: 0.3), endPoint: .bottom))
            .shadow(color: .white.opacity(scheme == .dark ? 0.14 : 0), radius: 9)
    }
}

/// A slow highlight that sweeps across once every 9 s. One per screen.
struct Shimmer: ViewModifier {
    @Environment(\\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase: CGFloat = -1

    func body(content: Content) -> some View {
        content.overlay {
            if !reduceMotion {
                LinearGradient(colors: [.clear, .white.opacity(0.9), .clear],
                               startPoint: .leading, endPoint: .trailing)
                    .frame(width: 120)
                    .offset(x: phase * 320)
                    .blendMode(.plusLighter)
                    .mask(content)
                    .onAppear {
                        withAnimation(.easeInOut(duration: 5).delay(4).repeatForever(autoreverses: false)) {
                            phase = 1
                        }
                    }
            }
        }
    }
}

extension View {
    func lit() -> some View { modifier(Lit()) }
    func shimmer() -> some View { modifier(Shimmer()) }
}

// MARK: - Space & shape ——————————————————————————————————————————

enum Space {
${spacing.map((s) => `    static let ${s.token.padEnd(3)}: CGFloat = ${s.value}`).join('\n')}
}

enum Radius {
${radii.map((r) => `    static let ${r.token.padEnd(5)}: CGFloat = ${r.value}`).join('\n')}
}

// MARK: - Motion ————————————————————————————————————————————————

extension Animation {
    static let snappy = Animation.spring(response: 0.30, dampingFraction: 0.86)
    static let smooth = Animation.spring(response: 0.45, dampingFraction: 1.00)
    static let gentle = Animation.spring(response: 0.80, dampingFraction: 1.00)
    static let drift  = Animation.easeInOut(duration: 9).repeatForever(autoreverses: true)
}

// MARK: - Press —————————————————————————————————————————————————

struct Pressable: ButtonStyle {
    @Environment(\\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.97 : 1)
            .opacity(configuration.isPressed ? 0.86 : 1)
            .animation(.snappy, value: configuration.isPressed)
    }
}

struct PrimaryButton: View {
    let title: LocalizedStringKey
    let action: () -> Void
    @Environment(\\.colorScheme) private var scheme

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundStyle(scheme == .dark ? Color.black : .white)
                .frame(maxWidth: .infinity, minHeight: 52)
                .background(Palette.label.gradient,
                            in: .rect(cornerRadius: Radius.md, style: .continuous))
        }
        .buttonStyle(Pressable())
    }
}

// MARK: - Example ———————————————————————————————————————————————

struct DaysTogether: View {
    let days: Int
    var body: some View {
        Text(days, format: .number)
            .font(.tTitle).monospacedDigit()
            .contentTransition(.numericText(value: Double(days)))
            .lit()
            .animation(.smooth, value: days)
    }
}`

export function Tokens() {
  return (
    <Section
      id="tokens"
      index="17 — SwiftUI"
      title="Ready for Xcode."
      intro="This is the same system as code. Drop it in as Dumbpling+Tokens.swift. It’s generated from the same source as this page, so design and engineering can’t drift apart."
    >
      <CodeBlock language="Dumbpling+Tokens.swift" code={swift} />
    </Section>
  )
}
