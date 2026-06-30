<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total" :value="store.positions.length" hint="Job positions" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v3c0 1.1.9 2 2 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM9 5h6v2H9V5zM3 13v6a2 2 0 002 2h14a2 2 0 002-2v-6" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Active" :value="store.activeCount" hint="Positions" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Inactive" :value="store.positions.length - store.activeCount" hint="Positions" color="red">
        <template #icon>
          <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Departments" :value="departmentsCovered" hint="With open positions" color="indigo">
        <template #icon>
          <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V5a1 1 0 011-1h5a1 1 0 011 1v16M13 21V9a1 1 0 011-1h5a1 1 0 011 1v12M9 7h0M9 11h0M9 15h0" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search by title or level..."
          class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        />
        <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="flex gap-2">
        <select
          v-model="filterDepartment"
          @change="onDepartmentFilterChange"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
        </select>

        <select
          v-model="filterStatus"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

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
          Add Position
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
      <p class="text-red-700 font-semibold mb-1">Failed to load job positions</p>
      <p class="text-red-500 text-sm mb-4">{{ store.error }}</p>
      <button @click="store.fetchAll(filterDepartment || undefined)" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.loading">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'">
        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl p-5 animate-pulse border border-gray-100 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
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
    <template v-else-if="filteredPositions.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v3c0 1.1.9 2 2 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM9 5h6v2H9V5zM3 13v6a2 2 0 002 2h14a2 2 0 002-2v-6" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">No job positions found</p>
        <p class="text-gray-400 text-sm">
          {{ search ? `No results for "${search}" — try a different term` : 'Add your first job position to get started' }}
        </p>
        <div class="flex gap-2 justify-center mt-5">
          <button v-if="search" @click="search = ''" class="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            Clear search
          </button>
          <button v-if="!search" @click="openAddModal" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            Add First Position
          </button>
        </div>
      </div>
    </template>

    <!-- Grid View -->
    <template v-else-if="viewMode === 'grid'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="pos in filteredPositions"
          :key="pos.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v3c0 1.1.9 2 2 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM9 5h6v2H9V5z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ pos.title }}</p>
                <p class="text-xs text-gray-400 truncate">{{ pos.departmentName }}</p>
              </div>
            </div>
            <StatusBadge :status="pos.isActive ? 'active' : 'inactive'" :label="pos.isActive ? 'Active' : 'Inactive'" />
          </div>

          <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {{ pos.description || 'No description provided.' }}
          </p>

          <div class="flex items-center gap-2 mb-4">
            <span v-if="pos.level" class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-xs font-semibold">{{ pos.level }}</span>
            <span class="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-xs font-medium">
              {{ format.currency(pos.minSalary) }} - {{ format.currency(pos.maxSalary) }}
            </span>
          </div>

          <button
            @click="openEditModal(pos)"
            class="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Position
          </button>
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
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Position</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Department</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">Level</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Salary Range</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="pos in filteredPositions" :key="pos.id" class="hover:bg-blue-50/30 transition-colors">
                <td class="px-5 py-3.5">
                  <p class="text-sm font-semibold text-gray-800">{{ pos.title }}</p>
                  <p class="text-xs text-gray-400 md:hidden">{{ pos.departmentName }}</p>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <span class="text-sm text-gray-600">{{ pos.departmentName }}</span>
                </td>
                <td class="px-4 py-3.5 text-center hidden sm:table-cell">
                  <span v-if="pos.level" class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-xs font-semibold">{{ pos.level }}</span>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <td class="px-4 py-3.5 text-right">
                  <p class="text-sm font-medium text-gray-700">{{ format.currency(pos.minSalary) }} - {{ format.currency(pos.maxSalary) }}</p>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <StatusBadge :status="pos.isActive ? 'active' : 'inactive'" :label="pos.isActive ? 'Active' : 'Inactive'" />
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openEditModal(pos)"
                      class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit position"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

    <!-- Modal -->
    <JobPositionFormModal
      v-if="showFormModal"
      :position="editingPosition"
      :default-department-id="filterDepartment"
      @close="showFormModal = false"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import JobPositionFormModal from '~/components/jobPositions/JobPositionFormModal.vue'

definePageMeta({
  middleware: ['auth', 'hr-staff'],
  title: 'Job Positions',
  subtitle: 'Manage roles and compensation bands',
})

const store = useJobPositionsStore()
const departmentsStore = useDepartmentsStore()
const toast = useToast()
const format = useFormat()

const viewMode = ref('grid')
const search = ref('')
const filterStatus = ref('all')
const filterDepartment = ref('')

const showFormModal = ref(false)
const editingPosition = ref(null)

const departmentsCovered = computed(() => new Set(store.positions.map((p) => p.departmentId)).size)

const filteredPositions = computed(() => {
  let list = store.positions
  if (filterStatus.value !== 'all') {
    list = list.filter((p) => (filterStatus.value === 'active' ? p.isActive : !p.isActive))
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.level ?? '').toLowerCase().includes(q) ||
        (p.departmentName ?? '').toLowerCase().includes(q)
    )
  }
  return list
})

const onDepartmentFilterChange = () => {
  store.fetchAll(filterDepartment.value || undefined)
}

const openAddModal = () => {
  editingPosition.value = null
  showFormModal.value = true
}

const openEditModal = (pos) => {
  editingPosition.value = pos
  showFormModal.value = true
}

const handleFormSuccess = () => {
  toast.success(editingPosition.value ? 'Job position updated successfully.' : 'Job position created successfully.')
}

onMounted(() => {
  store.fetchAll()
  if (!departmentsStore.departments.length) departmentsStore.fetchAll()
})
</script>
