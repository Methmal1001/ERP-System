import { defineStore } from 'pinia'

const API_BASE = '/api/hr/auth'

export interface HrUserProfile {
  id: string
  name: string
  email: string
  username?: string | null
  employeeId?: string | null
  role: string
  permissions: string[]
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: HrUserProfile | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    permissions: (state) => state.user?.permissions ?? [],
    initials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]!.toUpperCase())
        .join('')
    },
  },

  actions: {
    can(module: string, action: string) {
      return this.permissions.includes(`${module}.${action}`)
    },

    load() {
      if (typeof localStorage === 'undefined') return
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      const userJson = localStorage.getItem('hrUser')
      this.user = userJson ? JSON.parse(userJson) : null
    },

    persist() {
      if (typeof localStorage === 'undefined') return
      if (this.accessToken) localStorage.setItem('accessToken', this.accessToken)
      if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken)
      if (this.user) localStorage.setItem('hrUser', JSON.stringify(this.user))
    },

    setTokens(access: string, refresh: string) {
      this.accessToken = access
      this.refreshToken = refresh
      this.persist()
    },

    async login(usernameOrEmail: string, password: string) {
      this.loading = true
      const url = `${API_BASE}/Login`
      console.groupCollapsed(`%c[API] POST ${url}`, 'color:#2563eb;font-weight:bold')
      console.log('Request Body:', { usernameOrEmail, password: '••••••••' })
      try {
        const res: any = await $fetch(url, {
          method: 'POST',
          body: { usernameOrEmail, password },
        })
        console.log('%cResponse:', 'color:#16a34a;font-weight:bold', res)
        console.groupEnd()
        if (res.isSuccess) {
          this.accessToken = res.data.accessToken
          this.refreshToken = res.data.refreshToken
          this.user = res.data.user
          this.persist()
          return { success: true }
        }
        return { success: false, error: res.message || 'Login failed.' }
      } catch (e: any) {
        console.log('%cError Response:', 'color:#dc2626;font-weight:bold', e?.data ?? e)
        console.groupEnd()
        return {
          success: false,
          error: e?.data?.message || 'Invalid username/email or password.',
        }
      } finally {
        this.loading = false
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.loading = true
      try {
        const { request } = useHrApi()
        await request('/auth/ChangePassword', {
          method: 'POST',
          body: { currentPassword, newPassword },
        })
        return { success: true }
      } catch (e: any) {
        return {
          success: false,
          error: e?.data?.message || 'Failed to change password. Please check your current password and try again.',
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.accessToken && this.refreshToken) {
          const url = `${API_BASE}/Logout`
          console.groupCollapsed(`%c[API] POST ${url}`, 'color:#2563eb;font-weight:bold')
          console.log('Request Body:', { refreshToken: this.refreshToken })
          try {
            const res = await $fetch(url, {
              method: 'POST',
              headers: { Authorization: `Bearer ${this.accessToken}` },
              body: { refreshToken: this.refreshToken },
            })
            console.log('%cResponse:', 'color:#16a34a;font-weight:bold', res)
          } finally {
            console.groupEnd()
          }
        }
      } catch {
        // ignore network/auth errors on logout
      }
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('hrUser')
      }
    },
  },
})
