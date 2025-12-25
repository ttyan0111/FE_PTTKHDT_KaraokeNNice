import type { MatHang, NhanVien, BangChamCong, BangLuong, PhieuNhap, HoaDon, CaLamViec } from '../../types/accountant'

// Mock Data - Dễ dàng thay thế bằng API sau này

export const mockMatHang: MatHang[] = [
    {
        MaHang: 1,
        TenHang: 'Bia Heineken',
        LoaiHang: 'Đồ Uống',
        SoLuongTon: 45,
        DonViTinh: 'Lon',
        GiaNhap: 15000,
        GiaBan: 35000,
        MoTa: 'Bia Heineken 330ml',
        TrangThai: 'Con hang'
    },
    {
        MaHang: 2,
        TenHang: 'Nước Ngọt Coca',
        LoaiHang: 'Đồ Uống',
        SoLuongTon: 8,
        DonViTinh: 'Chai',
        GiaNhap: 8000,
        GiaBan: 20000,
        MoTa: 'Coca Cola 1.5L',
        TrangThai: 'Con hang'
    },
    {
        MaHang: 3,
        TenHang: 'Mực Chiên',
        LoaiHang: 'Thức Ăn',
        SoLuongTon: 15,
        DonViTinh: 'Suất',
        GiaNhap: 40000,
        GiaBan: 80000,
        MoTa: 'Mực chiên giòn',
        TrangThai: 'Con hang'
    },
    {
        MaHang: 4,
        TenHang: 'Gà Quay',
        LoaiHang: 'Thức Ăn',
        SoLuongTon: 5,
        DonViTinh: 'Suất',
        GiaNhap: 60000,
        GiaBan: 120000,
        MoTa: 'Gà quay vàng ươm',
        TrangThai: 'Con hang'
    },
    {
        MaHang: 5,
        TenHang: 'Bánh Mì',
        LoaiHang: 'Thức Ăn',
        SoLuongTon: 20,
        DonViTinh: 'Cái',
        GiaNhap: 5000,
        GiaBan: 15000,
        MoTa: 'Bánh mì nóng',
        TrangThai: 'Con hang'
    },
    {
        MaHang: 6,
        TenHang: 'Nước Cam',
        LoaiHang: 'Đồ Uống',
        SoLuongTon: 3,
        DonViTinh: 'Cốc',
        GiaNhap: 5000,
        GiaBan: 25000,
        MoTa: 'Nước cam ép tươi',
        TrangThai: 'Con hang'
    },
    {
        MaHang: 7,
        TenHang: 'Tiger Beer',
        LoaiHang: 'Đồ Uống',
        SoLuongTon: 60,
        DonViTinh: 'Lon',
        GiaNhap: 14000,
        GiaBan: 32000,
        TrangThai: 'Con hang'
    },
    {
        MaHang: 8,
        TenHang: 'Snack Khoai Tây',
        LoaiHang: 'Đồ Ăn Vặt',
        SoLuongTon: 2,
        DonViTinh: 'Gói',
        GiaNhap: 8000,
        GiaBan: 18000,
        TrangThai: 'Con hang'
    }
]

export const mockNhanVien: NhanVien[] = [
    {
        MaNV: 1,
        HoTen: 'Trần Quốc A',
        ChucVu: 'TiepTan',
        SDT: '0912345678',
        Email: 'staff1@karaoke.com',
        DiaChi: 'TP.HCM',
        NgaySinh: '1995-05-15',
        CMND: '079123456789',
        NgayVaoLam: '2023-01-10',
        HeSoLuong: 1.0,
        TyLeThuongDoanhThu: 0.02,
        TrangThai: 'Dang lam viec',
        MaCS: 1
    },
    {
        MaNV: 2,
        HoTen: 'Phạm Thị B',
        ChucVu: 'ThuNgan',
        SDT: '0912345679',
        Email: 'staff2@karaoke.com',
        DiaChi: 'TP.HCM',
        NgaySinh: '1997-08-20',
        CMND: '079987654321',
        NgayVaoLam: '2023-02-15',
        HeSoLuong: 1.0,
        TyLeThuongDoanhThu: 0.015,
        TrangThai: 'Dang lam viec',
        MaCS: 1
    },
    {
        MaNV: 3,
        HoTen: 'Lê Văn C',
        ChucVu: 'PhucVu',
        SDT: '0912345680',
        Email: 'staff3@karaoke.com',
        DiaChi: 'TP.HCM',
        NgaySinh: '1999-03-10',
        CMND: '079111222333',
        NgayVaoLam: '2023-03-20',
        HeSoLuong: 0.8,
        TyLeThuongDoanhThu: 0.01,
        TrangThai: 'Dang lam viec',
        MaCS: 1
    },
    {
        MaNV: 4,
        HoTen: 'Nguyễn Thị D',
        ChucVu: 'PhucVu',
        SDT: '0912345681',
        Email: 'staff4@karaoke.com',
        DiaChi: 'TP.HCM',
        NgaySinh: '1998-11-25',
        CMND: '079444555666',
        NgayVaoLam: '2023-04-01',
        HeSoLuong: 0.8,
        TyLeThuongDoanhThu: 0.01,
        TrangThai: 'Dang lam viec',
        MaCS: 1
    }
]

export const mockCaLamViec: CaLamViec[] = [
    { MaCa: 1, TenCa: 'Sáng', GioBatDau: '08:00:00', GioKetThuc: '16:00:00' },
    { MaCa: 2, TenCa: 'Chiều', GioBatDau: '16:00:00', GioKetThuc: '00:00:00' },
    { MaCa: 3, TenCa: 'Đêm', GioBatDau: '00:00:00', GioKetThuc: '08:00:00' }
]

export const mockBangChamCong: BangChamCong[] = [
    {
        MaChamCong: 1,
        MaNV: 1,
        HoTenNV: 'Trần Quốc A',
        MaCa: 1,
        TenCa: 'Sáng',
        NgayLam: '2025-12-20',
        GioCheckIn: '2025-12-20 08:00:00',
        GioCheckOut: '2025-12-20 16:00:00',
        TrangThai: 'Hoan thanh'
    },
    {
        MaChamCong: 2,
        MaNV: 2,
        HoTenNV: 'Phạm Thị B',
        MaCa: 2,
        TenCa: 'Chiều',
        NgayLam: '2025-12-20',
        GioCheckIn: '2025-12-20 16:00:00',
        GioCheckOut: '2025-12-21 00:00:00',
        TrangThai: 'Hoan thanh'
    },
    {
        MaChamCong: 3,
        MaNV: 3,
        HoTenNV: 'Lê Văn C',
        MaCa: 2,
        TenCa: 'Chiều',
        NgayLam: '2025-12-21',
        GioCheckIn: '2025-12-21 16:00:00',
        GioCheckOut: '2025-12-22 00:00:00',
        TrangThai: 'Hoan thanh'
    },
    {
        MaChamCong: 4,
        MaNV: 4,
        HoTenNV: 'Nguyễn Thị D',
        MaCa: 1,
        TenCa: 'Sáng',
        NgayLam: '2025-12-22',
        GioCheckIn: '2025-12-22 08:00:00',
        GioCheckOut: '2025-12-22 16:00:00',
        TrangThai: 'Hoan thanh'
    }
]

export const mockBangLuong: BangLuong[] = [
    {
        MaLuong: 1,
        MaNV: 1,
        HoTenNV: 'Trần Quốc A',
        Thang: 12,
        Nam: 2025,
        TongLuongNhan: 12500000,
        ChiTietCacKhoan: 'Lương cơ bản: 10M, Thưởng: 2.5M'
    },
    {
        MaLuong: 2,
        MaNV: 2,
        HoTenNV: 'Phạm Thị B',
        Thang: 12,
        Nam: 2025,
        TongLuongNhan: 11800000,
        ChiTietCacKhoan: 'Lương cơ bản: 10M, Thưởng: 1.8M'
    },
    {
        MaLuong: 3,
        MaNV: 3,
        HoTenNV: 'Lê Văn C',
        Thang: 12,
        Nam: 2025,
        TongLuongNhan: 8600000,
        ChiTietCacKhoan: 'Lương cơ bản: 8M, Thưởng: 0.6M'
    },
    {
        MaLuong: 4,
        MaNV: 4,
        HoTenNV: 'Nguyễn Thị D',
        Thang: 12,
        Nam: 2025,
        TongLuongNhan: 8800000,
        ChiTietCacKhoan: 'Lương cơ bản: 8M, Thưởng: 0.8M'
    }
]

export const mockPhieuNhap: PhieuNhap[] = [
    {
        MaPhieuNhap: 1,
        MaNCC: 1,
        TenNCC: 'Công Ty A',
        MaNV: 1,
        HoTenNV: 'Trần Quốc A',
        NgayNhap: '2025-12-15',
        TongTienNhap: 5000000,
        NguoiGiaoHang: 'Nguyễn Văn X'
    },
    {
        MaPhieuNhap: 2,
        MaNCC: 2,
        TenNCC: 'Công Ty B',
        MaNV: 2,
        HoTenNV: 'Phạm Thị B',
        NgayNhap: '2025-12-18',
        TongTienNhap: 3500000,
        NguoiGiaoHang: 'Trần Thị Y'
    }
]

export const mockHoaDon: HoaDon[] = [
    {
        MaHD: 1,
        MaPhieuSuDung: 1,
        MaKH: 1,
        NgayLap: '2025-12-01 12:30:00',
        TienPhong: 600000,
        TienDichVu: 200000,
        TongTienChuaThue: 800000,
        ThueVAT: 80000,
        GiamGia: 0,
        TongTien: 880000,
        TienCocDaTra: 880000,
        ConPhaiTra: 0,
        HinhThucThanhToan: 'Tien mat',
        TrangThai: 'Hoai thanh toan',
        MaNVThanhToan: 2
    },
    {
        MaHD: 2,
        MaPhieuSuDung: 2,
        MaKH: 2,
        NgayLap: '2025-12-05 16:45:00',
        TienPhong: 500000,
        TienDichVu: 150000,
        TongTienChuaThue: 650000,
        ThueVAT: 65000,
        GiamGia: 0,
        TongTien: 715000,
        TienCocDaTra: 715000,
        ConPhaiTra: 0,
        HinhThucThanhToan: 'The',
        TrangThai: 'Hoai thanh toan',
        MaNVThanhToan: 2
    },
    {
        MaHD: 3,
        MaPhieuSuDung: 3,
        MaKH: 3,
        NgayLap: '2025-12-10 21:15:00',
        TienPhong: 800000,
        TienDichVu: 300000,
        TongTienChuaThue: 1100000,
        ThueVAT: 110000,
        GiamGia: 0,
        TongTien: 1210000,
        TienCocDaTra: 1210000,
        ConPhaiTra: 0,
        HinhThucThanhToan: 'Tien mat',
        TrangThai: 'Hoai thanh toan',
        MaNVThanhToan: 2
    },
    {
        MaHD: 4,
        MaPhieuSuDung: 4,
        MaKH: 4,
        NgayLap: '2025-12-15 13:20:00',
        TienPhong: 550000,
        TienDichVu: 180000,
        TongTienChuaThue: 730000,
        ThueVAT: 73000,
        GiamGia: 0,
        TongTien: 803000,
        TienCocDaTra: 803000,
        ConPhaiTra: 0,
        HinhThucThanhToan: 'Tien mat',
        TrangThai: 'Hoai thanh toan',
        MaNVThanhToan: 2
    },
    {
        MaHD: 5,
        MaPhieuSuDung: 5,
        MaKH: 5,
        NgayLap: '2025-12-20 22:30:00',
        TienPhong: 700000,
        TienDichVu: 250000,
        TongTienChuaThue: 950000,
        ThueVAT: 95000,
        GiamGia: 0,
        TongTien: 1045000,
        TienCocDaTra: 1045000,
        ConPhaiTra: 0,
        HinhThucThanhToan: 'The',
        TrangThai: 'Hoai thanh toan',
        MaNVThanhToan: 2
    }
]
