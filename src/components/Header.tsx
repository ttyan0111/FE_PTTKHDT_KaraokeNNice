import React from 'react'
import { Menu, Button, Drawer } from 'antd'
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  GiftOutlined,
  CalendarOutlined,
  LoginOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
  onNavigate?: (page: string) => void
  currentPage?: string
}

export const Header: React.FC<HeaderProps> = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/', label: 'Trang Chủ', icon: <HomeOutlined /> },
    { key: '/rooms', label: 'Phòng Hát', icon: <ShoppingCartOutlined /> },
    { key: '/parties', label: 'Đặt Tiệc', icon: <CalendarOutlined /> },
    { key: '/promotions', label: 'Khuyến Mãi', icon: <GiftOutlined /> },
    { key: '/members', label: 'Thành Viên', icon: <UserOutlined /> },
  ]

  const handleMenuClick = (key: string) => {
    navigate(key)
    setDrawerVisible(false)
  }

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}> {/* Thêm flex để căn giữa */}
            <img
              src="/images/logo-nnice.png"
              alt="Logo NNice"
              style={{
                height: '40px',
                width: 'auto',
                marginRight: '10px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <h1 style={{ margin: 0, lineHeight: 1 }}>Karaoke NNice</h1> {/* Xóa margin mặc định của h1 */}
          </div>

          {/* Desktop Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={(e) => handleMenuClick(e.key)}
            className="desktop-menu"
            items={menuItems}
          />

          {/* Desktop Auth Buttons */}
          <div className="auth-buttons">
            <Button type="text" className="login-btn"
              onClick={() => navigate('/login')}>
              <LoginOutlined className="btn-icon" />
              <span className="btn-text">Đăng Nhập</span>
            </Button>
            <Button
              type="text"
              className="admin-btn"
              onClick={() => navigate('/admin')}
            >
              <UserOutlined className="btn-icon" />
              <span className="btn-text">Admin</span>
            </Button>
            <Button type="primary" className="signup-btn"
              onClick={() => navigate('/register')}>
              <span className="btn-shimmer"></span>
              <span className="btn-text">Đăng Ký</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="mobile-menu-btn"
          />
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        placement="right"
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          onClick={(e) => handleMenuClick(e.key)}
          items={menuItems}
        />
        <div className="mobile-auth-buttons">
          <Button type="text" icon={<LoginOutlined />} block>
            Đăng Nhập
          </Button>
          <Button
            type="text"
            icon={<UserOutlined />}
            block
            style={{ marginTop: '10px' }}
            onClick={() => (window.location.href = '/admin')}
          >
            Admin
          </Button>
          <Button type="primary" block style={{ marginTop: '10px' }}>
            Đăng Ký
          </Button>
        </div>
      </Drawer>
    </>
  )
}
