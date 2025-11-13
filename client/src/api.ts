const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as any) || {})
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register: (data: { username: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: async (data: { email: string; password: string }) => {
    const result = await request('/auth/login', { method: 'POST', body: JSON.stringify(data) })
    setToken(result.token)
    return result
  },
  listProducts: (params?: { q?: string; minPrice?: number; maxPrice?: number }) => {
    const sp = new URLSearchParams()
    if (params?.q) sp.set('q', params.q)
    if (params?.minPrice !== undefined) sp.set('minPrice', String(params.minPrice))
    if (params?.maxPrice !== undefined) sp.set('maxPrice', String(params.maxPrice))
    return request(`/products?${sp.toString()}`)
  },
  createProduct: (data: { name: string; description?: string; price: number }) =>
    request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: number, data: Partial<{ name: string; description?: string; price: number }>) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: number) => request(`/products/${id}`, { method: 'DELETE' })
}
