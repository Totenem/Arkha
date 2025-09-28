"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#4E4C67]">ARKHA</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#4E4C67]/80 hover:text-[#4E4C67] font-medium">
              Home
            </Link>
            <Link href="/analyze" className="text-[#4E4C67]/80 hover:text-[#4E4C67] font-medium">
              Analyze
            </Link>
            <Link href="#" className="text-[#4E4C67]/80 hover:text-[#4E4C67] font-medium">
              About
            </Link>
            <Button asChild className="bg-[#985F6F] hover:bg-[#B4869F] text-white">
              <Link href="/analyze">Get Started</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-[#4E4C67]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#4E4C67] hover:bg-[#DCD6F7]/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/analyze"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#4E4C67] hover:bg-[#DCD6F7]/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analyze
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#4E4C67] hover:bg-[#DCD6F7]/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-3 py-2">
              <Button asChild className="w-full bg-[#985F6F] hover:bg-[#B4869F] text-white">
                <Link href="/analyze" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
