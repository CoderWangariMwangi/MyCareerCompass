"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { History, MessageSquare, Trash2, Search, Plus, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  title: string
  messages: any[]
  created_at: string
  updated_at: string
}

interface ChatHistorySidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLoadConversation: (conversation: Conversation) => void
  onNewChat: () => void
  sessionId: string
  currentConversationId: string | null
  isMobile: boolean
}

export function ChatHistorySidebar({
  isOpen,
  onToggle,
  onLoadConversation,
  onNewChat,
  sessionId,
  currentConversationId,
  isMobile,
}: ChatHistorySidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchChatHistory()
    }
  }, [isOpen, sessionId])

  const fetchChatHistory = async () => {
    if (!sessionId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/chat-history?sessionId=${sessionId}`)
      const data = await response.json()
      setConversations(data.history || [])
    } catch (error) {
      console.error("Error fetching chat history:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteConversation = async (conversationId: string) => {
    try {
      await fetch(`/api/chat-history?sessionId=${sessionId}&conversationId=${conversationId}`, {
        method: "DELETE",
      })
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  const clearAllHistory = async () => {
    try {
      await fetch(`/api/chat-history?sessionId=${sessionId}`, {
        method: "DELETE",
      })
      setConversations([])
    } catch (error) {
      console.error("Error clearing history:", error)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPreview = (messages: any[]) => {
    const userMessage = messages.find((msg) => msg.role === "user")
    return userMessage?.content?.slice(0, 60) + "..." || "No messages"
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Chat History</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button onClick={onNewChat} className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No conversations found" : "No chat history yet"}
              </p>
              <p className="text-sm text-gray-400 mt-2">Start a conversation to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow group">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0" onClick={() => onLoadConversation(conversation)}>
                            <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                              {conversation.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {getPreview(conversation.messages)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {conversation.messages.length} messages
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {conversations.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm" onClick={clearAllHistory} className="w-full text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          </div>
        )}
      </motion.div>

      {/* Toggle Button - Only show on mobile when sidebar is closed */}
      {(!isOpen || window.innerWidth >= 768) && (
        <motion.button
          onClick={onToggle}
          className="fixed left-4 top-24 z-40 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </motion.button>
      )}
    </>
  )
}
