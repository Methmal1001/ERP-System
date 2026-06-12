<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">New Performance Review</h2>
                <p class="text-sm text-gray-400 mt-0.5">Record a performance evaluation for an employee</p>
              </div>
              <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Employee *</label>
                  <select v-model="form.employeeId" required class="input bg-white">
                    <option value="" disabled>Select employee</option>
                    <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">
                      {{ emp.fullName }} &mdash; {{ emp.employeeNo }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Reviewer *</label>
                  <select v-model="form.reviewerId" required class="input bg-white">
                    <option value="" disabled>Select reviewer</option>
                    <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">
                      {{ emp.fullName }} &mdash; {{ emp.jobTitle }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Review Date *</label>
                  <input v-model="form.reviewDate" type="date" required class="input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Period *</label>
                  <input v-model="form.period" type="text" required class="input" placeholder="e.g. Q1 2026" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Rating *</label>
                <div class="flex items-center gap-1.5">
                  <button v-for="i in 5" :key="i" type="button" @click="form.rating = i" class="p-0.5">
                    <svg class="w-7 h-7 transition-colors" :class="i <= form.rating ? 'text-amber-400' : 'text-gray-200 hover:text-amber-200'" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
                    </svg>
                  </button>
                  <span class="text-sm font-semibold text-gray-600 ml-2">{{ form.rating }} / 5</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Strengths</label>
                <textarea v-model="form.strengths" rows="2" placeholder="Key strengths demonstrated..." class="input resize-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Areas for Improvement</label>
                <textarea v-model="form.improvements" rows="2" placeholder="Areas that need development..." class="input resize-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Goals</label>
                <textarea v-model="form.goals" rows="2" placeholder="Goals for the next period..." class="input resize-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Comments</label>
                <textarea v-model="form.comments" rows="2" placeholder="Additional comments..." class="input resize-none"></textarea>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                @click="$emit('close')"
                :disabled="loading"
                class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ loading ? 'Saving...' : 'Create Review' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const emit = defineEmits(['close', 'success'])

const employeesStore = useEmployeesStore()
const performanceStore = usePerformanceStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  employeeId: '',
  reviewerId: '',
  reviewDate: new Date().toISOString().slice(0, 10),
  period: '',
  rating: 3,
  strengths: '',
  improvements: '',
  goals: '',
  comments: '',
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const result = await performanceStore.create({
    employeeId: form.employeeId,
    reviewerId: form.reviewerId,
    reviewDate: form.reviewDate,
    period: form.period.trim(),
    rating: form.rating,
    strengths: form.strengths.trim() || undefined,
    improvements: form.improvements.trim() || undefined,
    goals: form.goals.trim() || undefined,
    comments: form.comments.trim() || undefined,
  })

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}

onMounted(() => {
  if (!employeesStore.employees.length) employeesStore.fetchAll({ pageSize: 100 })
})
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
