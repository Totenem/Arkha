"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Download, FileText, Loader2, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { errorPayloadFromResponse, errorPayloadFromUnknown } from "@/components/error-modal"
import { useAuth } from "@/context/AuthContext"

type Status = "loading" | "success" | "error"

const LOADING_MESSAGES = [
  "Analyzing your resume gaps...",
  "Building optimization strategy...",
  "Rewriting resume content...",
  "Applying Harvard style formatting...",
  "Generating your PDF...",
  "Finalizing your optimized resume...",
]

interface OptimizeResumeModalProps {
  open: boolean
  onClose: () => void
  assessResults: Record<string, unknown>
  resumeDetails: Record<string, string>
  jobDescription: string
}

export default function OptimizeResumeModal({
  open,
  onClose,
  assessResults,
  resumeDetails,
  jobDescription,
}: OptimizeResumeModalProps) {
  const { session } = useAuth()
  const [status, setStatus] = useState<Status>("loading")
  const [error, setError] = useState<{ code: string; details: string } | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [fileName, setFileName] = useState("ARKHA-Optimized-Resume.pdf")
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Trigger optimization when modal opens
  useEffect(() => {
    if (!open) return
    setStatus("loading")
    setError(null)
    setPdfBlob(null)
    setMsgIndex(0)
    setProgress(0)
    runOptimization()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cycle loading messages
  useEffect(() => {
    if (status !== "loading") return
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [status])

  // Simulate progress bar (0 → 88% while loading, 100% on success)
  useEffect(() => {
    if (status === "success") {
      setProgress(100)
      return
    }
    if (status !== "loading") return
    setProgress(0)
    const timer = setInterval(() => {
      setProgress((p) => (p >= 88 ? p : p + 1))
    }, 600)
    return () => clearInterval(timer)
  }, [status])

  async function runOptimization() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tailor-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          assess_results: assessResults,
          resume_details: resumeDetails,
          job_description: jobDescription,
        }),
      })

      if (!response.ok) {
        setError(await errorPayloadFromResponse(response))
        setStatus("error")
        return
      }

      const disposition = response.headers.get("Content-Disposition")
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (match?.[1]) setFileName(match[1].replace(/['"]/g, ""))
      }

      const blob = await response.blob()
      setPdfBlob(blob)
      setStatus("success")
    } catch (err) {
      setError(errorPayloadFromUnknown(err, "Failed to connect to the server. Please try again."))
      setStatus("error")
    }
  }

  function handleDownload() {
    if (!pdfBlob) return
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleClose() {
    if (status === "loading") return // prevent closing while running
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4E4C67] to-[#985F6F] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 shrink-0" />
            <h2 className="text-lg font-bold">Optimize Resume</h2>
          </div>
          {status !== "loading" && (
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-8">
          {/* ── Loading ── */}
          {status === "loading" && (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#DCD6F7]/40 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-[#4E4C67] animate-spin" />
              </div>

              <div>
                <p className="text-lg font-semibold text-[#4E4C67] mb-2">
                  Building Your Optimized Resume
                </p>
                <p className="text-sm text-gray-500 min-h-[20px]">
                  {LOADING_MESSAGES[msgIndex]}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full space-y-1.5">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4E4C67] to-[#985F6F] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-right">{progress}%</p>
              </div>

              <p className="text-xs text-gray-400">
                This may take up to a minute — please don&apos;t close this window.
              </p>
            </div>
          )}

          {/* ── Success ── */}
          {status === "success" && (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>

              <div>
                <p className="text-lg font-semibold text-[#4E4C67] mb-2">
                  Your Resume is Ready!
                </p>
                <p className="text-sm text-gray-500">
                  Your resume has been optimized and formatted in Harvard style.
                </p>
              </div>

              {/* Progress bar at 100% */}
              <div className="w-full space-y-1.5">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4E4C67] to-[#985F6F] rounded-full transition-all duration-700"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleDownload}
                  className="bg-[#985F6F] hover:bg-[#B4869F] text-white w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Optimized Resume
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10 w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {status === "error" && (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>

              <div>
                <p className="text-lg font-semibold text-[#4E4C67] mb-2">Optimization Failed</p>
                <p className="text-sm text-gray-500">
                  {error?.details ?? "Something went wrong. Please try again."}
                </p>
                {error?.code && (
                  <p className="text-xs text-gray-400 mt-1">Error {error.code}</p>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleClose}
                className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10 w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
