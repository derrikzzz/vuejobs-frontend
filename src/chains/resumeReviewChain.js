import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Creates a reusable chain for resume review. Optionally accepts a Zod schema
// via `outputSchema` to return structured output when desired.
export function createResumeReviewChain({ model, outputSchema } = {}) {
  const llm =
    model ||
    new ChatOpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      [
        "You are an expert technical recruiter and career coach.",
        "Review the provided resume for clarity, relevance, and impact.",
        "When a job description is provided, tailor feedback to that role.",
        "Provide actionable, concise recommendations with examples when helpful.",
      ].join(" "),
    ],
    [
      "user",
      [
        "Resume text:\n{resumeText}",
        "\n\nOptional job description (if any):\n{jobDescription}",
        "\n\nReturn:",
        "- A brief overall assessment",
        "- Top strengths (bulleted)",
        "- Top issues to fix (bulleted)",
        "- Tailoring suggestions specific to the target role (if provided)",
        "- Suggested bullet rewrites (2-5 improved bullet examples)",
      ].join("\n"),
    ],
  ]);

  let chain = prompt.pipe(llm);

  // If a schema is provided, return structured output using model-native JSON mode
  if (outputSchema && typeof chain.withStructuredOutput === "function") {
    chain = chain.withStructuredOutput(outputSchema);
  }

  return chain;
}
