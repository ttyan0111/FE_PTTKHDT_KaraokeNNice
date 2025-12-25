import React, { useState } from 'react'
import { Layout, Menu, Button } from 'antd'
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    FileTextOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AccountantDashboard } from './AccountantDashboard'
import { InventoryManager } from './InventoryManager'
import { PayrollManager } from './PayrollManager'
import { FinancialReport } from './FinancialReport'
import './AccountantPage.css'

const { Sider, Content } = Layout

export const AccountantPage: React.FC = () => {
    const [selectedMenu, setSelectedMenu] = useState('dashboard')
    const navigate = useNavigate()
    const { logout, user } = useAuth()

    const renderContent = () => {
        switch (selectedMenu) {
            case 'dashboard':
                return <AccountantDashboard />
            case 'inventory':
                return <InventoryManager />
            case 'payroll':
                return <PayrollManager />
            case 'report':
                return <FinancialReport />
            default:
                return <AccountantDashboard />
        }
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <Sider
                width={260}
                style={{
                    background: 'linear-gradient(180deg, #001529 0%, #0a1e3d 100%)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
                }}
            >
                <div className="accountant-sidebar-header">
                    <div className="accountant-icon">💼</div>
                    <h2>Kế Toán</h2>
                    <p>Xin chào, {user?.hoTen || 'Kế toán'}</p>
                </div>

                <Menu
                    theme="dark"
                    selectedKeys={[selectedMenu]}
                    onClick={(e) => setSelectedMenu(e.key)}
                    style={{ background: 'transparent', border: 'none' }}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: 'Tổng Quan',
                            className: 'accountant-menu-item'
                        },
                        {
                            key: 'inventory',
                            icon: <ShoppingCartOutlined />,
                            label: 'Quản Lý Kho',
                            className: 'accountant-menu-item'
                        },
                        {
                            key: 'payroll',
                            icon: <DollarOutlined />,
                            label: 'Lương & Nhân Sự',
                            className: 'accountant-menu-item'
                        },
                        {
                            key: 'report',
                            icon: <FileTextOutlined />,
                            label: 'Báo Cáo',
                            className: 'accountant-menu-item'
                        }
                    ]}
                />

                <div style={{ padding: '20px', position: 'absolute', bottom: 0, width: '100%' }}>
                    <Button
                        type="primary"
                        danger
                        block
                        icon={<LogoutOutlined />}
                        onClick={() => {
                            logout()
                            navigate('/')
                        }}
                        style={{
                            height: '44px',
                            borderRadius: '8px',
                            fontWeight: '600'
                        }}
                    >
                        Đăng Xuất
                    </Button>
                </div>
            </Sider>

            {/* Main Content */}
            <Layout>
                <Content className="accountant-content">
                    <div className="accountant-content-wrapper">
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
