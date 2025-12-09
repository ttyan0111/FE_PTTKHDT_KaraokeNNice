import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { RoomsPage } from './components/RoomsPage'
import { PartiesPage } from './components/PartiesPage'
import { PromotionsPage } from './components/PromotionsPage'
import { MembersPage } from './components/MembersPage'
import './App.css'

const { Footer } = Layout

export const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header onNavigate={() => {}} />

        <Layout.Content style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/parties" element={<PartiesPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/members" element={<MembersPage />} />
          </Routes>
        </Layout.Content>

        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#001529',
            color: '#fff',
            padding: '40px 20px',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              {/* About */}
              <div>
                <h4 style={{ marginBottom: '16px' }}>Về Karaoke NNice</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                      Về chúng tôi
                    </a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                      Lịch sử
                    </a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                      Tuyển dụng
                    </a>
                  </li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 style={{ marginBottom: '16px' }}>Dịch vụ</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#/rooms" style={{ color: '#fff', textDecoration: 'none' }}>
                      Đặt phòng
                    </a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#/parties" style={{ color: '#fff', textDecoration: 'none' }}>
                      Gói tiệc
                    </a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#/members" style={{ color: '#fff', textDecoration: 'none' }}>
                      Chương trình thành viên
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 style={{ marginBottom: '16px' }}>Hỗ trợ</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                      Liên hệ
                    </a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                      FAQ
                    </a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                      Chính sách bảo mật
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{ marginBottom: '16px' }}>Liên hệ</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>📞 0912 345 678</li>
                  <li style={{ marginBottom: '8px' }}>📧 info@karaokennice.vn</li>
                  <li style={{ marginBottom: '8px' }}>📍 123 Đường ABC, Quận 1, TP.HCM</li>
                  <li>🕐 10:00 - 03:00 (T2-T7) | 10:00-02:00 (CN)</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid #333',
                paddingTop: '20px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, marginBottom: '10px' }}>
                © 2024 Karaoke NNice. Tất cả các quyền được bảo lưu.
              </p>
              <div style={{ fontSize: '20px' }}>
                <a href="#" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
                  📘
                </a>
                <a href="#" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
                  🐦
                </a>
                <a href="#" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
                  📷
                </a>
                <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                  ▶️
                </a>
              </div>
            </div>
          </div>
        </Footer>
      </Layout>
    </Router>
  )
}
