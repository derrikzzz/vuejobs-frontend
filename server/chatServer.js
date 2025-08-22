import { WebSocketServer } from "ws";
import { createServer } from "http";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Job skills mapping
const jobSkillsMap = {
  "Data Analyst": [
    "python",
    "sql",
    "excel",
    "tableau",
    "powerbi",
    "r",
    "statistics",
    "data analysis",
  ],
  "Frontend Developer": [
    "javascript",
    "react",
    "vue",
    "angular",
    "html",
    "css",
    "typescript",
    "frontend",
  ],
  "Backend Developer": [
    "python",
    "java",
    "nodejs",
    "express",
    "django",
    "flask",
    "sql",
    "mongodb",
    "backend",
  ],
  "Full Stack Developer": [
    "javascript",
    "react",
    "vue",
    "angular",
    "nodejs",
    "express",
    "python",
    "django",
    "sql",
    "mongodb",
  ],
  "DevOps Engineer": [
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "jenkins",
    "git",
    "linux",
    "ci/cd",
  ],
  "Mobile Developer": [
    "react native",
    "flutter",
    "swift",
    "kotlin",
    "android",
    "ios",
    "mobile",
  ],
  "Data Scientist": [
    "python",
    "r",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "statistics",
  ],
  "UI/UX Designer": [
    "figma",
    "adobe xd",
    "sketch",
    "photoshop",
    "illustrator",
    "design",
    "prototyping",
  ],
  "Product Manager": [
    "agile",
    "scrum",
    "product management",
    "user research",
    "analytics",
    "strategy",
  ],
  "QA Engineer": [
    "selenium",
    "cypress",
    "jest",
    "testing",
    "quality assurance",
    "automation",
  ],
  "Vue Developer": [
    "vue",
    "javascript",
    "vuex",
    "pinia",
    "composition api",
    "options api",
    "frontend",
  ],
  "Software Engineer": [
    "python",
    "java",
    "javascript",
    "c++",
    "c#",
    "algorithms",
    "data structures",
    "software development",
  ],
};

// Job descriptions for recommendations
const jobDescriptions = {
  "Data Analyst":
    "Analyze data to help businesses make informed decisions. Work with databases, create reports, and identify trends.",
  "Frontend Developer":
    "Build user interfaces and interactive web applications. Focus on creating responsive and accessible user experiences.",
  "Backend Developer":
    "Develop server-side logic and APIs. Handle database operations and business logic implementation.",
  "Full Stack Developer":
    "Work on both frontend and backend development. End-to-end application development and deployment.",
  "DevOps Engineer":
    "Manage infrastructure, deployment pipelines, and system reliability. Bridge development and operations.",
  "Mobile Developer":
    "Create mobile applications for iOS and Android platforms. Focus on mobile-specific user experiences.",
  "Data Scientist":
    "Apply statistical analysis and machine learning to solve complex business problems.",
  "UI/UX Designer":
    "Design user interfaces and user experiences. Create wireframes, prototypes, and design systems.",
  "Product Manager":
    "Lead product development from conception to launch. Coordinate between stakeholders and development teams.",
  "QA Engineer":
    "Ensure software quality through testing and quality assurance processes.",
  "Vue Developer":
    "Specialize in Vue.js development. Build modern, reactive web applications using Vue ecosystem.",
  "Software Engineer":
    "Design, develop, and maintain software applications. Solve complex technical problems.",
};

class JobRecommendationChat {
  constructor() {
    this.userSkills = new Set();
    this.conversationHistory = [];
  }

  addSkills(skills) {
    const skillArray = Array.isArray(skills) ? skills : [skills];
    skillArray.forEach((skill) => {
      this.userSkills.add(skill.toLowerCase().trim());
    });
  }

  getRecommendations() {
    const recommendations = [];
    const skillCount = {};

    // Count matching skills for each job
    Object.entries(jobSkillsMap).forEach(([job, requiredSkills]) => {
      let matchCount = 0;
      requiredSkills.forEach((skill) => {
        if (this.userSkills.has(skill.toLowerCase())) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        skillCount[job] = matchCount;
      }
    });

    // Sort by match count and return top recommendations
    const sortedJobs = Object.entries(skillCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([job]) => job);

    return sortedJobs;
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Extract skills from message
    const extractedSkills = [];
    Object.values(jobSkillsMap)
      .flat()
      .forEach((skill) => {
        if (lowerMessage.includes(skill.toLowerCase())) {
          extractedSkills.push(skill);
        }
      });

    // Add extracted skills
    if (extractedSkills.length > 0) {
      this.addSkills(extractedSkills);
    }

    // Get recommendations
    const recommendations = this.getRecommendations();

    if (recommendations.length === 0) {
      return {
        type: "response",
        message:
          "I don't have enough information about your skills yet. Could you tell me more about your technical background, programming languages, or tools you're familiar with?",
        recommendations: [],
        skills: Array.from(this.userSkills),
      };
    }

    const recommendationText =
      recommendations.length === 1
        ? `Based on your skills, you might be interested in: ${recommendations[0]}`
        : `Based on your skills, you might be interested in: ${recommendations.join(", ")}`;

    return {
      type: "response",
      message: recommendationText,
      recommendations: recommendations.map((job) => ({
        title: job,
        description: jobDescriptions[job],
        matchScore: this.calculateMatchScore(job),
      })),
      skills: Array.from(this.userSkills),
    };
  }

  calculateMatchScore(job) {
    const requiredSkills = jobSkillsMap[job];
    const userSkillArray = Array.from(this.userSkills);
    const matches = requiredSkills.filter((skill) =>
      userSkillArray.some(
        (userSkill) =>
          userSkill.includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill)
      )
    );
    return Math.round((matches.length / requiredSkills.length) * 100);
  }

  reset() {
    this.userSkills.clear();
    this.conversationHistory = [];
  }
}

// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Job Recommendation Chat Server is running");
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store active connections and their chat instances
const connections = new Map();

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Create a new chat instance for this connection
  const chatInstance = new JobRecommendationChat();
  connections.set(ws, chatInstance);

  // Send welcome message
  const welcomeMessage = {
    type: "response",
    message:
      "Hello! I'm your job recommendation assistant. Tell me about your skills, programming languages, or tools you're familiar with, and I'll suggest relevant job opportunities for you.",
    recommendations: [],
    skills: [],
  };

  ws.send(JSON.stringify(welcomeMessage));

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "user_message") {
        const chatInstance = connections.get(ws);
        if (chatInstance) {
          const response = chatInstance.processMessage(message.content);
          ws.send(JSON.stringify(response));
        }
      } else if (message.type === "reset") {
        const chatInstance = connections.get(ws);
        if (chatInstance) {
          chatInstance.reset();
          const resetMessage = {
            type: "response",
            message: "Conversation reset! Tell me about your skills again.",
            recommendations: [],
            skills: [],
          };
          ws.send(JSON.stringify(resetMessage));
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message:
            "Sorry, I encountered an error processing your message. Please try again.",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    connections.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    connections.delete(ws);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Job Recommendation Chat Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});

export default server;
