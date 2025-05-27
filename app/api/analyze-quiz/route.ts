import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const CareerSuggestionSchema = z.object({
  careers: z.array(
    z.object({
      title: z.string(),
      match: z.number().min(0).max(100),
      description: z.string(),
      skills: z.array(z.string()),
      salaryRange: z.string(),
      growthOutlook: z.string(),
      workEnvironment: z.string(),
      educationRequired: z.string(),
      reasoning: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const { answers } = await req.json()

    if (!answers || typeof answers !== "object") {
      return new Response("Invalid quiz answers", { status: 400 })
    }

    // Convert answers to a readable format for AI analysis
    const answerSummary = Object.entries(answers)
      .map(([key, value]) => {
        const [section, question] = key.split("-")
        return `Section ${Number.parseInt(section) + 1}, Question ${Number.parseInt(question) + 1}: Option ${Number.parseInt(value as string) + 1}`
      })
      .join("\n")

    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      system: `You are a professional career counselor and psychologist specializing in career assessment. 
      Analyze the quiz responses and provide personalized career recommendations.
      
      The quiz has 3 sections:
      Section 1 (Interests): Questions about activities, preferences, and content types
      Section 2 (Skills): Questions about natural strengths and work styles  
      Section 3 (Personality): Questions about work environment and problem-solving approaches
      
      Each question has 4 options representing different career orientations:
      - Option 1: Analytical/Technical orientation
      - Option 2: Social/Communication orientation  
      - Option 3: Creative/Innovation orientation
      - Option 4: Practical/Organizational orientation
      
      Provide 4-6 career suggestions with realistic match percentages (70-95%), detailed descriptions, 
      required skills, current salary ranges, growth outlook, work environment, education requirements,
      and reasoning for the match based on their responses.`,
      prompt: `Analyze these quiz responses and provide personalized career recommendations:

${answerSummary}

Provide detailed career suggestions that match the user's interests, skills, and personality based on their responses.`,
      schema: CareerSuggestionSchema,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error analyzing quiz:", error)
    return new Response("Failed to analyze quiz results", { status: 500 })
  }
}
