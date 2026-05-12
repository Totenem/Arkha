"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const { session, loading } = useAuth()
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!loading && session) router.replace("/analyze")
  }, [loading, session, router])
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push("/analyze")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FC]">
      <Header />

      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-[#4E4C67]">Welcome back</h1>
              <p className="text-gray-500 mt-1 text-sm">Log in to continue analyzing resumes</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4E4C67] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#A6B1E1] focus:outline-none focus:ring-1 focus:ring-[#A6B1E1]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4E4C67] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#A6B1E1] focus:outline-none focus:ring-1 focus:ring-[#A6B1E1]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#985F6F] hover:bg-[#B4869F] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[#985F6F] font-medium hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
