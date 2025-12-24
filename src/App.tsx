import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { RoomsPage } from './components/RoomsPage'
import { PartiesPage } from './components/PartiesPage'
import { PromotionsPage } from './components/PromotionsPage'
import { MembersPage } from './components/MembersPage'
import { AdminPage } from './components/Admin'
import { ReceptionistPage } from './components/Receptionist/ReceptionistPage'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './App.css'
import {
  FacebookFilled,
  XOutlined,
  InstagramOutlined,
  YoutubeFilled,
  MailOutlined
} from '@ant-design/icons';
const { Footer } = Layout

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (no header/footer) */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Receptionist Routes (no header/footer) */}
        <Route path="/receptionist" element={<ReceptionistPage />} />

        {/* Public Routes (with header/footer) */}
        <Route
          path="/*"
          element={
            <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header />

              <Layout.Content style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rooms" element={<RoomsPage />} />
                  <Route path="/parties" element={<PartiesPage />} />
                  <Route path="/promotions" element={<PromotionsPage />} />
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
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
                        <li style={{ marginBottom: '8px' }}><MailOutlined /> info@karaokennice.vn</li>
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
                      © 2025 Karaoke NNice. Tất cả các quyền được bảo lưu.
                    </p>
                    <div style={{ fontSize: '24px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                        <FacebookFilled />
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                        <XOutlined />
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                        <InstagramOutlined />
                      </a>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                        <YoutubeFilled />
                      </a>
                    </div>
                  </div>
                </div>
              </Footer>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}
