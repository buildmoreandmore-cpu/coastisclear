import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Clear Wax — sample clearance, simplified",
  description:
    "Find who owns the music. Get the contact. Draft the letter. Clear the sample — in under 60 seconds.",
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
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-mono text-sm font-medium text-[var(--text)] hover:opacity-60 transition-opacity tracking-wide"
          >
            clear
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
            >
              about
            </Link>
            <Link
              href="/login"
              className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
            >
              login
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
