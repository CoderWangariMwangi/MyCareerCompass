"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Loader2, Save, Download } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useChat } from "ai/react"
import { ChatWelcome } from "@/components/chat-welcome"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import { useSession } from "@/hooks/use-session"
import { useChatHistory } from "@/hooks/use-chat-history"
import { toast } from "sonner"

interface Conversation {
  id: string
  title: string
  messages: any[]
  created_at: string
  updated_at: string
}

export default function ChatPage() {
  const { sessionId, createNewSession, isLoadingSession } = useSession()
  // Initialize useChatHistory only when sessionId is available and not null
  // Note: useChatHistory expects sessionId: string. If isLoadingSession is false, sessionId will be a string.
  const { saveConversation, isSaving } = useChatHistory(sessionId || ""); // Pass empty string if sessionID is null during initial brief moment before isLoadingSession guard
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open on desktop
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false) // Close sidebar on mobile by default
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm your AI Career Advisor. I can help you with career guidance, job search tips, skill development advice, and answer any questions about your professional journey. How can I assist you today?",
      },
    ],
  })

  const handleSuggestedQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as any)
  }

  const handleSaveConversation = async () => {
    if (messages.length <= 1) {
      toast.error("No conversation to save")
      return
    }

    try {
      const conversation = await saveConversation(messages)
      setCurrentConversationId(conversation.id)
      toast.success("Conversation saved successfully!")
    } catch (error) {
      toast.error("Failed to save conversation")
    }
  }

  const handleLoadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages)
    setCurrentConversationId(conversation.id)
    if (isMobile) setSidebarOpen(false)
    toast.success(`Loaded: ${conversation.title}`)
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm your AI Career Advisor. I can help you with career guidance, job search tips, skill development advice, and answer any questions about your professional journey. How can I assist you today?",
      },
    ])
    setCurrentConversationId(null)
    if (isMobile) setSidebarOpen(false)
    createNewSession()
  }

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-2">Loading chat session...</p>
      </div>
    );
  }

  // At this point, isLoadingSession is false, and sessionId should be a string.
  // We can use sessionId! if we are certain, or handle the null case if useChatHistory is called before the guard.
  // The useChatHistory call above was modified to pass `sessionId || ""` to satisfy its type, 
  // but it's better to ensure it's only effectively used when sessionId is truly ready.
  // For components like ChatHistorySidebar, we'll pass sessionId! as it's guarded by isLoadingSession.

  const exportConversation = () => {
    const conversationText = messages.map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`).join("\n\n")

    const blob = new Blob([conversationText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `career-chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Conversation exported!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />

      <ChatHistorySidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLoadConversation={handleLoadConversation}
        onNewChat={handleNewChat}
        currentConversationId={currentConversationId}
        sessionId={sessionId!} // Safe because isLoadingSession is false here
        isMobile={isMobile}
      />

      <div className={`pt-20 pb-4 transition-all duration-300 ${sidebarOpen && !isMobile ? "md:ml-80" : ""}`}>
        <div className="container mx-auto px-2 sm:px-4 h-[calc(100vh-6rem)]">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="w-full text-center mb-6 px-1">
              <div className="w-full flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:items-center sm:gap-2 mb-2">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 40px rgba(59, 130, 246, 0.8)",
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h1 className="min-w-0 max-w-full sm:max-w-none text-sm leading-tight tracking-tight sm:leading-normal sm:tracking-normal sm:text-lg md:text-xl lg:text-3xl font-bold text-gray-900 dark:text-white break-all text-center overflow-hidden">AI Career Advisor</h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Get personalized career advice and guidance from our AI assistant
              </p>
            </div>
              {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Sparkles className="w-5 h-5" />
                    Career Chat Assistant
                  </CardTitle>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {messages.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleSaveConversation}
                          disabled={isSaving}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={exportConversation}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 || (messages.length === 1 && messages[0].id === "welcome" && messages[0].role === "assistant") ? (
                  <ChatWelcome onSuggestedQuestion={handleSuggestedQuestion} />
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="w-8 h-8 bg-blue-600">
                              <AvatarFallback>
                                <Bot className="w-4 h-4 text-white" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="w-8 h-8 bg-purple-600">
                              <AvatarFallback>
                                <User className="w-4 h-4 text-white" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <Avatar className="w-8 h-8 bg-blue-600">
                          <AvatarFallback>
                            <Bot className="w-4 h-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything about careers..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
