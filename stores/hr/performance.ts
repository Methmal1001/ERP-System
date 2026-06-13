import { defineStore } from 'pinia'

export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  reviewerId: string
  reviewerName: string
  reviewDate: string
  period: string
  rating: number
  strengths?: string | null
  improvements?: string | null
  goals?: string | null
  comments?: string | null
  status: string
  createdAt: string
}

interface PerformanceState {
  reviews: PerformanceReview[]
  current: PerformanceReview | null
  loading: boolean
  error: string | null
}

export const usePerformanceStore = defineStore('hrPerformance', {
  state: (): PerformanceState => ({
    reviews: [],
    current: null,
    loading: false,
    error: null,
  }),

  getters: {
    averageRating: (state) => {
      if (!state.reviews.length) return 0
      const sum = state.reviews.reduce((acc, r) => acc + r.rating, 0)
      return Math.round((sum / state.reviews.length) * 10) / 10
    },
    draftCount: (state) => state.reviews.filter((r) => r.status === 'Draft').length,
    submittedCount: (state) => state.reviews.filter((r) => r.status === 'Submitted').length,
    acknowledgedCount: (state) => state.reviews.filter((r) => r.status === 'Acknowledged').length,
  },

  actions: {
    async fetchAll(filters: { employeeId?: string; period?: string } = {}) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const params: Record<string, any> = {}
        if (filters.employeeId) params.employeeId = filters.employeeId
        if (filters.period) params.period = filters.period

        const res: any = await request('/performance/GetPerformanceReviews', { params })
        if (res.isSuccess) this.reviews = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load performance reviews. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: string) {
      const { request } = useHrApi()
      try {
        const res: any = await request('/performance/GetPerformanceReviewById', { params: { id } })
        if (res.isSuccess) this.current = res.data
        return this.current
      } catch (e: any) {
        return null
      }
    },

    async create(payload: {
      employeeId: string
      reviewerId: string
      reviewDate: string
      period: string
      rating: number
      strengths?: string
      improvements?: string
      goals?: string
      comments?: string
    }) {
      const { request } = useHrApi()
      try {
        await request('/performance/CreatePerformanceReview', { method: 'POST', body: payload })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create performance review.' }
      }
    },

    async updateStatus(id: string, status: 'Draft' | 'Submitted' | 'Acknowledged') {
      const { request } = useHrApi()
      try {
        await request(`/performance/UpdatePerformanceReviewStatus?id=${id}&status=${status}`, { method: 'PUT' })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update review status.' }
      }
    },
  },
})
