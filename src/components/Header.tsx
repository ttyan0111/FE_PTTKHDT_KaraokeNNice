import React from 'react'
import { Menu, Button, Drawer } from 'antd'
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  GiftOutlined,
  CalendarOutlined,
  LoginOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import './Header.css'

interface HeaderProps {
  onNavigate: (page: string) => void
  currentPage?: string
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage = '' }) => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const menuItems = [
    { key: 'home', label: 'Trang Chủ', icon: <HomeOutlined /> },
    { key: 'rooms', label: 'Phòng Hát', icon: <ShoppingCartOutlined /> },
    { key: 'party', label: 'Đặt Tiệc', icon: <CalendarOutlined /> },
    { key: 'promotions', label: 'Khuyến Mãi', icon: <GiftOutlined /> },
    { key: 'member', label: 'Thành Viên', icon: <UserOutlined /> },
  ]

  const handleMenuClick = (key: string) => {
    onNavigate(key)
    setDrawerVisible(false)
  }

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            <h1>🎤 Karaoke NNice</h1>
          </div>

          {/* Desktop Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[currentPage]}
            onClick={(e) => handleMenuClick(e.key)}
            className="desktop-menu"
            items={menuItems}
          />

          {/* Desktop Auth Buttons */}
          <div className="auth-buttons">
            <Button type="text" icon={<LoginOutlined />} className="login-btn">
              Đăng Nhập
            </Button>
            <Button type="primary" className="signup-btn">
              Đăng Ký
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
          selectedKeys={[currentPage]}
          onClick={(e) => handleMenuClick(e.key)}
          items={menuItems}
        />
        <div className="mobile-auth-buttons">
          <Button type="text" icon={<LoginOutlined />} block>
            Đăng Nhập
          </Button>
          <Button type="primary" block style={{ marginTop: '10px' }}>
            Đăng Ký
          </Button>
        </div>
      </Drawer>
    </>
  )
}
