import { defineStore } from 'pinia'

export interface Department {
  id: string
  name: string
  description?: string | null
  code?: string | null
  managerId?: string | null
  managerName?: string | null
  isActive: boolean
  employeeCount: number
  createdAt: string
}

interface DepartmentsState {
  departments: Department[]
  loading: boolean
  error: string | null
}

export const useDepartmentsStore = defineStore('hrDepartments', {
  state: (): DepartmentsState => ({
    departments: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeCount: (state) => state.departments.filter((d) => d.isActive).length,
    inactiveCount: (state) => state.departments.filter((d) => !d.isActive).length,
    totalEmployees: (state) => state.departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
    byId: (state) => (id: string) => state.departments.find((d) => d.id === id),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const res: any = await request('/departments/GetDepartments')
        if (res.isSuccess) this.departments = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load departments. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async create(payload: { name: string; description?: string; code?: string; managerId?: string | null }) {
      const { request } = useHrApi()
      try {
        await request('/departments/CreateDepartment', { method: 'POST', body: payload })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create department.' }
      }
    },

    async update(id: string, payload: Record<string, any>) {
      const { request } = useHrApi()
      try {
        await request(`/departments/UpdateDepartment?id=${id}`, {
          method: 'PUT',
          body: { id, ...payload },
        })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update department.' }
      }
    },
  },
})
