<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Employee' : 'New Employee' }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ isEdit ? 'Update employee record' : 'Add a new employee to the organization' }}</p>
              </div>
              <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <!-- Personal Information -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Personal Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">First Name *</label>
                    <input v-model="form.firstName" type="text" required class="input" placeholder="Jane" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Last Name *</label>
                    <input v-model="form.lastName" type="text" required class="input" placeholder="Doe" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                    <input v-model="form.email" type="email" required class="input" placeholder="jane.doe@company.com" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                    <input v-model="form.phone" type="text" class="input" placeholder="+94 71 234 5678" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">National ID</label>
                    <input v-model="form.nationalId" type="text" class="input" placeholder="200012345678" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Date of Birth *</label>
                    <input v-model="form.dateOfBirth" type="date" required class="input" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Gender *</label>
                    <select v-model="form.gender" required class="input bg-white">
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">City</label>
                    <input v-model="form.city" type="text" class="input" placeholder="Colombo" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Address</label>
                    <input v-model="form.address" type="text" class="input" placeholder="Street address" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Country</label>
                    <input v-model="form.country" type="text" class="input" placeholder="Sri Lanka" />
                  </div>
                </div>
              </div>

              <!-- Employment Details -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Employment Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Department *</label>
                    <select v-model="form.departmentId" required class="input bg-white" @change="form.jobPositionId = ''">
                      <option value="" disabled>Select department</option>
                      <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Job Position *</label>
                    <select v-model="form.jobPositionId" required class="input bg-white" :disabled="!form.departmentId">
                      <option value="" disabled>Select position</option>
                      <option v-for="pos in positionsForDepartment" :key="pos.id" :value="pos.id">{{ pos.title }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Manager</label>
                    <select v-model="form.managerId" class="input bg-white">
                      <option value="">No manager</option>
                      <option v-for="emp in managerOptions" :key="emp.id" :value="emp.id">{{ emp.fullName }} — {{ emp.jobTitle }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Joining Date *</label>
                    <input v-model="form.joiningDate" type="date" required class="input" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Employment Type *</label>
                    <select v-model="form.employmentType" required class="input bg-white">
                      <option value="" disabled>Select type</option>
                      <option value="FullTime">Full Time</option>
                      <option value="PartTime">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Basic Salary *</label>
                    <div class="relative">
                      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                      <input v-model.number="form.basicSalary" type="number" min="0" step="0.01" required class="input pl-10" placeholder="0.00" />
                    </div>
                  </div>
                  <div v-if="isEdit">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                    <select v-model="form.status" class="input bg-white">
                      <option value="Active">Active</option>
                      <option value="OnLeave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Banking Details -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Banking Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Bank Name</label>
                    <input v-model="form.bankName" type="text" class="input" placeholder="e.g. Commercial Bank" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Bank Account No.</label>
                    <input v-model="form.bankAccountNo" type="text" class="input" placeholder="0000000000" />
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
                {{ loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  employee: { type: Object, default: null },
})
const emit = defineEmits(['close', 'success'])

const employeesStore = useEmployeesStore()
const departmentsStore = useDepartmentsStore()
const jobPositionsStore = useJobPositionsStore()

const isEdit = computed(() => !!props.employee)
const loading = ref(false)
const error = ref('')

const toDateInput = (value) => {
  if (!value) return ''
  return String(value).slice(0, 10)
}

const form = reactive({
  firstName: props.employee?.firstName ?? '',
  lastName: props.employee?.lastName ?? '',
  email: props.employee?.email ?? '',
  phone: props.employee?.phone ?? '',
  nationalId: props.employee?.nationalId ?? '',
  dateOfBirth: toDateInput(props.employee?.dateOfBirth),
  gender: props.employee?.gender ?? '',
  address: props.employee?.address ?? '',
  city: props.employee?.city ?? '',
  country: props.employee?.country ?? '',
  departmentId: props.employee?.departmentId ?? '',
  jobPositionId: props.employee?.jobPositionId ?? '',
  managerId: props.employee?.managerId ?? '',
  joiningDate: toDateInput(props.employee?.joiningDate) || new Date().toISOString().slice(0, 10),
  employmentType: props.employee?.employmentType ?? '',
  basicSalary: props.employee?.basicSalary ?? null,
  status: props.employee?.status ?? 'Active',
  bankName: props.employee?.bankName ?? '',
  bankAccountNo: props.employee?.bankAccountNo ?? '',
})

const positionsForDepartment = computed(() => {
  if (!form.departmentId) return []
  return jobPositionsStore.positions.filter((p) => p.departmentId === form.departmentId)
})

const managerOptions = computed(() =>
  employeesStore.employees.filter((e) => e.id !== props.employee?.id)
)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    nationalId: form.nationalId.trim() || null,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    address: form.address.trim() || null,
    city: form.city.trim() || null,
    country: form.country.trim() || null,
    departmentId: form.departmentId,
    jobPositionId: form.jobPositionId,
    managerId: form.managerId || null,
    joiningDate: form.joiningDate,
    employmentType: form.employmentType,
    basicSalary: form.basicSalary ?? 0,
    bankName: form.bankName.trim() || null,
    bankAccountNo: form.bankAccountNo.trim() || null,
  }

  if (isEdit.value) {
    payload.status = form.status
  }

  const result = isEdit.value
    ? await employeesStore.update(props.employee.id, payload)
    : await employeesStore.create(payload)

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}

onMounted(() => {
  if (!departmentsStore.departments.length) departmentsStore.fetchAll()
  if (!jobPositionsStore.positions.length) jobPositionsStore.fetchAll()
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
.input:disabled {
  background-color: rgb(249 250 251);
  cursor: not-allowed;
}
</style>
