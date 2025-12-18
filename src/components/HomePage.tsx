import React from 'react'
import { Row, Col, Card, Button, Carousel, Statistic, Space } from 'antd'
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SoundOutlined,
  CustomerServiceOutlined,
  CoffeeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <SoundOutlined />,
      title: 'Âm Thanh Đỉnh Cao',
      description: 'Hệ thống JBL Professional, mixer Yamaha cao cấp, âm thanh chuẩn studio',
    },
    {
      icon: <CustomerServiceOutlined />,
      title: 'Kho Nhạc Khổng Lồ',   
      description: '100,000+ bài hát Việt - Hàn - Âu Mỹ, cập nhật hàng tuần, karaoke HD',
    },
    {
      icon: <CoffeeOutlined />,
      title: 'F&B Cao Cấp',
      description: 'Menu đa dạng 200+ món, đồ uống premium, phục vụ tận phòng 24/7',
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Không Gian 5 Sao',
      description: 'Phòng cách âm tốt, nội thất sang trọng, hệ thống đèn LED hiện đại',
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <Carousel autoplay className="hero-carousel">
        <div className="hero-slide slide-1">
          <div className="hero-content">
            <h1>Karaoke NNice</h1>
            <p>Hát, vui, và tạo kỉ niệm đáng nhớ cùng bạn bè</p>
            <Button type="primary" size="large" onClick={() => navigate('/rooms')}>
              Đặt Phòng Ngay
            </Button>
          </div>
        </div>

        <div className="hero-slide slide-2">
          <div className="hero-content">
            <h1>Đặt Tiệc Hoàn Hảo</h1>
            <p>Gói tiệc đặc biệt cho các sự kiện quan trọng</p>
            <Button type="primary" size="large" onClick={() => navigate('/parties')}>
              Xem Gói Tiệc
            </Button>
          </div>
        </div>

        <div className="hero-slide slide-3">
          <div className="hero-content">
            <h1>Khuyến Mãi Hot</h1>
            <p>Giảm giá lên đến 30% cho thành viên mới</p>
            <Button type="primary" size="large" onClick={() => navigate('/promotions')}>
              Xem Khuyến Mãi
            </Button>
          </div>
        </div>
      </Carousel>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stats-container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="Phòng Hát" value={24} suffix="phòng" />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="Khách Hàng" value={5843} suffix="+" />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="Đánh Giá" value={4.8} suffix="⭐" />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="Năm Hoạt Động" value={5} suffix="năm" />
            </Col>
          </Row>
        </div>
      </div>

      {/* Features */}
      <div className="features-section">
        <div className="section-header">
          <h2>Trải Nghiệm Karaoke Đẳng Cấp</h2>
          <p className="section-subtitle">Chất lượng dịch vụ hàng đầu tại Hà Nội</p>
        </div>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card hoverable className="feature-card" bordered={false}>
                <div className="feature-icon-wrapper">
                  {React.cloneElement(feature.icon, { className: 'feature-icon-svg' })}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Booking CTA */}
      <div className="booking-cta-section">
        <h2>Sẵn Sàng Hát?</h2>
        <p>Đặt phòng của bạn ngay hôm nay và nhận ưu đãi đặc biệt</p>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/rooms')}
            className="cta-button"
          >
            Đặt Phòng Hát
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/parties')}
            className="cta-button"
          >
            Đặt Tiệc Sự Kiện
          </Button>
        </Space>
      </div>

      {/* Contact Info */}
      <div className="contact-section">
        <h2>Thông Tin Liên Hệ</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div className="contact-info-card">
              <PhoneOutlined className="contact-icon" />
              <h4>Điện Thoại</h4>
              <p>(+84) 123-456-789</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="contact-info-card">
              <EnvironmentOutlined className="contact-icon" />
              <h4>Địa Chỉ</h4>
              <p>123 Đường ABC, Hà Nội</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="contact-info-card">
              <ClockCircleOutlined className="contact-icon" />
              <h4>Giờ Mở Cửa</h4>
              <p>18:00 - 02:00 (Hàng ngày)</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="contact-info-card">
              <TeamOutlined className="contact-icon" />
              <h4>Hỗ Trợ</h4>
              <p>Chat trực tuyến 24/7</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
