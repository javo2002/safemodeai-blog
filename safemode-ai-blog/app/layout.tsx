import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { getSession } from "./actions" // Import getSession
import { Header } from "@/components/header" // Import Header

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const orbitronFont = Orbitron({
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();
  const user = session?.user || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitronFont.variable} antialiased bg-[#0D0D0D]`}>
        <div className="flex flex-col min-h-screen">
          <Header user={user} /> {/* Pass user data as a prop */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
