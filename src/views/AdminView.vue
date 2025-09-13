<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import Card from "@/components/Card.vue";

const authStore = useAuthStore();
const toast = useToast();

const users = ref([]);
const loading = ref(false);
const selectedUser = ref(null);
const showRoleModal = ref(false);
const newRole = ref("job_seeker");

const roles = [
  {
    value: "job_seeker",
    label: "Job Seeker",
    description: "Can search and apply for jobs",
  },
  {
    value: "employer",
    label: "Employer",
    description: "Can post and manage job listings",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Full system access",
  },
];

// Mock user data - in real app, fetch from Firestore
const mockUsers = [
  {
    uid: "1",
    displayName: "John Doe",
    email: "john@example.com",
    role: "job_seeker",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    uid: "2",
    displayName: "Jane Smith",
    email: "jane@company.com",
    role: "employer",
    createdAt: "2024-02-10",
    isActive: true,
  },
];

const loadUsers = async () => {
  loading.value = true;
  try {
    // In a real app, you would fetch from Firestore
    // const usersSnapshot = await getDocs(collection(db, 'users'));
    // users.value = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // For now, use mock data
    users.value = mockUsers;
  } catch (error) {
    toast.error("Failed to load users");
    console.error("Error loading users:", error);
  } finally {
    loading.value = false;
  }
};

const openRoleModal = (user) => {
  selectedUser.value = user;
  newRole.value = user.role;
  showRoleModal.value = true;
};

const updateUserRole = async () => {
  if (!selectedUser.value) return;

  loading.value = true;
  try {
    const result = await authStore.updateUserRole(
      selectedUser.value.uid,
      newRole.value
    );

    if (result.success) {
      toast.success("User role updated successfully");

      // Update local user data
      const userIndex = users.value.findIndex(
        (u) => u.uid === selectedUser.value.uid
      );
      if (userIndex !== -1) {
        users.value[userIndex].role = newRole.value;
      }

      showRoleModal.value = false;
      selectedUser.value = null;
    } else {
      toast.error(result.error || "Failed to update user role");
    }
  } catch (error) {
    toast.error("An error occurred while updating the user role");
    console.error("Error updating user role:", error);
  } finally {
    loading.value = false;
  }
};

const getRoleInfo = (role) => {
  return roles.find((r) => r.value === role) || roles[0];
};

const getRoleColor = (role) => {
  const colors = {
    job_seeker: "bg-blue-100 text-blue-800",
    employer: "bg-green-100 text-green-800",
    admin: "bg-purple-100 text-purple-800",
  };
  return colors[role] || colors.job_seeker;
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Manage users and their roles</p>
      </div>

      <!-- Users Management -->
      <Card bg="bg-white">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            User Management
          </h2>

          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"
            ></div>
            <p class="text-gray-500 mt-2">Loading users...</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.uid">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.displayName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getRoleColor(user.role),
                      ]"
                    >
                      {{ getRoleInfo(user.role).label }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(user.createdAt).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ user.isActive ? "Active" : "Inactive" }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="openRoleModal(user)"
                      class="text-green-600 hover:text-green-900 mr-3"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <!-- Role Change Modal -->
      <div
        v-if="showRoleModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showRoleModal = false"
      >
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Change User Role
          </h3>

          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              User: <strong>{{ selectedUser?.displayName }}</strong>
            </p>
            <p class="text-sm text-gray-600 mb-4">
              Email: {{ selectedUser?.email }}
            </p>

            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select new role:
            </label>
            <select
              v-model="newRole"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option
                v-for="role in roles"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }} - {{ role.description }}
              </option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              @click="updateUserRole"
              :disabled="loading"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {{ loading ? "Updating..." : "Update Role" }}
            </button>
            <button
              @click="showRoleModal = false"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
