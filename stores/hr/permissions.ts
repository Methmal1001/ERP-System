import { defineStore } from 'pinia'

export interface Role {
  id: string
  name: string
  description?: string | null
  permissions: string[]
}

export interface Permission {
  id: string
  module: string
  action: string
  description?: string | null
}

export interface AppUserAccount {
  id: string
  name: string
  email: string
  username?: string | null
  employeeId?: string | null
  employeeNo?: string | null
  roleId: string
  roleName: string
  isActive: boolean
  lastLoginAt?: string | null
  createdAt: string
}

interface PermissionsState {
  roles: Role[]
  permissions: Permission[]
  users: AppUserAccount[]
  loading: boolean
  error: string | null
}

export const usePermissionsStore = defineStore('hrPermissions', {
  state: (): PermissionsState => ({
    roles: [],
    permissions: [],
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeUserCount: (state) => state.users.filter((u) => u.isActive).length,
    modules: (state) => Array.from(new Set(state.permissions.map((p) => p.module))).sort(),
  },

  actions: {
    async fetchRoles() {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const res: any = await request('/roles/GetRoles')
        if (res.isSuccess) this.roles = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load roles.'
      } finally {
        this.loading = false
      }
    },

    async createRole(payload: { name: string; description?: string }) {
      const { request } = useHrApi()
      try {
        await request('/roles/CreateRole', { method: 'POST', body: payload })
        await this.fetchRoles()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create role.' }
      }
    },

    async updateRole(id: string, payload: { name: string; description?: string }) {
      const { request } = useHrApi()
      try {
        await request(`/roles/UpdateRole?id=${id}`, { method: 'PUT', body: payload })
        await this.fetchRoles()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update role.' }
      }
    },

    async deleteRole(id: string) {
      const { request } = useHrApi()
      try {
        await request(`/roles/DeleteRole?id=${id}`, { method: 'DELETE' })
        await this.fetchRoles()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to delete role.' }
      }
    },

    async assignPermissions(roleId: string, permissionIds: string[]) {
      const { request } = useHrApi()
      try {
        await request('/roles/AssignPermissionsToRole', {
          method: 'POST',
          body: { roleId, permissionIds },
        })
        await this.fetchRoles()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to assign permissions.' }
      }
    },

    async fetchPermissions() {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const res: any = await request('/permissions/GetPermissions')
        if (res.isSuccess) this.permissions = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load permissions.'
      } finally {
        this.loading = false
      }
    },

    async createPermission(payload: { module: string; action: string; description?: string }) {
      const { request } = useHrApi()
      try {
        await request('/permissions/CreatePermission', { method: 'POST', body: payload })
        await this.fetchPermissions()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create permission.' }
      }
    },

    async fetchUsers() {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const res: any = await request('/users/GetUsers')
        console.log('Fetched users details:', res);
        if (res.isSuccess) this.users = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load users.'
        console.log('Error fetching users:', e);
      } finally {
        this.loading = false
      }
    },

    async createUser(payload: { name: string; email: string; password: string; roleId: string }) {
      const { request } = useHrApi()
      try {
        const res: any = await request('/users/CreateUser', { method: 'POST', body: payload })
        await this.fetchUsers()
        return { success: true, data: res.data as AppUserAccount }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to create user.') }
      }
    },

    async updateUser(id: string, payload: { name: string; email: string; roleId: string; isActive: boolean }) {
      const { request } = useHrApi()
      try {
        await request(`/users/UpdateUser?id=${id}`, { method: 'PUT', body: payload })
        await this.fetchUsers()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update user.' }
      }
    },

    async deactivateUser(id: string) {
      const { request } = useHrApi()
      try {
        await request(`/users/DeleteUser?id=${id}`, { method: 'DELETE' })
        await this.fetchUsers()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to deactivate user.' }
      }
    },
  },
})
