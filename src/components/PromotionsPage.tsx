import React, { useState } from 'react'
import { Row, Col, Card, Button, Tag, Input, Space, Modal, Form, InputNumber, DatePicker } from 'antd'
import { CopyOutlined, GiftOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface Promotion {
  id: number
  code: string
  title: string
  description: string
  discount: number
  type: 'percent' | 'fixed'
  validFrom: string
  validTo: string
  minAmount: number
  maxUses: number
  currentUses: number
  image: string
  active: boolean
}

export const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 1,
      code: 'WELCOME50',
      title: 'Chào mừng bạn',
      description: 'Giảm 50.000đ cho đơn đặt phòng đầu tiên',
      discount: 50000,
      type: 'fixed',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minAmount: 100000,
      maxUses: 500,
      currentUses: 245,
      image: '🎁',
      active: true,
    },
    {
      id: 2,
      code: 'PARTY30',
      title: 'Đặt tiệc',
      description: 'Giảm 30% cho gói tiệc cơ bản',
      discount: 30,
      type: 'percent',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minAmount: 500000,
      maxUses: 200,
      currentUses: 87,
      image: '🎉',
      active: true,
    },
    {
      id: 3,
      code: 'MEMBER25',
      title: 'Thành viên',
      description: 'Giảm 25% cho thành viên',
      discount: 25,
      type: 'percent',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minAmount: 200000,
      maxUses: 1000,
      currentUses: 532,
      image: '⭐',
      active: true,
    },
    {
      id: 4,
      code: 'WEEKEND50',
      title: 'Cuối tuần',
      description: 'Giảm 50.000đ cho đặt phòng cuối tuần',
      discount: 50000,
      type: 'fixed',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minAmount: 150000,
      maxUses: 300,
      currentUses: 298,
      image: '🎊',
      active: true,
    },
    {
      id: 5,
      code: 'LOYALTY100',
      title: 'Quà tặng',
      description: 'Dùng 100 điểm tích lũy để nhận voucher 100.000đ',
      discount: 100000,
      type: 'fixed',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minAmount: 0,
      maxUses: 500,
      currentUses: 156,
      image: '🏆',
      active: true,
    },
    {
      id: 6,
      code: 'REFER50',
      title: 'Giới thiệu',
      description: 'Giới thiệu bạn được 50.000đ',
      discount: 50000,
      type: 'fixed',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minAmount: 0,
      maxUses: 800,
      currentUses: 423,
      image: '👥',
      active: true,
    },
  ])

  const [copiedCode, setCopiedCode] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    Modal.success({
      title: 'Đã sao chép',
      content: `Mã "${code}" đã được sao chép vào clipboard`
    })
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const handleApply = (promo: Promotion) => {
    setSelectedPromo(promo)
    setIsModalVisible(true)
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      console.log('Apply promotion:', { promo: selectedPromo, ...values })
      setTimeout(() => {
        Modal.success({
          title: 'Áp dụng thành công',
          content: `Mã ${selectedPromo?.code} đã được áp dụng cho đơn hàng của bạn`,
        })
        setIsModalVisible(false)
        form.resetFields()
        setLoading(false)
      }, 1000)
    } catch (error) {
      Modal.error({ title: 'Lỗi', content: 'Có lỗi xảy ra khi áp dụng mã' })
      setLoading(false)
    }
  }

  const calculateSavings = (promo: Promotion, amount: number = 1000000) => {
    if (promo.type === 'percent') {
      return Math.floor((amount * promo.discount) / 100)
    }
    return promo.discount
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px' }}>
        Khuyến Mãi Đặc Biệt
      </h1>

      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Áp dụng mã khuyến mãi khi đặt phòng hoặc tiệc để nhận ưu đãi
        </p>
      </div>

      <Row gutter={[24, 24]}>
        {promotions.map((promo) => {
          const isExpired = dayjs(promo.validTo).isBefore(dayjs())
          const isComingSoon = dayjs(promo.validFrom).isAfter(dayjs())

          return (
            <Col xs={24} sm={12} lg={8} key={promo.id}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  opacity: isExpired || isComingSoon ? 0.6 : 1,
                }}
                cover={
                  <div
                    style={{
                      background:
                        promo.id % 3 === 0
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          : promo.id % 3 === 1
                            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                            : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '60px',
                    }}
                  >
                    {promo.image}
                  </div>
                }
              >
                <div style={{ marginBottom: '12px' }}>
                  <h3>{promo.title}</h3>
                  <p style={{ color: '#666', fontSize: '12px' }}>{promo.description}</p>
                </div>

                {/* Discount Info */}
                <div
                  style={{
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#f5576c' }}>
                    {promo.type === 'percent' ? `${promo.discount}%` : `${promo.discount.toLocaleString('vi-VN')}đ`}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
                    Tiết kiệm tối đa
                  </p>
                </div>

                {/* Code Box */}
                <div
                  style={{
                    padding: '12px',
                    border: '2px dashed #667eea',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#667eea',
                      fontFamily: 'monospace',
                    }}
                  >
                    {promo.code}
                  </span>
                  <CopyOutlined
                    onClick={() => handleCopy(promo.code)}
                    style={{ cursor: 'pointer', color: '#667eea', fontSize: '16px' }}
                  />
                </div>

                {/* Validity */}
                <div style={{ marginBottom: '12px', fontSize: '12px', color: '#999' }}>
                  <p>
                    <CalendarOutlined /> Đến {dayjs(promo.validTo).format('DD/MM/YYYY')}
                  </p>
                  <p>
                    <TagOutlined /> Đã dùng {promo.currentUses}/{promo.maxUses}
                  </p>
                  <p>
                    <span style={{ fontSize: '12px' }}>Đơn tối thiểu: {promo.minAmount.toLocaleString('vi-VN')}đ</span>
                  </p>
                </div>

                {/* Status Tags */}
                <div style={{ marginBottom: '12px' }}>
                  {isExpired && <Tag color="red">Hết hạn</Tag>}
                  {isComingSoon && <Tag color="orange">Sắp diễn ra</Tag>}
                  {!isExpired && !isComingSoon && (
                    <Tag color="green">Còn hiệu lực</Tag>
                  )}
                  {promo.currentUses >= promo.maxUses * 0.9 && !isExpired && (
                    <Tag color="volcano">Sắp hết</Tag>
                  )}
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  disabled={isExpired || isComingSoon}
                  onClick={() => handleApply(promo)}
                  style={{ background: '#667eea', borderColor: '#667eea' }}
                >
                  <GiftOutlined /> Sử Dụng
                </Button>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Apply Modal */}
      <Modal
        title={`Sử Dụng Mã - ${selectedPromo?.code}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div
            style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Mã khuyến mãi</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
              {selectedPromo?.code}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>{selectedPromo?.description}</p>
          </div>

          <Form.Item label="Loại Đặt" name="type" rules={[{ required: true }]}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item label="Số Tiền" name="amount" rules={[{ required: true }]}>
            <InputNumber
              prefix="₫"
              min={selectedPromo?.minAmount || 0}
              placeholder="Nhập số tiền"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item label="Ghi Chú" name="notes">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>

          <div
            style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Bạn sẽ tiết kiệm</p>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#f5576c',
              }}
            >
              {selectedPromo
                ? `${selectedPromo.type === 'percent' ? selectedPromo.discount + '%' : selectedPromo.discount.toLocaleString('vi-VN') + 'đ'}`
                : '0đ'}
            </p>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Xác Nhận Sử Dụng Mã
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
