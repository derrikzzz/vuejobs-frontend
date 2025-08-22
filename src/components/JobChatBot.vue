<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";

// Reactive data
const messages = ref([]);
const newMessage = ref("");
const isConnected = ref(false);
const isTyping = ref(false);
const ws = ref(null);
const messagesContainer = ref(null);
const messageInput = ref(null);

// Computed properties
const connectionStatus = computed(() => {
  return isConnected.value ? "Online" : "Connecting...";
});

// WebSocket connection
const connectWebSocket = () => {
  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3001";

  try {
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => {
      console.log("WebSocket connected");
      isConnected.value = true;
    };

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleBotResponse(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.value.onclose = () => {
      console.log("WebSocket disconnected");
      isConnected.value = false;
      // Try to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.value.onerror = (error) => {
      console.error("WebSocket error:", error);
      isConnected.value = false;
    };
  } catch (error) {
    console.error("Error creating WebSocket connection:", error);
    isConnected.value = false;
  }
};

// Handle bot response
const handleBotResponse = (data) => {
  isTyping.value = false;

  if (data.type === "response") {
    messages.value.push({
      type: "bot",
      content: data.message,
      recommendations: data.recommendations || [],
      skills: data.skills || [],
      timestamp: new Date(),
    });
  } else if (data.type === "error") {
    messages.value.push({
      type: "bot",
      content: data.message,
      recommendations: [],
      skills: [],
      timestamp: new Date(),
    });
  }

  scrollToBottom();
};

// Send message
const sendMessage = async () => {
  const message = newMessage.value.trim();
  if (!message || !isConnected.value || isTyping.value) return;

  // Add user message to chat
  messages.value.push({
    type: "user",
    content: message,
    recommendations: [],
    skills: [],
    timestamp: new Date(),
  });

  // Clear input
  newMessage.value = "";
  autoResize();

  // Show typing indicator
  isTyping.value = true;

  // Send message to WebSocket
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(
      JSON.stringify({
        type: "user_message",
        content: message,
      })
    );
  }

  await nextTick();
  scrollToBottom();
};

// Reset chat
const resetChat = () => {
  messages.value = [];

  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(
      JSON.stringify({
        type: "reset",
      })
    );
  }
};

// Auto-resize textarea
const autoResize = () => {
  if (messageInput.value) {
    messageInput.value.style.height = "auto";
    messageInput.value.style.height =
      Math.min(messageInput.value.scrollHeight, 120) + "px";
  }
};

// Format timestamp
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

  if (diffInMinutes < 1) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return messageTime.toLocaleDateString();
};

// Scroll to bottom of messages
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Lifecycle hooks
onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Chat Header -->
    <div
      class="flex items-center justify-between p-4 bg-white border-b shadow-sm"
    >
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 text-white"
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
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            Job Recommendation Assistant
          </h3>
          <p class="text-sm text-gray-500">
            {{ connectionStatus }}
          </p>
        </div>
      </div>
      <button
        @click="resetChat"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Reset conversation"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'flex',
          message.type === 'user' ? 'justify-end' : 'justify-start',
        ]"
      >
        <div
          :class="[
            'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm',
            message.type === 'user'
              ? 'bg-green-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200',
          ]"
        >
          <p class="text-sm leading-relaxed">{{ message.content }}</p>

          <!-- Show recommendations if available -->
          <div
            v-if="message.recommendations && message.recommendations.length > 0"
            class="mt-3 space-y-2"
          >
            <div
              v-for="(job, jobIndex) in message.recommendations"
              :key="jobIndex"
              :class="[
                'p-3 rounded-lg border',
                message.type === 'user'
                  ? 'bg-green-700 border-green-600'
                  : 'bg-gray-50 border-gray-200',
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <h4 class="text-sm font-medium">{{ job.title }}</h4>
                <span
                  :class="[
                    'text-xs px-2 py-1 rounded-full',
                    message.type === 'user'
                      ? 'bg-green-800 text-green-100'
                      : 'bg-green-100 text-green-800',
                  ]"
                >
                  {{ job.matchScore }}% match
                </span>
              </div>
              <p class="text-xs opacity-80">{{ job.description }}</p>
            </div>
          </div>

          <!-- Show detected skills -->
          <div v-if="message.skills && message.skills.length > 0" class="mt-3">
            <p class="text-xs opacity-70 mb-2">Detected skills:</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="skill in message.skills"
                :key="skill"
                :class="[
                  'text-xs px-2 py-1 rounded-full',
                  message.type === 'user'
                    ? 'bg-green-700 text-green-100'
                    : 'bg-blue-100 text-blue-800',
                ]"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Message timestamp -->
          <div
            :class="[
              'text-xs mt-2 opacity-60',
              message.type === 'user' ? 'text-right' : 'text-left',
            ]"
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div
          class="bg-white text-gray-900 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-2 shadow-sm"
        >
          <div class="flex items-center space-x-1">
            <div class="flex space-x-1">
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.1s"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              ></div>
            </div>
            <span class="text-xs text-gray-500 ml-2">typing...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="p-4 bg-white border-t">
      <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
        <div class="flex-1 relative">
          <textarea
            v-model="newMessage"
            placeholder="Tell me about your skills (e.g., Python, React, SQL...)"
            class="w-full p-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="{ 'bg-gray-100': !isConnected || isTyping }"
            :disabled="!isConnected || isTyping"
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="newMessage += '\n'"
            @input="autoResize"
            ref="messageInput"
          ></textarea>
        </div>
        <button
          type="submit"
          :class="[
            'p-3 rounded-full transition-all duration-200 flex-shrink-0',
            isConnected && !isTyping && newMessage.trim()
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          :disabled="!isConnected || isTyping || !newMessage.trim()"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </button>
      </form>
    </div>

    <!-- Connection Status -->
    <div v-if="!isConnected" class="p-3 bg-red-50 border-t border-red-200">
      <div class="flex items-center justify-center space-x-2 text-red-600">
        <svg
          class="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        <span class="text-sm">Connecting...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for chat messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth animations */
.message {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Typing animation */
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
