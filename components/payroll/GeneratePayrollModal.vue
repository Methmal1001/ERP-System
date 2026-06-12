<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Generate Payroll</h2>
                <p class="text-sm text-gray-400 mt-0.5">Create a payroll record for an employee</p>
              </div>
              <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-4">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Employee *</label>
                <select v-model="form.employeeId" required class="input bg-white">
                  <option value="" disabled>Select employee</option>
                  <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">
                    {{ emp.fullName }} &mdash; {{ emp.employeeNo }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Month *</label>
                  <select v-model.number="form.month" required class="input bg-white">
                    <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">{{ name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Year *</label>
                  <input v-model.number="form.year" type="number" required min="2000" class="input" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Allowances</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input v-model.number="form.allowances" type="number" min="0" step="0.01" class="input pl-10" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Bonuses</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input v-model.number="form.bonuses" type="number" min="0" step="0.01" class="input pl-10" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Overtime Pay</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input v-model.number="form.overtimePay" type="number" min="0" step="0.01" class="input pl-10" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Deductions</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input v-model.number="form.deductions" type="number" min="0" step="0.01" class="input pl-10" placeholder="0.00" />
                  </div>
                </div>
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
                {{ loading ? 'Generating...' : 'Generate Payroll' }}
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

const props = defineProps({
  defaultMonth: { type: Number, default: 0 },
  defaultYear: { type: Number, default: 0 },
})
const emit = defineEmits(['close', 'success'])

const employeesStore = useEmployeesStore()
const payrollStore = usePayrollStore()
const auth = useAuthStore()

const loading = ref(false)
const error = ref('')

const now = new Date()
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const form = reactive({
  employeeId: '',
  month: props.defaultMonth || now.getMonth() + 1,
  year: props.defaultYear || now.getFullYear(),
  allowances: 0,
  bonuses: 0,
  overtimePay: 0,
  deductions: 0,
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const result = await payrollStore.generate({
    employeeId: form.employeeId,
    month: form.month,
    year: form.year,
    allowances: form.allowances ?? 0,
    bonuses: form.bonuses ?? 0,
    overtimePay: form.overtimePay ?? 0,
    deductions: form.deductions ?? 0,
    processedById: auth.user?.id ?? null,
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
