import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { apiClient } from '../../services/api'

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

interface MemberManagementProps {
  onDataUpdate?: () => void
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ onDataUpdate }) => {
  const [members, setMembers] = useState<Member[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchMembersData()
  }, [])

  const fetchMembersData = async () => {
    try {
      setDataLoading(true)
      setError(null)
      const response = await apiClient.getAllEmployees()
      console.log('Response from getAllEmployees:', response)
      console.log('Response length:', response?.length)
      console.log('Response type:', typeof response)
      
      if (response && Array.isArray(response)) {
        console.log(`Mapping ${response.length} items...`)
        const mappedMembers = response.map((item: any, index: number) => {
          try {
            console.log(`Item ${index}:`, item)
            const mapped = {
              id: item.maNV || item.id || 0,
              name: item.hoTen || item.tenNV || item.name || '',
              email: item.email || '',
              phone: item.sdt || item.phone || '',
              tier: item.chucVu || item.tier || 'Bronze',
              points: item.points || 0,
              totalSpent: item.totalSpent || 0,
              joinDate: item.ngayVaoLam || item.joinDate || new Date().toISOString().split('T')[0],
            }
            console.log(`Mapped ${index}:`, mapped)
            return mapped
          } catch (mapError) {
            console.error(`Error mapping item ${index}:`, item, mapError)
            throw new Error(`Lỗi xử lý dữ liệu item ${index}: ${(mapError as any).message}`)
          }
        })
        console.log(`Successfully mapped ${mappedMembers.length} members`)
        setMembers(mappedMembers)
      } else {
        throw new Error(`Dữ liệu không hợp lệ từ server. Response type: ${typeof response}`)
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể load danh sách nhân viên từ database'
      console.error('Load employees error:', error)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      setError(errorMsg)
      message.error(`❌ Lỗi load dữ liệu: ${errorMsg}`)
      setMembers([])
    } finally {
      setDataLoading(false)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        const colors: { [key: string]: string } = {
          Gold: 'gold',
          Silver: 'default',
          Bronze: 'orange',
          Platinum: 'purple',
        }
        return <span style={{ color: colors[tier] || '#000' }}>{tier}</span>
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      sorter: (a: Member, b: Member) => a.points - b.points,
    },
    {
      title: 'Chi Tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      render: (_: any, record: Member) => (
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
          <Popconfirm
            title="Xóa thành viên?"
            onConfirm={() => {
              setMembers(members.filter((m) => m.id !== record.id))
              message.success('Xóa thành công')
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </span>
      ),
    },
  ]

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const requestData = {
        hoTen: values.name,
        email: values.email,
        soDienThoai: values.phone,
        diaChi: values.diaChi || '',
        cmndCccd: values.cmndCccd || '',
        ngaySinh: values.ngaySinh || new Date().toISOString().split('T')[0],
        gioiTinh: values.gioiTinh || 'Khác',
      }

      if (editingId) {
        // Update existing member
        await apiClient.updateMemberInfo(editingId, requestData)
        message.success('Cập nhật thành công')
      } else {
        // Create new member
        await apiClient.registerMember(requestData)
        message.success('Thêm thành công')
      }
      setIsModalVisible(false)
      form.resetFields()
      await fetchMembersData()
      onDataUpdate?.()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản Lý Nhân Viên</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Thêm Nhân Viên
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
              onClick={fetchMembersData}
              style={{ marginLeft: '16px' }}
            >
              Thử lại
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <Table
          dataSource={members}
          columns={columns}
          rowKey="id"
          loading={dataLoading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Điện Thoại" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tier" name="tier" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Bronze', value: 'Bronze' },
                { label: 'Silver', value: 'Silver' },
                { label: 'Gold', value: 'Gold' },
                { label: 'Platinum', value: 'Platinum' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Điểm Tích Lũy" name="points" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
