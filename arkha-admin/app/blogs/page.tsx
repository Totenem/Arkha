import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { deleteBlog } from "@/app/actions"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default async function BlogsPage() {
  const { data: blogs } = await supabaseAdmin
    .from("blogs")
    .select("id, title, author, published, created_at, slug")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#4E4C67]">Blogs</h1>
        <Link
          href="/blogs/new"
          className="flex items-center gap-2 bg-[#985F6F] hover:bg-[#B4869F] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {!blogs?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400 text-sm">No blog posts yet</p>
          <Link href="/blogs/new" className="text-[#985F6F] text-sm font-medium mt-2 inline-block hover:underline">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Author</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Created</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 font-medium text-[#4E4C67]">{blog.title}</td>
                  <td className="px-5 py-3.5 text-gray-500">{blog.author}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${blog.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/blogs/${blog.id}/edit`} className="p-1.5 text-gray-400 hover:text-[#4E4C67] transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={async () => { "use server"; await deleteBlog(blog.id) }}>
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
