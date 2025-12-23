import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { apiClient } from '../../services/api'

interface RoomType {
  maLoai: number
  tenLoai: string
  sucChua: number
  giaTheoGio: number
  moTa?: string
}

interface RoomTypeManagementProps {
  onDataUpdate?: () => void
}

export const RoomTypeManagement: React.FC<RoomTypeManagementProps> = ({ onDataUpdate }) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const fetchRoomTypes = async () => {
    try {
      setDataLoading(true)
      setError(null)
      const response = await apiClient.getAllRoomTypes()
      console.log('Response from getAllRoomTypes:', response)
      
      if (response && Array.isArray(response)) {
        setRoomTypes(response)
      } else {
        throw new Error('Dữ liệu không hợp lệ từ server')
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể load danh sách loại phòng'
      console.error('Load room types error:', error)
      setError(errorMsg)
      message.error(`❌ Lỗi load dữ liệu: ${errorMsg}`)
      setRoomTypes([])
    } finally {
      setDataLoading(false)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'maLoai', key: 'maLoai', width: 60 },
    { title: 'Tên Loại Phòng', dataIndex: 'tenLoai', key: 'tenLoai' },
    { title: 'Sức Chứa (người)', dataIndex: 'sucChua', key: 'sucChua', align: 'center' as const },
    {
      title: 'Giá/Giờ (đ)',
      dataIndex: 'giaTheoGio',
      key: 'giaTheoGio',
      render: (price: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {price?.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa' },
    {
      title: 'Hành Động',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"    
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa loại phòng?"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.maLoai)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleEdit = (record: RoomType) => {
    setEditingId(record.maLoai)
    form.setFieldsValue({
      tenLoai: record.tenLoai,
      sucChua: record.sucChua,
      giaTheoGio: record.giaTheoGio,
      moTa: record.moTa,
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (maLoai: number) => {
    try {
      await apiClient.deleteRoomType(maLoai)
      message.success('Xóa loại phòng thành công!')
      fetchRoomTypes()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thất bại')
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const formData = {
        tenLoai: values.tenLoai,
        sucChua: values.sucChua,
        giaTheoGio: values.giaTheoGio,
        moTa: values.moTa || '',
      }

      if (editingId) {
        // Update
        await apiClient.updateRoomType(editingId, formData)
        message.success('Cập nhật loại phòng thành công!')
      } else {
        // Create
        await apiClient.createRoomType(formData)
        message.success('Thêm loại phòng thành công!')
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingId(null)
      fetchRoomTypes()
      if (onDataUpdate) onDataUpdate()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi xử lý')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản Lý Loại Phòng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Thêm Loại Phòng
        </Button>
      </div>

      {error && (
        <Card style={{ marginBottom: '16px', borderColor: '#ff4d4f', backgroundColor: '#fff2f0' }}>
          <div style={{ color: '#ff4d4f', fontSize: '14px' }}>
            <strong>❌ Lỗi:</strong> {error}
            <br />
            <small>Vui lòng kiểm tra kết nối database và thử lại.</small>
            <Button
              type="link"
              size="small"
              onClick={fetchRoomTypes}
              style={{ marginLeft: '16px' }}
            >
              Thử lại
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <Table
          dataSource={roomTypes}
          columns={columns}
          rowKey="maLoai"
          loading={dataLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Sửa Loại Phòng' : 'Thêm Loại Phòng'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setEditingId(null)
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Tên Loại Phòng"
            name="tenLoai"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại phòng' }]}
          >
            <Input placeholder="VIP, Thường, Standard..." />
          </Form.Item>

          <Form.Item
            label="Sức Chứa (người)"
            name="sucChua"
            rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
          >
            <InputNumber min={1} max={100} placeholder="Số người tối đa" />
          </Form.Item>

          <Form.Item
            label="Giá Theo Giờ (đ)"
            name="giaTheoGio"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber 
              min={0} 
              placeholder="Nhập giá" 
              size="large"
              style={{ width: '100%', fontSize: '16px' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={(value: any) => value.replace(/\./g, '')}
              addonAfter="vn₫"
            />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="moTa"
          >
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết loại phòng" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingId ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
