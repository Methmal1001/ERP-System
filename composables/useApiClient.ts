export const getApiErrorMessage = (err: any, fallback: string): string => {
  const data = err?.data
  if (!data) return fallback
  if (typeof data === 'string') return data || fallback
  if (data.message) return data.message
  if (data.errors) {
    const messages = Object.values(data.errors).flat().filter(Boolean)
    if (messages.length) return messages.join(' ')
  }
  if (data.title) return data.title
  return fallback
}

export const useApiClient = (basePath: string) => {
  const auth = useAuthStore()

  const request = async <T = any>(url: string, opts: Record<string, any> = {}): Promise<T> => {
    const headers: Record<string, string> = { ...(opts.headers || {}) }
    if (auth.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`
    }

    const method = (opts.method || 'GET').toUpperCase()
    const fullUrl = `${basePath}${url}`

    console.groupCollapsed(`%c[API] ${method} ${fullUrl}`, 'color:#2563eb;font-weight:bold')
    if (opts.params) console.log('Params:', opts.params)
    if (opts.body !== undefined) console.log('Request Body:', opts.body)

    try {
      const res = await $fetch<T>(fullUrl, { ...opts, headers })
      console.log('%cResponse:', 'color:#16a34a;font-weight:bold', res)
      console.groupEnd()
      return res
    } catch (err: any) {
      console.log('%cError Response:', 'color:#dc2626;font-weight:bold', err?.data ?? err)
      console.groupEnd()
      if (err?.response?.status === 401) {
        await auth.logout()
        if (import.meta.client) {
          navigateTo('/auth/Login')
        }
      }
      throw err
    }
  }

  return { request }
}
