// layout.tsx
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Poppins } from "next/font/google" // Import Poppins
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Header } from "@/components/Header" // Import new Header
import { Footer } from "@/components/Footer" // Import new Footer

// Font setup
const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


export const metadata: Metadata = {
  title: "MPS - Multi-Disease Prediction System",
  description:
    "A multi-disease detection system for diabetes, heart disease, and Parkinson's disease",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Use the Poppins font on the body */}
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {/* The old sidebar provider is removed */}
            <div className="flex flex-col min-h-screen">
              <Header /> {/* Add the new header */}
              {/* Main content no longer has a sidebar */}
              <main className="flex-1">
                {/* Theme toggle can be moved to header or footer if needed */}
                {/* <div className="container flex justify-end py-4"><ThemeToggle /></div> */}
                {children}
              </main>
              <Footer /> {/* Add the new footer */}
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}