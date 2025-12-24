import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Popconfirm, message, Tag, Tabs, Row, Col, Statistic } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined, CoffeeOutlined, BgColorsOutlined, SmileOutlined } from '@ant-design/icons'
import { apiClient } from '../../services/api'

interface MenuItem {
  id: number
  tenHang: string
  loaiHang: string
  giaBan: number
  soLuongTon: number
  moTa?: string
  trangThai: string
}

interface Menu {
  id: string
  tenThucDon: string
  moTa: string
  loaiHang: string
  trangThai: string
  soMon: number
  items: MenuItem[]
}

interface MenuManagementProps {
  onDataUpdate?: () => void
}

export const MenuManagement: React.FC<MenuManagementProps> = ({ onDataUpdate }) => {
  const [menus, setMenus] = useState<Menu[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchMenusData()
  }, [])

  const fetchMenusData = async () => {
    try {
      setDataLoading(true)
      setError(null)
      // Lấy dữ liệu từ backend API
      const response = await apiClient.getAllMatHang()
      const itemsData = response || []

      console.log('API Response:', itemsData)

      if (!itemsData || itemsData.length === 0) {
        throw new Error('Không có dữ liệu từ API, sử dụng dữ liệu mẫu')
      }

      // Normalize loaiHang: đưa về chữ hoa chữ cái đầu
      const normalizeCategory = (text: string): string => {
        return text
          .trim()
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      // Tạo 4 loại menu cơ bản
      const menuCategories = new Map<string, Menu>()
      const basicCategories = ['Đồ Ăn', 'Đồ Uống', 'Rượu & Bia', 'Tráng Miệng']
      
      basicCategories.forEach((category) => {
        menuCategories.set(category, {
          id: category,
          tenThucDon: category,
          moTa: `Danh sách ${category.toLowerCase()}`,
          loaiHang: category,
          trangThai: 'Hoạt động',
          soMon: 0,
          items: []
        })
      })

      // Thêm dữ liệu API vào categories
      itemsData.forEach((item: any) => {
        const loaiHangNormalized = normalizeCategory(item.loaiHang || 'Khác')
        console.log(`Item: ${item.tenHang}, Original: '${item.loaiHang}', Normalized: '${loaiHangNormalized}'`)
        
        if (!menuCategories.has(loaiHangNormalized)) {
          menuCategories.set(loaiHangNormalized, {
            id: loaiHangNormalized,
            tenThucDon: loaiHangNormalized,
            moTa: `Danh sách ${loaiHangNormalized.toLowerCase()}`,
            loaiHang: loaiHangNormalized,
            trangThai: 'Hoạt động',
            soMon: 0,
            items: []
          })
        }
        const menu = menuCategories.get(loaiHangNormalized)!
        menu.items.push({
          id: item.maHang,
          tenHang: item.tenHang,
          loaiHang: loaiHangNormalized,
          giaBan: item.giaBan || 0,
          soLuongTon: item.soLuongTon || 0,
          moTa: item.moTa,
          trangThai: item.trangThai || 'Con hang'
        })
        menu.soMon = menu.items.length
      })

      // Sắp xếp theo 4 loại cơ bản
      const sortedMenus = basicCategories
        .map((cat) => menuCategories.get(cat)!)
        .filter((menu) => menu !== undefined)

      console.log('Menu Categories:', Array.from(menuCategories.entries()))
      console.log('Sorted Menus:', sortedMenus)
      
      setMenus(sortedMenus)
    } catch (error: any) {
      // Fallback: sử dụng mock data
      console.error('Error fetching data, using mock data:', error.message)
      
      // Normalize loaiHang
      const normalizeCategory = (text: string): string => {
        return text
          .trim()
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      const mockItems: MenuItem[] = [
        // Đồ ăn
        { id: 1, tenHang: 'Gà rán', loaiHang: 'Đồ ăn', giaBan: 85000, soLuongTon: 20, moTa: 'Gà rán giòn', trangThai: 'Con hang' },
        { id: 2, tenHang: 'Cơm tấm', loaiHang: 'Đồ ăn', giaBan: 65000, soLuongTon: 15, moTa: 'Cơm tấm cá', trangThai: 'Con hang' },
        { id: 3, tenHang: 'Mỳ Ý', loaiHang: 'Đồ ăn', giaBan: 75000, soLuongTon: 10, moTa: 'Mỳ Ý sốt cà chua', trangThai: 'Con hang' },
        // Đồ uống
        { id: 4, tenHang: 'Nước cam', loaiHang: 'Đồ uống', giaBan: 25000, soLuongTon: 30, moTa: 'Nước cam tươi', trangThai: 'Con hang' },
        { id: 5, tenHang: 'Nước Coke', loaiHang: 'Đồ uống', giaBan: 20000, soLuongTon: 25, moTa: 'Coca Cola lạnh', trangThai: 'Con hang' },
        { id: 6, tenHang: 'Café', loaiHang: 'Đồ uống', giaBan: 30000, soLuongTon: 18, moTa: 'Café đen nóng', trangThai: 'Con hang' },
        // Rượu & Bia
        { id: 7, tenHang: 'Bia Saigon', loaiHang: 'Rượu & bia', giaBan: 35000, soLuongTon: 40, moTa: 'Bia Saigon lạnh', trangThai: 'Con hang' },
        { id: 8, tenHang: 'Bia Heineken', loaiHang: 'Rượu & bia', giaBan: 50000, soLuongTon: 20, moTa: 'Bia Heineken nhập khẩu', trangThai: 'Con hang' },
        { id: 9, tenHang: 'Rượu Vodka', loaiHang: 'Rượu & bia', giaBan: 150000, soLuongTon: 8, moTa: 'Vodka Skyy', trangThai: 'Con hang' },
        // Tráng miệng
        { id: 10, tenHang: 'Kem ốc quế', loaiHang: 'Tráng miệng', giaBan: 30000, soLuongTon: 12, moTa: 'Kem ốc quế vani', trangThai: 'Con hang' },
        { id: 11, tenHang: 'Bánh flan', loaiHang: 'Tráng miệng', giaBan: 20000, soLuongTon: 15, moTa: 'Bánh flan trứng', trangThai: 'Con hang' }
      ]

      setError(error?.message || 'Không thể tải từ API, hiển thị dữ liệu mẫu')

      // Tạo 4 loại menu cơ bản
      const menuCategories = new Map<string, Menu>()
      const basicCategories = ['Đồ Ăn', 'Đồ Uống', 'Rượu & Bia', 'Tráng Miệng']
      
      basicCategories.forEach((category) => {
        menuCategories.set(category, {
          id: category,
          tenThucDon: category,
          moTa: `Danh sách ${category.toLowerCase()}`,
          loaiHang: category,
          trangThai: 'Hoạt động',
          soMon: 0,
          items: []
        })
      })

      // Thêm mock data vào categories
      mockItems.forEach((item: MenuItem) => {
        const loaiHangNormalized = normalizeCategory(item.loaiHang)
        if (!menuCategories.has(loaiHangNormalized)) {
          menuCategories.set(loaiHangNormalized, {
            id: loaiHangNormalized,
            tenThucDon: loaiHangNormalized,
            moTa: `Danh sách ${loaiHangNormalized.toLowerCase()}`,
            loaiHang: loaiHangNormalized,
            trangThai: 'Hoạt động',
            soMon: 0,
            items: []
          })
        }
        const menu = menuCategories.get(loaiHangNormalized)!
        menu.items.push({
          ...item,
          loaiHang: loaiHangNormalized
        })
        menu.soMon = menu.items.length
      })

      const sortedMenus = basicCategories
        .map((cat) => menuCategories.get(cat)!)
        .filter((menu) => menu !== undefined)

      setMenus(sortedMenus)
    } finally {
      setDataLoading(false)
    }
  }

  const handleAdd = (categoryId?: string) => {
    form.resetFields()
    setEditingId(null)
    if (categoryId) {
      form.setFieldsValue({ loaiHang: categoryId, trangThai: 'Con hang' })
    } else {
      form.setFieldsValue({ trangThai: 'Con hang' })
    }
    setIsModalVisible(true)
  }

  const handleEdit = (item: MenuItem) => {
    form.setFieldsValue({
      tenHang: item.tenHang,
      loaiHang: item.loaiHang,
      giaBan: item.giaBan,
      soLuongTon: item.soLuongTon,
      trangThai: item.trangThai
    })
    setEditingId(item.id.toString())
    setIsModalVisible(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)

      if (editingId) {
        // Cập nhật mặt hàng
        const requestData = {
          maHang: parseInt(editingId),
          tenHang: values.tenHang,
          loaiHang: values.loaiHang,
          giaBan: values.giaBan,
          soLuongTon: values.soLuongTon,
          trangThai: values.trangThai
        }
        await apiClient.updateMatHang(requestData)
        message.success('✅ Cập nhật món thành công')
      } else {
        // Tạo mặt hàng mới
        const requestData = {
          tenHang: values.tenHang,
          loaiHang: values.loaiHang,
          giaBan: values.giaBan,
          soLuongTon: values.soLuongTon,
          trangThai: values.trangThai
        }
        await apiClient.createMatHang(requestData)
        message.success('✅ Thêm món thành công')
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingId(null)
      fetchMenusData()
      onDataUpdate?.()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Lỗi khi lưu dữ liệu'
      message.error(`❌ ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number | string) => {
    try {
      setLoading(true)
      const numId = typeof id === 'string' ? parseInt(id) : id
      await apiClient.deleteMatHang(numId)
      message.success('✅ Xóa món thành công')
      fetchMenusData()
      onDataUpdate?.()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Lỗi khi xóa dữ liệu'
      message.error(`❌ ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  // Table columns for items
  const itemColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'tenHang',
      key: 'tenHang'
    },
    {
      title: 'Giá Bán',
      dataIndex: 'giaBan',
      key: 'giaBan',
      render: (price: number) => `${price.toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Số Lượng Tồn',
      dataIndex: 'soLuongTon',
      key: 'soLuongTon'
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={status === 'Con hang' ? 'green' : 'red'}>{status}</Tag>
      )
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      render: (_: any, record: MenuItem) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Xóa món này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </span>
      ),
    }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên Thực Đơn', dataIndex: 'tenThucDon', key: 'tenThucDon' },
    { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa' },
    {
      title: 'Số Món',
      dataIndex: 'soMon',
      key: 'soMon',
      render: (value: number) => `${value} món`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string) => (
        <Tag color={trangThai === 'Hoạt động' ? 'green' : 'red'}>{trangThai}</Tag>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2>Quản Lý Menu</h2>
      </div>

      {dataLoading && (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <div>⏳ Đang tải dữ liệu...</div>
        </Card>
      )}

      {error && (
        <Card style={{ marginBottom: '16px', borderColor: '#ff4d4f', backgroundColor: '#fff2f0' }}>
          <div style={{ color: '#ff4d4f', fontSize: '14px' }}>
            <strong>❌ Lỗi:</strong> {error}
            <Button
              type="link"
              size="small"
              onClick={fetchMenusData}
              style={{ marginLeft: '16px' }}
            >
              Thử lại
            </Button>
          </div>
        </Card>
      )}

      {!dataLoading && menus.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <div>📭 Không có dữ liệu menu</div>
        </Card>
      )}

      {!dataLoading && menus.length > 0 && (
        <>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {menus.map((menu) => {
          const icons: Record<string, React.ReactNode> = {
            'Đồ Ăn': <ShoppingCartOutlined style={{ fontSize: 24 }} />,
            'Đồ Uống': <CoffeeOutlined style={{ fontSize: 24 }} />,
            'Rượu & Bia': <BgColorsOutlined style={{ fontSize: 24 }} />,
            'Tráng Miệng': <SmileOutlined style={{ fontSize: 24 }} />
          }
          const colors: Record<string, string> = {
            'Đồ Ăn': '#f6d365',
            'Đồ Uống': '#4facfe',
            'Rượu & Bia': '#fa709a',
            'Tráng Miệng': '#30b0c8'
          }

          return (
            <Col xs={24} sm={12} lg={6} key={menu.id}>
              <Card
                style={{
                  background: `linear-gradient(135deg, ${colors[menu.loaiHang]}20 0%, ${colors[menu.loaiHang]}10 100%)`,
                  borderLeft: `4px solid ${colors[menu.loaiHang]}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                hoverable
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8, color: colors[menu.loaiHang] }}>
                    {icons[menu.loaiHang]}
                  </div>
                  <h3 style={{ margin: '8px 0', color: colors[menu.loaiHang], fontWeight: 600 }}>
                    {menu.tenThucDon}
                  </h3>
                  <Statistic
                    value={menu.soMon}
                    suffix="mục"
                    valueStyle={{ color: colors[menu.loaiHang], fontSize: 20, fontWeight: 600 }}
                  />
                  <Tag color={menu.trangThai === 'Hoạt động' ? 'green' : 'red'} style={{ marginTop: 8 }}>
                    {menu.trangThai}
                  </Tag>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Tabs for each category */}
      <Card>
        <Tabs
          items={menus.map((menu) => ({
            key: menu.id,
            label: (
              <span>
                <span style={{ marginRight: 8 }}>
                  {{
                    'Đồ Ăn': '🍗',
                    'Đồ Uống': '🥤',
                    'Rượu & Bia': '🍺',
                    'Tráng Miệng': '🍰'
                  }[menu.loaiHang] || '📋'}
                </span>
                {menu.tenThucDon} ({menu.soMon})
              </span>
            ),
            children: (
              <div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleAdd(menu.loaiHang)}
                  style={{ marginBottom: 16 }}
                >
                  Thêm Món
                </Button>
                <Table
                  columns={itemColumns}
                  dataSource={menu.items}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="middle"
                />
              </div>
            )
          }))}
        />
      </Card>
      </>
      )}      {/* Modal Thêm/Sửa Món */}
      <Modal
        title={editingId ? 'Chỉnh Sửa Món' : 'Thêm Món Mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setEditingId(null)
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên Món" name="tenHang" rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}>
            <Input placeholder="Ví dụ: Gà Rán, Nước Cam" />
          </Form.Item>
          <Form.Item label="Loại Hàng" name="loaiHang" rules={[{ required: true, message: 'Vui lòng chọn loại hàng' }]}>
            <Select
              placeholder="Chọn loại hàng"
              options={[
                { label: 'Đồ ăn', value: 'Đồ ăn' },
                { label: 'Đồ uống', value: 'Đồ uống' },
                { label: 'Rượu & bia', value: 'Rượu & bia' },
                { label: 'Tráng miệng', value: 'Tráng miệng' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Giá Bán" name="giaBan" rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}>
            <Input type="number" placeholder="Ví dụ: 85000" />
          </Form.Item>
          <Form.Item label="Số Lượng Tồn" name="soLuongTon" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <Input type="number" placeholder="Ví dụ: 20" />
          </Form.Item>
          <Form.Item label="Trạng Thái" name="trangThai" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { label: 'Còn hàng', value: 'Con hang' },
                { label: 'Hết hàng', value: 'Het hang' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
