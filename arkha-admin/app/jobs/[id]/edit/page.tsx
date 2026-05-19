import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase-admin"
import JobForm from "../../JobForm"

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: job } = await supabaseAdmin.from("jobs").select("*").eq("id", id).single()
  if (!job) notFound()
  return <JobForm initialData={job} />
}
