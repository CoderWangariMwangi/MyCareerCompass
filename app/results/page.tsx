"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Sparkles, TrendingUp, Users, DollarSign, GraduationCap, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

interface CareerSuggestion {
  title: string
  match: number
  description: string
  skills: string[]
  salaryRange: string
  growthOutlook: string
  workEnvironment: string
  educationRequired: string
  reasoning: string
}

export default function ResultsPage() {
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const analyzeQuiz = async () => {
      try {
        const answers = localStorage.getItem("quizAnswers")
        if (!answers) {
          setError("No quiz answers found. Please take the quiz first.")
          setLoading(false)
          return
        }

        const parsedAnswers = JSON.parse(answers)

        const response = await fetch("/api/analyze-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: parsedAnswers }),
        })

        if (!response.ok) {
          throw new Error("Failed to analyze quiz results")
        }

        const data = await response.json()
        setSuggestions(data.careers)
      } catch (error) {
        console.error("Error analyzing quiz:", error)
        setError("Failed to analyze your quiz results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    // Simulate AI processing time
    setTimeout(analyzeQuiz, 2000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-16 h-16 text-blue-600 mx-auto" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI is Analyzing Your Responses...</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Our advanced AI is processing your quiz answers to find the perfect career matches for you.
                </p>
                <div className="w-full max-w-md mx-auto">
                  <Progress value={75} className="h-2" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="p-8">
                <CardContent>
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Analysis Error</h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                  <Link href="/quiz">
                    <Button>Take Quiz Again</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Your AI-Powered Career Matches</h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Based on advanced AI analysis of your responses, here are the careers that align best with your
                interests, skills, and personality.
              </p>
            </motion.div>

            {/* Career Suggestions */}
            <div className="space-y-6">
              {suggestions.map((career, index) => (
                <motion.div
                  key={career.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">{career.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-blue-100">AI Match Score:</span>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {career.match}%
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{career.match}%</div>
                          <Progress value={career.match} className="w-24 h-2 bg-white/20" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 dark:text-gray-300 mb-6">{career.description}</p>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {career.skills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-gray-900 dark:text-white">Salary Range:</span>
                            <span className="text-gray-700 dark:text-gray-300">{career.salaryRange}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900 dark:text-white">Growth Outlook:</span>
                            <span className="text-gray-700 dark:text-gray-300">{career.growthOutlook}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-gray-900 dark:text-white">Work Environment:</span>
                            <span className="text-gray-700 dark:text-gray-300">{career.workEnvironment}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-gray-900 dark:text-white">Education:</span>
                            <span className="text-gray-700 dark:text-gray-300">{career.educationRequired}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-600" />
                          Why This Career Matches You
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{career.reasoning}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12 space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/careers">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Explore All Careers
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" size="lg">
                    Discuss with AI Advisor
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="outline" size="lg">
                    Retake Quiz
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Want personalized advice? Chat with our AI career advisor about these results.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
