import React from 'react'
import { Form, Button, Card, message, InputNumber } from 'antd'
import { apiClient } from '@services/api'
import type { OrderRequest } from '../types/index'

export const OrderForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const onFinish = async (values: OrderRequest) => {
    try {
      setLoading(true)
      const response = await apiClient.createOrder(values)
      message.success('Tạo đơn gọi món thành công!')
      form.resetFields()
      console.log('Order created:', response)
    } catch (error) {
      message.error('Lỗi khi tạo đơn gọi món')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="📋 Tạo Đơn Gọi Món" className="form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
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
          label="Mã Hàng"
          name="maHang"
          rules={[{ required: true, message: 'Vui lòng chọn hàng' }]}
        >
          <InputNumber placeholder="Nhập mã hàng" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Số Lượng"
          name="soLuong"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
        >
          <InputNumber placeholder="Nhập số lượng" min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo Đơn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
