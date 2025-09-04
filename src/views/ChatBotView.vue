<script setup>
import JobChatBot from "@/components/JobChatBot.vue";
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Job Recommendation Assistant
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Chat with our AI assistant to discover job opportunities that match
          your skills and experience. Simply tell us about your technical
          background, programming languages, or tools you're familiar with.
        </p>
      </div>

      <!-- Chat Container -->
      <div class="max-w-4xl mx-auto">
        <JobChatBot />
      </div>

      <!-- Features Section -->
      <div class="mt-16 grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Smart Matching
          </h3>
          <p class="text-gray-600">
            Our AI analyzes your skills and matches them with relevant job
            opportunities in real-time.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Real-time Chat
          </h3>
          <p class="text-gray-600">
            Have a natural conversation with our assistant and get instant job
            recommendations.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Detailed Insights
          </h3>
          <p class="text-gray-600">
            Get detailed job descriptions, match scores, and skill analysis for
            each recommendation.
          </p>
        </div>
      </div>

      <!-- How to Use Section -->
      <div class="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          How to Use
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Example Conversations
            </h3>
            <div class="space-y-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-600 mb-2"><strong>You:</strong></p>
                <p class="text-sm">"I have experience with Python and SQL"</p>
                <p class="text-sm text-gray-600 mt-2">
                  <strong>Assistant:</strong>
                </p>
                <p class="text-sm">
                  "Based on your skills, you might be interested in: Data
                  Analyst"
                </p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-600 mb-2"><strong>You:</strong></p>
                <p class="text-sm">"I also know React and JavaScript"</p>
                <p class="text-sm text-gray-600 mt-2">
                  <strong>Assistant:</strong>
                </p>
                <p class="text-sm">
                  "Based on your skills, you might be interested in: Frontend
                  Developer, Data Analyst"
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Tips for Better Results
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                Mention specific programming languages (Python, JavaScript,
                Java, etc.)
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                Include frameworks and libraries (React, Vue, Django, Express,
                etc.)
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                Mention tools and technologies (Docker, AWS, Git, etc.)
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                Describe your experience level and domain expertise
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                Be specific about your interests and career goals
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}
</style>
