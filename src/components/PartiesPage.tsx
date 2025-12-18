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
  Tag,
} from 'antd'
import { 
  UserOutlined, 
  PhoneOutlined,
  GiftOutlined,
  CrownOutlined,
  StarOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
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
      image: 'gift',
    },
    {
      id: 2,
      name: 'Gói Tiêu Chuẩn',
      price: 800000,
      duration: 4,
      capacity: 30,
      description: '4 giờ hát, đồ ăn nhẹ, nước uống đa dạng',
      services: ['4 giờ hát', 'Nước uống', 'Đồ ăn nhẹ', 'Bánh kem 2kg'],
      image: 'star',
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
      image: 'crown',
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
      image: 'trophy',
    },
  ]

  const getPackageIcon = (iconType: string) => {
    const iconProps = { style: { fontSize: '48px', color: '#fff' } }
    switch (iconType) {
      case 'gift': return <GiftOutlined {...iconProps} />
      case 'star': return <StarOutlined {...iconProps} />
      case 'crown': return <CrownOutlined {...iconProps} />
      case 'trophy': return <TrophyOutlined {...iconProps} />
      default: return <GiftOutlined {...iconProps} />
    }
  }

  const getPackageColor = (id: number) => {
    const colors = {
      1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      4: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    }
    return colors[id as keyof typeof colors] || colors[1]
  }

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
                border: '1px solid #e8e8e8',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
              bodyStyle={{ padding: '20px' }}
              cover={
                <div
                  style={{
                    background: getPackageColor(pkg.id),
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {getPackageIcon(pkg.image)}
                  {pkg.id === 3 && (
                    <Tag 
                      color="gold" 
                      style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      PHỔ BIẾN
                    </Tag>
                  )}
                </div>
              }
            >
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#262626'
              }}>
                {pkg.name}
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ 
                  color: '#8c8c8c', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  minHeight: '42px'
                }}>
                  {pkg.description}
                </p>
              </div>

              <div
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)',
                  borderRadius: '10px',
                  border: '1px solid #e8e8e8',
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong style={{ 
                    color: '#1890ff', 
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    {pkg.price.toLocaleString('vi-VN')} đ
                  </strong>
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#8c8c8c',
                  margin: '4px 0 0 0'
                }}>
                  {pkg.duration}h • {pkg.capacity} người
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: '#262626'
                }}>
                  Dịch vụ bao gồm:
                </p>
                <div style={{ 
                  background: '#fafafa',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}>
                  {pkg.services.map((service, idx) => (
                    <p key={idx} style={{ 
                      fontSize: '13px', 
                      color: '#595959', 
                      margin: '6px 0',
                      paddingLeft: '4px',
                      lineHeight: '1.5'
                    }}>
                      <span style={{ color: '#52c41a', marginRight: '8px', fontWeight: 'bold' }}>✓</span>
                      {service}
                    </p>
                  ))}
                </div>
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={() => handleBooking(pkg)}
                style={{ 
                  background: '#1890ff',
                  borderColor: '#1890ff',
                  height: '44px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                }}
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
