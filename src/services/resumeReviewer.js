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
Review the provided resume with a focus on making it more impactful, ATS-friendly, and tailored to the target role (if a job description is provided).

Your review should follow this structured output:

1. **Overall Assessment**  
   - 2–4 sentences summarizing first impressions: clarity, impact, professionalism, and fit for target roles.  

2. **Top Strengths**  
   - 3–5 concise bullet points highlighting what works well (e.g., quantified achievements, technical depth, leadership).  

3. **Top Issues to Fix**  
   - 3–5 concise bullet points on weaknesses (e.g., vague language, lack of metrics, formatting inconsistencies).  

4. **Tailoring Suggestions (if job description provided)**  
   - Explicitly compare resume against the job posting.  
   - Call out missing keywords, technical skills, or experiences to emphasize.  
   - Suggest how to reposition existing experience to align with the role.  

5. **Suggested Bullet Rewrites (3–5 examples)**  
   - Rewrite weak or generic resume bullets into strong, recruiter-standard bullets.  
   - Use action verbs, quantify results where possible, and align with ATS keywords.  
   - Example style: *"Optimized X by Y%, leading to Z impact."*  

Tone: Be direct, specific, and supportive—like a recruiter giving actionable coaching. Avoid vague advice (“make it stronger”), instead show *how* to improve with concrete rewrites and examples.
If applicable, suggest other jobs that the candidate may be a good fit for and be descriptive and detailed as much as possible.

Inputs:  
- Resume text  
- (Optional) Job description

Outputs:  
- A structured review following the above format, with tangible improvements that would increase the candidate's interview chances.`;

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
