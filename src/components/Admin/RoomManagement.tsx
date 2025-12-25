import { useState, useEffect } from 'react'
import { Card, Button, Modal, Form, Input, Select, Popconfirm, message, Space, Tag, Segmented } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { apiClient } from '../../services/api'

interface Room {
  maPhong: number
  tenPhong: string
  trangThai: string
  maLoai: number
  maCS: number
  tang?: number
  viTri?: string
}

interface RoomManagementProps {
  onDataUpdate?: () => void
}

const floorLabels: Record<number, string> = {
  0: 'Tầng Trệt',
  1: 'Tầng 1',
  2: 'Tầng 2',
}

export default function RoomManagement({ onDataUpdate }: RoomManagementProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loaiPhongs, setLoaiPhongs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [, setFormUpdateTrigger] = useState(0)

  useEffect(() => {
    fetchRooms()
    fetchLoaiPhongs()
  }, [])

  const fetchRooms = async () => {
    try {
      setError(null)
      const response = await apiClient.getAllRooms()
      if (response && Array.isArray(response)) {
        setRooms(response)
      } else {
        throw new Error('Dữ liệu không hợp lệ từ server')
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể load danh sách phòng'
      setError(errorMsg)
      console.error('Lỗi load danh sách phòng:', error)
      message.error(`❌ Lỗi load dữ liệu: ${errorMsg}`)
      setRooms([])
    }
  }

  const fetchLoaiPhongs = async () => {
    try {
      const response = await apiClient.getAllRoomTypes()
      if (response && Array.isArray(response)) {
        setLoaiPhongs(response)
      }
    } catch (error: any) {
      console.error('Load room types error:', error)
    }
  }

  const getLoaiPhongName = (maLoai: number) => {
    const loaiPhong = loaiPhongs.find((lp) => lp.maLoai === maLoai)
    return loaiPhong?.tenLoai || 'N/A'
  }

  const getLoaiPhongPrice = (maLoai: number) => {
    const loaiPhong = loaiPhongs.find((lp) => lp.maLoai === maLoai)
    return loaiPhong?.giaTheoGio || 0
  }

  const getLoaiPhongCapacity = (maLoai: number) => {
    const loaiPhong = loaiPhongs.find((lp) => lp.maLoai === maLoai)
    return loaiPhong?.sucChua || 0
  }

  const roomsWithFloor = rooms.map((room: any) => {
    const tenPhong = room.tenPhong || ''
    const extractedFloor = parseInt(tenPhong.substring(1, 2)) || 1
    return {
      ...room,
      tang: extractedFloor
    }
  })

  const groupedByFloor = roomsWithFloor.reduce((acc, room) => {
    const floor = room.tang
    if (!acc[floor]) {
      acc[floor] = []
    }
    acc[floor].push(room)
    return acc
  }, {} as Record<number, Room[]>)

  const floors = [0, 1, 2,3]
  const currentFloorRooms = groupedByFloor[selectedFloor] || []

  const handleEdit = (record: Room) => {
    setEditingId(record.maPhong)
    const tenPhong = record.tenPhong || ''
    const tang = parseInt(tenPhong.substring(1, 2)) || 1
    const viTriNumber = parseInt(tenPhong.substring(2)) || 1
    form.setFieldsValue({
      tang: tang,
      viTriNumber: viTriNumber,
      maLoai: record.maLoai,
      trangThai: record.trangThai,
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (maPhong: number) => {
    try {
      await apiClient.deleteRoom(maPhong)
      message.success('Xóa phòng thành công!')
      fetchRooms()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thất bại')
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const tang = values.tang || selectedFloor
      const viTriNumber = values.viTriNumber || 1
      const tenPhong = `P${tang}${String(viTriNumber).padStart(2, '0')}`

      // Kiểm tra phòng đã tồn tại chưa (chỉ khi tạo mới)
      if (!editingId) {
        const existingRoom = rooms.find(r => r.tenPhong === tenPhong)
        if (existingRoom) {
          message.error(`❌ Phòng ${tenPhong} đã tồn tại! Vui lòng chọn vị trí khác.`)
          setLoading(false)
          return
        }
      }

      const formData = {
        tenPhong: tenPhong,
        maLoai: values.maLoai,
        trangThai: values.trangThai || 'Trong',
        maCS: 1,
        tang: tang,
      }

      if (editingId) {
        await apiClient.updateRoom(editingId, formData)
        message.success('Cập nhật phòng thành công!')
      } else {
        await apiClient.createRoom(formData)
        message.success('Thêm phòng thành công!')
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingId(null)
      fetchRooms()
      if (onDataUpdate) onDataUpdate()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi xử lý')
    } finally {
      setLoading(false)
    }
  }

  const renderGridView = () => {
    const positions = ['left', 'right'] as const
    const SLOTS_PER_SIDE = 3
    const roomsByPosition: { [key: string]: (Room | null)[] } = {
      left: [null, null, null],    // Khởi tạo 3 slot cho bên trái (P_01, P_02, P_03)
      corridor: [],
      right: [null, null, null]    // Khởi tạo 3 slot cho bên phải (P_04, P_05, P_06)
    }

    // Đặt phòng vào đúng vị trí slot dựa trên số phòng
    currentFloorRooms.forEach((room: any) => {
      const tenPhong = room.tenPhong || ''
      const roomNum = parseInt(tenPhong.substring(2)) || 0

      if (roomNum >= 1 && roomNum <= 3) {
        // Bên trái: slot 0, 1, 2 tương ứng với phòng 01, 02, 03
        roomsByPosition['left'][roomNum - 1] = room
      } else if (roomNum >= 4 && roomNum <= 6) {
        // Bên phải: slot 0, 1, 2 tương ứng với phòng 04, 05, 06
        roomsByPosition['right'][roomNum - 4] = room
      }
    })

    return (
      <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
        {/* Left Sidebar - Floor Selector */}
        <div style={{ 
          width: '150px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#00d4ff',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Chọn Tầng
          </div>
          {floors.map((floor) => (
            <Button
              key={floor}
              type={selectedFloor === floor ? 'primary' : 'default'}
              onClick={() => setSelectedFloor(floor)}
              style={{
                height: 'auto',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>
                {floorLabels[floor] || `Tầng ${floor}`}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>
                {groupedByFloor[floor]?.length || 0}/6 phòng
              </div>
            </Button>
          ))}
        </div>

        {/* Right Main Area - Rooms Diagram */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '20px', textAlign: 'center' }}>
            {floorLabels[selectedFloor] || `Tầng ${selectedFloor}`} - Sơ Đồ (6 slot)
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '20px',
            height: 'calc(100% - 60px)'
          }}>
            {/* LEFT SIDE - 3 rooms */}
            <div style={{ 
              display: 'grid',
              gridTemplateRows: 'auto repeat(3, 1fr)',
              gap: '12px'
            }}>
              <div style={{ 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                color: '#52c41a'
              }}>
                Bên Trái
              </div>
              {roomsByPosition.left.map((room: any, idx: number) => {
                const isSelected = selectedRoom?.maPhong === room?.maPhong
                const isAvailable = room?.trangThai === 'Trong'
                const loaiPhongName = room ? getLoaiPhongName(room.maLoai) : null
                const price = room ? getLoaiPhongPrice(room.maLoai) : 0
                const capacity = room ? getLoaiPhongCapacity(room.maLoai) : 0

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                    {room ? (
                      <Card
                        onClick={() => setSelectedRoom(isSelected ? null : room)}
                        hoverable
                        style={{
                          borderColor: isSelected ? '#00d4ff' : (isAvailable ? '#52c41a' : '#ff4d4f'),
                          borderWidth: '2px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(0, 212, 255, 0.1)' : (isAvailable ? 'rgba(82, 196, 26, 0.05)' : 'rgba(255, 77, 79, 0.05)'),
                          transition: 'all 0.3s ease',
                          padding: '12px',
                          height: '100%',
                          minHeight: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#00d4ff' }}>
                          {room.tenPhong}
                        </div>
                        <Tag color={isAvailable ? 'success' : 'error'} style={{ marginBottom: '8px' }}>
                          {isAvailable ? '✓ Trống' : '✗ ' + room.trangThai}
                        </Tag>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>{loaiPhongName}</div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>👥 {capacity}</div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#52c41a' }}>
                          {price?.toLocaleString('vi-VN')} ₫
                        </div>
                        {isSelected && (
                          <Space style={{ marginTop: '12px' }}>
                            <Button
                              icon={<EditOutlined />}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(room)
                              }}
                            >
                              Sửa
                            </Button>
                            <Popconfirm
                              title="Xóa phòng này?"
                              onConfirm={() => handleDelete(room.maPhong)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={(e: any) => e.stopPropagation()}
                              >
                                Xóa
                              </Button>
                            </Popconfirm>
                          </Space>
                        )}
                      </Card>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingId(null)
                          setSelectedRoom(null)
                          const viTriNumber = idx + 1
                          form.setFieldsValue({
                            tang: selectedFloor,
                            viTriNumber: viTriNumber,
                            maLoai: 1,
                            trangThai: 'Trong'
                          })
                          setIsModalVisible(true)
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#00d4ff'
                          e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d9d9d9'
                          e.currentTarget.style.backgroundColor = '#ffffff'
                        }}
                        style={{
                          border: '2px dashed #d9d9d9',
                          borderRadius: '8px',
                          padding: '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          minHeight: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{ fontSize: '32px', color: '#d9d9d9' }}>➕</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Trống</div>
                        <div style={{ fontSize: '10px', color: '#aaa' }}>Click thêm</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* CENTER - CORRIDOR */}
            <div style={{ 
              width: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              padding: '20px 10px'
            }}>
              <div style={{ 
                transform: 'rotate(-90deg)',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#666',
                letterSpacing: '2px'
              }}>
                HÀNH LANG
              </div>
            </div>

            {/* RIGHT SIDE - 3 rooms */}
            <div style={{ 
              display: 'grid',
              gridTemplateRows: 'auto repeat(3, 1fr)',
              gap: '12px'
            }}>
              <div style={{ 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                color: '#ff7875'
              }}>
                Bên Phải
              </div>
              {roomsByPosition.right.map((room: any, idx: number) => {
                const isSelected = selectedRoom?.maPhong === room?.maPhong
                const isAvailable = room?.trangThai === 'Trong'
                const loaiPhongName = room ? getLoaiPhongName(room.maLoai) : null
                const price = room ? getLoaiPhongPrice(room.maLoai) : 0
                const capacity = room ? getLoaiPhongCapacity(room.maLoai) : 0

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                    {room ? (
                      <Card
                        onClick={() => setSelectedRoom(isSelected ? null : room)}
                        hoverable
                        style={{
                          borderColor: isSelected ? '#00d4ff' : (isAvailable ? '#52c41a' : '#ff4d4f'),
                          borderWidth: '2px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(0, 212, 255, 0.1)' : (isAvailable ? 'rgba(82, 196, 26, 0.05)' : 'rgba(255, 77, 79, 0.05)'),
                          transition: 'all 0.3s ease',
                          padding: '12px',
                          height: '100%',
                          minHeight: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#00d4ff' }}>
                          {room.tenPhong}
                        </div>
                        <Tag color={isAvailable ? 'success' : 'error'} style={{ marginBottom: '8px' }}>
                          {isAvailable ? '✓ Trống' : '✗ ' + room.trangThai}
                        </Tag>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>{loaiPhongName}</div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>👥 {capacity}</div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#52c41a' }}>
                          {price?.toLocaleString('vi-VN')} ₫
                        </div>
                        {isSelected && (
                          <Space style={{ marginTop: '12px' }}>
                            <Button
                              icon={<EditOutlined />}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(room)
                              }}
                            >
                              Sửa
                            </Button>
                            <Popconfirm
                              title="Xóa phòng này?"
                              onConfirm={() => handleDelete(room.maPhong)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={(e: any) => e.stopPropagation()}
                              >
                                Xóa
                              </Button>
                            </Popconfirm>
                          </Space>
                        )}
                      </Card>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingId(null)
                          setSelectedRoom(null)
                          const viTriNumber = 4 + idx
                          form.setFieldsValue({
                            tang: selectedFloor,
                            viTriNumber: viTriNumber,
                            maLoai: 1,
                            trangThai: 'Trong'
                          })
                          setIsModalVisible(true)
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#00d4ff'
                          e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d9d9d9'
                          e.currentTarget.style.backgroundColor = '#ffffff'
                        }}
                        style={{
                          border: '2px dashed #d9d9d9',
                          borderRadius: '8px',
                          padding: '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          minHeight: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{ fontSize: '32px', color: '#d9d9d9' }}>➕</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Trống</div>
                        <div style={{ fontSize: '10px', color: '#aaa' }}>Click thêm</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTableView = () => (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #434343' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff' }}>Tên Phòng</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff' }}>Loại Phòng</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff' }}>Trạng Thái</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#00d4ff' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr
              key={room.maPhong}
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                borderBottom: '1px solid #e0e0e0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9'}
            >
              <td style={{ padding: '12px' }}>{room.maPhong}</td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#00d4ff' }}>{room.tenPhong}</td>
              <td style={{ padding: '12px' }}>{getLoaiPhongName(room.maLoai)}</td>
              <td style={{ padding: '12px' }}>
                <Tag color={room.trangThai === 'Trong' ? 'success' : 'error'}>
                  {room.trangThai === 'Trong' ? '✓ Trống' : '✗ ' + room.trangThai}
                </Tag>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(room)}
                  />
                  <Popconfirm
                    title="Xóa phòng này?"
                    onConfirm={() => handleDelete(room.maPhong)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                    />
                  </Popconfirm>
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, color: '#00d4ff' }}>🎤 Quản Lý Phòng Hát</h2>
        <Space>
          <Segmented
            options={[
              { label: '📊 Sơ Đồ', value: 'grid' },
              { label: '📋 Bảng', value: 'table' }
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value as 'grid' | 'table')}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null)
              setSelectedRoom(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
            size="large"
          >
            Thêm Phòng
          </Button>
        </Space>
      </div>

      {error && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ff4d4f20', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ff4d4f'
        }}>
          <div style={{ color: '#ff4d4f', marginBottom: '10px' }}>❌ Lỗi: {error}</div>
          <div style={{ fontSize: '12px', color: '#ccc' }}>Vui lòng kiểm tra kết nối database và thử lại.</div>
          <Button onClick={fetchRooms} style={{ marginTop: '10px' }}>Thử lại</Button>
        </div>
      )}

      {viewMode === 'grid' ? renderGridView() : renderTableView()}

      <Modal
        title={editingId ? 'Chỉnh Sửa Phòng' : 'Thêm Phòng Mới'}
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
          onFinish={handleSubmit}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item label="Tên Phòng (Nhập P + Tầng + Số)" name="tenPhong">
            <Input
              placeholder="VD: P201"
              maxLength={4}
              onChange={(e) => {
                const value = e.target.value.toUpperCase()
                if (value.length === 4 && value.startsWith('P')) {
                  const tang = parseInt(value[1])
                  const viTriNumber = parseInt(value.substring(2))
                  if (!isNaN(tang) && !isNaN(viTriNumber) && viTriNumber >= 1 && viTriNumber <= 6) {
                    form.setFieldsValue({
                      tang: tang,
                      viTriNumber: viTriNumber
                    })
                    setFormUpdateTrigger(prev => prev + 1)
                  }
                }
              }}
            />
          </Form.Item>

          <Form.Item label="Tầng" name="tang" rules={[{ required: true, message: 'Chọn tầng' }]}>
            <Select onChange={() => setFormUpdateTrigger(prev => prev + 1)}>
              <Select.Option value={0}>Tầng Trệt</Select.Option>
              <Select.Option value={1}>Tầng 1</Select.Option>
              <Select.Option value={2}>Tầng 2</Select.Option>
              <Select.Option value={3}>Tầng 3</Select.Option>

            </Select>
          </Form.Item>

          <Form.Item label="Vị Trí Phòng" name="viTriNumber" rules={[{ required: true, message: 'Chọn vị trí' }]}>
            <Select onChange={() => setFormUpdateTrigger(prev => prev + 1)}>
              <Select.Option value={1}>Phòng 1 (Trái)</Select.Option>
              <Select.Option value={2}>Phòng 2 (Trái)</Select.Option>
              <Select.Option value={3}>Phòng 3 (Trái)</Select.Option>
              <Select.Option value={4}>Phòng 4 (Phải)</Select.Option>
              <Select.Option value={5}>Phòng 5 (Phải)</Select.Option>
              <Select.Option value={6}>Phòng 6 (Phải)</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Tên Phòng (Tự Động)</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00d4ff' }}>
              {(() => {
                const tang = form.getFieldValue('tang') || selectedFloor
                const viTriNumber = form.getFieldValue('viTriNumber') || 1
                return `P${tang}${String(viTriNumber).padStart(2, '0')}`
              })()}
            </div>
          </div>

          <Form.Item label="Loại Phòng" name="maLoai" rules={[{ required: true, message: 'Chọn loại phòng' }]}>
            <Select>
              {loaiPhongs.map((lp) => (
                <Select.Option key={lp.maLoai} value={lp.maLoai}>
                  {lp.tenLoai} ({lp.sucChua} người, {lp.giaTheoGio?.toLocaleString('vi-VN')} ₫/giờ)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Trạng Thái" name="trangThai" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
            <Select>
              <Select.Option value="Trong">Trống</Select.Option>
              <Select.Option value="Đang Sử Dụng">Đang Sử Dụng</Select.Option>
              <Select.Option value="Bảo Trì">Bảo Trì</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? 'Cập Nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}