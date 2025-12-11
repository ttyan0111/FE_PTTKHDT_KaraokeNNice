import React from 'react'
import { Card, Table, Button, Tag } from 'antd'

interface Order {
  id: number
  memberName: string
  roomName: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  date: string
}

interface OrderManagementProps {
  orders: Order[]
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ orders }) => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Khách Hàng', dataIndex: 'memberName', key: 'memberName' },
    { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
    {
      title: 'Số Tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
      sorter: (a: Order, b: Order) => a.amount - b.amount,
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
      width: 100,
      render: () => (
        <Button type="link" size="small">
          Chi Tiết
        </Button>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Quản Lý Đơn Hàng</h2>
      <Card>
        <Table dataSource={orders} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
