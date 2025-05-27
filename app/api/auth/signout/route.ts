import { signOut } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await signOut()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Signout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sign out",
      },
      { status: 500 },
    )
  }
}
