import { defineStore } from 'pinia'

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  month: number
  year: number
  basicSalary: number
  allowances: number
  bonuses: number
  overtimePay: number
  deductions: number
  taxAmount: number
  netSalary: number
  workingDays: number
  presentDays: number
  leaveDays: number
  status: string
  paidAt?: string | null
  createdAt: string
}

interface PayrollState {
  payrolls: PayrollRecord[]
  current: PayrollRecord | null
  loading: boolean
  error: string | null
}

export const usePayrollStore = defineStore('hrPayroll', {
  state: (): PayrollState => ({
    payrolls: [],
    current: null,
    loading: false,
    error: null,
  }),

  getters: {
    totalNet: (state) => state.payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0),
    draftCount: (state) => state.payrolls.filter((p) => p.status === 'Draft').length,
    approvedCount: (state) => state.payrolls.filter((p) => p.status === 'Approved').length,
    paidCount: (state) => state.payrolls.filter((p) => p.status === 'Paid').length,
  },

  actions: {
    async fetchAll(filters: { employeeId?: string; month?: number; year?: number } = {}) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const params: Record<string, any> = {}
        if (filters.employeeId) params.employeeId = filters.employeeId
        if (filters.month) params.month = filters.month
        if (filters.year) params.year = filters.year

        const res: any = await request('/payroll/GetPayrolls', { params })
        if (res.isSuccess) this.payrolls = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load payroll records. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: string) {
      const { request } = useHrApi()
      try {
        const res: any = await request('/payroll/GetPayrollById', { params: { id } })
        if (res.isSuccess) this.current = res.data
        return this.current
      } catch (e: any) {
        return null
      }
    },

    async generate(payload: {
      employeeId: string
      month: number
      year: number
      allowances?: number
      bonuses?: number
      overtimePay?: number
      deductions?: number
      processedById?: string | null
    }) {
      const { request } = useHrApi()
      try {
        await request('/payroll/GeneratePayroll', { method: 'POST', body: payload })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to generate payroll.' }
      }
    },

    async updateStatus(id: string, status: 'Draft' | 'Approved' | 'Paid') {
      const { request } = useHrApi()
      try {
        await request(`/payroll/UpdatePayrollStatus?id=${id}&status=${status}`, { method: 'PUT' })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update payroll status.' }
      }
    },
  },
})
