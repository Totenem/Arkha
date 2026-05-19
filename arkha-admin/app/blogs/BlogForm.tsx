"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, AlertCircle } from "lucide-react"
import { createBlog, updateBlog, type BlogData } from "@/app/actions"

type Blog = BlogData & { id: string }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#A6B1E1] focus:outline-none focus:ring-1 focus:ring-[#A6B1E1]"

export default function BlogForm({ initialData }: { initialData?: Blog }) {
  const router = useRouter()
  const isEdit = !!initialData

  const [title, setTitle] = useState(initialData?.title ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [content, setContent] = useState(initialData?.content ?? "")
  const [author, setAuthor] = useState(initialData?.author ?? "")
  const [published, setPublished] = useState(initialData?.published ?? false)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url ?? null)
  const [slugEdited, setSlugEdited] = useState(isEdit)
  const [imageLoading, setImageLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugEdited) setSlug(slugify(val))
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageLoading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload-image", { method: "POST", body: fd })
    const data = await res.json()
    setImageLoading(false)
    if (res.ok) {
      setImageUrl(data.url)
    } else {
      setError(data.error ?? "Image upload failed")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const data: BlogData = { slug, title, content, image_url: imageUrl, author, published }
    const result = isEdit ? await updateBlog(initialData.id, data) : await createBlog(data)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }
    router.push("/blogs")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#4E4C67]">{isEdit ? "Edit Post" : "New Blog Post"}</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/blogs")} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || imageLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#985F6F] hover:bg-[#B4869F] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Cover Image */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-[#4E4C67] mb-3">Cover Image</label>
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
              <button type="button" onClick={() => { setImageUrl(null); if (fileRef.current) fileRef.current.value = "" }} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={imageLoading} className="w-full h-36 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#A6B1E1] hover:text-[#4E4C67] transition-colors">
              {imageLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Upload className="h-6 w-6" /><span className="text-sm">Click to upload cover image</span></>}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        </div>

        {/* Title + Slug + Author */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Title</label>
            <input type="text" required value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter blog title..." className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Slug <span className="text-gray-400 font-normal">(auto-generated)</span></label>
            <input type="text" required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }} placeholder="my-blog-post" className={`${inputCls} font-mono`} />
            <p className="text-xs text-gray-400 mt-1">arkha.com/blogs/{slug || "..."}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Author</label>
            <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className={inputCls} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-[#4E4C67] mb-1.5">Content <span className="text-gray-400 font-normal">(Markdown supported)</span></label>
          <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder={"Write your article in markdown...\n\n## Heading\n\nParagraph text here."} rows={22} className={`${inputCls} font-mono leading-relaxed resize-y`} />
        </div>

        {/* Published toggle */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#4E4C67]">Published</p>
            <p className="text-xs text-gray-400 mt-0.5">Visible to the public when enabled</p>
          </div>
          <button type="button" onClick={() => setPublished((v) => !v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${published ? "bg-[#985F6F]" : "bg-gray-200"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${published ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
    </form>
  )
}
