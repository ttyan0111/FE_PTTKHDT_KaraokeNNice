// Types for Accountant Module - Matching Database Schema

export interface MatHang {
    MaHang: number
    TenHang: string
    LoaiHang: string
    SoLuongTon: number
    DonViTinh: string
    GiaNhap: number
    GiaBan: number
    MoTa?: string
    HinhAnh?: string
    TrangThai: string
    CreatedAt?: string
    UpdatedAt?: string
}

export interface NhanVien {
    MaNV: number
    HoTen: string
    ChucVu: string
    SDT: string
    Email: string
    DiaChi: string
    NgaySinh: string
    CMND: string
    NgayVaoLam: string
    HeSoLuong: number
    TyLeThuongDoanhThu: number
    TrangThai: string
    MaCS: number
}

export interface CaLamViec {
    MaCa: number
    TenCa: string
    GioBatDau: string
    GioKetThuc: string
}

export interface BangChamCong {
    MaChamCong: number
    MaNV: number
    HoTenNV?: string
    MaCa: number
    TenCa?: string
    NgayLam: string
    GioCheckIn: string
    GioCheckOut: string
    TrangThai: string
}

export interface BangLuong {
    MaLuong: number
    MaNV: number
    HoTenNV?: string
    Thang: number
    Nam: number
    TongLuongNhan: number
    ChiTietCacKhoan: string
}

export interface PhieuNhap {
    MaPhieuNhap: number
    MaNCC: number
    TenNCC?: string
    MaNV: number
    HoTenNV?: string
    NgayNhap: string
    TongTienNhap: number
    NguoiGiaoHang: string
}

export interface PhieuXuat {
    MaPhieuXuat: number
    MaNV: number
    HoTenNV?: string
    NgayXuat: string
    LyDoXuat: string
}

export interface HoaDon {
    MaHD: number
    MaPhieuSuDung: number
    MaKH: number
    NgayLap: string
    TienPhong: number
    TienDichVu: number
    TongTienChuaThue: number
    ThueVAT: number
    GiamGia: number
    TongTien: number
    TienCocDaTra: number
    ConPhaiTra: number
    HinhThucThanhToan: string
    TrangThai: string
    MaNVThanhToan: number
}

export interface InventoryStats {
    tongVonTonKho: number
    soMatHang: number
    canhBaoSapHet: number
}

export interface FinancialStats {
    tongThu: number
    tongChi: number
    loiNhuan: number
}
