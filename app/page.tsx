import { redirect } from "next/navigation"

export default function Home() {
  // Root automatically redirects to login
  redirect("/login")
}
