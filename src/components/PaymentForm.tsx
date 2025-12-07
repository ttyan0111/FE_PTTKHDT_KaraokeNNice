import React from 'react'
import { Form, Button, Card, message, InputNumber, Select } from 'antd'
import { apiClient } from '@services/api'
import type { ThanhToanResponse } from '../types/index'

export const PaymentForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [invoiceData, setInvoiceData] = React.useState<ThanhToanResponse | null>(null)

  const onFinish = async (values: { maPhieuSuDung: number; hinhThucThanhToan: string }) => {
    try {
      setLoading(true)
      const response = await apiClient.createInvoice(values.maPhieuSuDung)
      setInvoiceData(response)
      message.success('Tạo hóa đơn thành công!')
    } catch (error) {
      message.error('Lỗi khi tạo hóa đơn')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="💳 Thanh Toán / Tạo Hóa Đơn" className="form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="form-wrapper"
      >
        <Form.Item
          label="Mã Phiếu Sử Dụng"
          name="maPhieuSuDung"
          rules={[{ required: true, message: 'Vui lòng nhập mã phiếu' }]}
        >
          <InputNumber placeholder="Nhập mã phiếu" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Hình Thức Thanh Toán"
          name="hinhThucThanhToan"
          rules={[{ required: true, message: 'Vui lòng chọn hình thức thanh toán' }]}
        >
          <Select placeholder="Chọn hình thức thanh toán">
            <Select.Option value="TIEN_MAT">Tiền Mặt</Select.Option>
            <Select.Option value="THE_TIN_DUNG">Thẻ Tín Dụng</Select.Option>
            <Select.Option value="CHUYEN_KHOAN">Chuyển Khoản</Select.Option>
            <Select.Option value="QR_CODE">QR Code</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo Hóa Đơn
          </Button>
        </Form.Item>
      </Form>

      {invoiceData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f2f5', borderRadius: '4px' }}>
          <h3>Thông Tin Hóa Đơn:</h3>
          <p><strong>Mã Hóa Đơn:</strong> {invoiceData.maHoaDon}</p>
          <p><strong>Tiền Phòng:</strong> {invoiceData.tienPhong.toLocaleString()}đ</p>
          <p><strong>Tiền Ăn Uống:</strong> {invoiceData.tienAnUong.toLocaleString()}đ</p>
          <p><strong>VAT (10%):</strong> {invoiceData.thueVAT.toLocaleString()}đ</p>
          <p><strong>Giảm Giá:</strong> {invoiceData.giamGia.toLocaleString()}đ</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
            <strong>Tổng Tiền:</strong> {invoiceData.tongTien.toLocaleString()}đ
          </p>
        </div>
      )}
    </Card>
  )
}
