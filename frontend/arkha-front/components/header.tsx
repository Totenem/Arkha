"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useUsage, MONTHLY_LIMIT } from "@/hooks/useUsage"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { assessLeft, optimizeLeft } = useUsage()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    router.push("/")
  }

  const shortEmail = user?.email
    ? user.email.length > 22 ? user.email.slice(0, 22) + "…" : user.email
    : ""

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
              Analyze Resume
            </Link>
            <Link href="/find-jobs" className="text-[#4E4C67]/80 hover:text-[#4E4C67] font-medium">
              Find Jobs
            </Link>
            <Link href="/blogs" className="text-[#4E4C67]/80 hover:text-[#4E4C67] font-medium">
              Blog
            </Link>

            {!loading && (
              user ? (
                /* Logged-in user menu */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#4E4C67] border border-[#DCD6F7] rounded-full px-3 py-1.5 hover:bg-[#DCD6F7]/30 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {shortEmail}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
                        {/* Usage stats */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">This month</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Assess</span>
                              <span className={`font-semibold ${assessLeft === 0 ? "text-red-500" : "text-[#4E4C67]"}`}>
                                {assessLeft} / {MONTHLY_LIMIT} left
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1">
                              <div
                                className="h-1 rounded-full bg-gradient-to-r from-[#4E4C67] to-[#985F6F]"
                                style={{ width: `${(assessLeft / MONTHLY_LIMIT) * 100}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span className="text-gray-600">Optimize</span>
                              <span className={`font-semibold ${optimizeLeft === 0 ? "text-red-500" : "text-[#4E4C67]"}`}>
                                {optimizeLeft} / {MONTHLY_LIMIT} left
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1">
                              <div
                                className="h-1 rounded-full bg-gradient-to-r from-[#4E4C67] to-[#985F6F]"
                                style={{ width: `${(optimizeLeft / MONTHLY_LIMIT) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-[#DCD6F7]/30 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Guest buttons */
                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10">
                    <Link href="/auth/login">Log In</Link>
                  </Button>
                  <Button asChild className="bg-[#985F6F] hover:bg-[#B4869F] text-white">
                    <Link href="/auth/signup">Sign Up Free</Link>
                  </Button>
                </div>
              )
            )}
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
              Analyze Resume
            </Link>
            <Link
              href="/find-jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#4E4C67] hover:bg-[#DCD6F7]/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/blogs"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#4E4C67] hover:bg-[#DCD6F7]/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>

            <div className="px-3 py-2 space-y-2">
              {!loading && (
                user ? (
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}
                    className="flex items-center gap-2 w-full text-sm font-medium text-[#4E4C67] px-3 py-2 rounded-md hover:bg-[#DCD6F7]/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out ({shortEmail})
                  </button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full border-[#4E4C67] text-[#4E4C67]">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                    </Button>
                    <Button asChild className="w-full bg-[#985F6F] hover:bg-[#B4869F] text-white">
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up Free</Link>
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
