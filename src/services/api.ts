import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
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
  GoiTiecResponse,
  SanhTiecResponse,
  HoanCocResponse,
  MemberRegistrationRequest,
  MemberRegistrationResponse,
  DatPhongRequest,
  DatPhongResponse,
} from '../types/index'

// Sử dụng proxy từ vite.config.ts - tự động chuyển /api -> localhost:8080/api
const API_BASE_URL = '/api'

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
      timeout: 30000, // Tăng từ 10000ms lên 30000ms (30 giây)
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
          // Chỉ redirect nếu KHÔNG phải đang ở trang login/register
          const currentPath = window.location.pathname
          if (currentPath !== '/login' && currentPath !== '/register') {
            localStorage.removeItem('authToken')
            localStorage.removeItem('authUser')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Generic HTTP methods
  async get(url: string): Promise<any> {
    const response = await this.client.get(url)
    return response
  }

  async post(url: string, data: any): Promise<any> {
    const response = await this.client.post(url, data)
    return response
  }

  // Auth APIs
  async login(data: LoginRequest): Promise<LoginResponse> {
    console.log('🔷 api.login() called with:', {
      ...data,
      matKhau: '***' + data.matKhau.slice(-3),
      fullData: data
    })
    const response = await this.client.post('/auth/login', data)
    console.log('🔷 api.login() response:', response.data)
    return response.data
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post('/auth/register', data)
    return response.data
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.client.get('/auth/verify', {
        params: { token },
      })
      return response.status === 200
    } catch {
      return false
    }
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
    const response = await this.client.post('/v1/dat-tiec', data)
    return response.data
  }

  async getPartyBookingDetail(maTiec: number): Promise<DatTiecResponse> {
    const response = await this.client.get(`/v1/dat-tiec/${maTiec}`)
    return response.data
  }

  async updatePartyBooking(
    maTiec: number,
    data: DatTiecRequest,
  ): Promise<DatTiecResponse> {
    const response = await this.client.put(`/v1/dat-tiec/${maTiec}`, data)
    return response.data
  }

  async cancelPartyBooking(maTiec: number, lyDo: string): Promise<void> {
    await this.client.delete(`/v1/dat-tiec/${maTiec}`, {
      params: { lyDo },
    })
  }

  async getPartyBookingList(trangThai?: string): Promise<DatTiecResponse[]> {
    const response = await this.client.get('/v1/dat-tiec/danh-sach', {
      params: { trangThai },
    })
    return response.data
  }

  async calculateDepositRefund(maTiec: number): Promise<HoanCocResponse> {
    const response = await this.client.get(`/v1/dat-tiec/tinh-hoan-coc/${maTiec}`)
    return response.data
  }

  async processDeposit(maTiec: number, soTien: number, hinhThuc: string): Promise<void> {
    await this.client.post('/v1/dat-tiec/thanh-toan-coc', null, {
      params: { maTiec, soTien, hinhThuc },
    })
  }

  async sendPartyConfirmation(maTiec: number): Promise<void> {
    await this.client.post(`/v1/dat-tiec/gui-xac-nhan/${maTiec}`)
  }

  // Gói Tiệc APIs
  async getAllPartyPackages(): Promise<GoiTiecResponse[]> {
    const response = await this.client.get('/v1/goi-tiec')
    return response.data
  }

  async getPartyPackageById(maGoi: number): Promise<GoiTiecResponse> {
    const response = await this.client.get(`/v1/goi-tiec/${maGoi}`)
    return response.data
  }

  // Sảnh Tiệc APIs
  async getAllBanquetHalls(): Promise<SanhTiecResponse[]> {
    const response = await this.client.get('/v1/sanh-tiec')
    return response.data
  }

  async getBanquetHallById(maSanh: number): Promise<SanhTiecResponse> {
    const response = await this.client.get(`/v1/sanh-tiec/${maSanh}`)
    return response.data
  }

  async findAvailableBanquetHalls(
    tuNgay: string,
    denNgay: string,
  ): Promise<SanhTiecResponse[]> {
    const response = await this.client.get('/v1/dat-tiec/sanh-trong', {
      params: { tuNgay, denNgay },
    })
    return response.data
  }

  async checkBanquetHallAvailability(
    maSanh: number,
    ngayToChuc: string,
  ): Promise<boolean> {
    const response = await this.client.get('/v1/dat-tiec/kiem-tra-sanh', {
      params: { maSanh, ngayToChuc },
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

  // Admin APIs - Get all members (khách hàng)
  async getAllMembers(): Promise<any[]> {
    const response = await this.client.get('/v1/khach-hang/tat-ca')
    console.log('getAllMembers response:', response.data)
    return response.data
  }

  // Admin APIs - Get all employees (nhân viên)
  async getAllEmployees(): Promise<any[]> {
    const response = await this.client.get('/v1/quan-ly-tai-khoan-nhan-vien/danh-sach')
    console.log('getAllEmployees raw response:', response)
    console.log('getAllEmployees response.data:', response.data)
    
    // Nếu response.data là array, trả về nó
    // Nếu response.data là object có property data/content, unwrap nó
    let data = response.data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (Array.isArray(data.data)) {
        data = data.data
      } else if (Array.isArray(data.content)) {
        data = data.content
      } else if (Array.isArray(data.employees)) {
        data = data.employees
      } else if (Array.isArray(data.nhanViens)) {
        data = data.nhanViens
      }
    }
    
    console.log('getAllEmployees final data:', data)
    return Array.isArray(data) ? data : []
  }

  // Create new employee (nhân viên)
  async createEmployee(data: any): Promise<any> {
    const response = await this.client.post(
      '/v1/quan-ly-tai-khoan-nhan-vien/tao-tai-khoan',
      {
        hoTen: data.hoTen,
        email: data.email,
        sdt: data.sdt,
        chucVu: data.chucVu,
        diaChi: data.diaChi,
        cmndCccd: data.cmndCccd,
        ngaySinh: data.ngaySinh,
        gioiTinh: data.gioiTinh,
        heSoLuong: data.heSoLuong,
        tyLeThuongDoanhThu: data.tyLeThuongDoanhThu,
      },
      {
        params: {
          username: data.sdt,  // Dùng số điện thoại làm tên đăng nhập
          password: data.matKhau,
        },
      }
    )
    return response.data
  }

  // Update employee (nhân viên)
  async updateEmployee(maNV: number, data: any): Promise<any> {
    const response = await this.client.put('/v1/quan-ly-tai-khoan-nhan-vien/cap-nhat', {
      maNV,
      ...data,
    })
    return response.data
  }

  // Delete employee (nhân viên)
  async deleteEmployee(maNV: number): Promise<void> {
    await this.client.delete(`/v1/quan-ly-tai-khoan-nhan-vien/vo-hieu-hoa/${maNV}`)
  }

  // Room Type APIs (Loại Phòng)
  async getAllRoomTypes(): Promise<any[]> {
    const response = await this.client.get('/v1/loai-phong/tat-ca')
    console.log('getAllRoomTypes response:', response.data)
    return Array.isArray(response.data) ? response.data : []
  }

  async getRoomTypeById(maLoai: number): Promise<any> {
    const response = await this.client.get(`/v1/loai-phong/${maLoai}`)
    return response.data
  }

  async createRoomType(data: any): Promise<any> {
    const response = await this.client.post('/v1/loai-phong', data)
    return response.data
  }

  async updateRoomType(maLoai: number, data: any): Promise<any> {
    const response = await this.client.put(`/v1/loai-phong/${maLoai}`, data)
    return response.data
  }

  async deleteRoomType(maLoai: number): Promise<void> {
    await this.client.delete(`/v1/loai-phong/${maLoai}`)
  }

  // Room APIs
  async getAllRooms(): Promise<any[]> {
    const response = await this.client.get('/v1/phong/tat-ca')
    console.log('getAllRooms response:', response.data)
    return Array.isArray(response.data) ? response.data : []
  }

  async getRoomById(maPhong: number): Promise<any> {
    const response = await this.client.get(`/v1/phong/${maPhong}`)
    return response.data
  }

  async createRoom(data: any): Promise<any> {
    const response = await this.client.post('/v1/phong', data)
    return response.data
  }

  async updateRoom(maPhong: number, data: any): Promise<any> {
    const response = await this.client.put(`/v1/phong/${maPhong}`, data)
    return response.data
  }

  async deleteRoom(maPhong: number): Promise<void> {
    await this.client.delete(`/v1/phong/${maPhong}`)
  }

  // Booking APIs
  async bookRoom(data: DatPhongRequest): Promise<DatPhongResponse> {
    const response = await this.client.post('/dat-phong', data)
    return response.data
  }

  async getBookingDetail(maPhieuDat: number): Promise<DatPhongResponse> {
    const response = await this.client.get(`/dat-phong/${maPhieuDat}`)
    return response.data
  }

  async updateBooking(
    maPhieuDat: number,
    data: DatPhongRequest,
  ): Promise<DatPhongResponse> {
    const response = await this.client.put(`/dat-phong/${maPhieuDat}`, data)
    return response.data
  }

  async cancelBooking(maPhieuDat: number): Promise<void> {
    await this.client.delete(`/dat-phong/${maPhieuDat}`)
  }

  async findAvailableRooms(
    soNguoi?: number,
    gioDat?: string,
    gioKetThuc?: string,
  ): Promise<any[]> {
    const response = await this.client.get('/dat-phong/tim-phong-trong', {
      params: { soNguoi, gioDat, gioKetThuc },
    })
    return response.data
  }

  // MatHang (Menu Items) APIs
  async getAllMatHang(): Promise<any[]> {
    const response = await this.client.get('/v1/mat-hang/tat-ca')
    return response.data
  }

  async getMatHangByLoai(loaiHang: string): Promise<any[]> {
    const response = await this.client.get('/v1/mat-hang/theo-loai', {
      params: { loaiHang }
    })
    return response.data
  }

  async getMatHangById(maHang: number): Promise<any> {
    const response = await this.client.get(`/v1/mat-hang/${maHang}`)
    return response.data
  }

  async createMatHang(data: any): Promise<any> {
    const response = await this.client.post('/v1/mat-hang/tao', data)
    return response.data
  }

  async updateMatHang(data: any): Promise<any> {
    const response = await this.client.put('/v1/mat-hang/cap-nhat', data)
    return response.data
  }

  async deleteMatHang(maHang: number): Promise<void> {
    await this.client.delete(`/v1/mat-hang/${maHang}`)
  }

  // HoaDon (Invoice) APIs
  async getAllHoaDon(): Promise<any[]> {
    const response = await this.client.get('/v1/hoa-don/tat-ca')
    return response.data
  }

  async getHoaDonById(maHD: number): Promise<any> {
    const response = await this.client.get(`/v1/hoa-don/${maHD}`)
    return response.data
  }

  async getHoaDonByTrangThai(trangThai: string): Promise<any[]> {
    const response = await this.client.get('/v1/hoa-don/theo-trang-thai', {
      params: { trangThai }
    })
    return response.data
  }

  async createHoaDon(data: any): Promise<any> {
    const response = await this.client.post('/v1/hoa-don/tao', data)
    return response.data
  }

  async updateHoaDon(data: any): Promise<any> {
    const response = await this.client.put('/v1/hoa-don/cap-nhat', data)
    return response.data
  }

  async deleteHoaDon(maHD: number): Promise<void> {
    await this.client.delete(`/v1/hoa-don/${maHD}`)
  }

  // Bang Luong (Payroll) APIs
  async getAllBangLuong(thang: number, nam: number): Promise<any[]> {
    const response = await this.client.get(`/v1/quan-ly-luong/danh-sach/${thang}/${nam}`)
    return response.data
  }

  async getBangLuongByNhanVien(maNhanVien: number, thang: number, nam: number): Promise<any> {
    const response = await this.client.get(`/v1/quan-ly-luong/xem-chi-tiet/${maNhanVien}`, {
      params: { thang, nam }
    })
    return response.data
  }

  async tinhLuongNhanVien(maNhanVien: number, thang: number, nam: number): Promise<any> {
    const response = await this.client.post(`/v1/quan-ly-luong/tinh-luong-nhan-vien/${maNhanVien}`, null, {
      params: { thang, nam }
    })
    return response.data
  }

  // Phieu Nhap (Import Receipt) APIs
  async getAllPhieuNhap(): Promise<any[]> {
    const response = await this.client.get('/v1/nhap-kho')
    return response.data
  }

  async getPhieuNhapById(maPhieuNhap: number): Promise<any> {
    const response = await this.client.get(`/v1/nhap-kho/${maPhieuNhap}`)
    return response.data
  }

  async createPhieuNhap(data: any): Promise<any> {
    const response = await this.client.post('/v1/nhap-kho', data)
    return response.data
  }

  async updatePhieuNhap(maPhieuNhap: number, data: any): Promise<any> {
    const response = await this.client.put(`/v1/nhap-kho/${maPhieuNhap}`, data)
    return response.data
  }

  async capNhatTonKho(maMatHang: number, soLuong: number): Promise<void> {
    await this.client.post(`/v1/nhap-kho/cap-nhat-ton-kho/${maMatHang}`, null, {
      params: { soLuong }
    })
  }
}

export const apiClient = new ApiClient()
