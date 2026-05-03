"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ResultsDisplay from "@/components/results-display"
import { errorPayloadFromResponse, errorPayloadFromUnknown } from "@/components/error-modal"

type AnalysisResults = {
  extraction_message: string
  important_info: {
    name: string
    email: string
    phone_number: string
    education: Array<{ school: string; degree: string; duration: string; relevant_coursework?: string[] }>
    skills: string[]
    languages: string[]
    licenses: Array<string | { license: string }>
    work_experience: Array<{ company: string; position: string; date: string; description: string[] }>
  }
  score: string
  cover_letter: string
  improvements: string[]
}

type AnalyzeJobModalProps = {
  open: boolean
  onClose: () => void
  jobTitle: string
  companyName: string
  jobDescription: string
}

export default function AnalyzeJobModal({
  open,
  onClose,
  jobTitle,
  companyName,
  jobDescription,
}: AnalyzeJobModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [sector, setSector] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<AnalysisResults | null>(null)

  if (!open) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }
    setFile(selected)
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (!dropped) return
    if (dropped.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }
    setFile(dropped)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setError("Please upload your resume PDF"); return }
    if (!sector) { setError("Please select a resume type"); return }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-assess?job_description=${encodeURIComponent(jobDescription)}&sector=${encodeURIComponent(sector)}`,
        { method: "POST", body: formData }
      )

      if (!response.ok) {
        const payload = await errorPayloadFromResponse(response)
        setError(`${payload.code}: ${payload.details}`)
        return
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(errorPayloadFromUnknown(err).details)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setSector("")
    setError(null)
    setResults(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-[#4E4C67]">Analyze This Job</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {jobTitle} · {companyName}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!results ? (
          <div className="p-6">
            {/* Job Description Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#4E4C67] mb-2">Job Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 max-h-32 overflow-y-auto leading-relaxed border border-gray-100">
                {jobDescription}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Resume Upload */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#4E4C67] mb-2">
                  Upload Your Resume (PDF)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    file
                      ? "border-[#A6B1E1] bg-[#A6B1E1]/10"
                      : "border-gray-300 hover:border-[#A6B1E1]"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("modal-resume-upload")?.click()}
                >
                  <input
                    id="modal-resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-[#4E4C67]" />
                      <span className="text-[#4E4C67] font-medium text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        className="ml-2 p-1 rounded-full bg-[#4E4C67]/10 hover:bg-[#4E4C67]/20"
                      >
                        <X className="h-3 w-3 text-[#4E4C67]" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Drag and drop or{" "}
                        <span className="text-[#985F6F] font-medium">browse</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#4E4C67] mb-2">
                  Resume Type
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded-md border border-gray-300 focus:border-[#A6B1E1] focus:outline-none p-2 text-sm"
                >
                  <option value="">Select a type</option>
                  <option value="software_engineering">Software Engineering</option>
                  <option value="data_science">Data Science &amp; Analytics</option>
                  <option value="engineering">Engineering</option>
                  <option value="finance">Finance &amp; Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="marketing">Marketing &amp; Communications</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="education">Education</option>
                  <option value="legal">Legal</option>
                  <option value="creative">Creative &amp; Design</option>
                  <option value="operations">Operations &amp; Logistics</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-gray-300 text-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#985F6F] hover:bg-[#B4869F] text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <ResultsDisplay results={results} />
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setResults(null)}
                className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10"
              >
                Try Again
              </Button>
              <Button
                onClick={handleClose}
                className="bg-[#985F6F] hover:bg-[#B4869F] text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
