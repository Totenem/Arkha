"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase-admin"

export type BlogData = {
  slug: string
  title: string
  content: string
  image_url: string | null
  author: string
  published: boolean
}

export type JobData = {
  job_id: string
  title: string
  job_type: string
  posted_at: string | null
  salary: string
  description: string
  skills: string[]
  url: string
  hours_per_week: string
  date_updated: string | null
}

export async function createBlog(data: BlogData) {
  const { error } = await supabaseAdmin.from("blogs").insert(data)
  if (error) return { error: error.message }
  revalidatePath("/blogs")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateBlog(id: string, data: Partial<BlogData>) {
  const { error } = await supabaseAdmin.from("blogs").update(data).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/blogs")
  return { success: true }
}

export async function deleteBlog(id: string) {
  const { error } = await supabaseAdmin.from("blogs").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/blogs")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function createJob(data: JobData) {
  const { error } = await supabaseAdmin.from("jobs").insert(data)
  if (error) return { error: error.message }
  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateJob(id: string, data: Partial<JobData>) {
  const { error } = await supabaseAdmin.from("jobs").update(data).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/jobs")
  return { success: true }
}

export async function deleteJob(id: string) {
  const { error } = await supabaseAdmin.from("jobs").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  return { success: true }
}
