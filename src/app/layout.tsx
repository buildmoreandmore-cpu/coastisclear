import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SiteGate from "@/components/SiteGate";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clear the Wax — sample clearance, simplified",
  description:
    "Find who owns the music. Get the contact. Draft the letter. Clear the sample — in under 60 seconds.",
  metadataBase: new URL("https://clearthewax.com"),
  openGraph: {
    title: "Clear the Wax — sample clearance, simplified",
    description:
      "Find who owns the music. Get the contact. Draft the letter. Clear the sample — in under 60 seconds.",
    url: "https://clearthewax.com",
    siteName: "Clear the Wax",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Clear the Wax — sample clearance, simplified",
    description:
      "Find who owns the music. Get the contact. Draft the letter. Clear the sample — in under 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dmMono.variable} antialiased`}
      >
        <SiteGate>
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="liquid-glass font-display font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity select-none"
            >
              Clear the Wax
            </Link>
            <NavLinks />
          </nav>
          {children}
          <footer className="w-full py-6 flex items-center justify-center gap-4">
            <a
              href="/glossary"
              className="font-mono text-[10px] text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors opacity-60 hover:opacity-90"
            >
              glossary
            </a>
            <a
              href="/admin"
              className="font-mono text-[10px] text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors opacity-40 hover:opacity-70"
            >
              admin
            </a>
          </footer>
        </SiteGate>
      </body>
    </html>
  );
}
