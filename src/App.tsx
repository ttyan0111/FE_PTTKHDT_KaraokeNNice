import React from 'react'
import { Layout, Menu, MenuProps } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import {
  ShoppingCartOutlined,
  DollarOutlined,
  LoginOutlined,
  StarOutlined,
  GiftOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { OrderForm } from '@components/OrderForm'
import { PaymentForm } from '@components/PaymentForm'
import { CheckInForm } from '@components/CheckInForm'
import { LoyaltyPointsForm } from '@components/LoyaltyPointsForm'
import { PromotionForm } from '@components/PromotionForm'
import { PartyBookingForm } from '@components/PartyBookingForm'
import { MemberRegistrationForm } from '@components/MemberRegistrationForm'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: 'order',
    icon: <ShoppingCartOutlined />,
    label: 'Gọi Món',
  },
  {
    key: 'payment',
    icon: <DollarOutlined />,
    label: 'Thanh Toán',
  },
  {
    key: 'checkin',
    icon: <LoginOutlined />,
    label: 'Check In/Out',
  },
  {
    key: 'loyalty',
    icon: <StarOutlined />,
    label: 'Điểm Tích Lũy',
  },
  {
    key: 'promotion',
    icon: <GiftOutlined />,
    label: 'Ưu Đãi',
  },
  {
    key: 'partybook',
    icon: <CalendarOutlined />,
    label: 'Đặt Tiệc',
  },
  {
    key: 'memberreg',
    icon: <UserOutlined />,
    label: 'Đăng Ký Thành Viên',
  },
]

interface RouteConfig {
  path: string
  component: React.FC
  label: string
}

const routes: RouteConfig[] = [
  { path: 'order', component: OrderForm, label: 'Gọi Món' },
  { path: 'payment', component: PaymentForm, label: 'Thanh Toán' },
  { path: 'checkin', component: CheckInForm, label: 'Check In/Out' },
  { path: 'loyalty', component: LoyaltyPointsForm, label: 'Điểm Tích Lũy' },
  { path: 'promotion', component: PromotionForm, label: 'Ưu Đãi' },
  { path: 'partybook', component: PartyBookingForm, label: 'Đặt Tiệc' },
  { path: 'memberreg', component: MemberRegistrationForm, label: 'Đăng Ký Thành Viên' },
]

export const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = React.useState('order')

  const handleMenuClick: MenuProps['onClick'] = (e: any) => {
    setSelectedKey(e.key)
  }

  const currentRoute = routes.find((route) => route.path === selectedKey)

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            background: '#001529',
            color: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          🎤 Karaoke N-Nice Quản Lý Hệ Thống
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              defaultOpenKeys={['order']}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ borderRight: 'none' }}
            />
          </Sider>
          <Layout>
            <Content style={{ padding: '24px', background: '#fafafa' }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                {currentRoute && <currentRoute.component />}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}
