import React, { useState } from 'react'
import { Layout, Menu, Card, Button } from 'antd'
import {
  CalendarOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { PartyManagement } from '../Admin/PartyManagement'
import ReceptionistBooking from './ReceptionistBooking'

const { Sider, Content } = Layout

export const ReceptionistPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('party')
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const renderContent = () => {
    switch (selectedMenu) {
      case 'party':
        return <PartyManagement />
      case 'booking':
        // Receptionist-specific booking UI
        return <ReceptionistBooking />
      default:
        return <PartyManagement />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#001529' }}>
        <div style={{ padding: '20px', textAlign: 'center', color: 'white', marginBottom: '20px' }}>
          <UserOutlined style={{ fontSize: '32px', marginBottom: '10px' }} />
          <h2 style={{ margin: 0, fontSize: '18px' }}>👔 Tiếp Tân</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#8c8c8c' }}>
            {user?.hoTen || 'Nhân Viên'}
          </p>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          items={[
            { key: 'party', icon: <CalendarOutlined />, label: 'Quản Lý Đặt Tiệc' },
            { key: 'booking', icon: <HomeOutlined />, label: 'Quản Lý Đặt Phòng' },
          ]}
        />
        <div style={{ padding: '20px', marginTop: '20px' }}>
          <Button
            type="primary"
            danger
            block
            icon={<LogoutOutlined />}
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Đăng Xuất
          </Button>
          <Button
            type="default"
            block
            style={{ marginTop: '10px' }}
            onClick={() => navigate('/')}
          >
            Về Trang Chủ
          </Button>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content style={{ padding: '24px', background: '#0a0e27' }}>
          <Card bodyStyle={{ background: 'transparent', color: '#fff' }} style={{ background: 'transparent', border: 'none' }}>
            {renderContent()}
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ReceptionistPage
