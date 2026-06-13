<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-md mx-auto space-y-5">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Change Password</h2>
            <p class="text-xs text-gray-400">Keep your account secure with a strong password</p>
          </div>
        </div>

        <div v-if="error" class="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ error }}
        </div>

        <div v-if="success" class="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Your password has been changed successfully.
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Current Password</label>
            <input
              v-model="currentPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="input"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">New Password</label>
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              placeholder="••••••••"
              class="input"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Confirm New Password</label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              placeholder="••••••••"
              class="input"
            />
          </div>

          <button
            type="button"
            @click="showPassword = !showPassword"
            class="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <circle v-if="!showPassword" cx="12" cy="12" r="3" />
            </svg>
            {{ showPassword ? 'Hide passwords' : 'Show passwords' }}
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="text-xs text-blue-700 leading-relaxed">
          Use at least 6 characters with a mix of letters, numbers, and symbols. You'll need to sign in again on other devices after changing your password.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  middleware: 'auth',
  title: 'Change Password',
  subtitle: 'Update your account security credentials',
})

const auth = useAuthStore()
const toast = useToast()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'New passwords do not match.'
    return
  }

  if (newPassword.value === currentPassword.value) {
    error.value = 'New password must be different from the current password.'
    return
  }

  loading.value = true
  const result = await auth.changePassword(currentPassword.value, newPassword.value)
  loading.value = false

  if (result.success) {
    success.value = true
    toast.success('Password changed successfully.')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
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
