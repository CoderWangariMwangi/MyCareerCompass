"use client"

import { useState, useEffect } from "react"

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    // Get or create session ID
    let id = localStorage.getItem("chatSessionId");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatSessionId", id);
    }
    setSessionId(id);
    setIsLoadingSession(false);
  }, []);

  const createNewSession = () => {
    setIsLoadingSession(true); // Indicate loading while new session is created
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chatSessionId", newId);
    setSessionId(newId);
    setIsLoadingSession(false);
    return newId;
  };

  return { sessionId, createNewSession, isLoadingSession };
}
