<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-md mx-auto space-y-5">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <span class="text-white text-sm font-bold">{{ auth.initials }}</span>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">My Profile</h2>
            <p class="text-xs text-gray-400">View and update your account details</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">{{ auth.user?.role ?? 'Guest' }}</span>
          <span class="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">{{ auth.permissions.length }} permissions granted</span>
        </div>

        <div v-if="error" class="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
            <input v-model="name" type="text" required placeholder="Your full name" class="input" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
            <input v-model="username" type="text" required placeholder="your.username" class="input" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
            <input v-model="email" type="email" required placeholder="you@company.com" class="input" />
          </div>

          <button
            type="submit"
            :disabled="loading || !isDirty"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <NuxtLink
        to="/account/change-password"
        class="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-blue-200 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Change Password</p>
            <p class="text-xs text-gray-400">Update your account security credentials</p>
          </div>
        </div>
        <svg class="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth',
  title: 'My Profile',
  subtitle: 'View and edit your account details',
})

const auth = useAuthStore()
const toast = useToast()

const name = ref(auth.user?.name ?? '')
const username = ref(auth.user?.username ?? '')
const email = ref(auth.user?.email ?? '')
const loading = ref(false)
const error = ref('')

const isDirty = computed(() =>
  name.value !== (auth.user?.name ?? '') ||
  username.value !== (auth.user?.username ?? '') ||
  email.value !== (auth.user?.email ?? '')
)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  const result = await auth.updateProfile({ name: name.value.trim(), username: username.value.trim(), email: email.value.trim() })
  loading.value = false

  if (result.success) {
    toast.success('Profile updated successfully.')
  } else {
    error.value = result.error
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input:focus {
  outline: none;
  border-color: rgb(96 165 250);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}
</style>
