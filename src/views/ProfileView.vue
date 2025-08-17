<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(false)
const activeTab = ref('profile')
const showChangePassword = ref(false)

// Profile form data
const profileForm = ref({
  displayName: '',
  email: ''
})

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const user = computed(() => authStore.currentUser)
const isEmailVerified = computed(() => authStore.isEmailVerified)

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      displayName: user.value.displayName || '',
      email: user.value.email || ''
    }
  }

  // Show message if redirected here for email verification
  if (route.query.message) {
    toast.info(route.query.message)
  }
})

const handleUpdateProfile = async () => {
  if (!profileForm.value.displayName) {
    toast.error('Please enter your name')
    return
  }

  loading.value = true
  try {
    const result = await authStore.updateProfile({
      displayName: profileForm.value.displayName
    })

    if (result.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(result.error || 'Failed to update profile')
    }
  } catch (error) {
    toast.error('An error occurred while updating profile')
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    toast.error('Please fill in all password fields')
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('New passwords do not match')
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    toast.error('New password must be at least 6 characters long')
    return
  }

  // Strong password validation
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  if (!strongPasswordRegex.test(passwordForm.value.newPassword)) {
    toast.error('Password must contain uppercase, lowercase, number, and special character')
    return
  }

  loading.value = true
  try {
    const result = await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    if (result.success) {
      toast.success('Password changed successfully')
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      showChangePassword.value = false
    } else {
      toast.error(result.error || 'Failed to change password')
    }
  } catch (error) {
    toast.error('An error occurred while changing password')
  } finally {
    loading.value = false
  }
}

const handleSendVerificationEmail = async () => {
  loading.value = true
  try {
    const result = await authStore.sendEmailVerification()

    if (result.success) {
      toast.success('Verification email sent! Check your inbox.')
    } else {
      toast.error(result.error || 'Failed to send verification email')
    }
  } catch (error) {
    toast.error('An error occurred while sending verification email')
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  loading.value = true
  try {
    const result = await authStore.logout()
    if (result.success) {
      toast.success('Logged out successfully')
      router.push('/login')
    } else {
      toast.error(result.error || 'Failed to logout')
    }
  } catch (error) {
    toast.error('An error occurred during logout')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-green-600">
                {{ user?.displayName?.charAt(0)?.toUpperCase() || '?' }}
              </span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ user?.displayName || 'Anonymous User' }}</h1>
              <p class="text-gray-600">{{ user?.email }}</p>
              <div class="flex items-center mt-1">
                <span class="text-sm" :class="isEmailVerified ? 'text-green-600' : 'text-orange-600'">
                  {{ isEmailVerified ? '✓ Email Verified' : '⚠️ Email Not Verified' }}
                </span>
              </div>
            </div>
          </div>
          <InteractiveHoverButton
            text="Logout"
            @click="handleLogout"
            :disabled="loading"
            class="bg-red-600 text-white border-red-600 hover:bg-red-700 disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Email Verification Alert -->
      <div v-if="!isEmailVerified" class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-orange-800">Email Verification Required</h3>
            <p class="text-sm text-orange-700 mt-1">Please verify your email address to access all features.</p>
          </div>
          <InteractiveHoverButton
            text="Send Verification Email"
            @click="handleSendVerificationEmail"
            :disabled="loading"
            class="bg-orange-600 text-white border-orange-600 hover:bg-orange-700 disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'profile'"
              :class="[
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
                'py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Profile Settings
            </button>
            <button
              @click="activeTab = 'security'"
              :class="[
                activeTab === 'security'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
                'py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Security
            </button>
          </nav>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
          <form @submit.prevent="handleUpdateProfile" class="space-y-4 max-w-md">
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="displayName"
                v-model="profileForm.displayName"
                type="text"
                required
                class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                disabled
                class="w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-500"
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <InteractiveHoverButton
              text="Update Profile"
              type="submit"
              :disabled="loading"
              class="bg-green-600 text-white border-green-600 hover:bg-green-700 disabled:opacity-50"
            />
          </form>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
          
          <div class="space-y-6">
            <!-- Change Password -->
            <div>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Password</h3>
                  <p class="text-sm text-gray-500">Change your account password</p>
                </div>
                <InteractiveHoverButton
                  v-if="!showChangePassword"
                  text="Change Password"
                  @click="showChangePassword = true"
                  class="bg-gray-600 text-white border-gray-600 hover:bg-gray-700"
                />
              </div>
              
              <form v-if="showChangePassword" @submit.prevent="handleChangePassword" class="mt-4 space-y-4 max-w-md">
                <div>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="Current Password"
                    required
                    class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="New Password"
                    required
                    class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div class="flex space-x-2">
                  <InteractiveHoverButton
                    text="Update Password"
                    type="submit"
                    :disabled="loading"
                    class="bg-green-600 text-white border-green-600 hover:bg-green-700 disabled:opacity-50"
                  />
                  <InteractiveHoverButton
                    text="Cancel"
                    type="button"
                    @click="showChangePassword = false; passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' }"
                    class="bg-gray-500 text-white border-gray-500 hover:bg-gray-600"
                  />
                </div>
              </form>
            </div>

            <!-- Account Actions -->
            <div class="border-t pt-6">
              <h3 class="text-sm font-medium text-gray-900 mb-4">Account Actions</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Sign out of all devices</p>
                    <p class="text-sm text-gray-500">This will log you out of all active sessions</p>
                  </div>
                  <InteractiveHoverButton
                    text="Sign Out All"
                    @click="handleLogout"
                    :disabled="loading"
                    class="bg-orange-600 text-white border-orange-600 hover:bg-orange-700 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
