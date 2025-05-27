"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"

const quizSections = [
  {
    title: "Interests",
    description: "What activities and subjects excite you?",
    questions: [
      {
        question: "Which activity sounds most appealing to you?",
        options: [
          "Analyzing data and finding patterns",
          "Creating visual designs and artwork",
          "Helping people solve their problems",
          "Building and fixing things with your hands",
        ],
      },
      {
        question: "In your free time, you prefer to:",
        options: [
          "Read about new technologies and innovations",
          "Attend social events and meet new people",
          "Work on creative projects or hobbies",
          "Spend time outdoors and stay active",
        ],
      },
      {
        question: "What type of content do you enjoy most?",
        options: [
          "Scientific articles and research papers",
          "Art galleries and design showcases",
          "Documentaries about social issues",
          "DIY tutorials and how-to guides",
        ],
      },
    ],
  },
  {
    title: "Skills",
    description: "What are your natural strengths?",
    questions: [
      {
        question: "Which skill comes most naturally to you?",
        options: [
          "Problem-solving and logical thinking",
          "Communication and public speaking",
          "Creative thinking and innovation",
          "Organization and attention to detail",
        ],
      },
      {
        question: "In group projects, you typically:",
        options: [
          "Take charge and lead the team",
          "Focus on research and analysis",
          "Handle the creative and design aspects",
          "Ensure everything runs smoothly and on time",
        ],
      },
      {
        question: "Your friends would describe you as:",
        options: ["The analytical thinker", "The natural leader", "The creative visionary", "The reliable organizer"],
      },
    ],
  },
  {
    title: "Personality",
    description: "What work environment suits you best?",
    questions: [
      {
        question: "Your ideal work environment is:",
        options: [
          "A quiet space where you can focus deeply",
          "A collaborative office with lots of interaction",
          "A flexible space where you can be creative",
          "A structured environment with clear processes",
        ],
      },
      {
        question: "When facing a challenge, you:",
        options: [
          "Research thoroughly before taking action",
          "Brainstorm with others to find solutions",
          "Think outside the box for creative solutions",
          "Break it down into manageable steps",
        ],
      },
      {
        question: "You feel most energized when:",
        options: [
          "Solving complex problems independently",
          "Collaborating with a diverse team",
          "Working on innovative projects",
          "Completing tasks efficiently and accurately",
        ],
      },
    ],
  },
]

export default function QuizPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  const totalQuestions = quizSections.reduce((total, section) => total + section.questions.length, 0)
  const currentQuestionIndex =
    quizSections.slice(0, currentSection).reduce((total, section) => total + section.questions.length, 0) +
    currentQuestion
  const progress =
    ((currentQuestionIndex + (Object.keys(answers).length > currentQuestionIndex ? 1 : 0)) / totalQuestions) * 100

  const handleAnswer = (answerIndex: number) => {
    const questionKey = `${currentSection}-${currentQuestion}`
    setAnswers((prev) => ({ ...prev, [questionKey]: answerIndex }))
  }

  const nextQuestion = () => {
    const section = quizSections[currentSection]
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentSection < quizSections.length - 1) {
      setCurrentSection(currentSection + 1)
      setCurrentQuestion(0)
    } else {
      setIsCompleted(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      setCurrentQuestion(quizSections[currentSection - 1].questions.length - 1)
    }
  }

  const submitQuiz = () => {
    // Store answers in localStorage for the results page
    localStorage.setItem("quizAnswers", JSON.stringify(answers))
    router.push("/results")
  }

  const currentQuestionKey = `${currentSection}-${currentQuestion}`
  const hasAnswered = answers[currentQuestionKey] !== undefined

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <Card className="p-8">
                <CardContent>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Great job! We're now analyzing your responses to provide personalized career recommendations.
                  </p>
                  <Button
                    onClick={submitQuiz}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    View My Results
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
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
            {/* Progress Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Career Assessment Quiz</h1>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>

            {/* Section Header */}
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Section {currentSection + 1}: {quizSections[currentSection].title}
                  </CardTitle>
                  <p className="text-blue-100">{quizSections[currentSection].description}</p>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSection}-${currentQuestion}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {quizSections[currentSection].questions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quizSections[currentSection].questions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                            answers[currentQuestionKey] === index
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                answers[currentQuestionKey] === index
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {answers[currentQuestionKey] === index && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-full h-full rounded-full bg-white"
                                />
                              )}
                            </div>
                            <span className="text-gray-900 dark:text-white">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevQuestion} disabled={currentSection === 0 && currentQuestion === 0}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={!hasAnswered}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentSection === quizSections.length - 1 &&
                currentQuestion === quizSections[currentSection].questions.length - 1
                  ? "Complete Quiz"
                  : "Next"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
