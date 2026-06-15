<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Tabs -->
    <div class="flex gap-1 overflow-x-auto border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'"
        class="px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Roles Tab -->
    <div v-if="activeTab === 'roles'" class="space-y-5">
      <div class="flex justify-end">
        <button
          @click="openAddRoleModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Role
        </button>
      </div>

      <template v-if="permissionsStore.loading && !permissionsStore.roles.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-5 animate-pulse border border-gray-100 space-y-3">
            <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div class="h-3.5 bg-gray-200 rounded w-2/3"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </template>

      <template v-else-if="permissionsStore.roles.length === 0">
        <div class="text-center py-20">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
            </svg>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-1">No roles defined</p>
          <p class="text-gray-400 text-sm">Add a role to start managing user permissions.</p>
        </div>
      </template>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="role in permissionsStore.roles" :key="role.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
            </svg>
          </div>
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-semibold text-gray-800">{{ role.name }}</p>
            <div v-if="canManageRoles" class="flex items-center gap-1 flex-shrink-0">
              <button
                @click="openEditRoleModal(role)"
                class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit role"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                @click="openDeleteRoleModal(role)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete role"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-500 line-clamp-2 mt-1 mb-4 flex-1">{{ role.description || 'No description provided.' }}</p>
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-semibold">
              {{ (role.permissions ?? []).length }} permission{{ (role.permissions ?? []).length === 1 ? '' : 's' }}
            </span>
            <button
              @click="openAssignModal(role)"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              Manage
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Permissions Tab -->
    <div v-else-if="activeTab === 'permissions'" class="space-y-5">
      <div class="flex justify-end">
        <button
          @click="showPermissionModal = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Permission
        </button>
      </div>

      <template v-if="permissionsStore.loading && !permissionsStore.permissions.length">
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
        </div>
      </template>

      <template v-else-if="permissionsStore.permissions.length === 0">
        <div class="text-center py-20">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
            </svg>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-1">No permissions defined</p>
          <p class="text-gray-400 text-sm">Add a permission to start building roles.</p>
        </div>
      </template>

      <div v-else class="space-y-4">
        <div v-for="(items, moduleName) in groupedPermissions" :key="moduleName" class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <span class="text-sm font-semibold text-gray-700">{{ moduleName }}</span>
          </div>
          <div class="divide-y divide-gray-50">
            <div v-for="perm in items" :key="perm.id" class="flex items-center justify-between px-5 py-3">
              <div>
                <p class="text-sm font-medium text-gray-700">{{ perm.action }}</p>
                <p v-if="perm.description" class="text-xs text-gray-400 mt-0.5">{{ perm.description }}</p>
              </div>
              <span class="text-xs font-mono text-gray-400">{{ moduleName }}.{{ perm.action }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-else-if="activeTab === 'users'" class="space-y-5">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Users" :value="permissionsStore.users.length" color="blue">
          <template #icon>
            <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Active" :value="permissionsStore.activeUserCount" color="emerald">
          <template #icon>
            <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Inactive" :value="inactiveUserCount" color="red">
          <template #icon>
            <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </template>
        </StatCard>
      </div>

      <div v-if="canManageUsers" class="flex justify-end">
        <button
          @click="showCreateUserModal = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create User
        </button>
      </div>
      <div v-else class="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
        <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p class="text-xs text-amber-700">Only HR Admins can create or manage user accounts.</p>
      </div>

      <!-- Error State -->
      <div v-if="permissionsStore.error && !permissionsStore.loading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p class="text-red-700 font-semibold mb-1">Failed to load users</p>
        <p class="text-red-500 text-sm mb-4">{{ permissionsStore.error }}</p>
        <button @click="permissionsStore.fetchUsers()" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
          Retry
        </button>
      </div>

      <template v-else-if="permissionsStore.loading && !permissionsStore.users.length">
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
        </div>
      </template>

      <template v-else-if="permissionsStore.users.length === 0">
        <div class="text-center py-20">
          <p class="text-gray-700 font-semibold text-lg mb-1">No users found</p>
          <p class="text-gray-400 text-sm">Add a user account to get started.</p>
        </div>
      </template>

      <template v-else>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">User</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Role</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Last Login</th>
                  <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                  <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="u in permissionsStore.users" :key="u.id" class="hover:bg-blue-50/30 transition-colors">
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-sm font-bold">{{ u.name.charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-800 truncate">{{ u.name }}</p>
                        <p class="text-xs text-gray-400 truncate">{{ u.email }}</p>
                        <p v-if="u.username" class="text-xs text-blue-500 font-mono truncate">@{{ u.username }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3.5 text-sm text-gray-600">{{ u.roleName }}</td>
                  <td class="px-4 py-3.5 text-sm text-gray-500 hidden md:table-cell">{{ u.lastLoginAt ? format.dateTime(u.lastLoginAt) : 'Never' }}</td>
                  <td class="px-4 py-3.5 text-center">
                    <StatusBadge :status="u.isActive ? 'active' : 'inactive'" :label="u.isActive ? 'Active' : 'Inactive'" />
                  </td>
                  <td class="px-5 py-3.5">
                    <div v-if="canManageUsers" class="flex items-center justify-end gap-1">
                      <NuxtLink
                        v-if="u.employeeId"
                        :to="`/employees/${u.employeeId}`"
                        class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View employee profile"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6v6M10 14L20 4" />
                        </svg>
                      </NuxtLink>
                      <button
                        @click="openEditUserModal(u)"
                        class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        v-if="u.isActive"
                        @click="openDeactivateModal(u)"
                        class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deactivate user"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                      </button>
                    </div>
                    <span v-else class="text-xs text-gray-300">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- Modals -->
    <RoleFormModal
      v-if="showRoleModal"
      :role="editingRole"
      @close="showRoleModal = false"
      @success="handleRoleSuccess"
    />
    <PermissionFormModal v-if="showPermissionModal" @close="showPermissionModal = false" @success="handlePermissionSuccess" />
    <AssignPermissionsModal
      v-if="showAssignModal && assigningRole"
      :role="assigningRole"
      @close="showAssignModal = false"
      @success="handleAssignSuccess"
    />
    <UserFormModal
      v-if="showUserModal && editingUser"
      :user="editingUser"
      @close="showUserModal = false"
      @success="handleUserSuccess"
    />
    <CreateUserModal
      v-if="showCreateUserModal"
      @close="showCreateUserModal = false"
      @success="handleCreateUserSuccess"
    />
    <ConfirmModal
      v-if="showDeactivateModal && deactivatingUser"
      title="Deactivate User"
      subtitle="This user will lose access to the system"
      tone="danger"
      confirm-text="Deactivate"
      loading-text="Deactivating..."
      :loading="deactivateLoading"
      :error="deactivateError"
      @close="showDeactivateModal = false"
      @confirm="confirmDeactivate"
    >
      Are you sure you want to deactivate <strong>{{ deactivatingUser.name }}</strong>? They will no longer be able to sign in.
    </ConfirmModal>
    <ConfirmModal
      v-if="showDeleteRoleModal && deletingRole"
      title="Delete Role"
      subtitle="This cannot be undone"
      tone="danger"
      confirm-text="Delete"
      loading-text="Deleting..."
      :loading="deleteRoleLoading"
      :error="deleteRoleError"
      @close="showDeleteRoleModal = false"
      @confirm="confirmDeleteRole"
    >
      Are you sure you want to delete <strong>{{ deletingRole.name }}</strong>? Users assigned to this role will lose its permissions.
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import RoleFormModal from '~/components/permissions/RoleFormModal.vue'
import PermissionFormModal from '~/components/permissions/PermissionFormModal.vue'
import AssignPermissionsModal from '~/components/permissions/AssignPermissionsModal.vue'
import UserFormModal from '~/components/permissions/UserFormModal.vue'
import CreateUserModal from '~/components/permissions/CreateUserModal.vue'

definePageMeta({
  middleware: 'auth',
  title: 'Roles & Permissions',
  subtitle: 'Manage roles, permissions, and user accounts',
})

const permissionsStore = usePermissionsStore()
const auth = useAuthStore()
const toast = useToast()
const format = useFormat()

const isHrAdmin = computed(() => auth.user?.role === 'HR Admin')
const canManageUsers = computed(() => isHrAdmin.value || auth.can('Users', 'Create'))
const canManageRoles = computed(() => isHrAdmin.value || auth.can('Roles', 'Update'))

const tabs = [
  { key: 'roles', label: 'Roles' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'users', label: 'Users' },
]
const activeTab = ref('roles')

const showRoleModal = ref(false)
const editingRole = ref(null)
const showPermissionModal = ref(false)
const showAssignModal = ref(false)
const assigningRole = ref(null)
const showUserModal = ref(false)
const editingUser = ref(null)
const showCreateUserModal = ref(false)
const showDeactivateModal = ref(false)
const deactivatingUser = ref(null)
const deactivateLoading = ref(false)
const deactivateError = ref('')
const showDeleteRoleModal = ref(false)
const deletingRole = ref(null)
const deleteRoleLoading = ref(false)
const deleteRoleError = ref('')

const inactiveUserCount = computed(() => permissionsStore.users.filter((u) => !u.isActive).length)

const groupedPermissions = computed(() => {
  const groups = {}
  for (const perm of permissionsStore.permissions) {
    if (!groups[perm.module]) groups[perm.module] = []
    groups[perm.module].push(perm)
  }
  return groups
})

const openAddRoleModal = () => {
  editingRole.value = null
  showRoleModal.value = true
}

const openEditRoleModal = (role) => {
  editingRole.value = role
  showRoleModal.value = true
}

const openDeleteRoleModal = (role) => {
  deletingRole.value = role
  deleteRoleError.value = ''
  showDeleteRoleModal.value = true
}

const confirmDeleteRole = async () => {
  if (!deletingRole.value) return
  deleteRoleLoading.value = true
  deleteRoleError.value = ''
  const result = await permissionsStore.deleteRole(deletingRole.value.id)
  deleteRoleLoading.value = false
  if (result.success) {
    showDeleteRoleModal.value = false
    toast.success('Role deleted successfully.')
  } else {
    deleteRoleError.value = result.error
  }
}

const openAssignModal = (role) => {
  assigningRole.value = role
  showAssignModal.value = true
}

const openEditUserModal = (user) => {
  editingUser.value = user
  showUserModal.value = true
}

const openDeactivateModal = (user) => {
  deactivatingUser.value = user
  deactivateError.value = ''
  showDeactivateModal.value = true
}

const confirmDeactivate = async () => {
  if (!deactivatingUser.value) return
  deactivateLoading.value = true
  deactivateError.value = ''
  const result = await permissionsStore.deactivateUser(deactivatingUser.value.id)
  deactivateLoading.value = false
  if (result.success) {
    showDeactivateModal.value = false
    toast.success('User deactivated successfully.')
  } else {
    deactivateError.value = result.error
  }
}

const handleRoleSuccess = () => {
  toast.success(editingRole.value ? 'Role updated successfully.' : 'Role created successfully.')
}

const handlePermissionSuccess = () => {
  toast.success('Permission created successfully.')
}

const handleAssignSuccess = () => {
  toast.success('Permissions updated successfully.')
}

const handleUserSuccess = () => {
  toast.success(editingUser.value ? 'User updated successfully.' : 'User created successfully.')
}

const handleCreateUserSuccess = (payload) => {
  toast.success(payload?.message || 'User created successfully.')
}

onMounted(() => {
  permissionsStore.fetchRoles()
  permissionsStore.fetchPermissions()
  permissionsStore.fetchUsers()
})
</script>
