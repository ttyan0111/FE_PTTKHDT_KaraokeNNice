import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  Tag,
  Space,
  message,
  Descriptions,
  Row,
  Col,
  Divider,
  Statistic,
  Alert,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { apiClient } from '@services/api'
import type {
  DatTiecRequest,
  DatTiecResponse,
  GoiTiecResponse,
  SanhTiecResponse,
  HoanCocResponse,
} from '../../types/index'

const { Option } = Select

export const PartyManagement: React.FC = () => {
  const [bookings, setBookings] = useState<DatTiecResponse[]>([])
  const [packages, setPackages] = useState<GoiTiecResponse[]>([])
  const [halls, setHalls] = useState<SanhTiecResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
  const [editingBooking, setEditingBooking] = useState<DatTiecResponse | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<DatTiecResponse | null>(null)
  const [refundInfo, setRefundInfo] = useState<HoanCocResponse | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [form] = Form.useForm()
  const [cancelForm] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [filterStatus])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load bookings
      const bookingsData = await apiClient.getPartyBookingList(filterStatus)
      setBookings(bookingsData)
      
      // Load packages - with fallback if API not ready
      try {
        const packagesData = await apiClient.getAllPartyPackages()
        setPackages(packagesData)
      } catch (error) {
        console.warn('Goi tiec API chua san sang')
        setPackages([
          { maGoi: 1, tenGoi: 'Goi Co Ban', giaTronGoi: 500000 },
          { maGoi: 2, tenGoi: 'Goi Tieu Chuan', giaTronGoi: 800000 },
          { maGoi: 3, tenGoi: 'Goi Premium', giaTronGoi: 1200000 },
          { maGoi: 4, tenGoi: 'Goi Vip', giaTronGoi: 2000000 },
        ])
      }
      
      // Load halls - with fallback if API not ready
      try {
        const hallsData = await apiClient.getAllBanquetHalls()
        setHalls(hallsData)
      } catch (error) {
        console.warn('Sanh tiec API chua san sang')
        setHalls([
          { maSanh: 1, tenSanh: 'Sanh Hoa Hong', sucChua: 50, dienTich: 100, giaThue: 2000000, trangThai: 'TRONG' },
          { maSanh: 2, tenSanh: 'Sanh Lan Huong', sucChua: 100, dienTich: 200, giaThue: 3000000, trangThai: 'TRONG' },
          { maSanh: 3, tenSanh: 'Sanh Thuy Tinh', sucChua: 150, dienTich: 300, giaThue: 4000000, trangThai: 'TRONG' },
          { maSanh: 4, tenSanh: 'Sanh Hoang Gia', sucChua: 200, dienTich: 400, giaThue: 5000000, trangThai: 'TRONG' },
          { maSanh: 5, tenSanh: 'Sanh Dai Duong', sucChua: 120, dienTich: 250, giaThue: 4500000, trangThai: 'TRONG' },
        ])
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu đặt tiệc')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBooking(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: DatTiecResponse) => {
    setEditingBooking(record)
    form.setFieldsValue({
      maKH: record.maKH,
      maGoi: record.maGoi,
      ngayToChuc: dayjs(record.ngayToChuc),
      soLuongNguoi: record.soLuongNguoi,
    })
    setIsModalVisible(true)
  }

  const handleViewDetail = async (record: DatTiecResponse) => {
    setSelectedBooking(record)
    setIsDetailVisible(true)
  }

  const handleCancelBooking = async (record: DatTiecResponse) => {
    try {
      // Tính tiền hoàn cọc
      const refund = await apiClient.calculateDepositRefund(record.maDonDatTiec)
      setRefundInfo(refund)
      setSelectedBooking(record)
      cancelForm.resetFields()
      setIsCancelModalVisible(true)
    } catch (error) {
      message.error('Lỗi khi tính tiền hoàn cọc')
      console.error(error)
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const data: DatTiecRequest = {
        maKH: values.maKH,
        maGoi: values.maGoi,
        maSanh: values.maSanh,
        ngayToChuc: values.ngayToChuc.format('YYYY-MM-DDTHH:mm:ss'),
        soLuongNguoi: values.soLuongNguoi,
        ghiChu: values.ghiChu,
      }

      if (editingBooking) {
        await apiClient.updatePartyBooking(editingBooking.maDonDatTiec, data)
        message.success('Cập nhật đặt tiệc thành công')
      } else {
        await apiClient.createPartyBooking(data)
        message.success('Tạo đặt tiệc thành công')
      }

      setIsModalVisible(false)
      form.resetFields()
      loadData()
    } catch (error: any) {
      if (error.response?.data?.message?.includes('không còn trống')) {
        message.error('Sảnh tiệc không còn trống trong thời gian này')
      } else {
        message.error('Lỗi khi lưu đặt tiệc')
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCancel = async (values: any) => {
    if (!selectedBooking) return

    setLoading(true)
    try {
      await apiClient.cancelPartyBooking(selectedBooking.maDonDatTiec, values.lyDo)
      message.success('Hủy đặt tiệc thành công')
      setIsCancelModalVisible(false)
      cancelForm.resetFields()
      loadData()
    } catch (error) {
      message.error('Lỗi khi hủy đặt tiệc')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessDeposit = async (record: DatTiecResponse) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán cọc',
      content: `Xác nhận đã nhận tiền cọc ${record.tienCoc.toLocaleString('vi-VN')}đ?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await apiClient.processDeposit(
            record.maDonDatTiec,
            record.tienCoc,
            'TIEN_MAT',
          )
          message.success('Xác nhận thanh toán cọc thành công')
          loadData()
        } catch (error) {
          message.error('Lỗi khi xác nhận thanh toán')
          console.error(error)
        }
      },
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CHO_XAC_NHAN: 'orange',
      DA_COC: 'blue',
      DA_THANH_TOAN: 'green',
      HUY: 'red',
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      CHO_XAC_NHAN: 'Chờ xác nhận',
      DA_COC: 'Đã đặt cọc',
      DA_THANH_TOAN: 'Đã thanh toán',
      HUY: 'Đã hủy',
    }
    return texts[status] || status
  }

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'maDonDatTiec',
      key: 'maDonDatTiec',
      width: 80,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'tenKH',
      key: 'tenKH',
      width: 150,
    },
    {
      title: 'Gói tiệc',
      dataIndex: 'tenGoi',
      key: 'tenGoi',
      width: 150,
    },
    {
      title: 'Ngày tổ chức',
      dataIndex: 'ngayToChuc',
      key: 'ngayToChuc',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Số người',
      dataIndex: 'soLuongNguoi',
      key: 'soLuongNguoi',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      width: 120,
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Tiền cọc',
      dataIndex: 'tienCoc',
      key: 'tienCoc',
      width: 120,
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: DatTiecResponse) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          {record.trangThai === 'CHO_XAC_NHAN' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                Sửa
              </Button>
              <Button
                type="link"
                size="small"
                icon={<DollarOutlined />}
                onClick={() => handleProcessDeposit(record)}
              >
                Thu cọc
              </Button>
            </>
          )}
          {(record.trangThai === 'CHO_XAC_NHAN' || record.trangThai === 'DA_COC') && (
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCancelBooking(record)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.trangThai === 'CHO_XAC_NHAN').length,
    deposited: bookings.filter((b) => b.trangThai === 'DA_COC').length,
    totalRevenue: bookings
      .filter((b) => b.trangThai !== 'HUY')
      .reduce((sum, b) => sum + b.tongTien, 0),
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            🎉 Quản Lý Đặt Tiệc
          </h2>

          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng đơn"
                  value={stats.total}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Chờ xác nhận"
                  value={stats.pending}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã đặt cọc"
                  value={stats.deposited}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={stats.totalRevenue}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
          </Row>

          {/* Filters and Actions */}
          <Space style={{ marginBottom: '16px' }}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 200 }}
              allowClear
              value={filterStatus || undefined}
              onChange={setFilterStatus}
            >
              <Option value="">Tất cả</Option>
              <Option value="CHO_XAC_NHAN">Chờ xác nhận</Option>
              <Option value="DA_COC">Đã đặt cọc</Option>
              <Option value="DA_THANH_TOAN">Đã thanh toán</Option>
              <Option value="HUY">Đã hủy</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Tạo đơn đặt tiệc
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="maDonDatTiec"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingBooking ? 'Cập nhật đặt tiệc' : 'Tạo đơn đặt tiệc'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã khách hàng"
                name="maKH"
                rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng' }]}
              >
                <InputNumber
                  placeholder="Nhập mã khách hàng"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Gói tiệc"
                name="maGoi"
                rules={[{ required: true, message: 'Vui lòng chọn gói tiệc' }]}
              >
                <Select placeholder="Chọn gói tiệc">
                  {packages.map((pkg) => (
                    <Option key={pkg.maGoi} value={pkg.maGoi}>
                      {pkg.tenGoi} - {pkg.giaTronGoi.toLocaleString('vi-VN')}đ
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Sảnh tiệc" name="maSanh">
                <Select placeholder="Chọn sảnh tiệc (tùy chọn)" allowClear>
                  {halls
                    .filter((h) => h.trangThai === 'TRONG')
                    .map((hall) => (
                      <Option key={hall.maSanh} value={hall.maSanh}>
                        {hall.tenSanh} (Sức chứa: {hall.sucChua} người)
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng người"
                name="soLuongNguoi"
                rules={[{ required: true, message: 'Vui lòng nhập số người' }]}
              >
                <InputNumber
                  placeholder="Số người dự kiến"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Ngày tổ chức"
            name="ngayToChuc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày tổ chức' }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày giờ tổ chức"
              style={{ width: '100%' }}
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="ghiChu">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingBooking ? 'Cập nhật' : 'Tạo đơn'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đặt tiệc"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedBooking && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã đơn" span={2}>
              {selectedBooking.maDonDatTiec}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {selectedBooking.tenKH}
            </Descriptions.Item>
            <Descriptions.Item label="Mã KH">
              {selectedBooking.maKH}
            </Descriptions.Item>
            <Descriptions.Item label="Gói tiệc" span={2}>
              {selectedBooking.tenGoi}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tổ chức" span={2}>
              {dayjs(selectedBooking.ngayToChuc).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Số người">
              {selectedBooking.soLuongNguoi}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedBooking.trangThai)}>
                {getStatusText(selectedBooking.trangThai)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                {selectedBooking.tongTien.toLocaleString('vi-VN')}đ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Tiền cọc (20%)">
              <strong style={{ color: '#faad14', fontSize: '16px' }}>
                {selectedBooking.tienCoc.toLocaleString('vi-VN')}đ
              </strong>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Cancel Modal with Refund Info */}
      <Modal
        title="Hủy đặt tiệc"
        open={isCancelModalVisible}
        onCancel={() => setIsCancelModalVisible(false)}
        footer={null}
        width={600}
      >
        {refundInfo && (
          <>
            <Alert
              message="Chính sách hoàn cọc"
              description={refundInfo.chiTietChinhSach}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Card styles={{ body: { padding: '16px', background: '#f0f5ff' } }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tiền cọc đã thanh toán"
                    value={refundInfo.tienCocDaThanhToan}
                    precision={0}
                    suffix="đ"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Số ngày còn lại"
                    value={refundInfo.soNgayConLai}
                    suffix="ngày"
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tỷ lệ hoàn"
                    value={refundInfo.tyLeHoan * 100}
                    precision={0}
                    suffix="%"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Tiền được hoàn"
                    value={refundInfo.tienDuocHoan}
                    precision={0}
                    suffix="đ"
                    valueStyle={{
                      color: refundInfo.tienDuocHoan > 0 ? '#3f8600' : '#cf1322',
                    }}
                  />
                </Col>
              </Row>
            </Card>

            <Form form={cancelForm} layout="vertical" onFinish={handleConfirmCancel}>
              <Form.Item
                label="Lý do hủy"
                name="lyDo"
                rules={[{ required: true, message: 'Vui lòng nhập lý do hủy' }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập lý do hủy đặt tiệc..."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" danger htmlType="submit" loading={loading}>
                    Xác nhận hủy
                  </Button>
                  <Button onClick={() => setIsCancelModalVisible(false)}>
                    Đóng
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  )
}
