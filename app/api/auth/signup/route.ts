import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 },
      )
    }

    const supabase = createServerClient()

    // Use supabase.auth.signUp() instead of custom logic
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName, // Supabase convention is often snake_case for metadata keys
          last_name: lastName,
        },
      },
    })

    if (signUpError) {
      console.error("Error creating user:", signUpError)
      return NextResponse.json(
        {
          success: false,
          error: signUpError.message || "Failed to create user", // Use Supabase error message
        },
        { status: signUpError.status || 500 }, // Use Supabase error status
      )
    }

    // Handle case where user is created but requires email confirmation (if enabled)
    // data.user will exist, data.session might be null if confirmation is needed.
    if (data.user && !data.session) {
      return NextResponse.json({
        success: true,
        message: "Signup successful. Please check your email to confirm your account.",
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata?.first_name, // Access metadata
          lastName: data.user.user_metadata?.last_name,
          // isVerified: !!data.user.email_confirmed_at, // Check email confirmation status
          createdAt: data.user.created_at,
        },
      })
    }

    // If session exists, user is likely auto-confirmed or confirmation is not required
    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        firstName: data.user?.user_metadata?.first_name,
        lastName: data.user?.user_metadata?.last_name,
        // isVerified: !!data.user?.email_confirmed_at,
        createdAt: data.user?.created_at,
      },
      session: data.session, // Optionally return the session
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
