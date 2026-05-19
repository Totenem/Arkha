import Link from "next/link"
import { supabase } from "@/lib/supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Heart, BookOpen } from "lucide-react"

export const revalidate = 60

export default async function BlogsPage() {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, slug, title, author, image_url, likes, content, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FC]">
      <Header />

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-[#4E4C67] to-[#985F6F] py-12 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Arkha Blog</h1>
          <p className="text-white/80 text-sm">Career tips, job market insights, and resume advice</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {!blogs?.length ? (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-400">No articles yet</p>
              <p className="text-sm mt-1 text-gray-300">Check back soon for career tips and insights</p>
            </div>
          ) : (
            <div className="space-y-8">
              {blogs.map((blog) => {
                const excerpt = blog.content
                  ? blog.content.replace(/#{1,6}\s/g, "").replace(/[*_`]/g, "").slice(0, 160).trim() + "…"
                  : ""
                const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                return (
                  <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                      {blog.image_url ? (
                        <div className="md:w-64 md:shrink-0 h-48 md:h-auto overflow-hidden">
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="md:w-64 md:shrink-0 h-48 md:h-auto bg-gradient-to-br from-[#DCD6F7] to-[#A6B1E1] flex items-center justify-center">
                          <BookOpen className="h-10 w-10 text-[#4E4C67]/40" />
                        </div>
                      )}

                      <div className="flex flex-col justify-between p-6 flex-1">
                        <div>
                          <h2 className="text-xl font-bold text-[#4E4C67] mb-2 group-hover:text-[#985F6F] transition-colors line-clamp-2">
                            {blog.title}
                          </h2>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{excerpt}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                          <div>
                            <p className="text-xs font-medium text-[#4E4C67]">{blog.author}</p>
                            <p className="text-xs text-gray-400">{formattedDate}</p>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Heart className="h-3.5 w-3.5" />
                            {blog.likes}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
