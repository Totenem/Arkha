"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

export const MONTHLY_LIMIT = 20

export function useUsage() {
  const { session } = useAuth()
  const [assessUsed, setAssessUsed] = useState(0)
  const [optimizeUsed, setOptimizeUsed] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    supabase
      .from("usage_logs")
      .select("endpoint")
      .gte("created_at", startOfMonth.toISOString())
      .then(({ data }) => {
        setAssessUsed(data?.filter((r) => r.endpoint === "assess").length ?? 0)
        setOptimizeUsed(data?.filter((r) => r.endpoint === "optimize").length ?? 0)
        setLoading(false)
      })
  }, [session])

  return {
    assessUsed,
    optimizeUsed,
    assessLeft: Math.max(0, MONTHLY_LIMIT - assessUsed),
    optimizeLeft: Math.max(0, MONTHLY_LIMIT - optimizeUsed),
    loading,
  }
}
