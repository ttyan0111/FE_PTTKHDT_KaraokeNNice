import React from 'react'
import { Row, Col, Card, Button, Carousel, Statistic, Space } from 'antd'
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import './HomePage.css'

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <Carousel autoplay className="hero-carousel">
        <div className="hero-slide slide-1">
          <div className="hero-content">
            <h1>Karaoke NNice</h1>
            <p>Hát, vui, và tạo kỉ niệm đáng nhớ cùng bạn bè</p>
            <Button type="primary" size="large" onClick={() => window.location.hash = '/rooms'}>
              Đặt Phòng Ngay
            </Button>
          </div>
        </div>

        <div className="hero-slide slide-2">
          <div className="hero-content">
            <h1>Đặt Tiệc Hoàn Hảo</h1>
            <p>Gói tiệc đặc biệt cho các sự kiện quan trọng</p>
            <Button type="primary" size="large" onClick={() => window.location.hash = '/parties'}>
              Xem Gói Tiệc
            </Button>
          </div>
        </div>

        <div className="hero-slide slide-3">
          <div className="hero-content">
            <h1>Khuyến Mãi Hot</h1>
            <p>Giảm giá lên đến 30% cho thành viên mới</p>
            <Button type="primary" size="large" onClick={() => window.location.hash = '/promotions'}>
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
        <h2>Tại Sao Chọn Karaoke NNice?</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3>Âm Thanh Chất Lượng</h3>
              <p>Hệ thống âm thanh hiện đại, chất lượng studio chuyên nghiệp</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Bài Hát Phong Phú</h3>
              <p>Hơn 50,000 bài hát mới cập nhật hàng tuần</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <div className="feature-icon">🍕</div>
              <h3>Thức Ăn & Thức Uống</h3>
              <p>Thực đơn đa dạng với giá cả hợp lý</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Thoáng Mát & Sạch Sẽ</h3>
              <p>Không gian hiện đại, sạch sẽ và thoáng mát</p>
            </Card>
          </Col>
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
            onClick={() => window.location.hash = '/rooms'}
            className="cta-button"
          >
            Đặt Phòng Hát
          </Button>
          <Button
            size="large"
            onClick={() => window.location.hash = '/parties'}
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
