"use client"

import { useState, useEffect } from "react"

export function useSession() {
  const [sessionId, setSessionId] = useState<string>("")

  useEffect(() => {
    // Get or create session ID
    let id = localStorage.getItem("chatSessionId")
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("chatSessionId", id)
    }
    setSessionId(id)
  }, [])

  const createNewSession = () => {
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("chatSessionId", newId)
    setSessionId(newId)
    return newId
  }

  return { sessionId, createNewSession }
}
