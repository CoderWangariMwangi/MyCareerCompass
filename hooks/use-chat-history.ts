"use client"

import { useState } from "react"

interface Conversation {
  id: string
  title: string
  messages: any[]
  createdAt: string
  updatedAt: string
}

export function useChatHistory(sessionId: string) {
  const [isSaving, setIsSaving] = useState(false)

  const saveConversation = async (messages: any[], title?: string) => {
    if (!sessionId || messages.length === 0) return

    setIsSaving(true)
    try {
      // Generate title from first user message if not provided
      const generatedTitle =
        title ||
        messages.find((msg) => msg.role === "user")?.content?.slice(0, 50) + "..." ||
        `Chat ${new Date().toLocaleDateString()}`

      const response = await fetch("/api/chat-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          messages,
          title: generatedTitle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save conversation")
      }

      const data = await response.json()
      return data.conversation
    } catch (error) {
      console.error("Error saving conversation:", error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return { saveConversation, isSaving }
}
