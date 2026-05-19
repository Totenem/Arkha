import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { deleteJob } from "@/app/actions"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default async function JobsPage() {
  const { data: jobs } = await supabaseAdmin
    .from("jobs")
    .select("id, title, job_type, salary, posted_at")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#4E4C67]">Jobs</h1>
        <Link href="/jobs/new" className="flex items-center gap-2 bg-[#4E4C67] hover:bg-[#4E4C67]/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          New Job
        </Link>
      </div>

      {!jobs?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400 text-sm">No jobs yet</p>
          <Link href="/jobs/new" className="text-[#4E4C67] text-sm font-medium mt-2 inline-block hover:underline">Add your first job →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Salary</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Posted</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 font-medium text-[#4E4C67]">{job.title}</td>
                  <td className="px-5 py-3.5 text-gray-500">{job.job_type ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-500">{job.salary ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {job.posted_at ? new Date(job.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/jobs/${job.id}/edit`} className="p-1.5 text-gray-400 hover:text-[#4E4C67] transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={async () => { "use server"; await deleteJob(job.id) }}>
                        <button type="submit" className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
