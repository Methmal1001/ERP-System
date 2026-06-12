<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Mark Attendance</h2>
                <p class="text-sm text-gray-400 mt-0.5">Record check-in/out and attendance status</p>
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
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Date *</label>
                  <input v-model="form.date" type="date" required class="input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Status *</label>
                  <select v-model="form.status" required class="input bg-white">
                    <option value="" disabled>Select status</option>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="OnLeave">On Leave</option>
                    <option value="HalfDay">Half Day</option>
                    <option value="WorkFromHome">Work From Home</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Check In Time</label>
                  <input v-model="form.checkInTime" type="time" class="input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Check Out Time</label>
                  <input v-model="form.checkOutTime" type="time" class="input" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Note</label>
                <textarea
                  v-model="form.note"
                  rows="2"
                  placeholder="Optional note..."
                  class="input resize-none"
                ></textarea>
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
                {{ loading ? 'Saving...' : 'Save Attendance' }}
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
  defaultEmployeeId: { type: String, default: '' },
  defaultDate: { type: String, default: '' },
})
const emit = defineEmits(['close', 'success'])

const employeesStore = useEmployeesStore()
const attendanceStore = useAttendanceStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  employeeId: props.defaultEmployeeId || '',
  date: props.defaultDate || new Date().toISOString().slice(0, 10),
  status: '',
  checkInTime: '',
  checkOutTime: '',
  note: '',
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const result = await attendanceStore.mark({
    employeeId: form.employeeId,
    date: form.date,
    checkInTime: form.checkInTime ? `${form.checkInTime}:00` : null,
    checkOutTime: form.checkOutTime ? `${form.checkOutTime}:00` : null,
    status: form.status,
    note: form.note.trim() || undefined,
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
