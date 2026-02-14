import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bibliotheca Academica",
  description: "A digital renaissance archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          playfair.variable
        )}
      >
        {/* Layer 0: Void (Base Background) */}
        <div className="fixed inset-0 -z-50 bg-background" />

        {/* Layer 1: Dot Grid with 24px spacing (8px grid aligned) */}
        <div
          className="fixed inset-0 -z-40 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)'
          }}
        />

        {/* Layer 2: Enhanced Radial Gradients (Atmosphere) */}
        <div
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-30 h-[1200px] w-[1200px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/[0.08] via-background to-transparent blur-[100px]"
        />
        <div
          className="fixed right-0 top-0 -z-30 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-600/5 blur-[100px]"
        />

        {/* Layer 3: Analog Grain (Texture) */}
        <div className="fixed inset-0 -z-10 opacity-[0.025] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/noise.svg")' }} />

        {/* Main Content */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
