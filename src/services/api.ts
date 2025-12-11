import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  OrderRequest,
  OrderResponse,
  ThanhToanResponse,
  CheckInRequest,
  CheckInResponse,
  CheckOutRequest,
  CheckOutResponse,
  TichDiemRequest,
  ThanhVienResponse,
  ApDungUuDaiResponse,
  DatTiecRequest,
  DatTiecResponse,
  MemberRegistrationRequest,
  MemberRegistrationResponse,
} from '../types/index'

const API_BASE_URL = 'http://localhost:8080/api/v1'

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

    // Request interceptor - Add auth token if available
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

    // Response interceptor - Handle 401 errors
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

  // Order APIs
  async createOrder(data: OrderRequest): Promise<OrderResponse> {
    const response = await this.client.post('/order', data)
    return response.data
  }

  async getOrderDetail(maOrder: number): Promise<OrderResponse> {
    const response = await this.client.get(`/order/${maOrder}`)
    return response.data
  }

  async updateOrderStatus(
    maOrder: number,
    trangThai: string,
  ): Promise<OrderResponse> {
    const response = await this.client.put(`/order/${maOrder}/trang-thai`, null, {
      params: { trangThai },
    })
    return response.data
  }

  // Payment APIs
  async createInvoice(maPhieuSuDung: number): Promise<ThanhToanResponse> {
    const response = await this.client.post('/thanh-toan/hoa-don', null, {
      params: { maPhieuSuDung },
    })
    return response.data
  }

  async getInvoiceDetail(maHoaDon: number): Promise<ThanhToanResponse> {
    const response = await this.client.get(`/thanh-toan/${maHoaDon}`)
    return response.data
  }

  async calculateRoomPrice(maPhieu: number): Promise<number> {
    const response = await this.client.get('/thanh-toan/tien-phong', {
      params: { maPhieu },
    })
    return response.data
  }

  async calculateFoodPrice(maPhieu: number): Promise<number> {
    const response = await this.client.get('/thanh-toan/tien-an-uong', {
      params: { maPhieu },
    })
    return response.data
  }

  // CheckIn APIs
  async checkIn(data: CheckInRequest): Promise<CheckInResponse> {
    const response = await this.client.post('/check-in/check-in', data)
    return response.data
  }

  async checkOut(data: CheckOutRequest): Promise<CheckOutResponse> {
    const response = await this.client.post('/check-in/check-out', data)
    return response.data
  }

  async lookupBooking(maDat: string): Promise<CheckInResponse> {
    const response = await this.client.get(`/check-in/tra-cuu/${maDat}`)
    return response.data
  }

  // Loyalty Points APIs
  async addLoyaltyPoints(data: TichDiemRequest): Promise<void> {
    await this.client.post('/tich-luy-diem/tich-diem', data)
  }

  async getMemberInfo(maThanhVien: number): Promise<ThanhVienResponse> {
    const response = await this.client.get(`/tich-luy-diem/${maThanhVien}`)
    return response.data
  }

  // Promotion APIs
  async checkPromoCode(maUuDai: string): Promise<ApDungUuDaiResponse> {
    const response = await this.client.get(`/ap-dung-uu-dai/kiem-tra/${maUuDai}`)
    return response.data
  }

  async getActivePromotions(): Promise<ApDungUuDaiResponse[]> {
    const response = await this.client.get('/ap-dung-uu-dai/danh-sach-con-han')
    return response.data
  }

  // Party Booking APIs
  async createPartyBooking(data: DatTiecRequest): Promise<DatTiecResponse> {
    const response = await this.client.post('/dat-tiec', data)
    return response.data
  }

  async getPartyBookingDetail(maTiec: number): Promise<DatTiecResponse> {
    const response = await this.client.get(`/dat-tiec/${maTiec}`)
    return response.data
  }

  async updatePartyBooking(
    maTiec: number,
    data: DatTiecRequest,
  ): Promise<DatTiecResponse> {
    const response = await this.client.put(`/dat-tiec/${maTiec}`, data)
    return response.data
  }

  async getPartyBookingList(trangThai: string): Promise<DatTiecResponse[]> {
    const response = await this.client.get('/dat-tiec/danh-sach', {
      params: { trangThai },
    })
    return response.data
  }

  // Member Registration APIs
  async registerMember(
    data: MemberRegistrationRequest,
  ): Promise<MemberRegistrationResponse> {
    const response = await this.client.post('/khach-hang/dang-ky', data)
    return response.data
  }

  async getMemberByPhone(soDienThoai: string): Promise<MemberRegistrationResponse> {
    const response = await this.client.get(`/khach-hang/sdt/${soDienThoai}`)
    return response.data
  }

  async getMemberById(maKhachHang: string): Promise<MemberRegistrationResponse> {
    const response = await this.client.get(`/khach-hang/${maKhachHang}`)
    return response.data
  }

  async updateMemberInfo(
    maKhachHang: number,
    data: MemberRegistrationRequest,
  ): Promise<MemberRegistrationResponse> {
    const response = await this.client.put(`/khach-hang/${maKhachHang}`, data)
    return response.data
  }

  // Admin APIs - Get all members
  async getAllMembers(): Promise<MemberRegistrationResponse[]> {
    const response = await this.client.get('/khach-hang/tat-ca')
    return response.data
  }
}

export const apiClient = new ApiClient()
