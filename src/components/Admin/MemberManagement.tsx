import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { apiClient } from '../../services/api'

interface Member {
  id: number
  name: string
  email: string
  phone: string
  chucVu: string
  heSoLuong: number
  tyLeThuongDoanhThu: number
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
              chucVu: item.chucVu || item.tier || 'Nhân Viên',
              heSoLuong: item.heSoLuong || 1,
              tyLeThuongDoanhThu: item.tyLeThuongDoanhThu || 0,
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
    { title: 'Số Điện Thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Chức Vụ',
      dataIndex: 'chucVu',
      key: 'chucVu',
    },
    {
      title: 'Hệ Số Lương',
      dataIndex: 'heSoLuong',
      key: 'heSoLuong',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Tỷ Lệ Thưởng (%)',
      dataIndex: 'tyLeThuongDoanhThu',
      key: 'tyLeThuongDoanhThu',
      render: (value: number) => `${value.toFixed(2)}%`,
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
            title="Xóa nhân viên?"
            onConfirm={async () => {
              try {
                await apiClient.deleteEmployee(record.id)
                setMembers(members.filter((m) => m.id !== record.id))
                message.success('Xóa thành công')
                await fetchMembersData()
              } catch (error: any) {
                const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra'
                message.error(errorMsg)
              }
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
        sdt: values.phone,
        matKhau: values.password,
        chucVu: values.chucVu,
        diaChi: values.diaChi || '',
        cmndCccd: values.cmndCccd || '',
        heSoLuong: values.heSoLuong || 1,
        tyLeThuongDoanhThu: values.tyLeThuongDoanhThu || 0,
        ngaySinh: values.ngaySinh || new Date().toISOString().split('T')[0],
        gioiTinh: values.gioiTinh || 'Khác',
      }

      if (editingId) {
        // Update existing employee
        await apiClient.updateEmployee(editingId, requestData)
        message.success('Cập nhật thành công')
      } else {
        // Create new employee
        await apiClient.createEmployee(requestData)
        message.success('Thêm nhân viên thành công')
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
        title={editingId ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên Nhân Viên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item label="Số Điện Thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input placeholder="09xxxxxxxx" />
          </Form.Item>
          {!editingId && (
            <Form.Item label="Mật Khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }, { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' }]}>
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          <Form.Item label="Chức Vụ" name="chucVu" rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}>
            <Select
              placeholder="Chọn chức vụ"
              options={[
                { label: 'Lễ tân', value: 'Lễ tân' },
                { label: 'Quản Lý', value: 'Quản Lý' },
                { label: 'Kế toán', value: 'Kế toán' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Hệ Số Lương" name="heSoLuong" rules={[{ required: true, message: 'Vui lòng nhập hệ số lương' }]}>
            <Input type="number" placeholder="1.0" step="0.01" />
          </Form.Item>
          <Form.Item label="Tỷ Lệ Thưởng Doanh Thu (%)" name="tyLeThuongDoanhThu" rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ thưởng' }]}>
            <Input type="number" placeholder="0" step="0.01" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
   
