// Order / Đơn Gọi Món
export interface OrderRequest {
  maPhieuSuDung: number
  maHang: number
  soLuong: number
}

export interface OrderResponse {
  maOrder: number
  maPhieuSuDung: number
  maHang: number
  tenHang: string
  soLuong: number
  giaBan: number
  thanhTien: number
  thoiGianGoi: string
  trangThai: string
}

// Payment / Thanh Toán
export interface ThanhToanRequest {
  maPhieuSuDung: number
  hinhThucThanhToan: string
}

export interface ThanhToanResponse {
  maHoaDon: number
  maPhieuSuDung: number
  maKH: number
  ngayLap: string
  tienPhong: number
  tienAnUong: number
  thueVAT: number
  giamGia: number
  tongTien: number
  hinhThucThanhToan: string
}

// CheckIn/CheckOut
export interface CheckInRequest {
  maPhieuDat: number
  soDienThoai: string
  cmndCccd: string
  soNguoiThucTe: number
}

export interface CheckInResponse {
  maPhieuDat: number
  thoiGianCheckIn: string
  soNguoi: number
  tenPhong: string
}

export interface CheckOutRequest {
  maPhieuDat: number
}

export interface CheckOutResponse {
  maPhieuDat: number
  thoiGianCheckOut: string
  thoiGianLuuTru: string
  tongTien: number
}

// Loyalty Points / Tích Điểm
export interface TichDiemRequest {
  maThanhVien: number
  soTien: number
}

export interface ThanhVienResponse {
  maThanhVien: number
  hoTen: string
  email: string
  soDienThoai: string
  hanhThanhVien: string
  diemTichLuy: number
  tongChiTieu: number
}

// Promotions / Ưu Đãi
export interface ApDungUuDaiRequest {
  maUuDai: string
}

export interface ApDungUuDaiResponse {
  maUuDai: string
  tenUuDai: string
  moTa: string
  phanTramGiam: number
  giamToiDa: number
  giamToiThieu: number
  ngayBatDau: string
  ngayKetThuc: string
}

// Party Booking / Đặt Tiệc
export interface DatTiecRequest {
  maKhachHang: number
  maGoiTiec: number
  ngayToChuc: string
  soLuongNguoiDuKien: number
}

export interface DatTiecResponse {
  maDonDatTiec: number
  tenKhachHang: string
  tenGoiTiec: string
  ngayToChuc: string
  soLuongNguoiDuKien: number
  tongTien: number
}

// Member Registration / Đăng Ký Thành Viên
export interface MemberRegistrationRequest {
  hoTen: string
  soDienThoai: string
  email: string
  diaChi: string
  cmndCccd: string
  ngaySinh: string
  gioiTinh: string
}

export interface MemberRegistrationResponse {
  maThanhVien: number
  maThe: string
  hoTen: string
  soDienThoai: string
  email: string
  diaChi: string
  cmndCccd: string
  ngaySinh: string
  gioiTinh: string
  hanhThanhVien: string
  ngayCapThe: string
  diemTichLuy: number
  tongChiTieu: number
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
