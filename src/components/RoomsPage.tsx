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
  Spin,
  Empty,
  Tag,
} from 'antd'
import { CalendarOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface Room {
  id: number
  name: string
  capacity: number
  price: number
  image: string
  type: string
  isAvailable: boolean
}

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: 'Phòng VIP 1',
      capacity: 8,
      price: 200000,
      image: '🎤',
      type: 'VIP',
      isAvailable: true,
    },
    {
      id: 2,
      name: 'Phòng VIP 2',
      capacity: 10,
      price: 250000,
      image: '🎵',
      type: 'VIP',
      isAvailable: true,
    },
    {
      id: 3,
      name: 'Phòng Standard 1',
      capacity: 6,
      price: 120000,
      image: '🎤',
      type: 'Standard',
      isAvailable: false,
    },
    {
      id: 4,
      name: 'Phòng Standard 2',
      capacity: 6,
      price: 120000,
      image: '🎵',
      type: 'Standard',
      isAvailable: true,
    },
    {
      id: 5,
      name: 'Phòng Nhóm',
      capacity: 4,
      price: 80000,
      image: '🎤',
      type: 'Nhóm',
      isAvailable: true,
    },
    {
      id: 6,
      name: 'Phòng Cặp',
      capacity: 2,
      price: 60000,
      image: '🎵',
      type: 'Cặp',
      isAvailable: true,
    },
  ])

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleBooking = (room: Room) => {
    if (!room.isAvailable) {
      Modal.error({ title: 'Phòng không khả dụng', content: 'Phòng này hiện đã được đặt' })
      return
    }
    setSelectedRoom(room)
    setIsModalVisible(true)
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // Call API here
      console.log('Booking:', { room: selectedRoom, ...values })
      setTimeout(() => {
        Modal.success({
          title: 'Đặt phòng thành công',
          content: `Phòng ${selectedRoom?.name} đã được đặt. Vui lòng check email để xác nhận.`,
        })
        setIsModalVisible(false)
        form.resetFields()
        setLoading(false)
      }, 1000)
    } catch (error) {
      Modal.error({ title: 'Lỗi', content: 'Có lỗi xảy ra khi đặt phòng' })
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px' }}>
        Danh Sách Phòng Hát
      </h1>

      {rooms.length === 0 ? (
        <Empty description="Không có phòng nào" />
      ) : (
        <Row gutter={[24, 24]}>
          {rooms.map((room) => (
            <Col xs={24} sm={12} lg={8} key={room.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                cover={
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '80px',
                    }}
                  >
                    {room.image}
                  </div>
                }
              >
                <div style={{ marginBottom: '16px' }}>
                  <h3>{room.name}</h3>
                  <div style={{ marginBottom: '12px' }}>
                    <Tag color={room.type === 'VIP' ? 'gold' : 'blue'}>{room.type}</Tag>
                    {!room.isAvailable && <Tag color="red">Đã Đặt</Tag>}
                  </div>
                </div>

                <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                  <p>
                    <UserOutlined /> Sức chứa: {room.capacity} người
                  </p>
                  <p>Giá: <strong style={{ color: '#667eea', fontSize: '16px' }}>
                    {room.price.toLocaleString('vi-VN')} đ/giờ
                  </strong></p>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  disabled={!room.isAvailable}
                  onClick={() => handleBooking(room)}
                  style={{
                    background: room.isAvailable ? '#667eea' : '#ccc',
                    borderColor: room.isAvailable ? '#667eea' : '#ccc',
                  }}
                >
                  {room.isAvailable ? 'Đặt Ngay' : 'Đã Đặt'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Booking Modal */}
      <Modal
        title={`Đặt Phòng - ${selectedRoom?.name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Họ và Tên" name="name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item label="Điện Thoại" name="phone" rules={[{ required: true }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input type="email" placeholder="Nhập email" />
          </Form.Item>

          <Form.Item label="Ngày Đặt" name="date" rules={[{ required: true }]}>
            <DatePicker
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Thời Gian Bắt Đầu" name="time" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn giờ"
              options={Array.from({ length: 9 }, (_, i) => ({
                label: `${18 + i}:00`,
                value: `${18 + i}:00`,
              }))}
            />
          </Form.Item>

          <Form.Item label="Số Giờ" name="hours" rules={[{ required: true }]}>
            <InputNumber min={1} max={8} placeholder="Số giờ sử dụng" />
          </Form.Item>

          <Form.Item label="Số Người" name="guests" rules={[{ required: true }]}>
            <InputNumber
              min={1}
              max={selectedRoom?.capacity || 10}
              placeholder="Số người"
            />
          </Form.Item>

          <Form.Item label="Ghi Chú" name="notes">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>

          <div style={{ marginBottom: '20px', padding: '12px', background: '#f5f5f5' }}>
            <p>
              <strong>Giá dự kiến:</strong> {selectedRoom?.price.toLocaleString('vi-VN')} đ/giờ
            </p>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Xác Nhận Đặt Phòng
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
