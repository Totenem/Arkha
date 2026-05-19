import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import { supabase } from "@/lib/supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogPostClient from "./BlogPostClient"

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase.from("blogs").select("title, image_url").eq("slug", slug).single()
  return {
    title: data?.title ?? "Blog Post",
    openGraph: data?.image_url ? { images: [data.image_url] } : undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!blog) notFound()

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FC]">
      <Header />

      <main className="flex-grow">
        {blog.image_url && (
          <div className="w-full h-72 md:h-96 overflow-hidden">
            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4E4C67] leading-tight mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4E4C67] to-[#985F6F] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {blog.author?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div>
              <p className="text-sm font-medium text-[#4E4C67]">{blog.author}</p>
              <p className="text-xs text-gray-400">{formattedDate}</p>
            </div>
          </div>

          <div className="[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#4E4C67] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#4E4C67] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#4E4C67] [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:text-gray-700 [&_li]:my-1 [&_li]:leading-relaxed [&_code]:bg-gray-100 [&_code]:text-[#985F6F] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#A6B1E1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4 [&_strong]:font-semibold [&_strong]:text-[#4E4C67] [&_a]:text-[#985F6F] [&_a]:underline [&_hr]:border-gray-200 [&_hr]:my-6">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          <BlogPostClient
            blogId={blog.id}
            initialLikes={blog.likes}
            initialShares={blog.shares}
            title={blog.title}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
