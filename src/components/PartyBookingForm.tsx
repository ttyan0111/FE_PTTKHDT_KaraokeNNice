import React from 'react'
import { Form, Button, Card, message, InputNumber, DatePicker, Table, Tag } from 'antd'
import { apiClient } from '@services/api'
import type { DatTiecResponse } from '../types/index'

export const PartyBookingForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [bookingResult, setBookingResult] = React.useState<DatTiecResponse | null>(null)
  const [bookingList, setBookingList] = React.useState<DatTiecResponse[]>([])
  const [showList, setShowList] = React.useState(false)

  const onCreateBooking = async (values: any) => {
    try {
      setLoading(true)
      const response = await apiClient.createPartyBooking({
        maKhachHang: values.maKhachHang,
        maGoiTiec: values.maGoiTiec,
        ngayToChuc: values.ngayToChuc.format('YYYY-MM-DD'),
        soLuongNguoiDuKien: values.soLuongNguoiDuKien
      })
      setBookingResult(response)
      message.success('Đặt tiệc thành công!')
      form.resetFields()
    } catch (error) {
      message.error('Lỗi khi đặt tiệc')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookingList = async () => {
    try {
      setLoading(true)
      const list = await apiClient.getPartyBookingList('CHUA_DUNG')
      setBookingList(list)
      setShowList(true)
    } catch (error) {
      message.error('Lỗi khi tải danh sách đặt tiệc')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Mã Đặt Tiệc',
      dataIndex: 'maDonDatTiec',
      key: 'maDonDatTiec',
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'tenKhachHang',
      key: 'tenKhachHang',
    },
    {
      title: 'Gói Tiệc',
      dataIndex: 'tenGoiTiec',
      key: 'tenGoiTiec',
    },
    {
      title: 'Ngày Tổ Chức',
      dataIndex: 'ngayToChuc',
      key: 'ngayToChuc',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Số Người',
      dataIndex: 'soLuongNguoiDuKien',
      key: 'soLuongNguoiDuKien',
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (amount: number) => `${amount.toLocaleString()}đ`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={status === 'DA_DUNG' ? 'green' : 'orange'}>
          {status === 'DA_DUNG' ? 'Đã Dùng' : 'Chưa Dùng'}
        </Tag>
      ),
    },
  ]

  return (
    <Card title="🎊 Quản Lý Đặt Tiệc" className="form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreateBooking}
      >
        <Form.Item
          label="Mã Khách Hàng"
          name="maKhachHang"
          rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng' }]}
        >
          <InputNumber placeholder="Nhập mã khách hàng" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Mã Gói Tiệc"
          name="maGoiTiec"
          rules={[{ required: true, message: 'Vui lòng nhập mã gói tiệc' }]}
        >
          <InputNumber placeholder="Nhập mã gói tiệc" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Ngày Tổ Chức"
          name="ngayToChuc"
          rules={[{ required: true, message: 'Vui lòng chọn ngày tổ chức' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Số Lượng Người Dự Kiến"
          name="soLuongNguoiDuKien"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng người' }]}
        >
          <InputNumber placeholder="Nhập số lượng người" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ marginBottom: '10px' }}>
            Đặt Tiệc
          </Button>
          <Button
            type="dashed"
            onClick={fetchBookingList}
            loading={loading}
            block
          >
            Xem Danh Sách Đặt Tiệc
          </Button>
        </Form.Item>
      </Form>

      {bookingResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f6ffed', borderRadius: '4px', border: '1px solid #b7eb8f' }}>
          <h3>✓ Đơn Đặt Tiệc Mới:</h3>
          <p><strong>Mã Đơn:</strong> {bookingResult.maDonDatTiec}</p>
          <p><strong>Khách Hàng:</strong> {bookingResult.tenKhachHang}</p>
          <p><strong>Gói Tiệc:</strong> {bookingResult.tenGoiTiec}</p>
          <p><strong>Ngày Tổ Chức:</strong> {new Date(bookingResult.ngayToChuc).toLocaleDateString()}</p>
          <p><strong>Số Người:</strong> {bookingResult.soLuongNguoiDuKien}</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
            <strong>Tổng Tiền:</strong> {bookingResult.tongTien.toLocaleString()}đ
          </p>
        </div>
      )}

      {showList && bookingList.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>📋 Danh Sách Đơn Đặt Tiệc:</h3>
          <Table
            columns={columns}
            dataSource={bookingList}
            rowKey="maDonDatTiec"
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </div>
      )}
    </Card>
  )
}
