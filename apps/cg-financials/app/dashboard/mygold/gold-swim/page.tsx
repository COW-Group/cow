import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import GoldSwimContent from "@/components/gold-swim-content"

export default async function GoldSwimPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const userEmail = data.user.email || "unknown@mycow.io"

  return <GoldSwimContent userEmail={userEmail} />
}
