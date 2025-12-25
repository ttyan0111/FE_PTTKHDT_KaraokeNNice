import React, { useMemo, useState } from 'react'
import { Card, Row, Col, Table, Tag, Button, Modal, InputNumber, message, Statistic } from 'antd'
import {
    WarningOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    PlusOutlined,
    MinusOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { mockMatHang } from './mockData'
import type { MatHang } from '../../types/accountant'

export const InventoryManager: React.FC = () => {
    const [isNhapHangModalVisible, setIsNhapHangModalVisible] = useState(false)
    const [isXuatHangModalVisible, setIsXuatHangModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState<MatHang | null>(null)
    const [soLuong, setSoLuong] = useState<number>(1)

    const stats = useMemo(() => {
        const tongVonTonKho = mockMatHang.reduce((sum, item) => sum + (item.GiaNhap * item.SoLuongTon), 0)
        const soMatHang = mockMatHang.length
        const canhBaoSapHet = mockMatHang.filter(item => item.SoLuongTon < 10).length
        return { tongVonTonKho, soMatHang, canhBaoSapHet }
    }, [])

    const columns: ColumnsType<MatHang> = [
        {
            title: 'Mã Hàng',
            dataIndex: 'MaHang',
            key: 'MaHang',
            width: 100,
            render: (val) => <span style={{ fontWeight: '600', color: '#8b5cf6' }}>#{val}</span>
        },
        {
            title: 'Tên Hàng',
            dataIndex: 'TenHang',
            key: 'TenHang',
            render: (text) => <span style={{ fontWeight: '600' }}>{text}</span>
        },
        {
            title: 'Loại',
            dataIndex: 'LoaiHang',
            key: 'LoaiHang',
            render: (loai) => (
                <Tag color={loai === 'Đồ Uống' ? 'blue' : loai === 'Thức Ăn' ? 'green' : 'orange'}>
                    {loai}
                </Tag>
            )
        },
        {
            title: 'Đơn Vị',
            dataIndex: 'DonViTinh',
            key: 'DonViTinh'
        },
        {
            title: 'Giá Nhập',
            dataIndex: 'GiaNhap',
            key: 'GiaNhap',
            render: (val) => `${val.toLocaleString('vi-VN')} đ`,
            align: 'right'
        },
        {
            title: 'Giá Bán',
            dataIndex: 'GiaBan',
            key: 'GiaBan',
            render: (val) => `${val.toLocaleString('vi-VN')} đ`,
            align: 'right'
        },
        {
            title: 'Tồn Kho',
            dataIndex: 'SoLuongTon',
            key: 'SoLuongTon',
            render: (val) => {
                if (val < 10) {
                    return (
                        <Tag icon={<WarningOutlined />} color="error">
                            {val} (Sắp hết)
                        </Tag>
                    )
                }
                return <Tag color="success">{val}</Tag>
            },
            align: 'center'
        },
        {
            title: 'Tổng Giá Trị',
            key: 'TongGiaTri',
            render: (_, record) => (
                <span style={{ fontWeight: '600', color: '#10b981' }}>
                    {(record.GiaNhap * record.SoLuongTon).toLocaleString('vi-VN')} đ
                </span>
            ),
            align: 'right'
        },
        {
            title: 'Hành Động',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setSelectedItem(record)
                            setIsNhapHangModalVisible(true)
                            setSoLuong(1)
                        }}
                    >
                        Nhập
                    </Button>
                    <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => {
                            setSelectedItem(record)
                            setIsXuatHangModalVisible(true)
                            setSoLuong(1)
                        }}
                    >
                        Xuất
                    </Button>
                </div>
            )
        }
    ]

    const handleNhapHang = () => {
        if (!selectedItem || soLuong <= 0) {
            message.error('Vui lòng nhập số lượng hợp lệ')
            return
        }
        message.success(`Đã nhập ${soLuong} ${selectedItem.DonViTinh} ${selectedItem.TenHang}`)
        setIsNhapHangModalVisible(false)
    }

    const handleXuatHang = () => {
        if (!selectedItem || soLuong <= 0) {
            message.error('Vui lòng nhập số lượng hợp lệ')
            return
        }
        if (soLuong > selectedItem.SoLuongTon) {
            message.error('Số lượng xuất vượt quá tồn kho!')
            return
        }
        message.success(`Đã xuất ${soLuong} ${selectedItem.DonViTinh} ${selectedItem.TenHang}`)
        setIsXuatHangModalVisible(false)
    }

    return (
        <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
                📦 Quản Lý Kho
            </h2>

            {/* Summary Cards */}
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Tổng Vốn Tồn Kho</span>}
                            value={stats.tongVonTonKho}
                            precision={0}
                            valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}
                            prefix={<ShoppingCartOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Số Mặt Hàng</span>}
                            value={stats.soMatHang}
                            valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}
                            prefix={<AppstoreOutlined />}
                            suffix="mặt hàng"
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card
                        bordered={false}
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Cảnh Báo Sắp Hết</span>}
                            value={stats.canhBaoSapHet}
                            valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}
                            prefix={<WarningOutlined />}
                            suffix="mặt hàng"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Table */}
            <Card
                bordered={false}
                style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                }}
            >
                <Table
                    columns={columns}
                    dataSource={mockMatHang}
                    rowKey="MaHang"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* Nhập Hàng Modal */}
            <Modal
                title="📥 Nhập Hàng"
                open={isNhapHangModalVisible}
                onOk={handleNhapHang}
                onCancel={() => setIsNhapHangModalVisible(false)}
                okText="Xác Nhận"
                cancelText="Hủy"
            >
                {selectedItem && (
                    <div>
                        <p><strong>Tên hàng:</strong> {selectedItem.TenHang}</p>
                        <p><strong>Tồn kho hiện tại:</strong> {selectedItem.SoLuongTon} {selectedItem.DonViTinh}</p>
                        <div style={{ marginTop: '16px' }}>
                            <label>Số lượng nhập:</label>
                            <InputNumber
                                min={1}
                                value={soLuong}
                                onChange={(val) => setSoLuong(val || 1)}
                                style={{ width: '100%', marginTop: '8px' }}
                                size="large"
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Xuất Hàng Modal */}
            <Modal
                title="📤 Xuất Hàng"
                open={isXuatHangModalVisible}
                onOk={handleXuatHang}
                onCancel={() => setIsXuatHangModalVisible(false)}
                okText="Xác Nhận"
                cancelText="Hủy"
            >
                {selectedItem && (
                    <div>
                        <p><strong>Tên hàng:</strong> {selectedItem.TenHang}</p>
                        <p><strong>Tồn kho hiện tại:</strong> {selectedItem.SoLuongTon} {selectedItem.DonViTinh}</p>
                        <div style={{ marginTop: '16px' }}>
                            <label>Số lượng xuất:</label>
                            <InputNumber
                                min={1}
                                max={selectedItem.SoLuongTon}
                                value={soLuong}
                                onChange={(val) => setSoLuong(val || 1)}
                                style={{ width: '100%', marginTop: '8px' }}
                                size="large"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
