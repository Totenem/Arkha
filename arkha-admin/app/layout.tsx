import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "@/components/sidebar"

export const metadata: Metadata = {
  title: "Arkha Admin",
  description: "Local admin panel for Arkha",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#F8F8FC]">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  )
}
