import { defineStore } from 'pinia'

export interface LeaveType {
  id: string
  name: string
  maxDaysPerYear: number
  isPaid: boolean
  isActive: boolean
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveTypeId: string
  leaveTypeName: string
  startDate: string
  endDate: string
  totalDays: number
  reason?: string | null
  status: string
  approvedById?: string | null
  approvalNote?: string | null
  approvedAt?: string | null
  createdAt: string
}

export interface LeaveBalance {
  employeeId: string
  employeeName: string
  leaveTypeName: string
  year: number
  totalDays: number
  usedDays: number
  remainingDays: number
}

interface LeaveState {
  leaveTypes: LeaveType[]
  leaveRequests: LeaveRequest[]
  leaveBalances: LeaveBalance[]
  loading: boolean
  error: string | null
}

export const useLeaveStore = defineStore('hrLeave', {
  state: (): LeaveState => ({
    leaveTypes: [],
    leaveRequests: [],
    leaveBalances: [],
    loading: false,
    error: null,
  }),

  getters: {
    pendingCount: (state) => state.leaveRequests.filter((r) => r.status === 'Pending').length,
    approvedCount: (state) => state.leaveRequests.filter((r) => r.status === 'Approved').length,
    rejectedCount: (state) => state.leaveRequests.filter((r) => r.status === 'Rejected').length,
  },

  actions: {
    async fetchLeaveTypes() {
      const { request } = useHrApi()
      try {
        const res: any = await request('/leave/GetLeaveTypes')
        if (res.isSuccess) this.leaveTypes = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load leave types.'
      }
    },

    async createLeaveType(payload: { name: string; maxDaysPerYear: number; isPaid: boolean }) {
      const { request } = useHrApi()
      try {
        await request('/leave/CreateLeaveType', { method: 'POST', body: payload })
        await this.fetchLeaveTypes()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create leave type.' }
      }
    },

    async fetchLeaveRequests(filters: { employeeId?: string; status?: string } = {}) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const params: Record<string, any> = {}
        if (filters.employeeId) params.employeeId = filters.employeeId
        if (filters.status) params.status = filters.status

        const res: any = await request('/leave/GetLeaveRequests', { params })
        if (res.isSuccess) this.leaveRequests = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load leave requests. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async createLeaveRequest(payload: {
      employeeId: string
      leaveTypeId: string
      startDate: string
      endDate: string
      reason?: string
    }) {
      const { request } = useHrApi()
      try {
        await request('/leave/CreateLeaveRequest', { method: 'POST', body: payload })
        await this.fetchLeaveRequests()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to submit leave request.' }
      }
    },

    async approveLeaveRequest(payload: {
      leaveRequestId: string
      approvedById: string
      status: 'Approved' | 'Rejected'
      approvalNote?: string
    }) {
      const { request } = useHrApi()
      try {
        await request('/leave/ApproveLeaveRequest', { method: 'PUT', body: payload })
        await this.fetchLeaveRequests()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update leave request.' }
      }
    },

    async fetchLeaveBalances(employeeId: string, year?: number) {
      this.loading = true
      const { request } = useHrApi()
      try {
        const params: Record<string, any> = { employeeId }
        if (year) params.year = year
        const res: any = await request('/leave/GetLeaveBalances', { params })
        if (res.isSuccess) this.leaveBalances = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load leave balances.'
        this.leaveBalances = []
      } finally {
        this.loading = false
      }
    },

    async setLeaveBalance(payload: { employeeId: string; leaveTypeId: string; year: number; totalDays: number }) {
      const { request } = useHrApi()
      try {
        await request('/leave/SetLeaveBalance', { method: 'POST', body: payload })
        await this.fetchLeaveBalances(payload.employeeId, payload.year)
        return { success: true }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to update leave balance.') }
      }
    },
  },
})
