import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: `You are a professional career advisor and guidance counselor with expertise in:
      - Career development and planning
      - Job search strategies and techniques
      - Resume and cover letter optimization
      - Interview preparation and tips
      - Skill development recommendations
      - Industry trends and insights
      - Salary negotiation advice
      - Work-life balance guidance
      - Professional networking strategies
      - Career transition support
      - Educational pathways and certifications
      - Remote work and freelancing guidance
      - Personal branding and LinkedIn optimization

      Provide helpful, actionable, and encouraging advice. Be specific and practical in your recommendations. 
      Always maintain a supportive and professional tone. If asked about specific companies or salaries, 
      provide general guidance and suggest researching current market data.
      
      Keep responses concise but comprehensive, and always end with a follow-up question to continue the conversation.`,
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("Error processing chat request", { status: 500 })
  }
}
