// Simple resume reviewer using direct Gemini API calls
// This replaces the problematic LangChain implementation

// Simple resume reviewer using direct Gemini API calls

class ResumeReviewer {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not configured");
    }
    this.endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
  }

  async reviewResume({ text, jobDescription = "" }) {
    const instruction = `You are an expert technical recruiter and career coach.
Review the provided resume for clarity, relevance, and impact.
When a job description is provided, tailor feedback to that role.
Provide actionable, concise recommendations with examples when helpful.`;

    const prompt = [
      instruction,
      "",
      "Resume text:",
      text,
      "",
      jobDescription ? `Job description:\n${jobDescription}\n` : "",
      "Return:",
      "- A brief overall assessment",
      "- Top strengths (bulleted)",
      "- Top issues to fix (bulleted)",
      "- Tailoring suggestions specific to the target role (if provided)",
      "- Suggested bullet rewrites (2-5 improved bullet examples)",
    ]
      .filter(Boolean)
      .join("\n");

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2000,
      },
    };

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Do NOT send Authorization header for Gemini API key auth
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText} - ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      const content =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p?.text || "")
          .join("") || "";

      if (!content) {
        throw new Error("Invalid response from Gemini API");
      }

      return content;
    } catch (error) {
      console.error("Resume review error:", error);
      throw error;
    }
  }
}

export default ResumeReviewer;
