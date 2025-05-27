import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    const supabase = createServerClient()

    // Use Supabase's signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Signin error (Supabase):", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Invalid email or password", // Use Supabase error message
        },
        { status: error.status || 401 }, // Use Supabase error status
      )
    }

    // On successful sign-in, data.user and data.session will be populated.
    // Supabase client (especially with auth helpers) handles setting session cookies.

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        // Retrieve metadata stored during sign-up
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
        isVerified: !!data.user.email_confirmed_at, // Check if email is confirmed
        createdAt: data.user.created_at,
        lastLogin: data.user.last_sign_in_at, // Supabase provides last_sign_in_at
      },
      session: data.session, // The session object containing access_token, refresh_token etc.
    })

  } catch (error) {
    console.error("Signin error (Catch):", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
