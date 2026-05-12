"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/auth/login")
    }
  }, [loading, session, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#985F6F]" />
      </div>
    )
  }

  if (!session) return null

  return <>{children}</>
}
