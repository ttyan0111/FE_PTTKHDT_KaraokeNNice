import React from 'react'
import { Form, Button, Card, message, InputNumber, Input, Tabs } from 'antd'
import { apiClient } from '@services/api'
import type { CheckInResponse, CheckOutResponse } from '../types/index'

export const CheckInForm: React.FC = () => {
  const [checkInForm] = Form.useForm()
  const [checkOutForm] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [checkInResult, setCheckInResult] = React.useState<CheckInResponse | null>(null)
  const [checkOutResult, setCheckOutResult] = React.useState<CheckOutResponse | null>(null)

  const onCheckIn = async (values: { maPhieuDat: number; soDienThoai: string; cmndCccd: string; soNguoiThucTe: number }) => {
    try {
      setLoading(true)
      const response = await apiClient.checkIn({
        maPhieuDat: values.maPhieuDat,
        soDienThoai: values.soDienThoai,
        cmndCccd: values.cmndCccd,
        soNguoiThucTe: values.soNguoiThucTe
      })
      setCheckInResult(response)
      message.success('Check In thành công!')
      checkInForm.resetFields()
    } catch (error) {
      message.error('Lỗi khi Check In')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onCheckOut = async (values: { maPhieuDat: number }) => {
    try {
      setLoading(true)
      const response = await apiClient.checkOut({ maPhieuDat: values.maPhieuDat })
      setCheckOutResult(response)
      message.success('Check Out thành công!')
      checkOutForm.resetFields()
    } catch (error) {
      message.error('Lỗi khi Check Out')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: 'checkin',
      label: '🔑 Check In',
      children: (
        <Form
          form={checkInForm}
          layout="vertical"
          onFinish={onCheckIn}
        >
          <Form.Item
            label="Mã Phiếu Đặt"
            name="maPhieuDat"
            rules={[{ required: true, message: 'Vui lòng nhập mã phiếu' }]}
          >
            <InputNumber placeholder="Nhập mã phiếu đặt" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số Điện Thoại"
            name="soDienThoai"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="CMND/CCCD"
            name="cmndCccd"
            rules={[{ required: true, message: 'Vui lòng nhập CMND/CCCD' }]}
          >
            <Input placeholder="Nhập số CMND/CCCD" />
          </Form.Item>

          <Form.Item
            label="Số Người Thực Tế"
            name="soNguoiThucTe"
            rules={[{ required: true, message: 'Vui lòng nhập số người' }]}
          >
            <InputNumber placeholder="Nhập số người" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Check In
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'checkout',
      label: '🚪 Check Out',
      children: (
        <Form
          form={checkOutForm}
          layout="vertical"
          onFinish={onCheckOut}
        >
          <Form.Item
            label="Mã Phiếu Đặt"
            name="maPhieuDat"
            rules={[{ required: true, message: 'Vui lòng nhập mã phiếu' }]}
          >
            <InputNumber placeholder="Nhập mã phiếu đặt" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" danger htmlType="submit" loading={loading} block>
              Check Out
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ]

  return (
    <Card title="🏨 Check In / Check Out" className="form-card">
      <Tabs defaultActiveKey="checkin" items={tabItems} />

      {checkInResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
          <h3>Kết Quả Check In:</h3>
          <p><strong>Mã Phiếu:</strong> {checkInResult.maPhieuDat}</p>
          <p><strong>Thời Gian Check In:</strong> {new Date(checkInResult.thoiGianCheckIn).toLocaleString()}</p>
          <p><strong>Số Người:</strong> {checkInResult.soNguoi}</p>
          <p><strong>Phòng:</strong> {checkInResult.tenPhong}</p>
          <p style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ Check In thành công</p>
        </div>
      )}

      {checkOutResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
          <h3>Kết Quả Check Out:</h3>
          <p><strong>Mã Phiếu:</strong> {checkOutResult.maPhieuDat}</p>
          <p><strong>Thời Gian Check Out:</strong> {new Date(checkOutResult.thoiGianCheckOut).toLocaleString()}</p>
          <p><strong>Thời Gian Lưu Trú:</strong> {checkOutResult.thoiGianLuuTru}</p>
          <p><strong>Tổng Tiền:</strong> {checkOutResult.tongTien.toLocaleString()}đ</p>
          <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>✓ Check Out thành công</p>
        </div>
      )}
    </Card>
  )
}
