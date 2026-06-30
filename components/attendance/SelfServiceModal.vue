<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ headerTitle }}</h2>
              <p class="text-sm text-gray-400 mt-0.5">{{ todayLabel }}</p>
            </div>
            <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- No employee profile linked -->
          <div v-if="!employeeId" class="px-6 py-8 text-center">
            <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p class="text-gray-700 font-semibold mb-1">No employee profile linked</p>
            <p class="text-gray-400 text-sm">Your account isn't linked to an employee profile yet — contact HR.</p>
          </div>

          <!-- Choose step -->
          <div v-else-if="step === 'choose'" class="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              @click="step = 'attendance'"
              class="flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            >
              <div class="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm6-7l2 2 4-4" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-800">Mark Attendance</span>
            </button>
            <button
              type="button"
              @click="step = 'leave'"
              class="flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border-2 border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
            >
              <div class="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-800">Apply for Leave</span>
            </button>
          </div>

          <!-- Attendance step -->
          <form v-else-if="step === 'attendance'" @submit.prevent="handleMarkAttendance">
            <div class="px-6 py-5 space-y-4">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <label class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5 cursor-pointer">
                <input v-model="attendanceForm.present" type="checkbox" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Mark today as Present</span>
              </label>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Check In Time</label>
                  <input v-model="attendanceForm.checkInTime" type="time" class="input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Check Out Time</label>
                  <input v-model="attendanceForm.checkOutTime" type="time" class="input" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Note</label>
                <textarea v-model="attendanceForm.note" rows="2" placeholder="Optional note..." class="input resize-none"></textarea>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button type="button" @click="step = 'choose'" :disabled="loading" class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                Back
              </button>
              <button
                type="submit"
                :disabled="loading || !attendanceForm.present"
                class="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ loading ? 'Saving...' : 'Submit Attendance' }}
              </button>
            </div>
          </form>

          <!-- Leave step -->
          <form v-else @submit.prevent="handleApplyLeave">
            <div class="px-6 py-5 space-y-4">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div class="flex flex-wrap gap-2">
                <div
                  v-for="b in balanceChips"
                  :key="b.leaveTypeId"
                  class="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600"
                >
                  <span class="font-semibold text-gray-800">{{ b.name }}</span>: {{ b.remainingDays }} / {{ b.totalDays }} days left
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Leave Type *</label>
                <select v-model="leaveForm.leaveTypeId" required class="input bg-white">
                  <option value="" disabled>Select leave type</option>
                  <option v-for="lt in leaveStore.leaveTypes" :key="lt.id" :value="lt.id">{{ lt.name }}</option>
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Start Date *</label>
                  <input v-model="leaveForm.startDate" type="date" required class="input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">End Date *</label>
                  <input v-model="leaveForm.endDate" type="date" required :min="leaveForm.startDate" class="input" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Reason</label>
                <textarea v-model="leaveForm.reason" rows="2" placeholder="Optional reason..." class="input resize-none"></textarea>
              </div>

              <div class="bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl px-4 py-3">
                Your leave only counts against your balance once your reporting manager approves it.
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button type="button" @click="step = 'choose'" :disabled="loading" class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                Back
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
                {{ loading ? 'Submitting...' : 'Apply for Leave' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const emit = defineEmits(['close', 'success'])

const auth = useAuthStore()
const attendanceStore = useAttendanceStore()
const leaveStore = useLeaveStore()

const employeeId = computed(() => auth.user?.employeeId || '')
const step = ref('choose')
const loading = ref(false)
const error = ref('')

const today = new Date()
const todayIso = today.toISOString().slice(0, 10)
const todayLabel = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const headerTitle = computed(() => {
  if (step.value === 'attendance') return 'Mark Attendance'
  if (step.value === 'leave') return 'Apply for Leave'
  return 'What would you like to do?'
})

const attendanceForm = reactive({
  present: false,
  checkInTime: '',
  checkOutTime: '',
  note: '',
})

const leaveForm = reactive({
  leaveTypeId: '',
  startDate: todayIso,
  endDate: todayIso,
  reason: '',
})

const balanceChips = computed(() =>
  leaveStore.leaveTypes
    .filter((lt) => lt.isActive)
    .map((lt) => {
      const balance = leaveStore.leaveBalances.find((b) => b.leaveTypeName === lt.name)
      return {
        leaveTypeId: lt.id,
        name: lt.name,
        totalDays: balance?.totalDays ?? lt.maxDaysPerYear,
        remainingDays: balance?.remainingDays ?? lt.maxDaysPerYear,
      }
    })
)

const handleMarkAttendance = async () => {
  error.value = ''
  loading.value = true

  const result = await attendanceStore.mark({
    employeeId: employeeId.value,
    date: todayIso,
    checkInTime: attendanceForm.checkInTime ? `${attendanceForm.checkInTime}:00` : null,
    checkOutTime: attendanceForm.checkOutTime ? `${attendanceForm.checkOutTime}:00` : null,
    status: 'Present',
    note: attendanceForm.note.trim() || undefined,
  })

  loading.value = false

  if (result.success) {
    emit('success', { message: 'Attendance submitted — awaiting your manager\'s approval.' })
    emit('close')
  } else {
    error.value = result.error
  }
}

const handleApplyLeave = async () => {
  error.value = ''
  loading.value = true

  const result = await leaveStore.createLeaveRequest({
    employeeId: employeeId.value,
    leaveTypeId: leaveForm.leaveTypeId,
    startDate: leaveForm.startDate,
    endDate: leaveForm.endDate,
    reason: leaveForm.reason.trim() || undefined,
  })

  loading.value = false

  if (result.success) {
    emit('success', { message: 'Leave request submitted — awaiting your manager\'s approval.' })
    emit('close')
  } else {
    error.value = result.error
  }
}

watch(step, (value) => {
  error.value = ''
  if (value === 'leave' && employeeId.value) {
    if (!leaveStore.leaveTypes.length) leaveStore.fetchLeaveTypes()
    leaveStore.fetchLeaveBalances(employeeId.value)
  }
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
