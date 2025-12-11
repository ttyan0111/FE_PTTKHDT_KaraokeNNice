import React, { useState, useEffect } from 'react'
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Statistic,
  Badge,
  Tag,
  Popconfirm,
  message,
} from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  HomeOutlined,
  GiftOutlined,
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { apiClient } from '../services/api'
import './AdminPage.css'

const { Sider, Content } = Layout

interface Member {
  id: number
  name: string
  email: string
  phone: string
  tier: string
  points: number
  totalSpent: number
  joinDate: string
}

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
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // Sample data
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    fetchMembersData()
  }, [])

  const fetchMembersData = async () => {
    try {
      setDataLoading(true)
      // Fetch from API
      const response = await apiClient.getAllMembers()
      if (response && Array.isArray(response)) {
        // Map API response to Member interface
        const mappedMembers = response.map((item: any) => ({
          id: item.maKH || item.id || 0,
          name: item.hoTen || item.name || '',
          email: item.email || '',
          phone: item.soDienThoai || item.phone || '',
          tier: item.tier || 'Bronze',
          points: item.points || 0,
          totalSpent: item.totalSpent || 0,
          joinDate: item.ngayDangKy || item.joinDate || new Date().toISOString().split('T')[0],
        }))
        setMembers(mappedMembers)
      } else {
        throw new Error('Empty response')
      }
    } catch (error) {
      console.log('Using sample data:', error)
      // Fallback to sample data
      setMembers([
        {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyena@example.com',
          phone: '0912345678',
          tier: 'Gold',
          points: 5000,
          totalSpent: 15500000,
          joinDate: '2023-06-15',
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranb@example.com',
          phone: '0987654321',
          tier: 'Silver',
          points: 2500,
          totalSpent: 8200000,
          joinDate: '2023-08-20',
        },
        {
          id: 3,
          name: 'Lê Văn C',
          email: 'levanc@example.com',
          phone: '0945678901',
          tier: 'Bronze',
          points: 800,
          totalSpent: 3500000,
          joinDate: '2024-01-10',
        },
      ])
    } finally {
      setDataLoading(false)
    }
  }

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

  // Dashboard View
  const renderDashboard = () => (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Thành Viên"
              value={members.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Phòng"
              value={rooms.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn Hàng Hôm Nay"
              value={orders.filter((o) => o.status === 'completed').length}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh Thu (Triệu)"
              value={members.reduce((sum, m) => sum + m.totalSpent, 0) / 1000000}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card style={{ marginTop: '20px' }}>
        <h3>Đơn Hàng Gần Đây</h3>
        <Table
          dataSource={orders.slice(0, 5)}
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Khách', dataIndex: 'memberName', key: 'memberName' },
            { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
            {
              title: 'Giá',
              dataIndex: 'amount',
              key: 'amount',
              render: (amount) => `${amount.toLocaleString('vi-VN')}đ`,
            },
            {
              title: 'Trạng Thái',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                  {status === 'completed' ? 'Hoàn Thành' : status === 'pending' ? 'Chờ Xử Lý' : 'Hủy'}
                </Tag>
              ),
            },
            { title: 'Ngày', dataIndex: 'date', key: 'date' },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  )

  // Members Management View
  const memberColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => (
        <Tag color={tier === 'Gold' ? 'gold' : tier === 'Silver' ? 'default' : 'orange'}>
          {tier}
        </Tag>
      ),
    },
    { title: 'Điểm', dataIndex: 'points', key: 'points' },
    {
      title: 'Chi Tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, record: Member) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id)
              setIsModalVisible(true)
            }}
          />
          <Popconfirm
            title="Xóa thành viên?"
            onConfirm={() => {
              setMembers(members.filter((m) => m.id !== record.id))
              message.success('Xóa thành công')
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      ),
    },
  ]

  const renderMembers = () => (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản Lý Thành Viên</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Thêm Thành Viên
        </Button>
      </div>
      <Card>
        <Table dataSource={members} columns={memberColumns} rowKey="id" loading={dataLoading} />
      </Card>
    </div>
  )

  // Rooms Management View
  const roomColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Phòng', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Sức Chứa', dataIndex: 'capacity', key: 'capacity' },
    {
      title: 'Giá/Giờ',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'available' ? 'success' : status === 'occupied' ? 'processing' : 'error'}
          text={
            status === 'available'
              ? 'Sẵn Có'
              : status === 'occupied'
                ? 'Đang Sử Dụng'
                : 'Bảo Trì'
          }
        />
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, record: Room) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id)
              setIsModalVisible(true)
            }}
          />
          <Button type="link" danger icon={<DeleteOutlined />} />
        </span>
      ),
    },
  ]

  const renderRooms = () => (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản Lý Phòng Hát</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Thêm Phòng
        </Button>
      </div>
      <Card>
        <Table dataSource={rooms} columns={roomColumns} rowKey="id" />
      </Card>
    </div>
  )

  // Orders Management View
  const orderColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Khách Hàng', dataIndex: 'memberName', key: 'memberName' },
    { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
    {
      title: 'Số Tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status === 'completed' ? 'Hoàn Thành' : status === 'pending' ? 'Chờ Xử Lý' : 'Hủy'}
        </Tag>
      ),
    },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    {
      title: 'Hành Động',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          Chi Tiết
        </Button>
      ),
    },
  ]

  const renderOrders = () => (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Quản Lý Đơn Hàng</h2>
      <Card>
        <Table dataSource={orders} columns={orderColumns} rowKey="id" />
      </Card>
    </div>
  )

  // Promotions Management View
  const renderPromotions = () => (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản Lý Khuyến Mãi</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm Khuyến Mãi
        </Button>
      </div>
      <Card>
        <Table
          dataSource={[
            {
              id: 1,
              code: 'WELCOME50',
              discount: '50.000đ',
              maxUses: 500,
              used: 245,
              active: true,
            },
            {
              id: 2,
              code: 'PARTY30',
              discount: '30%',
              maxUses: 200,
              used: 87,
              active: true,
            },
          ]}
          columns={[
            { title: 'Mã', dataIndex: 'code', key: 'code' },
            { title: 'Giảm Giá', dataIndex: 'discount', key: 'discount' },
            { title: 'Tối Đa', dataIndex: 'maxUses', key: 'maxUses' },
            { title: 'Đã Dùng', dataIndex: 'used', key: 'used' },
            {
              title: 'Trạng Thái',
              dataIndex: 'active',
              key: 'active',
              render: (active) => (
                <Tag color={active ? 'green' : 'red'}>{active ? 'Hoạt Động' : 'Vô Hiệu'}</Tag>
              ),
            },
            { title: 'Hành Động', key: 'action', render: () => <Button type="link">Sửa</Button> },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return renderDashboard()
      case 'members':
        return renderMembers()
      case 'rooms':
        return renderRooms()
      case 'orders':
        return renderOrders()
      case 'promotions':
        return renderPromotions()
      default:
        return renderDashboard()
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Admin Sidebar */}
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

      {/* Admin Content */}
      <Layout>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card>{renderContent()}</Card>
        </Content>
      </Layout>

      {/* Add/Edit Modal */}
      <Modal
        title={editingId ? 'Chỉnh Sửa' : 'Thêm Mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          setLoading(true)
          setTimeout(() => {
            message.success(editingId ? 'Cập nhật thành công' : 'Thêm thành công')
            setIsModalVisible(false)
            setLoading(false)
            form.resetFields()
          }, 800)
        }}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Điện Thoại" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tier" name="tier" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Bronze', value: 'Bronze' },
              { label: 'Silver', value: 'Silver' },
              { label: 'Gold', value: 'Gold' },
              { label: 'Platinum', value: 'Platinum' },
            ]} />
          </Form.Item>
          <Form.Item label="Điểm Tích Lũy" name="points" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}
