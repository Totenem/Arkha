import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase-admin"
import BlogForm from "../../BlogForm"

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: blog } = await supabaseAdmin.from("blogs").select("*").eq("id", id).single()
  if (!blog) notFound()
  return <BlogForm initialData={blog} />
}
