import React, { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Progress,
  Table,
  Divider,
  InputNumber,
  Space,
} from 'antd'
import { GiftOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { apiClient } from '../services/api'

interface MemberTier {
  id: number
  name: string
  color: string
  minPoints: number
  benefits: string[]
  icon: string
}

interface RedeemItem {
  id: number
  name: string
  pointsRequired: number
  quantity: number
  description: string
}

export const MembersPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberData, setMemberData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyena@example.com',
    points: 2850,
    tier: 'Silver',
    joinDate: '2023-06-15',
    totalSpent: 15500000,
    visits: 28,
  })

  const memberTiers: MemberTier[] = [
    {
      id: 1,
      name: 'Bronze',
      color: '#CD7F32',
      minPoints: 0,
      benefits: ['Điểm tích lũy 1% giá trị đơn hàng', 'Ưu tiên đặt phòng'],
      icon: '🥉',
    },
    {
      id: 2,
      name: 'Silver',
      color: '#C0C0C0',
      minPoints: 1000,
      benefits: [
        'Điểm tích lũy 2% giá trị đơn hàng',
        'Giảm 5% giá phòng',
        'Hỗ trợ ưu tiên',
        'Sinh nhật tặng quà',
      ],
      icon: '🥈',
    },
    {
      id: 3,
      name: 'Gold',
      color: '#FFD700',
      minPoints: 5000,
      benefits: [
        'Điểm tích lũy 3% giá trị đơn hàng',
        'Giảm 10% giá phòng',
        'Hỗ trợ VIP 24/7',
        'Sinh nhật tặng voucher 200K',
        'Ưu tiên tham gia sự kiện',
      ],
      icon: '🥇',
    },
    {
      id: 4,
      name: 'Platinum',
      color: '#E5E4E2',
      minPoints: 10000,
      benefits: [
        'Điểm tích lũy 5% giá trị đơn hàng',
        'Giảm 15% giá phòng',
        'Account manager riêng',
        'Sinh nhật tặng voucher 500K',
        'Mời tham dự sự kiện VIP',
        'Quyền xin hoãn đơn hàng',
      ],
      icon: '💎',
    },
  ]

  const redeemItems: RedeemItem[] = [
    {
      id: 1,
      name: 'Voucher 50.000đ',
      pointsRequired: 500,
      quantity: 120,
      description: 'Sử dụng cho đặt phòng hoặc tiệc',
    },
    {
      id: 2,
      name: 'Voucher 100.000đ',
      pointsRequired: 1000,
      quantity: 85,
      description: 'Sử dụng cho đặt phòng hoặc tiệc',
    },
    {
      id: 3,
      name: 'Voucher 200.000đ',
      pointsRequired: 2000,
      quantity: 32,
      description: 'Sử dụng cho gói tiệc',
    },
    {
      id: 4,
      name: 'Gói nước uống',
      pointsRequired: 300,
      quantity: 200,
      description: '1 chai nước cao cấp khi sử dụng phòng',
    },
    {
      id: 5,
      name: 'Bánh kem 2kg',
      pointsRequired: 800,
      quantity: 45,
      description: 'Bánh kem tặng cho tiệc',
    },
    {
      id: 6,
      name: 'Session DJ',
      pointsRequired: 3000,
      quantity: 15,
      description: 'DJ phục vụ 1 tiệc (tối đa 3 giờ)',
    },
  ]

  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<RedeemItem | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)
  const [searchPhone, setSearchPhone] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const currentTier = memberTiers.find((tier) => tier.name === memberData.tier)
  const nextTier = memberTiers.find(
    (tier) => tier.minPoints > (currentTier?.minPoints || 0)
  )
  const pointsToNextTier = nextTier ? nextTier.minPoints - memberData.points : 0

  const handleRedeem = (item: RedeemItem) => {
    if (memberData.points < item.pointsRequired) {
      Modal.error({
        title: 'Điểm không đủ',
        content: `Bạn cần ${item.pointsRequired - memberData.points} điểm nữa`,
      })
      return
    }
    setSelectedItem(item)
    setIsRedeemModalVisible(true)
  }

  const handleRedeemSubmit = async (values: any) => {
    setLoading(true)
    try {
      console.log('Redeem:', { item: selectedItem, ...values })
      setTimeout(() => {
        Modal.success({
          title: 'Đổi thành công',
          content: `Bạn đã đổi ${selectedItem?.name}. Vui lòng check email để nhận code.`,
        })
        setIsRedeemModalVisible(false)
        form.resetFields()
        setMemberData((prev) => ({
          ...prev,
          points: prev.points - (selectedItem?.pointsRequired || 0),
        }))
        setLoading(false)
      }, 1000)
    } catch (error) {
      Modal.error({ title: 'Lỗi', content: 'Có lỗi xảy ra' })
      setLoading(false)
    }
  }

  const handleLogin = async (_values: any) => {
    setLoading(true)
    try {
      setTimeout(() => {
        Modal.success({ title: 'Đăng nhập thành công' })
        setIsLoginModalVisible(false)
        form.resetFields()
        setIsLoggedIn(true)
        setLoading(false)
      }, 1000)
    } catch (error) {
      Modal.error({ title: 'Lỗi', content: 'Email hoặc mật khẩu không đúng' })
      setLoading(false)
    }
  }

  const handleSearchMember = async () => {
    if (!searchPhone.trim()) {
      Modal.warning({ title: 'Cảnh báo', content: 'Vui lòng nhập số điện thoại' })
      return
    }
    
    setIsSearching(true)
    try {
      const response = await apiClient.getMemberByPhone(searchPhone)
      if (response) {
        setMemberData({
          name: response.hoTen,
          email: response.email || '',
          points: 2850,
          tier: 'Silver',
          joinDate: new Date().toISOString().split('T')[0],
          totalSpent: 15500000,
          visits: 28,
        })
        setIsLoggedIn(true)
        setSearchPhone('')
        Modal.success({ title: 'Thành công', content: 'Tìm kiếm thành viên thành công' })
      }
    } catch (error: any) {
      Modal.error({ title: 'Lỗi', content: error.response?.data?.message || 'Không tìm thấy thành viên' })
    } finally {
      setIsSearching(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Chương Trình Thành Viên</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Đăng nhập để xem điểm tích lũy và ưu đãi của bạn
          </p>

          {/* Search Member by Phone */}
          <Card style={{ marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
            <p style={{ marginBottom: '16px', fontWeight: 'bold' }}>Tìm Kiếm Thành Viên</p>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                size="large"
                placeholder="Nhập số điện thoại (VD: 0123456789)"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onPressEnter={handleSearchMember}
              />
              <Button
                type="primary"
                size="large"
                loading={isSearching}
                onClick={handleSearchMember}
                style={{ background: '#667eea', borderColor: '#667eea' }}
              >
                <SearchOutlined /> Tìm Kiếm
              </Button>
            </Space.Compact>
          </Card>

          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>hoặc</p>

          <Button
            type="primary"
            size="large"
            onClick={() => setIsLoginModalVisible(true)}
            style={{ background: '#667eea', borderColor: '#667eea', height: '40px', fontSize: '16px' }}
          >
            <UserOutlined /> Đăng Nhập
          </Button>
        </div>

        <Modal
          title="Đăng Nhập Thành Viên"
          open={isLoginModalVisible}
          onCancel={() => setIsLoginModalVisible(false)}
          footer={null}
          width={400}
        >
          <Form form={form} layout="vertical" onFinish={handleLogin}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input type="email" placeholder="Nhập email" />
            </Form.Item>
            <Form.Item label="Mật Khẩu" name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Đăng Nhập
            </Button>
          </Form>
        </Modal>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Chương Trình Thành Viên</h1>

        {/* Member Info Card */}
        <Card style={{ marginBottom: '30px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {currentTier?.icon}
                </div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                  {memberData.tier}
                </p>
                <p style={{ color: '#666', fontSize: '12px' }}>Thành Viên</p>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div>
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>Họ và Tên</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>
                  {memberData.name}
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>Ngày Tham Gia</p>
                <p style={{ fontSize: '14px', margin: '4px 0' }}>{memberData.joinDate}</p>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div>
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>Tổng Chi Tiêu</p>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '4px 0',
                    color: '#667eea',
                  }}
                >
                  {memberData.totalSpent.toLocaleString('vi-VN')}đ
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>Lần Ghé Thăm</p>
                <p style={{ fontSize: '14px', margin: '4px 0' }}>{memberData.visits} lần</p>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div>
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>Điểm Tích Lũy</p>
                <p
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: '4px 0',
                    color: '#f5576c',
                  }}
                >
                  {memberData.points}
                </p>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setIsRedeemModalVisible(true)}
                  style={{ padding: 0 }}
                >
                  Đổi thưởng →
                </Button>
              </div>
            </Col>
          </Row>

          <Divider />

          {/* Tier Progress */}
          <div style={{ marginTop: '20px' }}>
            <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>
              {nextTier
                ? `Tiến tới ${nextTier.name} (${pointsToNextTier} điểm nữa)`
                : 'Bạn đã đạt cấp độ cao nhất'}
            </p>
            {nextTier && (
              <Progress
                percent={Math.round(
                  ((memberData.points - currentTier!.minPoints) /
                    (nextTier.minPoints - currentTier!.minPoints)) *
                    100
                )}
              />
            )}
          </div>
        </Card>

        {/* Tier Info */}
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Các Cấp Độ Thành Viên</h2>
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          {memberTiers.map((tier) => (
            <Col xs={24} sm={12} lg={6} key={tier.id}>
              <Card
                style={{
                  border:
                    tier.name === memberData.tier
                      ? `3px solid ${tier.color}`
                      : '1px solid #ddd',
                  height: '100%',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{tier.icon}</div>
                  <h4 style={{ margin: 0 }}>{tier.name}</h4>
                  <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>
                    {tier.minPoints.toLocaleString('vi-VN')} điểm
                  </p>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                {tier.benefits.map((benefit, idx) => (
                  <p key={idx} style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
                    ✓ {benefit}
                  </p>
                ))}
              </Card>
            </Col>
          ))}
        </Row>

        {/* Redeem Section */}
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Đổi Thưởng</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Sử dụng điểm tích lũy để đổi các phần thưởng hấp dẫn
        </p>

        <Row gutter={[24, 24]}>
          {redeemItems.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card hoverable style={{ height: '100%' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#666', fontSize: '12px', margin: '8px 0' }}>
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Cần</p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#667eea',
                    }}
                  >
                    {item.pointsRequired} điểm
                  </p>
                </div>

                <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                  Còn lại: {item.quantity}
                </p>

                <Button
                  type="primary"
                  block
                  disabled={memberData.points < item.pointsRequired}
                  onClick={() => handleRedeem(item)}
                  style={{
                    background:
                      memberData.points >= item.pointsRequired ? '#667eea' : '#ccc',
                    borderColor:
                      memberData.points >= item.pointsRequired ? '#667eea' : '#ccc',
                  }}
                >
                  <GiftOutlined /> Đổi Ngay
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Transaction History */}
        <h2 style={{ fontSize: '24px', marginBottom: '20px', marginTop: '40px' }}>
          Lịch Sử Giao Dịch
        </h2>
        <Card>
          <Table
            dataSource={[
              {
                key: '1',
                date: '2024-01-15',
                description: 'Đặt phòng VIP 2',
                amount: 250000,
                points: 500,
                type: 'earning',
              },
              {
                key: '2',
                date: '2024-01-12',
                description: 'Đổi Voucher 50K',
                amount: -50000,
                points: -500,
                type: 'redeem',
              },
              {
                key: '3',
                date: '2024-01-10',
                description: 'Đặt tiệc gói Tiêu Chuẩn',
                amount: 800000,
                points: 1600,
                type: 'earning',
              },
            ]}
            columns={[
              { title: 'Ngày', dataIndex: 'date', key: 'date' },
              { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
              {
                title: 'Số Tiền',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount) => (
                  <span style={{ color: amount > 0 ? '#43e97b' : '#f5576c' }}>
                    {amount > 0 ? '+' : ''}{amount.toLocaleString('vi-VN')}đ
                  </span>
                ),
              },
              {
                title: 'Điểm',
                dataIndex: 'points',
                key: 'points',
                render: (points) => (
                  <span style={{ color: points > 0 ? '#43e97b' : '#f5576c' }}>
                    {points > 0 ? '+' : ''}{points}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {/* Redeem Modal */}
      <Modal
        title={`Đổi Thưởng - ${selectedItem?.name}`}
        open={isRedeemModalVisible}
        onCancel={() => setIsRedeemModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleRedeemSubmit}>
          <div
            style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Mục tiêu</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>
              {selectedItem?.name}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
              {selectedItem?.description}
            </p>
          </div>

          <Form.Item label="Số Lượng" name="quantity" initialValue={1} rules={[{ required: true }]}>
            <InputNumber min={1} max={5} />
          </Form.Item>

          <div
            style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Tổng điểm sử dụng</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#f5576c' }}>
              {(selectedItem?.pointsRequired || 0)} điểm
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
              Điểm còn lại: {memberData.points - (selectedItem?.pointsRequired || 0)}
            </p>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Xác Nhận Đổi Thưởng
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
