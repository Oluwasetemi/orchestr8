import { Syne } from "next/font/google"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${syne.variable} dark relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-4 py-16`}
      style={
        {
          backgroundColor: "#0d0b09",
          "--card": "#1b1815",
          "--card-foreground": "#f0ebe2",
          "--muted": "#131110",
          "--muted-foreground": "#5e5549",
          "--border": "rgba(255,255,255,0.08)",
          "--input": "oklch(0.18 0.01 90)",
          "--ring": "oklch(0.65 0.18 38)",
          "--primary": "oklch(0.65 0.18 38)",
          "--primary-foreground": "oklch(0.06 0 0)",
          "--destructive": "oklch(0.65 0.19 22)",
          "--destructive-foreground": "oklch(0.98 0 0)",
        } as React.CSSProperties
      }
    >
      {/* Dot-grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #2b2520 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.65,
        }}
      />

      {/* Amber radial glow from top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% -2%, rgba(215, 95, 15, 0.14) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="auth-logo relative z-10 select-none">
        <span
          className="text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-zinc-100"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          orchestr
          <span style={{ color: "oklch(0.68 0.19 38)" }}>8</span>
        </span>
      </div>

      {/* Card wrapper with amber top line */}
      <div className="auth-card relative z-10 w-full max-w-md">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent 5%, oklch(0.65 0.18 38) 40%, oklch(0.65 0.18 38) 60%, transparent 95%)",
            opacity: 0.55,
          }}
        />
        {children}
      </div>
    </div>
  )
}
