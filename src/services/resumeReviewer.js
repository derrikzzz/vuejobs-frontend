// Resume reviewer using Gemini API with PDF support
class ResumeReviewer {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is not configured in environment variables"
      );
    }
    this.uploadEndpoint = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${this.apiKey}`;
    this.generateEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    this.filesEndpoint = `https://generativelanguage.googleapis.com/v1beta/files`;
  }

  // Extract text from PDF using Gemini File API
  async extractTextFromPDF(file) {
    // Validate API key first
    if (!this.apiKey || this.apiKey === 'undefined') {
      throw new Error("VITE_GEMINI_API_KEY is not configured in environment variables");
    }

    let fileName = null;

    try {
      console.log("Starting PDF upload process...");

      // Upload the PDF file to Gemini
      const uploadResponse = await this.uploadFileToGemini(file);
      console.log("Upload response:", uploadResponse);

      const fileUri = uploadResponse.file.uri;
      fileName = uploadResponse.file.name;

      console.log("File uploaded, waiting for processing...");

      // Wait for file processing
      await this.waitForFileProcessing(fileName);

      console.log("File processed, extracting text...");

      // Extract text using Gemini
      const extractedText = await this.extractTextWithGemini(fileUri);

      console.log("Text extracted successfully");

      // Clean up - delete the uploaded file
      await this.deleteFile(fileName);

      return extractedText;
    } catch (error) {
      console.error("PDF extraction error details:", error);

      // Clean up on error if file was uploaded
      if (fileName) {
        try {
          await this.deleteFile(fileName);
        } catch (cleanupError) {
          console.warn("Failed to cleanup file on error:", cleanupError);
        }
      }

      // Provide more specific error messages
      if (error.message.includes("Upload failed")) {
        throw new Error(`Upload error: ${error.message}`);
      } else if (error.message.includes("File processing")) {
        throw new Error(
          "PDF processing failed. The file may be corrupted or password-protected."
        );
      } else if (error.message.includes("Text extraction failed")) {
        throw new Error(
          "Could not extract text from PDF. The file may contain only images."
        );
      } else {
        throw new Error(
          "Failed to process PDF. Please try again or paste the text manually."
        );
      }
    }
  }

  // Upload file to Gemini File API
  async uploadFileToGemini(file) {
    try {
      console.log(`Uploading file: ${file.name} (${file.size} bytes)`);

      // Create FormData with the file
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await fetch(this.uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error response:", errorText);

        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.message) {
            errorMessage += ` - ${errorData.error.message}`;
          }
        } catch (parseError) {
          // If cannot parse the error, include the raw text
          errorMessage += ` - ${errorText}`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      if (error.message.includes("Upload failed")) {
        throw error;
      }
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Wait for file processing to complete
  async waitForFileProcessing(fileName) {
    const maxAttempts = 15; // Increased attempts
    const delay = 2000; // 2 seconds

    console.log(`Waiting for file processing: ${fileName}`);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `${this.filesEndpoint}/${fileName}?key=${this.apiKey}`
        );

        if (response.ok) {
          const fileData = await response.json();
          console.log(
            `Processing attempt ${attempt + 1}, state: ${fileData.state}`
          );

          if (fileData.state === "ACTIVE") {
            return fileData;
          }
          if (fileData.state === "FAILED") {
            throw new Error(
              "File processing failed - the PDF may be corrupted or unsupported"
            );
          }
          // If state is PROCESSING, continue waiting
        } else {
          console.warn(`File status check failed: ${response.status}`);
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Processing check attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }

    throw new Error(
      "File processing timeout - please try again with a smaller file"
    );
  }

  // Extract text using Gemini with the uploaded file
  async extractTextWithGemini(fileUri) {
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Please extract all the text content from this PDF resume. Return only the plain text content without any additional commentary, formatting, or analysis.",
            },
            {
              file_data: {
                mime_type: "application/pdf",
                file_uri: fileUri,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.0, // More deterministic
        maxOutputTokens: 8000, // Increased token limit
      },
    };

    console.log("Sending text extraction request...");

    const response = await fetch(this.generateEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Text extraction error response:", errorText);

      let errorMessage = `Text extraction failed: ${response.status} ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (parseError) {
        errorMessage += ` - ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text || "")
        .join("") || "";

    if (!content || content.trim().length === 0) {
      throw new Error(
        "No text could be extracted from the PDF - the file may contain only images or be password-protected"
      );
    }

    return content.trim();
  }

  // Delete uploaded file from Gemini
  async deleteFile(fileName) {
    try {
      const response = await fetch(
        `${this.filesEndpoint}/${fileName}?key=${this.apiKey}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("File deleted successfully");
      } else {
        console.warn("Failed to delete file:", response.status);
      }
    } catch (error) {
      console.warn("Failed to delete uploaded file:", error);
      // Non-critical error, don't throw
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
      const response = await fetch(this.generateEndpoint, {
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
