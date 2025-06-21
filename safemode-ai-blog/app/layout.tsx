import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google" // Combined imports
import "./globals.css"
import { Footer } from "@/components/footer" // Import Footer
import { Toaster } from "@/components/ui/toaster" // Import Toaster for notifications

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const orbitronFont = Orbitron({
  // Renamed to avoid conflict if 'Orbitron' is used as a component name elsewhere
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
})

export const metadata: Metadata = {
  title: "SafemodeAI - The Frontline of Digital Intelligence",
  description:
    "Exploring the intersection of artificial intelligence, cybersecurity, and digital ethics in our rapidly evolving technological landscape.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitronFont.variable} antialiased bg-[#0D0D0D]`}>
        <div className="flex flex-col min-h-screen">
          {/* Header is rendered by individual page.tsx files */}
          <main className="flex-grow">{children}</main>
          <Footer /> {/* Add Footer here */}
        </div>
        <Toaster /> {/* Add Toaster here for notifications */}
      </body>
    </html>
  )
}
