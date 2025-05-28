"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, TrendingUp, Users, BookOpen } from "lucide-react"

interface ChatWelcomeProps {
  onSuggestedQuestion: (question: string) => void;
}

const features = [
  {
    icon: Target,
    title: "Career Planning",
    description: "Get personalized career roadmaps and goal-setting strategies",
    color: "text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Skill Development",
    description: "Discover in-demand skills and learning resources for your field",
    color: "text-green-600",
  },
  {
    icon: Users,
    title: "Interview Prep",
    description: "Practice interview questions and get tips for success",
    color: "text-purple-600",
  },
  {
    icon: BookOpen,
    title: "Industry Insights",
    description: "Stay updated on trends and opportunities in your industry",
    color: "text-orange-600",
  },
]

export function ChatWelcome({ onSuggestedQuestion }: ChatWelcomeProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to AI Career Chat!</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          I'm your personal career advisor, ready to help you navigate your professional journey. Here's how I can
          assist you:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.button
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              const questions = {
                "Career Planning": "Can you help me create a career development plan?",
                "Skill Development": "What skills should I focus on developing for my career?",
                "Interview Prep": "How can I prepare for upcoming job interviews?",
                "Industry Insights": "What are the current trends in my industry?",
              };
              const questionText = 
                questions[feature.title as keyof typeof questions] ||
                `Tell me more about ${feature.title.toLowerCase()}`;
              onSuggestedQuestion(questionText);
            }}
            className="w-full text-left"
          >
            <Card className="h-full hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${feature.color} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.button>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 Click on any card above to start a conversation about that topic
        </p>
      </div>

      <div className="text-center">
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
          💡 Tip: Be specific about your career goals for more personalized advice
        </Badge>
      </div>
    </motion.div>
  )
}
