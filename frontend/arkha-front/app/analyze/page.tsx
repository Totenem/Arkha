"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ResultsDisplay from "@/components/results-display"

type AnalysisResults = {
  extraction_message: string
  important_info: {
    name: string
    email: string
    phone_number: string
    education: Array<{
      school: string
      degree: string
      duration: string
      relevant_coursework?: string[]
    }>
    skills: string[]
    languages: string[]
    licenses: Array<string | { license: string }>
    work_experience: Array<{
      company: string
      position: string
      date: string
      description: string[]
    }>
  }
  score: string
  cover_letter: string
  improvements: string[]
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [sector, setSector] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<AnalysisResults | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        return
      }
      setFile(droppedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a resume PDF")
      return
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    if (!sector) {
      setError("Please select a job sector")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-assess?job_description=${encodeURIComponent(jobDescription)}&sector=${encodeURIComponent(sector)}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze resume")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during analysis"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setJobDescription("")
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FC]">
      <Header />

      <main className="flex-grow py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4E4C67] mb-6 text-center">Resume Analysis</h1>

          {!results ? (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#4E4C67] mb-2">Upload Resume (PDF)</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      file ? "border-[#A6B1E1] bg-[#A6B1E1]/10" : "border-gray-300 hover:border-[#A6B1E1]"
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("resume-upload")?.click()}
                  >
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {file ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-6 w-6 text-[#4E4C67]" />
                        <span className="text-[#4E4C67] font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFile(null)
                          }}
                          className="ml-2 p-1 rounded-full bg-[#4E4C67]/10 hover:bg-[#4E4C67]/20"
                        >
                          <X className="h-4 w-4 text-[#4E4C67]" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag and drop your resume PDF here or{" "}
                          <span className="text-[#985F6F] font-medium">browse</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="job-description" className="block text-sm font-medium text-[#4E4C67] mb-2">
                    Job Description
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Maximum length: 3000 characters</p>
                  <Textarea
                    id="job-description"
                    maxLength={3000}
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] border-gray-300 focus:border-[#A6B1E1] focus:ring-[#A6B1E1]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="sector" className="block text-sm font-medium text-[#4E4C67] mb-2">
                    Resume Type
                  </label>
                  <select
                    id="sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full rounded-md border border-gray-300 focus:border-[#A6B1E1] focus:ring-[#A6B1E1] p-2"
                    required
                  >
                    <option value="">Select a type</option>
                    <option value="software_engineering">Software Engineering</option>
                    <option value="data_science">Data Science & Analytics</option>
                    <option value="engineering">Engineering</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="marketing">Marketing & Communications</option>
                    <option value="sales">Sales</option>
                    <option value="hr">Human Resources</option>
                    <option value="education">Education</option>
                    <option value="legal">Legal</option>
                    <option value="creative">Creative & Design</option>
                    <option value="operations">Operations & Logistics</option>
                  </select>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#985F6F] hover:bg-[#B4869F] text-white px-8 py-2"
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
            <div className="bg-white rounded-xl shadow-md">
              <ResultsDisplay results={results} />
              <div className="p-6 border-t border-gray-100 flex justify-center">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10"
                >
                  Analyze Another Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
