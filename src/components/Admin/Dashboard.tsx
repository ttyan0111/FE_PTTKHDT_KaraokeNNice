import React from 'react'
import { Card, Row, Col, Table, Statistic, Tag } from 'antd'
import { UserOutlined, HomeOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons'

interface DashboardProps {
  memberCount: number
  roomCount: number
  completedOrders: number
  totalRevenue: number
  orders: Array<{
    id: number
    memberName: string
    roomName: string
    amount: number
    status: string
    date: string
  }>
}

export const Dashboard: React.FC<DashboardProps> = ({
  memberCount,
  roomCount,
  completedOrders,
  totalRevenue,
  orders,
}) => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Thành Viên"
              value={memberCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Phòng"
              value={roomCount}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn Hàng Hoàn Thành"
              value={completedOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh Thu (Triệu)"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card>
        <h3>Đơn Hàng Gần Đây</h3>
        <Table
          dataSource={orders.slice(0, 5)}
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
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
          rowKey="id"
        />
      </Card>
    </div>
  )
}
