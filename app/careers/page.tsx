"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, DollarSign, Users, Clock, GraduationCap } from "lucide-react"
import { Navigation } from "@/components/navigation"

const careers = [
  {
    title: "Software Developer",
    category: "Technology",
    description:
      "Design, develop, and maintain software applications using various programming languages and frameworks.",
    skills: ["Programming", "Problem Solving", "Debugging", "Version Control"],
    salaryRange: "$70,000 - $150,000",
    growthRate: "22%",
    workStyle: "Remote/Office",
    education: "Bachelor's Degree",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Data Scientist",
    category: "Analytics",
    description:
      "Analyze complex data sets to extract insights and drive business decisions using statistical methods.",
    skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization"],
    salaryRange: "$80,000 - $160,000",
    growthRate: "31%",
    workStyle: "Remote/Office",
    education: "Master's Degree",
    color: "from-green-500 to-teal-500",
  },
  {
    title: "UX/UI Designer",
    category: "Design",
    description: "Create intuitive and visually appealing user interfaces for digital products and applications.",
    skills: ["Design Thinking", "Prototyping", "User Research", "Visual Design"],
    salaryRange: "$60,000 - $120,000",
    growthRate: "13%",
    workStyle: "Hybrid",
    education: "Bachelor's Degree",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Product Manager",
    category: "Management",
    description: "Lead product development from conception to launch, coordinating between teams and stakeholders.",
    skills: ["Leadership", "Strategic Planning", "Communication", "Market Analysis"],
    salaryRange: "$90,000 - $180,000",
    growthRate: "8%",
    workStyle: "Office/Hybrid",
    education: "Bachelor's Degree",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Digital Marketing Specialist",
    category: "Marketing",
    description: "Develop and execute digital marketing campaigns across various online platforms and channels.",
    skills: ["SEO/SEM", "Content Marketing", "Analytics", "Social Media"],
    salaryRange: "$45,000 - $85,000",
    growthRate: "10%",
    workStyle: "Hybrid",
    education: "Bachelor's Degree",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Cybersecurity Analyst",
    category: "Security",
    description:
      "Protect organizations from cyber threats by monitoring, detecting, and responding to security incidents.",
    skills: ["Network Security", "Threat Analysis", "Risk Assessment", "Incident Response"],
    salaryRange: "$75,000 - $140,000",
    growthRate: "35%",
    workStyle: "Office/Remote",
    education: "Bachelor's Degree",
    color: "from-red-500 to-purple-500",
  },
  {
    title: "Cloud Architect",
    category: "Technology",
    description: "Design and implement cloud computing strategies and infrastructure for organizations.",
    skills: ["Cloud Platforms", "System Architecture", "DevOps", "Security"],
    salaryRange: "$120,000 - $200,000",
    growthRate: "25%",
    workStyle: "Remote/Office",
    education: "Bachelor's Degree",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Business Analyst",
    category: "Business",
    description: "Analyze business processes and requirements to improve efficiency and drive organizational growth.",
    skills: ["Process Analysis", "Requirements Gathering", "Documentation", "Problem Solving"],
    salaryRange: "$60,000 - $110,000",
    growthRate: "14%",
    workStyle: "Office/Hybrid",
    education: "Bachelor's Degree",
    color: "from-teal-500 to-green-500",
  },
  {
    title: "DevOps Engineer",
    category: "Technology",
    description:
      "Bridge development and operations teams to improve software deployment and infrastructure management.",
    skills: ["CI/CD", "Docker", "Kubernetes", "Infrastructure as Code"],
    salaryRange: "$85,000 - $155,000",
    growthRate: "20%",
    workStyle: "Remote/Office",
    education: "Bachelor's Degree",
    color: "from-blue-600 to-purple-600",
  },
  {
    title: "AI/ML Engineer",
    category: "Technology",
    description:
      "Develop and deploy machine learning models and artificial intelligence systems for various applications.",
    skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow/PyTorch"],
    salaryRange: "$100,000 - $180,000",
    growthRate: "40%",
    workStyle: "Remote/Office",
    education: "Master's Degree",
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Content Creator",
    category: "Creative",
    description: "Create engaging content across various platforms including video, written, and visual content.",
    skills: ["Content Writing", "Video Editing", "Social Media", "SEO"],
    salaryRange: "$35,000 - $75,000",
    growthRate: "15%",
    workStyle: "Remote/Freelance",
    education: "Bachelor's Degree",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Financial Analyst",
    category: "Finance",
    description:
      "Analyze financial data and market trends to provide investment recommendations and business insights.",
    skills: ["Financial Modeling", "Excel", "Data Analysis", "Risk Assessment"],
    salaryRange: "$55,000 - $95,000",
    growthRate: "6%",
    workStyle: "Office/Hybrid",
    education: "Bachelor's Degree",
    color: "from-green-600 to-emerald-600",
  },
  {
    title: "Nurse Practitioner",
    category: "Healthcare",
    description:
      "Provide advanced nursing care, diagnose conditions, and prescribe treatments in various healthcare settings.",
    skills: ["Clinical Skills", "Patient Care", "Diagnosis", "Treatment Planning"],
    salaryRange: "$95,000 - $130,000",
    growthRate: "45%",
    workStyle: "On-site",
    education: "Master's Degree",
    color: "from-blue-500 to-teal-500",
  },
  {
    title: "Sales Manager",
    category: "Sales",
    description: "Lead sales teams, develop strategies, and manage client relationships to drive revenue growth.",
    skills: ["Leadership", "Sales Strategy", "CRM", "Negotiation"],
    salaryRange: "$65,000 - $125,000",
    growthRate: "7%",
    workStyle: "Office/Hybrid",
    education: "Bachelor's Degree",
    color: "from-orange-600 to-red-600",
  },
  {
    title: "Graphic Designer",
    category: "Design",
    description: "Create visual concepts and designs for print and digital media to communicate ideas effectively.",
    skills: ["Adobe Creative Suite", "Typography", "Branding", "Layout Design"],
    salaryRange: "$40,000 - $70,000",
    growthRate: "3%",
    workStyle: "Remote/Office",
    education: "Bachelor's Degree",
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Project Manager",
    category: "Management",
    description:
      "Plan, execute, and oversee projects from initiation to completion while managing resources and timelines.",
    skills: ["Project Planning", "Risk Management", "Communication", "Agile/Scrum"],
    salaryRange: "$70,000 - $120,000",
    growthRate: "11%",
    workStyle: "Office/Hybrid",
    education: "Bachelor's Degree",
    color: "from-teal-600 to-cyan-600",
  },
  {
    title: "Teacher",
    category: "Education",
    description: "Educate and inspire students in various subjects while developing curriculum and assessment methods.",
    skills: ["Curriculum Development", "Classroom Management", "Communication", "Subject Expertise"],
    salaryRange: "$40,000 - $65,000",
    growthRate: "8%",
    workStyle: "On-site",
    education: "Bachelor's Degree",
    color: "from-yellow-600 to-orange-600",
  },
  {
    title: "Physical Therapist",
    category: "Healthcare",
    description:
      "Help patients recover from injuries and improve mobility through therapeutic exercises and treatments.",
    skills: ["Anatomy Knowledge", "Treatment Planning", "Patient Care", "Rehabilitation"],
    salaryRange: "$75,000 - $95,000",
    growthRate: "18%",
    workStyle: "On-site",
    education: "Doctoral Degree",
    color: "from-green-500 to-blue-500",
  },
  {
    title: "Social Media Manager",
    category: "Marketing",
    description: "Develop and implement social media strategies to build brand awareness and engage with audiences.",
    skills: ["Social Media Strategy", "Content Creation", "Analytics", "Community Management"],
    salaryRange: "$45,000 - $75,000",
    growthRate: "12%",
    workStyle: "Remote/Office",
    education: "Bachelor's Degree",
    color: "from-pink-600 to-purple-600",
  },
  {
    title: "Mechanical Engineer",
    category: "Engineering",
    description: "Design, develop, and test mechanical devices and systems for various industries and applications.",
    skills: ["CAD Software", "Problem Solving", "Mathematics", "Materials Science"],
    salaryRange: "$65,000 - $105,000",
    growthRate: "7%",
    workStyle: "Office/On-site",
    education: "Bachelor's Degree",
    color: "from-gray-600 to-slate-600",
  },
]

const categories = [
  "All",
  "Technology",
  "Design",
  "Analytics",
  "Management",
  "Marketing",
  "Security",
  "Business",
  "Creative",
  "Finance",
  "Healthcare",
  "Sales",
  "Education",
  "Engineering",
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || career.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">Explore Career Paths</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover detailed information about various careers, including salary ranges, required skills, and growth
              prospects. Search through our comprehensive database of {careers.length}+ careers.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search careers, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredCareers.length} of {careers.length} careers
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>
          </motion.div>

          {/* Career Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career, index) => (
              <motion.div
                key={career.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className={`bg-gradient-to-r ${career.color} text-white relative overflow-hidden`}>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {career.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+{career.growthRate}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:scale-105 transition-transform duration-300">
                        {career.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{career.description}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Key Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {career.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{career.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Salary</div>
                            <div className="text-gray-600 dark:text-gray-400">{career.salaryRange}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Work Style</div>
                            <div className="text-gray-600 dark:text-gray-400">{career.workStyle}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Education</div>
                            <div className="text-gray-600 dark:text-gray-400">{career.education}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredCareers.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                No careers found matching your search criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
