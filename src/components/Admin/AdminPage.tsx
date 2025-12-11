import React, { useState, useEffect } from 'react'
import { Layout, Menu, Card, Button, message } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  GiftOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Dashboard } from './Dashboard'
import { MemberManagement } from './MemberManagement'
import { RoomManagement } from './RoomManagement'
import { OrderManagement } from './OrderManagement'
import { PromotionManagement } from './PromotionManagement'

const { Sider, Content } = Layout

interface Room {
  id: number
  name: string
  type: string
  capacity: number
  price: number
  status: 'available' | 'occupied' | 'maintenance'
}

interface Order {
  id: number
  memberName: string
  roomName: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  date: string
}

export const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [memberCount, setMemberCount] = useState(0)

  const [rooms] = useState<Room[]>([
    { id: 1, name: 'Phòng VIP 1', type: 'VIP', capacity: 8, price: 200000, status: 'available' },
    { id: 2, name: 'Phòng VIP 2', type: 'VIP', capacity: 10, price: 250000, status: 'occupied' },
    { id: 3, name: 'Phòng Standard 1', type: 'Standard', capacity: 6, price: 120000, status: 'available' },
    { id: 4, name: 'Phòng Nhóm', type: 'Nhóm', capacity: 4, price: 80000, status: 'maintenance' },
  ])

  const [orders] = useState<Order[]>([
    {
      id: 1,
      memberName: 'Nguyễn Văn A',
      roomName: 'Phòng VIP 1',
      amount: 200000,
      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: 2,
      memberName: 'Trần Thị B',
      roomName: 'Phòng Standard 1',
      amount: 120000,
      status: 'pending',
      date: '2024-01-16',
    },
    {
      id: 3,
      memberName: 'Lê Văn C',
      roomName: 'Phòng Nhóm',
      amount: 80000,
      status: 'completed',
      date: '2024-01-14',
    },
  ])

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <Dashboard
            memberCount={memberCount}
            roomCount={rooms.length}
            completedOrders={orders.filter((o) => o.status === 'completed').length}
            totalRevenue={15.5}
            orders={orders}
          />
        )
      case 'members':
        return <MemberManagement onDataUpdate={() => console.log('Members updated')} />
      case 'rooms':
        return <RoomManagement rooms={rooms} />
      case 'orders':
        return <OrderManagement orders={orders} />
      case 'promotions':
        return <PromotionManagement />
      default:
        return <Dashboard memberCount={memberCount} roomCount={rooms.length} completedOrders={1} totalRevenue={15.5} orders={orders} />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#001529' }}>
        <div style={{ padding: '20px', textAlign: 'center', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>⚙️ Admin</h2>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'members', icon: <UserOutlined />, label: 'Thành Viên' },
            { key: 'rooms', icon: <HomeOutlined />, label: 'Phòng Hát' },
            { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Đơn Hàng' },
            { key: 'promotions', icon: <GiftOutlined />, label: 'Khuyến Mãi' },
          ]}
        />
        <div style={{ padding: '20px', marginTop: '20px' }}>
          <Button
            type="primary"
            danger
            block
            icon={<LogoutOutlined />}
            onClick={() => {
              message.success('Đăng xuất thành công')
              // Handle logout
            }}
          >
            Đăng Xuất
          </Button>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card>{renderContent()}</Card>
        </Content>
      </Layout>
    </Layout>
  )
}
