import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Resume reviewer using Gemini API with client-side PDF parsing
class ResumeReviewer {
  constructor() {
    // We'll use the proxy endpoint, so we don't need the API key in the frontend
    this.apiEndpoint =
      "/gemini-api/v1beta/models/gemini-1.5-flash:generateContent";
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  }

  // Extract text from PDF using client-side PDF.js
  async extractTextFromPDF(file, progressCallback) {
    try {
      console.log("Starting client-side PDF text extraction...");
      if (progressCallback) progressCallback("Loading PDF...");

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      if (progressCallback) progressCallback("Parsing PDF document...");

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      console.log(`PDF loaded with ${pdf.numPages} pages`);
      let fullText = "";

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (progressCallback)
          progressCallback(
            `Extracting text from page ${pageNum}/${pdf.numPages}...`
          );

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine all text items from the page
        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ")
          .trim();

        if (pageText) {
          fullText += pageText + "\n\n";
        }
      }

      if (!fullText.trim()) {
        throw new Error(
          "No text could be extracted from the PDF - the file may contain only images or be password-protected"
        );
      }

      console.log("PDF text extraction completed successfully");
      if (progressCallback) progressCallback("PDF text extraction completed!");

      return fullText.trim();
    } catch (error) {
      console.error("PDF extraction error details:", error);

      if (error.message.includes("Invalid PDF")) {
        throw new Error(
          "Invalid PDF file. Please ensure the file is not corrupted."
        );
      } else if (error.message.includes("password")) {
        throw new Error(
          "Password-protected PDFs are not supported. Please provide an unprotected PDF."
        );
      } else {
        throw new Error(
          "Failed to extract text from PDF. Please try again or paste the text manually."
        );
      }
    }
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

Tone: Be direct, specific, and supportive—like a recruiter giving actionable coaching. Avoid vague advice ("make it stronger"), instead show *how* to improve with concrete rewrites and examples.
If applicable, suggest other jobs that the candidate may be a good fit for and be descriptive and detailed as much as possible.`;

    const prompt = [
      instruction,
      "",
      "Resume text:",
      text,
      "",
      jobDescription ? `Job description:\n${jobDescription}\n` : "",
      "",
      "Please provide a structured review following the format above, with tangible improvements that would increase the candidate's interview chances.",
    ]
      .filter(Boolean)
      .join("\n");

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4000,
        topP: 0.8,
        topK: 40,
      },
    };

    try {
      // Add API key as fallback if proxy doesn't handle it
      const url =
        this.apiKey && !this.apiEndpoint.includes("key=")
          ? `${this.apiEndpoint}?key=${this.apiKey}`
          : this.apiEndpoint;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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
