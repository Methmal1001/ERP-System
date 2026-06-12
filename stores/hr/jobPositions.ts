import { defineStore } from 'pinia'

export interface JobPosition {
  id: string
  title: string
  description?: string | null
  departmentId: string
  departmentName: string
  level?: string | null
  minSalary: number
  maxSalary: number
  isActive: boolean
  createdAt: string
}

interface JobPositionsState {
  positions: JobPosition[]
  loading: boolean
  error: string | null
}

export const useJobPositionsStore = defineStore('hrJobPositions', {
  state: (): JobPositionsState => ({
    positions: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeCount: (state) => state.positions.filter((p) => p.isActive).length,
    byId: (state) => (id: string) => state.positions.find((p) => p.id === id),
    byDepartment: (state) => (departmentId: string) =>
      state.positions.filter((p) => p.departmentId === departmentId),
  },

  actions: {
    async fetchAll(departmentId?: string | null) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const query = departmentId ? `?departmentId=${departmentId}` : ''
        const res: any = await request(`/job-positions/GetJobPositions${query}`)
        if (res.isSuccess) this.positions = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load job positions. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async create(payload: {
      title: string
      description?: string
      departmentId: string
      level?: string
      minSalary: number
      maxSalary: number
    }) {
      const { request } = useHrApi()
      try {
        await request('/job-positions/CreateJobPosition', { method: 'POST', body: payload })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create job position.' }
      }
    },

    async update(id: string, payload: Record<string, any>) {
      const { request } = useHrApi()
      try {
        await request(`/job-positions/UpdateJobPosition?id=${id}`, {
          method: 'PUT',
          body: { id, ...payload },
        })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update job position.' }
      }
    },
  },
})
