import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { FileText, Briefcase, Plus, Eye } from "lucide-react"

export default async function DashboardPage() {
  const [{ count: totalJobs }, { count: totalBlogs }, { count: publishedBlogs }] =
    await Promise.all([
      supabaseAdmin.from("jobs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("blogs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("blogs").select("*", { count: "exact", head: true }).eq("published", true),
    ])

  const stats = [
    { label: "Total Jobs", value: totalJobs ?? 0, icon: Briefcase, color: "bg-[#4E4C67]", href: "/jobs" },
    { label: "Total Blogs", value: totalBlogs ?? 0, icon: FileText, color: "bg-[#985F6F]", href: "/blogs" },
    { label: "Published", value: publishedBlogs ?? 0, icon: Eye, color: "bg-[#A6B1E1]", href: "/blogs" },
    { label: "Drafts", value: (totalBlogs ?? 0) - (publishedBlogs ?? 0), icon: FileText, color: "bg-[#B4869F]", href: "/blogs" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#4E4C67] mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#4E4C67]">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/blogs/new" className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="p-2.5 rounded-lg bg-[#985F6F]/10 group-hover:bg-[#985F6F]/20 transition-colors">
            <Plus className="h-5 w-5 text-[#985F6F]" />
          </div>
          <div>
            <p className="font-semibold text-[#4E4C67]">New Blog Post</p>
            <p className="text-sm text-gray-500">Write and publish an article</p>
          </div>
        </Link>

        <Link href="/jobs/new" className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="p-2.5 rounded-lg bg-[#4E4C67]/10 group-hover:bg-[#4E4C67]/20 transition-colors">
            <Plus className="h-5 w-5 text-[#4E4C67]" />
          </div>
          <div>
            <p className="font-semibold text-[#4E4C67]">New Job Listing</p>
            <p className="text-sm text-gray-500">Add a curated job to Find Jobs</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
