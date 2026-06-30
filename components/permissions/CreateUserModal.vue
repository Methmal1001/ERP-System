<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ step === 1 ? 'Create User' : 'Assign Job Role' }}</h2>
              <p class="text-sm text-gray-400 mt-0.5">
                {{ step === 1 ? 'Step 1 of 2 — Register the login account' : 'Step 2 of 2 — Link this account to an employee profile' }}
              </p>
            </div>
            <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Step indicator -->
          <div class="px-6 pt-4 flex items-center gap-2">
            <div class="flex items-center gap-2 flex-1">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" :class="step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'">1</div>
              <span class="text-xs font-medium" :class="step >= 1 ? 'text-gray-700' : 'text-gray-400'">Account</span>
            </div>
            <div class="flex-1 h-px bg-gray-100"></div>
            <div class="flex items-center gap-2 flex-1 justify-end">
              <span class="text-xs font-medium" :class="step >= 2 ? 'text-gray-700' : 'text-gray-400'">Job Role</span>
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" :class="step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'">2</div>
            </div>
          </div>

          <!-- Step 1: Account -->
          <form v-if="step === 1" @submit.prevent="handleCreateAccount">
            <div class="px-6 py-5 space-y-4">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div class="bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The NIC entered below will be used as the user's <strong>initial password</strong> (min. 8 characters). The user should change their password after logging in.
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                <input v-model="accountForm.fullName" type="text" required class="input" placeholder="Jane Doe" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Username *</label>
                <input v-model="accountForm.username" type="text" required class="input" placeholder="jane.doe" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Employee No. *</label>
                <input v-model="accountForm.empNo" type="text" required class="input" placeholder="EMP-0001" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                <input v-model="accountForm.email" type="email" required class="input" placeholder="jane.doe@company.com" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">NIC *</label>
                <input v-model="accountForm.nic" type="text" required minlength="8" class="input" placeholder="National Identity Card number (used as password)" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Role *</label>
                <select v-model="accountForm.roleId" required class="input bg-white">
                  <option value="" disabled>Select role</option>
                  <option v-for="role in selectableRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
                </select>
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
                {{ loading ? 'Creating...' : 'Create & Continue' }}
              </button>
            </div>
          </form>

          <!-- Step 2: Assign Job Role / Employee Profile -->
          <form v-else @submit.prevent="handleCreateEmployee">
            <div class="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div class="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Account created for <strong>{{ createdUser?.email }}</strong>. Now set up their employee profile and assign a department &amp; job position.
              </div>

              <!-- Personal Information -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Personal Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">First Name *</label>
                    <input v-model="employeeForm.firstName" type="text" required class="input" placeholder="Jane" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Last Name *</label>
                    <input v-model="employeeForm.lastName" type="text" required class="input" placeholder="Doe" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                    <input v-model="employeeForm.phone" type="text" class="input" placeholder="+94 71 234 5678" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">National ID</label>
                    <input v-model="employeeForm.nationalId" type="text" class="input" disabled />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Date of Birth *</label>
                    <input v-model="employeeForm.dateOfBirth" type="date" required class="input" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Gender *</label>
                    <select v-model="employeeForm.gender" required class="input bg-white">
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">City</label>
                    <input v-model="employeeForm.city" type="text" class="input" placeholder="Colombo" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Address</label>
                    <input v-model="employeeForm.address" type="text" class="input" placeholder="Street address" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Country</label>
                    <input v-model="employeeForm.country" type="text" class="input" placeholder="Sri Lanka" />
                  </div>
                </div>
              </div>

              <!-- Employment Details -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Employment Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Department *</label>
                    <select v-model="employeeForm.departmentId" required class="input bg-white" @change="employeeForm.jobPositionId = ''">
                      <option value="" disabled>Select department</option>
                      <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Job Position *</label>
                    <select v-model="employeeForm.jobPositionId" required class="input bg-white" :disabled="!employeeForm.departmentId">
                      <option value="" disabled>Select position</option>
                      <option v-for="pos in positionsForDepartment" :key="pos.id" :value="pos.id">{{ pos.title }}</option>
                    </select>
                  </div>
                  <div v-if="!isCreatingTopRole">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Reporting Manager *</label>
                    <select v-model="employeeForm.managerId" required class="input bg-white">
                      <option value="" disabled>Select reporting manager</option>
                      <option v-for="emp in managerCandidates" :key="emp.id" :value="emp.id">{{ emp.fullName }} — {{ emp.jobTitle }}</option>
                    </select>
                    <p v-if="!managerCandidates.length" class="text-xs text-amber-600 mt-1.5">
                      {{ isCreatingManager ? 'No CEO account exists yet — create one first, or pick a manager once available.' : 'No Manager is assigned to this department yet — assign one from Departments first.' }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Joining Date *</label>
                    <input v-model="employeeForm.joiningDate" type="date" required class="input" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Employment Type *</label>
                    <select v-model="employeeForm.employmentType" required class="input bg-white">
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
                      <input v-model.number="employeeForm.basicSalary" type="number" min="0" step="0.01" required class="input pl-10" placeholder="0.00" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Banking Details -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Banking Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Bank Name</label>
                    <input v-model="employeeForm.bankName" type="text" class="input" placeholder="e.g. Commercial Bank" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Bank Account No.</label>
                    <input v-model="employeeForm.bankAccountNo" type="text" class="input" placeholder="0000000000" />
                  </div>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                @click="handleSkip"
                :disabled="loading"
                class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Skip for now
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
                {{ loading ? 'Saving...' : 'Save & Assign' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const emit = defineEmits(['close', 'success'])

const auth = useAuthStore()
const permissionsStore = usePermissionsStore()
const departmentsStore = useDepartmentsStore()
const jobPositionsStore = useJobPositionsStore()
const employeesStore = useEmployeesStore()

const RESTRICTED_ROLES = ['HR Admin', 'CEO']
const selectableRoles = computed(() =>
  auth.isAdmin ? permissionsStore.roles : permissionsStore.roles.filter((r) => !RESTRICTED_ROLES.includes(r.name))
)

const selectedRoleName = computed(() => permissionsStore.roles.find((r) => r.id === accountForm.roleId)?.name ?? '')
const isCreatingManager = computed(() => selectedRoleName.value === 'Manager')
const isCreatingTopRole = computed(() => selectedRoleName.value === 'CEO' || selectedRoleName.value === 'Admin')

const employeeRoleMap = computed(() => {
  const map = {}
  for (const u of permissionsStore.users) {
    if (u.employeeId) map[u.employeeId] = u.roleName
  }
  return map
})

const ceoEmployee = computed(() => employeesStore.employees.find((e) => employeeRoleMap.value[e.id] === 'CEO'))

const managerCandidates = computed(() => {
  if (isCreatingManager.value) {
    const managers = employeesStore.employees.filter((e) => employeeRoleMap.value[e.id] === 'Manager')
    return ceoEmployee.value ? [ceoEmployee.value, ...managers] : managers
  }
  return employeesStore.employees.filter(
    (e) => employeeRoleMap.value[e.id] === 'Manager' && e.departmentId === employeeForm.departmentId
  )
})

const step = ref(1)
const loading = ref(false)
const error = ref('')
const createdUser = ref(null)

const accountForm = reactive({
  fullName: '',
  username: '',
  empNo: '',
  email: '',
  nic: '',
  roleId: '',
})

const employeeForm = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  country: '',
  departmentId: '',
  jobPositionId: '',
  managerId: '',
  joiningDate: new Date().toISOString().slice(0, 10),
  employmentType: '',
  basicSalary: null,
  bankName: '',
  bankAccountNo: '',
})

const positionsForDepartment = computed(() => {
  if (!employeeForm.departmentId) return []
  return jobPositionsStore.positions.filter((p) => p.departmentId === employeeForm.departmentId)
})

watch(step, (value) => {
  if (value !== 2) return
  if (isCreatingTopRole.value) {
    employeeForm.managerId = ''
  } else if (isCreatingManager.value) {
    employeeForm.managerId = ceoEmployee.value?.id ?? ''
  }
})

watch(
  () => employeeForm.departmentId,
  (departmentId) => {
    if (isCreatingTopRole.value || isCreatingManager.value || !departmentId) return
    employeeForm.managerId = departmentsStore.byId(departmentId)?.managerId ?? ''
  }
)

const handleCreateAccount = async () => {
  error.value = ''
  loading.value = true

  const result = await permissionsStore.createUser({
    name: accountForm.fullName.trim(),
    username: accountForm.username.trim(),
    empNo: accountForm.empNo.trim(),
    email: accountForm.email.trim(),
    password: accountForm.nic.trim(),
    roleId: accountForm.roleId,
  })

  loading.value = false

  if (result.success) {
    createdUser.value = result.data

    const nameParts = accountForm.fullName.trim().split(/\s+/)
    employeeForm.firstName = nameParts[0] || ''
    employeeForm.lastName = nameParts.slice(1).join(' ') || ''
    employeeForm.nationalId = accountForm.nic.trim()

    step.value = 2
  } else {
    error.value = result.error
  }
}

const handleCreateEmployee = async () => {
  error.value = ''
  loading.value = true

  const payload = {
    firstName: employeeForm.firstName.trim(),
    lastName: employeeForm.lastName.trim(),
    email: accountForm.email.trim(),
    phone: employeeForm.phone.trim() || null,
    nationalId: employeeForm.nationalId.trim() || null,
    dateOfBirth: employeeForm.dateOfBirth,
    gender: employeeForm.gender,
    address: employeeForm.address.trim() || null,
    city: employeeForm.city.trim() || null,
    country: employeeForm.country.trim() || null,
    departmentId: employeeForm.departmentId,
    jobPositionId: employeeForm.jobPositionId,
    managerId: employeeForm.managerId || null,
    joiningDate: employeeForm.joiningDate,
    employmentType: employeeForm.employmentType,
    basicSalary: employeeForm.basicSalary ?? 0,
    bankName: employeeForm.bankName.trim() || null,
    bankAccountNo: employeeForm.bankAccountNo.trim() || null,
    appUserId: createdUser.value?.id,
  }

  const result = await employeesStore.create(payload)

  loading.value = false

  if (result.success) {
    emit('success', { message: 'User created and assigned to a job role successfully.' })
    emit('close')
  } else {
    error.value = result.error
  }
}

const handleSkip = () => {
  emit('success', { message: 'User account created. Assign a job role later from the employee profile.' })
  emit('close')
}

onMounted(() => {
  if (!permissionsStore.roles.length) permissionsStore.fetchRoles()
  if (!permissionsStore.users.length) permissionsStore.fetchUsers()
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
