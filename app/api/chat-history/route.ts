import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get or create user
    let { data: user } = await supabase.from("users").select("id").eq("session_id", sessionId).single()

    if (!user) {
      const { data: newUser } = await supabase.from("users").insert({ session_id: sessionId }).select("id").single()
      user = newUser
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Get conversations with messages
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        title,
        created_at,
        updated_at,
        messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    return NextResponse.json({ history: conversations || [] })
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, messages, title } = await request.json()

    if (!sessionId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Session ID and messages required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get or create user
    let { data: user } = await supabase.from("users").select("id").eq("session_id", sessionId).single()

    if (!user) {
      const { data: newUser } = await supabase.from("users").insert({ session_id: sessionId }).select("id").single()
      user = newUser
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: title || `Chat ${new Date().toLocaleDateString()}`,
      })
      .select()
      .single()

    if (convError || !conversation) {
      console.error("Error creating conversation:", convError)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    // Insert messages
    const messageInserts = messages.map((msg) => ({
      conversation_id: conversation.id,
      role: msg.role,
      content: msg.content,
    }))

    const { error: msgError } = await supabase.from("messages").insert(messageInserts)

    if (msgError) {
      console.error("Error inserting messages:", msgError)
      return NextResponse.json({ error: "Failed to save messages" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      conversation: {
        ...conversation,
        messages,
      },
    })
  } catch (error) {
    console.error("Error saving chat history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const conversationId = searchParams.get("conversationId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get user
    const { data: user } = await supabase.from("users").select("id").eq("session_id", sessionId).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (conversationId) {
      // Delete specific conversation
      const { error } = await supabase.from("conversations").delete().eq("id", conversationId).eq("user_id", user.id)

      if (error) {
        console.error("Error deleting conversation:", error)
        return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
      }
    } else {
      // Delete all conversations for user
      const { error } = await supabase.from("conversations").delete().eq("user_id", user.id)

      if (error) {
        console.error("Error deleting conversations:", error)
        return NextResponse.json({ error: "Failed to delete conversations" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
