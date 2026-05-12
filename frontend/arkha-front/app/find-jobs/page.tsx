"use client"

import type React from "react"
import { useState } from "react"
import {
  Search,
  ExternalLink,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  DollarSign,
  Eye,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnalyzeJobModal from "@/components/analyze-job-modal"
import ViewJobDetailsModal from "@/components/view-job-details-modal"
import { ErrorModal, errorPayloadFromResponse, errorPayloadFromUnknown } from "@/components/error-modal"
import AuthGuard from "@/components/auth-guard"

type JobDetails = {
  job_id: string
  title: string
  job_type: string
  salary: string
  hours_per_week: string
  date_updated: string
  description: string
  skills: string[]
  url: string
}

type Job = {
  job_id: string
  title: string
  job_type: string
  posted_at: string
  salary: string
  description: string
  skills: string[]
  url: string
}

type JobSearchResponse = {
  jobs: Job[]
  total: number | null
  page: number
  per_page: number
}

type AnalyzeTarget = {
  title: string
  description: string
}

export default function FindJobsPage() {
  const [keyword, setKeyword] = useState("")
  const [fullTime, setFullTime] = useState(true)
  const [partTime, setPartTime] = useState(true)
  const [gig, setGig] = useState(true)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<JobSearchResponse | null>(null)
  const [modalError, setModalError] = useState<{ code: string; details: string } | null>(null)
  const [analyzeTarget, setAnalyzeTarget] = useState<AnalyzeTarget | null>(null)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)

  const doSearch = async (targetPage: number) => {
    setIsLoading(true)
    setResults(null)

    try {
      const body = {
        keyword,
        gig,
        part_time: partTime,
        full_time: fullTime,
        page: targetPage,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search-ojph`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        setModalError(await errorPayloadFromResponse(response))
        return
      }

      const data: JobSearchResponse = await response.json()
      setResults(data)
      setPage(targetPage)
      setHasSearched(true)
    } catch (err) {
      setModalError(errorPayloadFromUnknown(err, "Failed to search jobs"))
    } finally {
      setIsLoading(false)
    }
  }

  const viewDetails = async (job_id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ojph-job/${job_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        setModalError(await errorPayloadFromResponse(response))
        return
      }
      const data: JobDetails = await response.json()
      setJobDetails(data)
    } catch (err) {
      setModalError(errorPayloadFromUnknown(err, "Failed to fetch job details"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await doSearch(1)
  }

  const handlePageChange = async (newPage: number) => {
    await doSearch(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // posted_at comes as "2026-05-02 21:59:41" (space-separated, not ISO T)
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr.replace(" ", "T"))
    if (isNaN(d.getTime())) return dateStr
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000)
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" })
  }

  const jobTypeBadgeColor = (type: string) => {
    const t = type.toLowerCase()
    if (t === "full time") return "bg-[#DCD6F7]/40 text-[#4E4C67]"
    if (t === "part time") return "bg-[#A6B1E1]/20 text-[#4E4C67]"
    if (t === "gig") return "bg-[#B4869F]/20 text-[#985F6F]"
    return "bg-gray-100 text-gray-600"
  }

  const totalPages = results?.total ? Math.ceil(results.total / 30) : 0

  return (
    <AuthGuard>
    <div className="min-h-screen flex flex-col bg-[#F8F8FC]">
      <Header />

      <main className="flex-grow">
        {/* Search Hero */}
        <div className="bg-gradient-to-r from-[#4E4C67] to-[#985F6F] py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
              Find Your Next Job
            </h1>
            <p className="text-white/80 text-center mb-8 text-sm">
              Search thousands of listings from OnlineJobs.ph and match them against your resume
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#A6B1E1]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#985F6F] hover:bg-[#B4869F] text-white px-8 shrink-0"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fullTime}
                    onChange={(e) => setFullTime(e.target.checked)}
                    className="rounded"
                  />
                  Full Time
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partTime}
                    onChange={(e) => setPartTime(e.target.checked)}
                    className="rounded"
                  />
                  Part Time
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gig}
                    onChange={(e) => setGig(e.target.checked)}
                    className="rounded"
                  />
                  Gig
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-[#4E4C67]">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="text-sm text-gray-500">Searching jobs...</p>
            </div>
          )}

          {!isLoading && results && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  {results.total != null && (
                    <>
                      <span className="font-semibold text-[#4E4C67]">
                        {results.total.toLocaleString()}
                      </span>{" "}
                      jobs found
                    </>
                  )}
                </p>
                {totalPages > 1 && (
                  <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                )}
              </div>

              <div className="space-y-4">
                {results.jobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-white rounded-xl shadow-sm border border-gray-500 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h2 className="text-lg font-semibold text-[#4E4C67]">{job.title}</h2>
                      {job.job_type && (
                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${jobTypeBadgeColor(job.job_type)}`}>
                          {job.job_type}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 shrink-0" />
                          {job.salary}
                        </span>
                      )}
                      {job.posted_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {formatDate(job.posted_at)}
                        </span>
                      )}
                    </div>

                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 bg-[#DCD6F7]/40 text-[#4E4C67] rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                      <Button asChild className="bg-[#4E4C67] hover:bg-[#4E4C67]/80 text-white text-sm px-5">
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Apply
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#985F6F] text-[#985F6F] hover:bg-[#985F6F]/10 text-sm px-5"
                        onClick={() =>
                          setAnalyzeTarget({ title: job.title, description: job.description })
                        }
                      >
                        <BrainCircuit className="h-3.5 w-3.5 mr-1.5" />
                        Analyze
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 text-sm px-5 ml-auto"
                        onClick={() => viewDetails(job.job_id)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <Button
                    variant="outline"
                    disabled={page <= 1 || isLoading}
                    onClick={() => handlePageChange(page - 1)}
                    className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => handlePageChange(page + 1)}
                    className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {results.jobs.length === 0 && (
                <div className="text-center py-16">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-200" />
                  <p className="text-lg font-medium text-gray-500">No jobs found</p>
                  <p className="text-sm mt-1 text-gray-400">Try adjusting your search terms or filters</p>
                </div>
              )}
            </>
          )}

          {!isLoading && !hasSearched && (
            <div className="text-center py-20">
              <Search className="h-14 w-14 mx-auto mb-4 text-gray-200" />
              <p className="text-base font-medium text-gray-400">Search for jobs above to get started</p>
              <p className="text-sm mt-1 text-gray-300">
                Find listings and check your resume fit in one place
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AnalyzeJobModal
        open={analyzeTarget !== null}
        onClose={() => setAnalyzeTarget(null)}
        jobTitle={analyzeTarget?.title ?? ""}
        companyName=""
        jobDescription={analyzeTarget?.description ?? ""}
      />

      <ViewJobDetailsModal
        open={jobDetails !== null}
        onClose={() => setJobDetails(null)}
        job={jobDetails}
      />

      <ErrorModal
        open={modalError !== null}
        onClose={() => setModalError(null)}
        code={modalError?.code ?? ""}
        details={modalError?.details ?? ""}
      />
    </div>
    </AuthGuard>
  )
}
