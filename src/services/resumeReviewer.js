import { createResumeReviewGraph } from "@/graphs/resumeReviewGraph";

class ResumeReviewer {
  /*
  User to upload resume and gpt model to review the resume
  */

  constructor() {
    this.resume = null;
    this.review = null;
  }

  async reviewResume(resume) {
    this.resume = resume;
    const graph = createResumeReviewGraph();

    const inputs = {
      resumeText: typeof resume === "string" ? resume : resume?.text || "",
      jobDescription: resume?.jobDescription || "",
    };

    const result = await graph.invoke(inputs);
    this.review = result.reviewText || "";
    return this.review;
  }
}
