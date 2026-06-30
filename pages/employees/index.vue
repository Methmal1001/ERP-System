<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total" :value="format.number(store.totalCount)" hint="All employees" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Active" :value="store.activeCount" hint="On this page" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="On Leave" :value="store.onLeaveCount" hint="On this page" color="amber">
        <template #icon>
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Terminated" :value="store.terminatedCount" hint="On this page" color="red">
        <template #icon>
          <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search by name, employee no. or email..."
          class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        />
        <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <select
          v-model="filterDepartment"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
        </select>

        <select
          v-model="filterStatus"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="OnLeave">On Leave</option>
          <option value="Terminated">Terminated</option>
        </select>

        <select
          v-model="sortBy"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        >
          <option value="firstName">Sort: Name</option>
          <option value="employeeNo">Sort: Employee No.</option>
          <option value="joiningDate">Sort: Joining Date</option>
          <option value="basicSalary">Sort: Salary</option>
        </select>

        <button
          @click="isDescending = !isDescending"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5"
          :title="isDescending ? 'Descending' : 'Ascending'"
        >
          <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="isDescending" stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9M3 12h5m6 6V8m0 10l-3-3m3 3l3-3" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3 4h5m-5 4h9m-9 4h13m-3 6V6m0 10l3-3m-3 3l-3-3" />
          </svg>
        </button>

        <div class="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
            class="p-2.5 transition-colors"
            title="Grid view"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
            class="p-2.5 transition-colors"
            title="List view"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>

        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="store.error && !store.loading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-700 font-semibold mb-1">Failed to load employees</p>
      <p class="text-red-500 text-sm mb-4">{{ store.error }}</p>
      <button @click="fetchEmployees()" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.loading">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'">
        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl p-5 animate-pulse border border-gray-100 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 bg-gray-200 rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
          </div>
          <div class="h-3 bg-gray-100 rounded w-full"></div>
          <div class="h-8 bg-gray-100 rounded-xl w-full"></div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="store.employees.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">No employees found</p>
        <p class="text-gray-400 text-sm">
          {{ search ? `No results for "${search}" — try a different term` : 'Add your first employee to get started' }}
        </p>
        <div class="flex gap-2 justify-center mt-5">
          <button v-if="search" @click="search = ''" class="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            Clear search
          </button>
          <button v-if="!search" @click="openAddModal" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            Add First Employee
          </button>
        </div>
      </div>
    </template>

    <!-- Grid View -->
    <template v-else-if="viewMode === 'grid'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="emp in store.employees"
          :key="emp.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm font-bold">{{ initials(emp) }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ emp.fullName }}</p>
                <p class="text-xs text-gray-400 font-mono">{{ emp.employeeNo }}</p>
              </div>
            </div>
            <StatusBadge :status="emp.status" />
          </div>

          <div class="space-y-1 mb-4 flex-1">
            <p class="text-sm text-gray-600 truncate">{{ emp.jobTitle }}</p>
            <p class="text-xs text-gray-400 truncate">{{ emp.departmentName }}</p>
            <p class="text-xs text-gray-400 truncate">{{ emp.email }}</p>
          </div>

          <div class="flex gap-2">
            <NuxtLink
              :to="`/employees/${emp.id}`"
              class="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              View
            </NuxtLink>
            <button
              @click="openEditModal(emp)"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              title="Edit employee"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- List View -->
    <template v-else>
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Employee</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Department / Position</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">Salary</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell">Joined</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="emp in store.employees" :key="emp.id" class="hover:bg-blue-50/30 transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-xs font-bold">{{ initials(emp) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-800 truncate">{{ emp.fullName }}</p>
                      <p class="text-xs text-gray-400 font-mono">{{ emp.employeeNo }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <p class="text-sm text-gray-700">{{ emp.jobTitle }}</p>
                  <p class="text-xs text-gray-400">{{ emp.departmentName }}</p>
                </td>
                <td class="px-4 py-3.5 text-right hidden sm:table-cell">
                  <p class="text-sm font-medium text-gray-700">{{ format.currency(emp.basicSalary) }}</p>
                </td>
                <td class="px-4 py-3.5 text-center hidden lg:table-cell">
                  <p class="text-sm text-gray-500">{{ format.date(emp.joiningDate) }}</p>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <StatusBadge :status="emp.status" />
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <NuxtLink
                      :to="`/employees/${emp.id}`"
                      class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View profile"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    </NuxtLink>
                    <button
                      @click="openEditModal(emp)"
                      class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit employee"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      v-if="emp.status !== 'Terminated'"
                      @click="openTerminateModal(emp)"
                      class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Terminate employee"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Pagination -->
    <Pagination
      v-if="store.totalPages > 1 && !store.loading"
      :page="store.page"
      :total-pages="store.totalPages"
      :total-count="store.totalCount"
      :loading="store.loading"
      @change="goToPage"
    />

    <!-- Modals -->
    <EmployeeFormModal
      v-if="showFormModal"
      :employee="editingEmployee"
      @close="showFormModal = false"
      @success="handleFormSuccess"
    />

    <ConfirmModal
      v-if="showTerminateModal && terminatingEmployee"
      title="Terminate Employee"
      subtitle="This action will mark the employee as terminated"
      tone="danger"
      confirm-text="Terminate"
      loading-text="Terminating..."
      :loading="terminating"
      :error="terminateError"
      @close="showTerminateModal = false"
      @confirm="confirmTerminate"
    >
      Are you sure you want to terminate <strong>{{ terminatingEmployee.fullName }}</strong>? This will set their status to
      <strong>Terminated</strong> and they will no longer appear as active staff.
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import Pagination from '~/components/ui/Pagination.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import EmployeeFormModal from '~/components/employees/EmployeeFormModal.vue'

definePageMeta({
  middleware: ['auth', 'hr-staff'],
  title: 'Employees',
  subtitle: 'Manage your workforce directory',
})

const store = useEmployeesStore()
const departmentsStore = useDepartmentsStore()
const toast = useToast()
const format = useFormat()

const viewMode = ref('grid')
const search = ref('')
const filterDepartment = ref('')
const filterStatus = ref('')
const sortBy = ref('firstName')
const isDescending = ref(false)

const showFormModal = ref(false)
const editingEmployee = ref(null)

const showTerminateModal = ref(false)
const terminatingEmployee = ref(null)
const terminating = ref(false)
const terminateError = ref('')

const initials = (emp) => `${emp.firstName?.[0] ?? ''}${emp.lastName?.[0] ?? ''}`.toUpperCase()

const fetchEmployees = (page = 1) => {
  store.fetchAll({
    page,
    search: search.value.trim() || undefined,
    departmentId: filterDepartment.value || undefined,
    status: filterStatus.value || undefined,
    sortBy: sortBy.value,
    isDescending: isDescending.value,
  })
}

const goToPage = (page) => {
  if (page < 1 || page > store.totalPages || store.loading) return
  fetchEmployees(page)
}

let searchTimer = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchEmployees(1), 400)
})

watch([filterDepartment, filterStatus, sortBy, isDescending], () => fetchEmployees(1))

const openAddModal = () => {
  editingEmployee.value = null
  showFormModal.value = true
}

const openEditModal = (emp) => {
  editingEmployee.value = emp
  showFormModal.value = true
}

const openTerminateModal = (emp) => {
  terminatingEmployee.value = emp
  terminateError.value = ''
  showTerminateModal.value = true
}

const confirmTerminate = async () => {
  if (!terminatingEmployee.value) return
  terminating.value = true
  terminateError.value = ''
  const result = await store.terminate(terminatingEmployee.value.id)
  terminating.value = false
  if (result.success) {
    showTerminateModal.value = false
    toast.success('Employee terminated successfully.')
  } else {
    terminateError.value = result.error
  }
}

const handleFormSuccess = () => {
  toast.success(editingEmployee.value ? 'Employee updated successfully.' : 'Employee created successfully.')
}

onMounted(() => {
  fetchEmployees(1)
  if (!departmentsStore.departments.length) departmentsStore.fetchAll()
})
</script>
