"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { createJob, updateJob, type JobData } from "@/app/actions"

type Job = JobData & { id: string }

const JOB_TYPES = ["Full Time", "Part Time", "Gig"]

function toDatetimeLocal(val: string | null): string {
  if (!val) return ""
  try { return new Date(val).toISOString().slice(0, 16) } catch { return "" }
}

const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#A6B1E1] focus:outline-none focus:ring-1 focus:ring-[#A6B1E1]"

export default function JobForm({ initialData }: { initialData?: Job }) {
  const router = useRouter()
  const isEdit = !!initialData

  const [jobId, setJobId] = useState(initialData?.job_id ?? "")
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [jobType, setJobType] = useState(initialData?.job_type ?? "Full Time")
  const [salary, setSalary] = useState(initialData?.salary ?? "")
  const [hoursPerWeek, setHoursPerWeek] = useState(initialData?.hours_per_week ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [skillsRaw, setSkillsRaw] = useState((initialData?.skills ?? []).join(", "))
  const [url, setUrl] = useState(initialData?.url ?? "")
  const [postedAt, setPostedAt] = useState(toDatetimeLocal(initialData?.posted_at ?? null))
  const [dateUpdated, setDateUpdated] = useState(toDatetimeLocal(initialData?.date_updated ?? null))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const data: JobData = {
      job_id: jobId, title, job_type: jobType, salary, hours_per_week: hoursPerWeek,
      description, skills: skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      url, posted_at: postedAt ? new Date(postedAt).toISOString() : null,
      date_updated: dateUpdated ? new Date(dateUpdated).toISOString() : null,
    }
    const result = isEdit ? await updateJob(initialData.id, data) : await createJob(data)
    if (result?.error) { setError(result.error); setIsSubmitting(false); return }
    router.push("/jobs")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#4E4C67]">{isEdit ? "Edit Job" : "New Job Listing"}</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/jobs")} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#4E4C67] hover:bg-[#4E4C67]/80 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Job"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="space-y-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Job Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Job ID <span className="text-gray-400 font-normal">(unique)</span></label>
              <input type="text" required value={jobId} onChange={(e) => setJobId(e.target.value)} placeholder="unique-job-id" className={`${inputCls} font-mono`} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Job Type</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)} className={inputCls}>
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Salary</label>
              <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 500" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Hours/Week</label>
              <input type="text" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="e.g. 40" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Application URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Skills <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input type="text" value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} placeholder="React, TypeScript, Node.js" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Posted At</label>
              <input type="datetime-local" value={postedAt} onChange={(e) => setPostedAt(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Date Updated</label>
              <input type="datetime-local" value={dateUpdated} onChange={(e) => setDateUpdated(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Job Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, requirements..." rows={12} className={`${inputCls} leading-relaxed resize-y`} />
        </div>
      </div>
    </form>
  )
}
