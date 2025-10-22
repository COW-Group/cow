import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const userEmail = data.user.email || "unknown@mycow.io"

  return <DashboardContent userEmail={userEmail} />
}
