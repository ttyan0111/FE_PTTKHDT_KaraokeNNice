import React, { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface Promotion {
  id: number
  code: string
  discount: string
  maxUses: number
  used: number
  active: boolean
}

interface PromotionManagementProps {
  promotions?: Promotion[]
}

const defaultPromotions: Promotion[] = [
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
]

export const PromotionManagement: React.FC<PromotionManagementProps> = ({
  promotions = defaultPromotions,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Mã Khuyến Mãi', dataIndex: 'code', key: 'code' },
    { title: 'Giảm Giá', dataIndex: 'discount', key: 'discount' },
    { title: 'Tối Đa', dataIndex: 'maxUses', key: 'maxUses', sorter: (a: Promotion, b: Promotion) => a.maxUses - b.maxUses },
    { title: 'Đã Dùng', dataIndex: 'used', key: 'used' },
    {
      title: 'Trạng Thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Hoạt Động' : 'Vô Hiệu'}</Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      render: (_: any, record: Promotion) => (
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
          <Button type="link" danger icon={<DeleteOutlined />} size="small" />
        </span>
      ),
    },
  ]

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // TODO: Call API to create/update promotion
      setIsModalVisible(false)
      form.resetFields()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản Lý Khuyến Mãi</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Thêm Khuyến Mãi
        </Button>
      </div>

      <Card>
        <Table dataSource={promotions} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Mã Khuyến Mãi" name="code" rules={[{ required: true }]}>
            <Input placeholder="VD: WELCOME50" />
          </Form.Item>
          <Form.Item label="Giảm Giá" name="discount" rules={[{ required: true }]}>
            <Input placeholder="VD: 50.000đ hoặc 30%" />
          </Form.Item>
          <Form.Item label="Tối Đa Lần Sử Dụng" name="maxUses" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Trạng Thái" name="active">
            <div>
              <input type="checkbox" defaultChecked /> Hoạt Động
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
