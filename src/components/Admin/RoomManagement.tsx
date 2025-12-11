import React, { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Badge } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface Room {
  id: number
  name: string
  type: string
  capacity: number
  price: number
  status: 'available' | 'occupied' | 'maintenance'
}

interface RoomManagementProps {
  rooms: Room[]
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ rooms: initialRooms }) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
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
      width: 120,
      render: (_: any, record: Room) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id)
              form.setFieldsValue(record)
              setIsModalVisible(true)
            }}
            size="small"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setRooms(rooms.filter((r) => r.id !== record.id))}
            size="small"
          />
        </span>
      ),
    },
  ]

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // TODO: Call API to create/update room
      setIsModalVisible(false)
      form.resetFields()
    } finally {
      setLoading(false)
    }
  }

  return (
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
        <Table dataSource={rooms} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh Sửa Phòng' : 'Thêm Phòng Mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên Phòng" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
            <Select options={[
              { label: 'VIP', value: 'VIP' },
              { label: 'Standard', value: 'Standard' },
              { label: 'Nhóm', value: 'Nhóm' },
            ]} />
          </Form.Item>
          <Form.Item label="Sức Chứa" name="capacity" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Giá/Giờ" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Trạng Thái" name="status" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Sẵn Có', value: 'available' },
              { label: 'Đang Sử Dụng', value: 'occupied' },
              { label: 'Bảo Trì', value: 'maintenance' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
