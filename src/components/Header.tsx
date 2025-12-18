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
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <h1>Karaoke NNice</h1>
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
            <Button type="text" className="login-btn">
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
            <Button type="primary" className="signup-btn">
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
