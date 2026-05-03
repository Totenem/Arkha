"use client"

import { X, DollarSign, Clock, Briefcase, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

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

type ViewJobDetailsModalProps = {
  open: boolean
  onClose: () => void
  job: JobDetails | null
}

function cleanDescription(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

export default function ViewJobDetailsModal({ open, onClose, job }: ViewJobDetailsModalProps) {
  if (!open || !job) return null

  const lines = cleanDescription(job.description)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-xl">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-[#4E4C67] leading-tight">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              {job.job_type && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A6B1E1]/20 text-[#4E4C67]">
                  {job.job_type}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  ${job.salary}/mo
                </span>
              )}
              {job.hours_per_week && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {job.hours_per_week} hrs/week
                </span>
              )}
              {job.date_updated && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  Updated {job.date_updated}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Skills */}
          {job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#4E4C67] mb-2 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#DCD6F7]/40 text-[#4E4C67] rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-[#4E4C67] mb-3">Job Description</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              {lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer — Apply button */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between gap-3 rounded-b-xl bg-white">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-600"
          >
            Close
          </Button>
          <Button
            asChild
            className="bg-[#985F6F] hover:bg-[#B4869F] text-white px-8 text-sm font-semibold"
          >
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply for this Job
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
