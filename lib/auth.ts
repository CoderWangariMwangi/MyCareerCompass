import { createServerClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isVerified: boolean
  createdAt: string
  lastLogin?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function generateSessionToken(): Promise<string> {
  return crypto.randomUUID()
}

export async function createSession(userId: string): Promise<string> {
  const supabase = createServerClient()
  const sessionToken = await generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const { error } = await supabase.from("user_sessions").insert({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    throw new Error("Failed to create session")
  }

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set("session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })

  return sessionToken
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return null
    }

    const supabase = createServerClient()

    // Get session and user data
    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .select(`
        user_id,
        expires_at,
        auth_users (
          id,
          email,
          first_name,
          last_name,
          is_verified,
          created_at,
          last_login
        )
      `)
      .eq("session_token", sessionToken)
      .single()

    if (sessionError || !session) {
      return null
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase.from("user_sessions").delete().eq("session_token", sessionToken)
      return null
    }

    const userData = session.auth_users as any

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      isVerified: userData.is_verified,
      createdAt: userData.created_at,
      lastLogin: userData.last_login,
    }
  } catch (error) {
    console.error("Error getting session user:", error)
    return null
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (sessionToken) {
    const supabase = createServerClient()
    await supabase.from("user_sessions").delete().eq("session_token", sessionToken)
  }

  cookieStore.delete("session_token")
}
