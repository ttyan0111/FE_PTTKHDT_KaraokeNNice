import React, { useMemo, useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, message } from 'antd'
import {
    RiseOutlined,
    FallOutlined,
    DollarOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { mockHoaDon, mockBangLuong, mockPhieuNhap } from './mockData'
import type { HoaDon } from '../../types/accountant'
import { apiClient } from '../../services/api'

export const FinancialReport: React.FC = () => {
    const [hoaDonList, setHoaDonList] = useState<any[]>([])
    const [bangLuongList, setBangLuongList] = useState<any[]>([])
    const [phieuNhapList, setPhieuNhapList] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchFinancialData()
    }, [])

    const fetchFinancialData = async () => {
        setLoading(true)
        try {
            const currentDate = new Date()
            const thang = currentDate.getMonth() + 1
            const nam = currentDate.getFullYear()

            const [hoaDonRes, bangLuongRes, phieuNhapRes] = await Promise.all([
                apiClient.getAllHoaDon().catch(() => mockHoaDon),
                apiClient.getAllBangLuong(thang, nam).catch(() => mockBangLuong),
                apiClient.getAllPhieuNhap().catch(() => mockPhieuNhap)
            ])

            setHoaDonList(Array.isArray(hoaDonRes) ? hoaDonRes : mockHoaDon)
            setBangLuongList(Array.isArray(bangLuongRes) ? bangLuongRes : mockBangLuong)
            setPhieuNhapList(Array.isArray(phieuNhapRes) ? phieuNhapRes : mockPhieuNhap)
        } catch (err: any) {
            message.error('Lỗi tải báo cáo tài chính: ' + (err.message || ''))
            setHoaDonList(mockHoaDon)
            setBangLuongList(mockBangLuong)
            setPhieuNhapList(mockPhieuNhap)
        } finally {
            setLoading(false)
        }
    }

    const financialStats = useMemo(() => {
        // Tổng thu từ hóa đơn
        const tongThu = hoaDonList.reduce((sum, hd) => sum + (Number(hd.tongTien) || Number(hd.TongTien) || 0), 0)

        // Tổng chi: Lương + Nhập hàng
        const tongChiLuong = bangLuongList.reduce((sum, l) => sum + (Number(l.tongLuongNhan) || Number(l.TongLuongNhan) || 0), 0)
        const tongChiNhapHang = phieuNhapList.reduce((sum, pn) => sum + (Number(pn.tongTienNhap) || Number(pn.TongTienNhap) || 0), 0)
        const tongChi = tongChiLuong + tongChiNhapHang

        // Lợi nhuận
        const loiNhuan = tongThu - tongChi

        return {
            tongThu,
            tongChi,
            tongChiLuong,
            tongChiNhapHang,
            loiNhuan
        }
    }, [hoaDonList, bangLuongList, phieuNhapList])

    const hoaDonColumns: ColumnsType<any> = [
        {
            title: 'Mã HĐ',
            key: 'maHD',
            render: (_, record) => <span style={{ fontWeight: '600', color: '#8b5cf6' }}>#{record.maHD || record.MaHD}</span>
        },
        {
            title: 'Ngày Lập',
            key: 'ngayLap',
            render: (_, record) => {
                const date = record.ngayLap || record.NgayLap
                if (!date) return 'N/A'
                return typeof date === 'string' ? date.split('T')[0].split(' ')[0] : date
            }
        },
        {
            title: 'Tiền Phòng',
            key: 'tienPhong',
            render: (_, record) => `${(Number(record.tienPhong || record.TienPhong) || 0).toLocaleString('vi-VN')} đ`,
            align: 'right'
        },
        {
            title: 'Tiền Dịch Vụ',
            key: 'tienDichVu',
            render: (_, record) => `${(Number(record.tienDichVu || record.TienDichVu) || 0).toLocaleString('vi-VN')} đ`,
            align: 'right'
        },
        {
            title: 'Tổng Tiền',
            key: 'tongTien',
            render: (_, record) => (
                <span style={{ fontWeight: '700', color: '#10b981' }}>
                    {(Number(record.tongTien || record.TongTien) || 0).toLocaleString('vi-VN')} đ
                </span>
            ),
            align: 'right'
        },
        {
            title: 'Thanh Toán',
            key: 'hinhThucThanhToan',
            render: (_, record) => record.hinhThucThanhToan || record.HinhThucThanhToan || 'N/A'
        }
    ]

    return (
        <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
                📈 Báo Cáo Tài Chính
            </h2>

            {/* Summary Cards */}
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Tổng Thu</span>}
                            value={financialStats.tongThu}
                            precision={0}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}
                            prefix={<RiseOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Tổng Chi</span>}
                            value={financialStats.tongChi}
                            precision={0}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}
                            prefix={<FallOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Chi Lương</span>}
                            value={financialStats.tongChiLuong}
                            precision={0}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}
                            prefix={<DollarOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Chi Nhập Hàng</span>}
                            value={financialStats.tongChiNhapHang}
                            precision={0}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}
                            prefix={<ShoppingCartOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Profit Card */}
            <Card
                bordered={false}
                style={{
                    marginBottom: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                }}
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        {financialStats.loiNhuan >= 0 ? '📈' : '📉'}
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                        Lợi Nhuận
                    </h3>
                    <div
                        style={{
                            fontSize: '42px',
                            fontWeight: '800',
                            background: financialStats.loiNhuan >= 0
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {financialStats.loiNhuan.toLocaleString('vi-VN')} đ
                    </div>
                    <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '15px' }}>
                        = Tổng Thu - (Chi Lương + Chi Nhập Hàng)
                    </p>
                </div>
            </Card>

            {/* Revenue Table */}
            <Card
                title={<span style={{ fontSize: '18px', fontWeight: '600' }}>💳 Chi Tiết Doanh Thu</span>}
                bordered={false}
                style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                }}
            >
                <Table
                    columns={hoaDonColumns}
                    dataSource={hoaDonList}
                    rowKey={(record) => record.maHD || record.MaHD}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    )
}
