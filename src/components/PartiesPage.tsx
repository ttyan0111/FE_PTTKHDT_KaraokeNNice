import React, { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Checkbox,
  Space,
  Divider,
} from 'antd'
import { UserOutlined, PhoneOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface PartyPackage {
  id: number
  name: string
  price: number
  duration: number
  capacity: number
  description: string
  services: string[]
  image: string
}

export const PartiesPage: React.FC = () => {
  const packages: PartyPackage[] = [
    {
      id: 1,
      name: 'Gói Cơ Bản',
      price: 500000,
      duration: 3,
      capacity: 20,
      description: '3 giờ hát, nước uống cơ bản',
      services: ['3 giờ hát', 'Nước uống', 'Bánh snacks'],
      image: '🎉',
    },
    {
      id: 2,
      name: 'Gói Tiêu Chuẩn',
      price: 800000,
      duration: 4,
      capacity: 30,
      description: '4 giờ hát, đồ ăn nhẹ, nước uống đa dạng',
      services: ['4 giờ hát', 'Nước uống', 'Đồ ăn nhẹ', 'Bánh kem 2kg'],
      image: '🎂',
    },
    {
      id: 3,
      name: 'Gói Premium',
      price: 1200000,
      duration: 5,
      capacity: 50,
      description: '5 giờ hát, thức ăn đầy đủ, nhân viên phục vụ',
      services: [
        '5 giờ hát',
        'Nước uống cao cấp',
        'Thức ăn đầy đủ',
        'Bánh kem 3kg',
        'Nhân viên phục vụ',
      ],
      image: '👑',
    },
    {
      id: 4,
      name: 'Gói Vip',
      price: 2000000,
      duration: 6,
      capacity: 100,
      description: '6 giờ hát, dịch vụ VIP, trang trí riêng',
      services: [
        '6 giờ hát',
        'Nước uống cao cấp',
        'Thức ăn sang trọng',
        'Bánh kem 5kg',
        'Nhân viên phục vụ riêng',
        'Trang trí tiệc',
        'MC chủ trì',
      ],
      image: '✨',
    },
  ]

  const [selectedPackage, setSelectedPackage] = useState<PartyPackage | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [addOns, setAddOns] = useState<string[]>([])

  const availableAddOns = [
    { id: 'dj', name: 'DJ Live Mix', price: 150000 },
    { id: 'photographer', name: 'Photographer', price: 200000 },
    { id: 'flower', name: 'Trang trí hoa', price: 300000 },
    { id: 'extra_food', name: 'Thêm thức ăn', price: 250000 },
  ]

  const handleBooking = (pkg: PartyPackage) => {
    setSelectedPackage(pkg)
    setIsModalVisible(true)
    setAddOns([])
  }

  const handleAddOnChange = (id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const calculateTotal = () => {
    if (!selectedPackage) return 0
    const addOnTotal = availableAddOns
      .filter((ao) => addOns.includes(ao.id))
      .reduce((sum, ao) => sum + ao.price, 0)
    return selectedPackage.price + addOnTotal
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      console.log('Party Booking:', { package: selectedPackage, addOns, ...values })
      setTimeout(() => {
        Modal.success({
          title: 'Đặt tiệc thành công',
          content: `Tiệc ${selectedPackage?.name} đã được đặt. Vui lòng check email để xác nhận.`,
        })
        setIsModalVisible(false)
        form.resetFields()
        setLoading(false)
      }, 1000)
    } catch (error) {
      Modal.error({ title: 'Lỗi', content: 'Có lỗi xảy ra khi đặt tiệc' })
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px' }}>
        Gói Tiệc Karaoke
      </h1>

      <Row gutter={[24, 24]}>
        {packages.map((pkg) => (
          <Col xs={24} sm={12} lg={6} key={pkg.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                border:
                  pkg.id === 3
                    ? '3px solid #667eea'
                    : '1px solid #ddd',
              }}
              cover={
                <div
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                  }}
                >
                  {pkg.image}
                </div>
              }
            >
              <h3>{pkg.name}</h3>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#666', fontSize: '14px' }}>{pkg.description}</p>
              </div>

              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <p>
                  <strong style={{ color: '#667eea', fontSize: '18px' }}>
                    {pkg.price.toLocaleString('vi-VN')} đ
                  </strong>
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {pkg.duration}h • {pkg.capacity} người
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Dịch vụ bao gồm:
                </p>
                {pkg.services.map((service, idx) => (
                  <p key={idx} style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>
                    ✓ {service}
                  </p>
                ))}
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={() => handleBooking(pkg)}
                style={{ background: '#667eea', borderColor: '#667eea' }}
              >
                Đặt Tiệc
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Booking Modal */}
      <Modal
        title={`Đặt Tiệc - ${selectedPackage?.name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <h4>Thông Tin Liên Hệ</h4>
          <Form.Item label="Tên Người Đặt" name="name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item label="Điện Thoại" name="phone" rules={[{ required: true }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input type="email" placeholder="Nhập email" />
          </Form.Item>

          <Divider />

          <h4>Thông Tin Tiệc</h4>
          <Form.Item label="Ngày Tổ Chức" name="date" rules={[{ required: true }]}>
            <DatePicker
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Giờ Bắt Đầu" name="time" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn giờ"
              options={Array.from({ length: 9 }, (_, i) => ({
                label: `${18 + i}:00`,
                value: `${18 + i}:00`,
              }))}
            />
          </Form.Item>

          <Form.Item label="Số Khách" name="guests" rules={[{ required: true }]}>
            <InputNumber
              min={1}
              max={selectedPackage?.capacity || 100}
              placeholder="Số khách dự kiến"
            />
          </Form.Item>

          <Form.Item label="Ghi Chú" name="notes">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (yêu cầu đặc biệt, ...)" />
          </Form.Item>

          <Divider />

          <h4>Dịch Vụ Bổ Sung</h4>
          <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
            {availableAddOns.map((ao) => (
              <Checkbox
                key={ao.id}
                checked={addOns.includes(ao.id)}
                onChange={() => handleAddOnChange(ao.id)}
              >
                {ao.name} +{ao.price.toLocaleString('vi-VN')}đ
              </Checkbox>
            ))}
          </Space>

          <Divider />

          <div
            style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <p>
                Gói {selectedPackage?.name}:{' '}
                <strong>{selectedPackage?.price.toLocaleString('vi-VN')} đ</strong>
              </p>
            </div>
            {addOns.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <p>
                  Dịch vụ bổ sung:{' '}
                  <strong>
                    {availableAddOns
                      .filter((ao) => addOns.includes(ao.id))
                      .reduce((sum, ao) => sum + ao.price, 0)
                      .toLocaleString('vi-VN')}{' '}
                    đ
                  </strong>
                </p>
              </div>
            )}
            <Divider style={{ margin: '8px 0' }} />
            <p>
              <strong style={{ fontSize: '16px', color: '#667eea' }}>
                Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} đ
              </strong>
            </p>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Xác Nhận Đặt Tiệc
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
