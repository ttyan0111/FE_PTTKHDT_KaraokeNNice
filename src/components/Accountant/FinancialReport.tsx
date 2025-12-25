import React, { useMemo } from 'react'
import { Card, Row, Col, Statistic, Table } from 'antd'
import {
    RiseOutlined,
    FallOutlined,
    DollarOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { mockHoaDon, mockBangLuong, mockPhieuNhap } from './mockData'
import type { HoaDon } from '../../types/accountant'

export const FinancialReport: React.FC = () => {
    const financialStats = useMemo(() => {
        // Tổng thu từ hóa đơn
        const tongThu = mockHoaDon.reduce((sum, hd) => sum + hd.TongTien, 0)

        // Tổng chi: Lương + Nhập hàng
        const tongChiLuong = mockBangLuong.reduce((sum, l) => sum + l.TongLuongNhan, 0)
        const tongChiNhapHang = mockPhieuNhap.reduce((sum, pn) => sum + pn.TongTienNhap, 0)
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
    }, [])

    const hoaDonColumns: ColumnsType<HoaDon> = [
        {
            title: 'Mã HĐ',
            dataIndex: 'MaHD',
            key: 'MaHD',
            render: (val) => <span style={{ fontWeight: '600', color: '#8b5cf6' }}>#{val}</span>
        },
        {
            title: 'Ngày Lập',
            dataIndex: 'NgayLap',
            key: 'NgayLap',
            render: (time) => time.split(' ')[0]
        },
        {
            title: 'Tiền Phòng',
            dataIndex: 'TienPhong',
            key: 'TienPhong',
            render: (val) => `${val.toLocaleString('vi-VN')} đ`,
            align: 'right'
        },
        {
            title: 'Tiền Dịch Vụ',
            dataIndex: 'TienDichVu',
            key: 'TienDichVu',
            render: (val) => `${val.toLocaleString('vi-VN')} đ`,
            align: 'right'
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'TongTien',
            key: 'TongTien',
            render: (val) => (
                <span style={{ fontWeight: '700', color: '#10b981' }}>
                    {val.toLocaleString('vi-VN')} đ
                </span>
            ),
            align: 'right'
        },
        {
            title: 'Thanh Toán',
            dataIndex: 'HinhThucThanhToan',
            key: 'HinhThucThanhToan'
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
                    dataSource={mockHoaDon}
                    rowKey="MaHD"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    )
}
