<script setup>
import { ref, computed } from "vue";
import Card from "@/components/Card.vue";
import AddActionForm from "@/components/AddActionForm.vue";

const showAddModal = ref(false);

const actions = ref([
  {
    id: 1,
    title: "Complete job application for Senior Vue Developer",
    priority: "urgent",
    dueDate: "2025-09-05",
    status: "pending",
  },
  {
    id: 2,
    title: "Update resume with latest project",
    priority: "urgent",
    dueDate: "2025-09-06",
    status: "pending",
  },
  {
    id: 3,
    title: "Prepare for technical interview at TechCorp",
    priority: "upcoming",
    dueDate: "2025-09-08",
    status: "pending",
  },
  {
    id: 4,
    title: "Follow up with HR at StartupXYZ",
    priority: "upcoming",
    dueDate: "2025-09-10",
    status: "pending",
  },
  {
    id: 5,
    title: "Research company culture for upcoming interview",
    priority: "upcoming",
    dueDate: "2025-09-12",
    status: "pending",
  },
]);

const urgentActions = computed(() =>
  actions.value.filter(
    (action) => action.priority === "urgent" && action.status === "pending"
  )
);

const upcomingActions = computed(() =>
  actions.value.filter(
    (action) => action.priority === "upcoming" && action.status === "pending"
  )
);

const completedActions = computed(() =>
  actions.value.filter((action) => action.status === "completed")
);

const toggleActionStatus = (actionId) => {
  const action = actions.value.find((a) => a.id === actionId);
  if (action) {
    if (action.status === "pending") {
      action.status = "completed";
      action.completedDate = new Date().toISOString().split("T")[0];
    } else {
      action.status = "pending";
      delete action.completedDate;
    }
  }
};

const openAddModal = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const addAction = (actionData) => {
  const newAction = {
    id: Date.now(),
    ...actionData,
    status: "pending",
  };
  actions.value.push(newAction);
  closeAddModal();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Action List</h1>
        <p class="text-gray-600">
          Manage your job search activities and stay organized
        </p>
        <button
          @click="openAddModal"
          class="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add New Action
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <!-- Urgent Section -->
        <div>
          <Card bg="bg-white">
            <div class="mb-4">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Urgent Actions
                </h2>
                <span
                  class="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ urgentActions.length }} urgent actions
                </span>
              </div>

              <div
                v-if="urgentActions.length === 0"
                class="text-gray-500 text-center py-8"
              >
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                No urgent actions
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="action in urgentActions"
                  :key="action.id"
                  class="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900 mb-1">
                        {{ action.title }}
                      </h3>
                      <p class="text-sm text-gray-600">
                        Due: {{ action.dueDate }}
                      </p>
                    </div>
                    <button
                      @click="toggleActionStatus(action.id)"
                      :class="[
                        action.status === 'completed'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                        'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      ]"
                    >
                      {{ action.status === "completed" ? "Done" : "Mark Done" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Upcoming Section -->
        <div>
          <Card bg="bg-white">
            <div class="mb-4">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Upcoming Actions
                </h2>
                <span
                  class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ upcomingActions.length }} upcoming actions
                </span>
              </div>

              <div
                v-if="upcomingActions.length === 0"
                class="text-gray-500 text-center py-8"
              >
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3a1 1 0 012 0v4h1a3 3 0 110 6H9v4a1 1 0 11-2 0v-4H6a3 3 0 110-6h2z"
                  />
                </svg>
                No upcoming actions
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="action in upcomingActions"
                  :key="action.id"
                  class="border border-blue-200 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900 mb-1">
                        {{ action.title }}
                      </h3>
                      <p class="text-sm text-gray-600">
                        Due: {{ action.dueDate }}
                      </p>
                    </div>
                    <button
                      @click="toggleActionStatus(action.id)"
                      :class="[
                        action.status === 'completed'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                        'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      ]"
                    >
                      {{ action.status === "completed" ? "Done" : "Mark Done" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Completed Section -->
        <div>
          <Card bg="bg-white">
            <div class="mb-4">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Completed Actions
                </h2>
                <span
                  class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ completedActions.length }} actions completed
                </span>
              </div>

              <div
                v-if="completedActions.length === 0"
                class="text-gray-500 text-center py-8"
              >
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                No completed actions yet
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="action in completedActions"
                  :key="action.id"
                  class="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900 mb-1 line-through">
                        {{ action.title }}
                      </h3>
                      <p class="text-sm text-gray-600">
                        Due: {{ action.dueDate }}
                        <span
                          v-if="action.completedDate"
                          class="ml-2 text-green-600"
                        >
                          • Completed: {{ action.completedDate }}
                        </span>
                      </p>
                    </div>
                    <button
                      @click="toggleActionStatus(action.id)"
                      class="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    >
                      Undo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Add Action Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeAddModal"
    >
      <AddActionForm @submit="addAction" @cancel="closeAddModal" />
    </div>
  </div>
</template>
