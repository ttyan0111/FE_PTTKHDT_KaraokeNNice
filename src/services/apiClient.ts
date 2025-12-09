import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

interface ApiErrorResponse {
  message: string
  status?: number
  timestamp?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient().getClient()

// Room APIs
export const roomAPI = {
  getAll: () => apiClient.get('/rooms'),
  getById: (id: number) => apiClient.get(`/rooms/${id}`),
  book: (data: any) => apiClient.post('/rooms/book', data),
}

// Party APIs
export const partyAPI = {
  getPackages: () => apiClient.get('/parties/packages'),
  book: (data: any) => apiClient.post('/parties/book', data),
  getById: (id: number) => apiClient.get(`/parties/${id}`),
}

// Promotion APIs
export const promotionAPI = {
  getAll: () => apiClient.get('/promotions'),
  apply: (code: string, data: any) => apiClient.post(`/promotions/apply/${code}`, data),
  validate: (code: string) => apiClient.get(`/promotions/validate/${code}`),
}

// Member APIs
export const memberAPI = {
  getProfile: (id: number) => apiClient.get(`/members/${id}`),
  updateProfile: (id: number, data: any) => apiClient.put(`/members/${id}`, data),
  getPoints: (id: number) => apiClient.get(`/members/${id}/points`),
  redeem: (id: number, data: any) => apiClient.post(`/members/${id}/redeem`, data),
  getHistory: (id: number) => apiClient.get(`/members/${id}/history`),
}

// Order APIs
export const orderAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id: number) => apiClient.get(`/orders/${id}`),
  create: (data: any) => apiClient.post('/orders', data),
  update: (id: number, data: any) => apiClient.put(`/orders/${id}`, data),
  delete: (id: number) => apiClient.delete(`/orders/${id}`),
}

// Payment APIs
export const paymentAPI = {
  getAll: () => apiClient.get('/payments'),
  getById: (id: number) => apiClient.get(`/payments/${id}`),
  create: (data: any) => apiClient.post('/payments', data),
  process: (id: number, data: any) => apiClient.post(`/payments/${id}/process`, data),
}

// Check-in APIs
export const checkinAPI = {
  checkIn: (data: any) => apiClient.post('/checkin/check-in', data),
  checkOut: (data: any) => apiClient.post('/checkin/check-out', data),
  getStatus: (roomId: number) => apiClient.get(`/checkin/room/${roomId}/status`),
}

// Login API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  signup: (data: any) => apiClient.post('/auth/signup', data),
  logout: () => {
    localStorage.removeItem('authToken')
    return Promise.resolve()
  },
}

export default apiClient
