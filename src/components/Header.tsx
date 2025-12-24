import React from 'react'
import { Menu, Button, Drawer, Avatar, Dropdown, type MenuProps } from 'antd'
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  GiftOutlined,
  CalendarOutlined,
  LoginOutlined,
  MenuOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Header.css'

interface HeaderProps {
  onNavigate?: (page: string) => void
  currentPage?: string
}

export const Header: React.FC<HeaderProps> = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [authState, setAuthState] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  // Force re-render when auth state changes
  useEffect(() => {
    setAuthState(isAuthenticated)
  }, [isAuthenticated])

  // Menu items cho Customer
  const customerMenuItems = [
    { key: '/', label: 'Trang Chủ', icon: <HomeOutlined /> },
    { key: '/rooms', label: 'Phòng Hát', icon: <ShoppingCartOutlined /> },
    { key: '/parties', label: 'Đặt Tiệc', icon: <CalendarOutlined /> },
    { key: '/promotions', label: 'Khuyến Mãi', icon: <GiftOutlined /> },
    { key: '/members', label: 'Thành Viên', icon: <UserOutlined /> },
  ]

  // Menu items cho Admin
  const adminMenuItems = [
    { key: '/admin', label: 'Dashboard', icon: <HomeOutlined /> },
    { key: '/admin/members', label: 'Thành Viên', icon: <UserOutlined /> },
    { key: '/admin/rooms', label: 'Phòng', icon: <ShoppingCartOutlined /> },
    { key: '/admin/orders', label: 'Đơn Hàng', icon: <CalendarOutlined /> },
    { key: '/admin/promotions', label: 'Khuyến Mãi', icon: <GiftOutlined /> },
  ]

  // Chọn menu dựa trên loại tài khoản
  const menuItems = user?.loaiTaiKhoan === 'NHAN_VIEN' ? adminMenuItems : customerMenuItems

  const handleMenuClick = (key: string) => {
    navigate(key)
    setDrawerVisible(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Hồ Sơ Cá Nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: 'Đổi mật khẩu',
      icon: <UserOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Đăng Xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ]

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/')}> {/* Thêm flex để căn giữa */}
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
            {authState && user ? (
              // After login - show avatar + dropdown
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <Avatar
                    size={40}
                    style={{ backgroundColor: '#c084fc' }}
                    icon={<UserOutlined />}
                  />
                  <span style={{ color: '#fff', fontWeight: '500' }}>
                    {user.hoTen || user.tenDangNhap}
                  </span>
                </div>
              </Dropdown>
            ) : (
              // Before login - show login/register buttons
              <>
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
              </>
            )}
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
          {authState && user ? (
            // After login - show user info and logout
            <>
              <div style={{ padding: '10px', color: '#fff' }}>
                <p style={{ margin: 0, fontWeight: '500' }}>
                  {user.hoTen || user.tenDangNhap}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                  {user.loaiTaiKhoan === 'KHACH_HANG' ? 'Khách Hàng' : 'Nhân Viên'}
                </p>
              </div>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                block
                onClick={handleLogout}
                danger
              >
                Đăng Xuất
              </Button>
            </>
          ) : (
            // Before login - show login/register buttons
            <>
              <Button type="text" icon={<LoginOutlined />} block onClick={() => navigate('/login')}>
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
              <Button type="primary" block style={{ marginTop: '10px' }} onClick={() => navigate('/register')}>
                Đăng Ký
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </>
  )
}
