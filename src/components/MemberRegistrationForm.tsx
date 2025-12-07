import React from 'react'
import { Form, Button, Card, message, Input, DatePicker, Select } from 'antd'
import { apiClient } from '@services/api'
import type { MemberRegistrationResponse } from '../types/index'

export const MemberRegistrationForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [registrationResult, setRegistrationResult] = React.useState<MemberRegistrationResponse | null>(null)
  const [searchPhone, setSearchPhone] = React.useState('')
  const [searchLoading, setSearchLoading] = React.useState(false)

  const onRegister = async (values: any) => {
    try {
      setLoading(true)
      const response = await apiClient.registerMember({
        hoTen: values.hoTen,
        soDienThoai: values.soDienThoai,
        email: values.email,
        diaChi: values.diaChi,
        cmndCccd: values.cmndCccd,
        ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
        gioiTinh: values.gioiTinh,
      })
      setRegistrationResult(response)
      message.success('Đăng ký thẻ thành viên thành công!')
      form.resetFields()
    } catch (error) {
      message.error('Lỗi khi đăng ký thẻ thành viên')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSearchMember = async () => {
    if (!searchPhone.trim()) {
      message.warning('Vui lòng nhập số điện thoại')
      return
    }

    try {
      setSearchLoading(true)
      const member = await apiClient.getMemberByPhone(searchPhone)
      form.setFieldsValue({
        hoTen: member.hoTen,
        soDienThoai: member.soDienThoai,
        email: member.email,
        diaChi: member.diaChi,
        cmndCccd: member.cmndCccd,
        gioiTinh: member.gioiTinh,
      })
      setRegistrationResult(member)
      message.success('Tìm thấy thông tin thành viên')
    } catch (error) {
      message.error('Không tìm thấy thành viên với số điện thoại này')
      form.resetFields()
      setRegistrationResult(null)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <Card title="🔍 Tra Cứu Thành Viên" style={{ flex: 1, minWidth: '300px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            placeholder="Nhập số điện thoại"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onPressEnter={onSearchMember}
          />
          <Button type="primary" loading={searchLoading} onClick={onSearchMember}>
            Tìm
          </Button>
        </div>
      </Card>

      <Card title="📝 Đăng Ký Thẻ Thành Viên" style={{ flex: 2, minWidth: '400px' }}>
        <Form form={form} layout="vertical" onFinish={onRegister}>
          <Form.Item
            label="Họ và Tên"
            name="hoTen"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Số Điện Thoại"
            name="soDienThoai"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input type="email" placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Địa Chỉ"
            name="diaChi"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="CMND/CCCD"
            name="cmndCccd"
            rules={[{ required: true, message: 'Vui lòng nhập CMND/CCCD' }]}
          >
            <Input placeholder="Nhập số CMND/CCCD" />
          </Form.Item>

          <Form.Item
            label="Ngày Sinh"
            name="ngaySinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Giới Tính"
            name="gioiTinh"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="NAM">Nam</Select.Option>
              <Select.Option value="NU">Nữ</Select.Option>
              <Select.Option value="KHAC">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng Ký Thẻ Thành Viên
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {registrationResult && (
        <Card
          title="✓ Thông Tin Thẻ Thành Viên"
          style={{
            flex: 1,
            minWidth: '300px',
            backgroundColor: '#f6ffed',
            borderColor: '#b7eb8f',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p>
              <strong>Mã Thành Viên:</strong> {registrationResult.maThanhVien}
            </p>
            <p>
              <strong>Mã Thẻ:</strong> {registrationResult.maThe}
            </p>
            <p>
              <strong>Họ Tên:</strong> {registrationResult.hoTen}
            </p>
            <p>
              <strong>Email:</strong> {registrationResult.email}
            </p>
            <p>
              <strong>Điện Thoại:</strong> {registrationResult.soDienThoai}
            </p>
            <p>
              <strong>Hạng Thành Viên:</strong> {registrationResult.hanhThanhVien}
            </p>
            <p>
              <strong>Ngày Cấp Thẻ:</strong> {new Date(registrationResult.ngayCapThe).toLocaleDateString()}
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              <strong>Điểm Tích Lũy:</strong> {registrationResult.diemTichLuy.toLocaleString()} điểm
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              <strong>Tổng Chi Tiêu:</strong> {registrationResult.tongChiTieu.toLocaleString()}đ
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
