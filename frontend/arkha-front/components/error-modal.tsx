"use client"

import type { MouseEvent } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ErrorModalProps = {
  open: boolean
  onClose: () => void
  /** Shown as the primary heading (e.g. HTTP status "429", "500", "NETWORK") */
  code: string
  /** Secondary descriptive text */
  details: string
  className?: string
}

export function ErrorModal({ open, onClose, code, details, className }: ErrorModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-modal-code"
        aria-describedby="error-modal-details"
        className={cn(
          "flex w-full max-w-md flex-col items-center justify-center gap-5 border-4 border-black bg-white px-8 py-10 shadow-lg",
          className
        )}
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="text-red-600" aria-hidden>
          <X className="h-16 w-16 stroke-[3]" strokeLinecap="round" />
        </div>

        <h2
          id="error-modal-code"
          className="text-center text-xl font-bold uppercase tracking-wide text-red-600"
        >
          {code}
        </h2>

        <p id="error-modal-details" className="text-center text-sm font-normal text-red-600">
          {details}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-2 border-2 border-black bg-white text-[#4E4C67] hover:bg-gray-50"
          onClick={onClose}
        >
          Dismiss
        </Button>
      </div>
    </div>
  )
}

/** Normalize FastAPI / Starlette `detail` field (string | validation object array). */
function detailToMessage(detail: unknown): string {
  if (detail == null) return "Something went wrong."
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    const parts = detail.map((item) => {
      if (item && typeof item === "object" && "msg" in item) {
        return String((item as { msg?: string }).msg ?? item)
      }
      return String(item)
    })
    return parts.join(" ")
  }
  if (typeof detail === "object" && "msg" in (detail as object)) {
    return String((detail as { msg: string }).msg)
  }
  return "Something went wrong."
}

/**
 * Build modal copy from a failed fetch Response (handles 429 rate limit and other status codes).
 */
export async function errorPayloadFromResponse(response: Response): Promise<{ code: string; details: string }> {
  const status = response.status
  let details = response.statusText || "Request failed."

  try {
    const data = (await response.json()) as { detail?: unknown; error?: unknown }
    if (data.detail !== undefined) {
      details = detailToMessage(data.detail)
    } else if (data.error !== undefined) {
      details = typeof data.error === "string" ? data.error : detailToMessage(data.error)
    }
  } catch {
    // non-JSON error body
  }

  if (status === 429) {
    const hint =
      details.toLowerCase().includes("rate") || details.toLowerCase().includes("limit")
        ? details
        : "Too many requests. Please wait a minute and try again."
    return { code: "429", details: hint }
  }

  const codeLabel = status >= 400 ? String(status) : "ERROR"
  return { code: codeLabel, details }
}

export function errorPayloadFromUnknown(err: unknown, fallbackDetails = "An unexpected error occurred."): { code: string; details: string } {
  const message = err instanceof Error ? err.message : fallbackDetails
  return { code: "NETWORK", details: message }
}
