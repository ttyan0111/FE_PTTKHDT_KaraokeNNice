import React, { useMemo } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import {
    DollarOutlined,
    ShoppingOutlined,
    TeamOutlined,
    RiseOutlined,
    FallOutlined
} from '@ant-design/icons'
import { mockMatHang, mockHoaDon, mockBangLuong, mockNhanVien } from './mockData'

export const AccountantDashboard: React.FC = () => {
    const stats = useMemo(() => {
        // Tính tổng vốn tồn kho
        const tongVonTonKho = mockMatHang.reduce((sum, item) => sum + (item.GiaNhap * item.SoLuongTon), 0)

        // Tính tổng doanh thu tháng
        const tongDoanhThu = mockHoaDon.reduce((sum, hd) => sum + hd.TongTien, 0)

        // Tính tổng lương tháng
        const tongLuong = mockBangLuong.reduce((sum, luong) => sum + luong.TongLuongNhan, 0)

        // Số nhân viên đang làm
        const soNhanVien = mockNhanVien.filter(nv => nv.TrangThai === 'Dang lam viec').length

        return {
            tongVonTonKho,
            tongDoanhThu,
            tongLuong,
            soNhanVien,
            loiNhuan: tongDoanhThu - tongLuong
        }
    }, [])

    return (
        <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
                📊 Tổng Quan Kế Toán
            </h2>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Tồn kho</span>}
                            value={stats.tongVonTonKho}
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
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Doanh thu tháng</span>}
                            value={stats.tongDoanhThu}
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
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Lương tháng</span>}
                            value={stats.tongLuong}
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
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(217, 70, 239, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Nhân viên</span>}
                            value={stats.soNhanVien}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}
                            prefix={<TeamOutlined />}
                            suffix="người"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col xs={24}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: '16px',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                        }}
                    >
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <ShoppingOutlined style={{ fontSize: '48px', color: '#8b5cf6', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                Lợi Nhuận Tạm Tính
                            </h3>
                            <div style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {stats.loiNhuan.toLocaleString('vi-VN')} đ
                            </div>
                            <p style={{ color: '#6B7280', marginTop: '8px' }}>Doanh thu - Chi phí lương</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
