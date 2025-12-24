import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '../types/index'
import { apiClient } from '@services/api'

export interface UseAuthReturn {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (tenDangNhap: string, matKhau: string) => Promise<void>
  register: (hoTen: string, soDienThoai: string, email: string, tenDangNhap: string, matKhau: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to load auth state:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = useCallback(async (tenDangNhap: string, matKhau: string) => {
    setIsLoading(true)
    try {
      console.log('🔹 useAuth.login() called with:', {
        tenDangNhap,
        matKhau: '***' + matKhau.slice(-3),
        matKhauLength: matKhau.length,
        fullMatKhau: matKhau
      })
      
      const requestPayload = {
        tenDangNhap,
        matKhau,
      }
      
      console.log('🔹 Request payload:', requestPayload)
      
      const response = await apiClient.login(requestPayload)
      
      console.log('✅ Login response:', response)

      const authUser: AuthUser = {
        maTaiKhoan: response.maTaiKhoan,
        tenDangNhap: response.tenDangNhap,
        loaiTaiKhoan: response.loaiTaiKhoan,
        maKhachHang: response.maKhachHang,
        maNhanVien: response.maNhanVien,
        chucVu: response.chucVu,
        hoTen: response.hoTen,
      }

      setUser(authUser)
      setToken(response.token)
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(authUser))
      // Notify other hook instances/components that auth state changed
      try {
        window.dispatchEvent(new CustomEvent('authChange'))
      } catch (e) {
        // no-op: some test environments may not support CustomEvent
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (
      hoTen: string,
      soDienThoai: string,
      email: string,
      tenDangNhap: string,
      matKhau: string
    ) => {
      setIsLoading(true)
      try {
        const response = await apiClient.register({
          hoTen,
          soDienThoai,
          email,
          tenDangNhap,
          matKhau,
          confirmMatKhau: matKhau,
        })

        const authUser: AuthUser = {
          maTaiKhoan: response.maTaiKhoan,
          tenDangNhap: response.tenDangNhap,
          loaiTaiKhoan: 'KHACH_HANG',
          maKhachHang: response.maKhachHang,
          hoTen: response.hoTen,
        }

        setUser(authUser)
        setToken(response.token)
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('authUser', JSON.stringify(authUser))
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    // Notify other hook instances/components that auth state changed
    try {
      window.dispatchEvent(new CustomEvent('authChange'))
    } catch (e) {
      // ignore
    }
  }, [])

  const checkAuth = useCallback(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        logout()
      }
    } else {
      logout()
    }
  }, [logout])

  // Listen for global auth changes (dispatched by other hook instances)
  // so that separate useAuth() calls across components stay in sync.
  useEffect(() => {
    const handler = () => {
      checkAuth()
    }

    window.addEventListener('authChange', handler)
    return () => {
      window.removeEventListener('authChange', handler)
    }
  }, [checkAuth])

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    checkAuth,
  }
}
