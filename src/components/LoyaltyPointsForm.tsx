import React from 'react'
import { Form, Button, Card, message, InputNumber } from 'antd'
import { apiClient } from '@services/api'
import type { ThanhVienResponse } from '../types/index'

export const LoyaltyPointsForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [memberData, setMemberData] = React.useState<ThanhVienResponse | null>(null)

  const onAddPoints = async (values: { maThanhVien: number; tongTien: number }) => {
    try {
      setLoading(true)
      await apiClient.addLoyaltyPoints({
        maThanhVien: values.maThanhVien,
        soTien: values.tongTien
      })

      // Fetch member info after adding points
      const memberInfo = await apiClient.getMemberInfo(values.maThanhVien)
      setMemberData(memberInfo)
      message.success('Cập nhật điểm tích lũy thành công!')
      form.resetFields()
    } catch (error) {
      message.error('Lỗi khi cập nhật điểm tích lũy')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="⭐ Cập Nhật Điểm Tích Lũy" className="form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onAddPoints}
      >
        <Form.Item
          label="Mã Thành Viên"
          name="maThanhVien"
          rules={[{ required: true, message: 'Vui lòng nhập mã thành viên' }]}
        >
          <InputNumber placeholder="Nhập mã thành viên" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Tổng Tiền (VNĐ)"
          name="tongTien"
          rules={[{ required: true, message: 'Vui lòng nhập tổng tiền' }]}
        >
          <InputNumber
            placeholder="Nhập tổng tiền"
            style={{ width: '100%' }}
            formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tích Điểm
          </Button>
        </Form.Item>
      </Form>

      {memberData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
          <h3>Thông Tin Thành Viên:</h3>
          <p><strong>Mã Thành Viên:</strong> {memberData.maThanhVien}</p>
          <p><strong>Họ Tên:</strong> {memberData.hoTen}</p>
          <p><strong>Email:</strong> {memberData.email}</p>
          <p><strong>Số Điện Thoại:</strong> {memberData.soDienThoai}</p>
          <p><strong>Hạng Thành Viên:</strong> {memberData.hanhThanhVien}</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#faad14' }}>
            <strong>Điểm Tích Lũy:</strong> {memberData.diemTichLuy.toLocaleString()} điểm
          </p>
          <p><strong>Tổng Chi Tiêu:</strong> {memberData.tongChiTieu.toLocaleString()}đ</p>
        </div>
      )}
    </Card>
  )
}
