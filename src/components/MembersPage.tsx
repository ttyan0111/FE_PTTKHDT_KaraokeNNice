import React from 'react';
import { Row, Col, Card, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CrownOutlined,
  TrophyOutlined,
  GiftOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  HeartOutlined,
  SafetyOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import './MembersPage.css';

const { Title, Paragraph, Text } = Typography;

interface MemberTier {
  id: number;
  name: string;
  nameEn: string;
  minPoints: number;
  maxPoints: number | null;
  discount: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  benefits: string[];
  featured?: boolean;
}

export const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const memberTiers: MemberTier[] = [
    {
      id: 1,
      name: 'THÀNH VIÊN',
      nameEn: 'MEMBER',
      minPoints: 0,
      maxPoints: 999,
      discount: 0,
      icon: <StarOutlined />,
      color: '#8B8B8B',
      gradient: 'linear-gradient(135deg, #757575 0%, #9E9E9E 100%)',
      benefits: [
        'Tích lũy điểm với mọi giao dịch',
        'Quà sinh nhật đặc biệt',
        'Thông tin ưu đãi qua email',
        'Hỗ trợ khách hàng ưu tiên',
      ],
    },
    {
      id: 2,
      name: 'BẠC',
      nameEn: 'SILVER',
      minPoints: 1000,
      maxPoints: 2999,
      discount: 5,
      icon: <ThunderboltOutlined />,
      color: '#C0C0C0',
      gradient: 'linear-gradient(135deg, #B0B0B0 0%, #D3D3D3 100%)',
      benefits: [
        'Giảm 5% tổng hóa đơn',
        'Ưu tiên đặt phòng ngày thường',
        'Tích điểm nhanh hơn 1.2x',
        'Quà sinh nhật cao cấp',
      ],
    },
    {
      id: 3,
      name: 'VÀNG',
      nameEn: 'GOLD',
      minPoints: 3000,
      maxPoints: 4999,
      discount: 10,
      icon: <CrownOutlined />,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #F4C430 0%, #FFD700 100%)',
      benefits: [
        'Giảm 10% tổng hóa đơn',
        'Miễn phí trang trí sinh nhật',
        'Check-in quầy VIP',
        'Ưu tiên đặt phòng cuối tuần',
        'Tích điểm nhanh hơn 1.5x',
      ],
      featured: true,
    },
    {
      id: 4,
      name: 'KIM CƯƠNG',
      nameEn: 'DIAMOND',
      minPoints: 5000,
      maxPoints: null,
      discount: 15,
      icon: <TrophyOutlined />,
      color: '#00D4FF',
      gradient: 'linear-gradient(135deg, #1E90FF 0%, #00BFFF 100%)',
      benefits: [
        'Giảm 15% tổng hóa đơn',
        'Ưu tiên giữ phòng Lễ/Tết',
        'Nhân viên phục vụ riêng',
        'Tặng 1 giờ hát (1 lần/tháng)',
        'Tích điểm nhanh hơn 2x',
        'Quà tặng cao cấp hàng quý',
      ],
      featured: true,
    },
  ];

  const pointSteps = [
    {
      icon: <HeartOutlined />,
      title: 'Sử Dụng Dịch Vụ',
      description: 'Thanh toán hóa đơn tại NNice',
    },
    {
      icon: <ThunderboltOutlined />,
      title: 'Tích Điểm Tự Động',
      description: '10.000đ = 1 điểm',
    },
    {
      icon: <GiftOutlined />,
      title: 'Nhận Ưu Đãi',
      description: 'Đổi điểm lấy quà & giảm giá',
    },
  ];

  const regulations = [
    'Hạng thành viên được xét duyệt lại vào ngày 31/12 hàng năm',
    'Điểm tích lũy có thời hạn sử dụng trong 12 tháng',
    'Ưu đãi giảm giá không áp dụng đồng thời với khuyến mãi khác',
    'Vui lòng xuất trình Mã thành viên/SĐT trước khi thanh toán',
    'NNice có quyền thay đổi chính sách mà không cần báo trước',
  ];

  return (
    <div className="members-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <CrownOutlined className="hero-badge-icon" />
            <span>Chương Trình Khách Hàng Thân Thiết</span>
          </div>
          <Title level={1} className="hero-title">
            NNICE CLUB
          </Title>
          <Paragraph className="hero-subtitle">
            Tham gia ngay để nhận ưu đãi độc quyền & tích điểm đổi quà hấp dẫn
          </Paragraph>
          <div className="hero-stats">
            <div className="hero-stat-item">
              <RocketOutlined className="hero-stat-icon" />
              <div className="hero-stat-text">
                <div className="hero-stat-number">15,000+</div>
                <div className="hero-stat-label">Thành Viên</div>
              </div>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <GiftOutlined className="hero-stat-icon" />
              <div className="hero-stat-text">
                <div className="hero-stat-number">500+</div>
                <div className="hero-stat-label">Quà Tặng/Tháng</div>
              </div>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <TrophyOutlined className="hero-stat-icon" />
              <div className="hero-stat-text">
                <div className="hero-stat-number">Lên Đến 15%</div>
                <div className="hero-stat-label">Giảm Giá</div>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="hero-cta-button"
            onClick={() => handleNavigate('/register')}
          >
            <RocketOutlined /> Đăng Ký Ngay - Miễn Phí
          </Button>
          <Text className="hero-note">
            * Đăng ký chỉ mất 30 giây - Không yêu cầu thẻ tín dụng
          </Text>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              <SafetyOutlined /> Cơ Chế Tích Điểm
            </Title>
            <Paragraph className="section-description">
              Đơn giản, minh bạch và dễ dàng tích lũy
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center" align="middle" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
            {pointSteps.map((step, index) => (
              <React.Fragment key={index}>
                <Col flex="0 0 auto" style={{ minWidth: '180px' }}>
                  <Card className="point-step-card" bordered={false}>
                    <div className="point-step-icon">{step.icon}</div>
                    <Title level={4} className="point-step-title">
                      {step.title}
                    </Title>
                    <Paragraph className="point-step-description">
                      {step.description}
                    </Paragraph>
                  </Card>
                </Col>
                {index < pointSteps.length - 1 && (
                  <Col flex="0 0 auto" className="point-arrow-col">
                    <div className="point-arrow">→</div>
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>

          <div className="point-formula">
            <div className="formula-card">
              <Text className="formula-label">Công Thức Đơn Giản:</Text>
              <div className="formula-content">
                <span className="formula-amount">10.000 VNĐ</span>
                <span className="formula-equal">=</span>
                <span className="formula-points">1 Điểm</span>
              </div>
              <Text className="formula-note">
                <CalendarOutlined /> Điểm có hiệu lực trong 12 tháng
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section className="tiers-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              <CrownOutlined /> Quyền Lợi Hạng Thẻ
            </Title>
            <Paragraph className="section-description">
              Càng sử dụng nhiều, càng nhận được nhiều ưu đãi
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {memberTiers.map((tier) => (
              <Col xs={24} sm={12} lg={6} key={tier.id}>
                <Card
                  className={`tier-card ${tier.featured ? 'tier-card-featured' : ''}`}
                  bordered={false}
                  style={{ background: tier.gradient }}
                >
                  {tier.featured && (
                    <div className="tier-badge">PHỔ BIẾN</div>
                  )}
                  <div className="tier-icon-wrapper">
                    <div className="tier-icon">{tier.icon}</div>
                  </div>
                  <Title level={3} className="tier-name">
                    {tier.name}
                  </Title>
                  <Text className="tier-name-en">{tier.nameEn}</Text>

                  <div className="tier-points">
                    <Text className="tier-points-range">
                      {tier.minPoints.toLocaleString('vi-VN')}
                      {tier.maxPoints ? ` - ${tier.maxPoints.toLocaleString('vi-VN')}` : '+'}
                    </Text>
                    <Text className="tier-points-label">điểm</Text>
                  </div>

                  {tier.discount > 0 && (
                    <div className="tier-discount">
                      <span className="tier-discount-value">{tier.discount}%</span>
                      <span className="tier-discount-label">Giảm giá</span>
                    </div>
                  )}

                  <div className="tier-benefits">
                    {tier.benefits.map((benefit, idx) => (
                      <div key={idx} className="tier-benefit-item">
                        <CheckCircleOutlined className="tier-benefit-icon" />
                        <Text className="tier-benefit-text">{benefit}</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Regulations Section */}
      <section className="regulations-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              <SafetyOutlined /> Quy Định & Lưu Ý
            </Title>
            <Paragraph className="section-description">
              Vui lòng đọc kỹ để hiểu rõ chính sách
            </Paragraph>
          </div>

          <Card className="regulations-card" bordered={false}>
            <Row gutter={[24, 24]}>
              {regulations.map((regulation, index) => (
                <Col xs={24} md={12} key={index}>
                  <div className="regulation-item">
                    <CheckCircleOutlined className="regulation-icon" />
                    <Text className="regulation-text">{regulation}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-overlay"></div>
        <div className="final-cta-content">
          <Title level={2} className="final-cta-title">
            Sẵn Sàng Trải Nghiệm Đặc Quyền?
          </Title>
          <Paragraph className="final-cta-description">
            Đăng ký NNice Club ngay hôm nay và bắt đầu hành trình tích điểm
          </Paragraph>
          <Button
            type="primary"
            size="large"
            className="final-cta-button"
            onClick={() => handleNavigate('/register')}
          >
            <RocketOutlined /> Đăng Ký Miễn Phí Ngay
          </Button>
          <Text className="final-cta-note">
            Đã có tài khoản?{' '}
            <a onClick={() => handleNavigate('/login')} className="final-cta-link">
              Đăng nhập ngay
            </a>
          </Text>
        </div>
      </section>
    </div>
  );
};