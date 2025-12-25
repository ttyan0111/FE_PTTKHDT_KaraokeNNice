import React from 'react'
import { Card, Row, Col, Table, Tag, Button, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { mockBangChamCong, mockBangLuong, mockCaLamViec } from './mockData'
import type { BangChamCong, BangLuong } from '../../types/accountant'

export const PayrollManager: React.FC = () => {
    const chamCongColumns: ColumnsType<BangChamCong> = [
        {
            title: 'Nhân Viên',
            dataIndex: 'HoTenNV',
            key: 'HoTenNV',
            render: (text) => <span style={{ fontWeight: '600' }}>{text}</span>
        },
        {
            title: 'Ca Làm',
            dataIndex: 'TenCa',
            key: 'TenCa',
            render: (ten) => {
                const color = ten === 'Sáng' ? 'blue' : ten === 'Chiều' ? 'orange' : 'purple'
                return <Tag color={color}>{ten}</Tag>
            }
        },
        {
            title: 'Ngày Làm',
            dataIndex: 'NgayLam',
            key: 'NgayLam'
        },
        {
            title: 'Giờ Vào',
            dataIndex: 'GioCheckIn',
            key: 'GioCheckIn',
            render: (time) => time.split(' ')[1]
        },
        {
            title: 'Giờ Ra',
            dataIndex: 'GioCheckOut',
            key: 'GioCheckOut',
            render: (time) => time.split(' ')[1]
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'TrangThai',
            key: 'TrangThai',
            render: (status) => (
                <Tag icon={status === 'Hoan thanh' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} color={status === 'Hoan thanh' ? 'success' : 'processing'}>
                    {status}
                </Tag>
            )
        }
    ]

    const luongColumns: ColumnsType<BangLuong> = [
        {
            title: 'Nhân Viên',
            dataIndex: 'HoTenNV',
            key: 'HoTenNV',
            render: (text) => <span style={{ fontWeight: '600' }}>{text}</span>
        },
        {
            title: 'Tháng/Năm',
            key: 'ThangNam',
            render: (_, record) => `${record.Thang}/${record.Nam}`
        },
        {
            title: 'Chi Tiết',
            dataIndex: 'ChiTietCacKhoan',
            key: 'ChiTietCacKhoan',
            render: (text) => <span style={{ color: '#6B7280', fontSize: '13px' }}>{text}</span>
        },
        {
            title: 'Tổng Lương',
            dataIndex: 'TongLuongNhan',
            key: 'TongLuongNhan',
            render: (val) => (
                <span style={{ fontWeight: '700', color: '#10b981', fontSize: '16px' }}>
                    {val.toLocaleString('vi-VN')} đ
                </span>
            ),
            align: 'right'
        }
    ]

    const tongLuong = mockBangLuong.reduce((sum, l) => sum + l.TongLuongNhan, 0)

    return (
        <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
                💼 Lương & Nhân Sự
            </h2>

            {/* Ca Làm Việc Section */}
            <Card
                title={<span style={{ fontSize: '18px', fontWeight: '600' }}>⏰ Phân Ca Làm Việc</span>}
                bordered={false}
                style={{
                    marginBottom: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                }}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    {mockCaLamViec.map((ca) => (
                        <Col xs={24} sm={8} key={ca.MaCa}>
                            <div
                                style={{
                                    padding: '16px',
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.15) 100%)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(139, 92, 246, 0.2)'
                                }}
                            >
                                <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#8b5cf6' }}>
                                    {ca.TenCa}
                                </div>
                                <div style={{ color: '#6B7280', fontSize: '14px' }}>
                                    {ca.GioBatDau} - {ca.GioKetThuc}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Table
                    columns={chamCongColumns}
                    dataSource={mockBangChamCong}
                    rowKey="MaChamCong"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* Bảng Lương Section */}
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>💰 Bảng Lương Tháng 12/2025</span>
                        <Button
                            type="primary"
                            icon={<DollarOutlined />}
                            onClick={() => message.success('Đã chốt lương tháng 12/2025')}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                        >
                            Chốt Lương
                        </Button>
                    </div>
                }
                bordered={false}
                style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '8px' }}>
                        Tổng Chi Lương Tháng
                    </div>
                    <div style={{ color: '#fff', fontSize: '32px', fontWeight: '800' }}>
                        {tongLuong.toLocaleString('vi-VN')} đ
                    </div>
                </div>

                <Table
                    columns={luongColumns}
                    dataSource={mockBangLuong}
                    rowKey="MaLuong"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    )
}
