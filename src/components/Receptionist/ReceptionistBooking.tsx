import React, { useState, useMemo } from 'react'
import { Card, Button, Select, DatePicker, TimePicker, Input, InputNumber, message, Modal, Row, Col, Badge, Tag } from 'antd'
import { AudioOutlined, CrownOutlined, UserOutlined, PhoneOutlined, DollarOutlined, EnvironmentOutlined, UpOutlined, ArrowDownOutlined, HomeOutlined, ClockCircleOutlined, ManOutlined, WomanOutlined, LogoutOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import '../RoomsPage.css'
import { apiClient } from '../../services/api'

const { Option } = Select

type RoomStatus = 'available' | 'occupied' | 'maintenance'
type RoomType = 'VIP' | 'Standard' | 'Premium' | 'Party'
type ItemPosition = 'left' | 'right' | 'corridor'
type ItemType = 'room' | 'facility'
type FacilityType = 'elevator' | 'wc' | 'exit' | 'reception' | 'waiting'

interface BaseMapItem {
  id: string
  type: ItemType
  position: ItemPosition
  order: number
}

interface Room extends BaseMapItem {
  type: 'room'
  name: string
  capacity: number
  pricePerHour: number
  status: RoomStatus
  roomType: RoomType
}

interface Facility extends BaseMapItem {
  type: 'facility'
  facilityType: FacilityType
  label: string
}

type MapItem = Room | Facility

interface Floor {
  id: number
  name: string
  level: number
  items: MapItem[]
}

interface Branch {
  id: number
  name: string
  address?: string
  floors: Floor[]
}

const mockBranches: Branch[] = [
  {
    id: 1,
    name: 'Chi Nhánh Trung Tâm',
    floors: [
      {
        id: 0,
        name: 'Tầng Trệt',
        level: 0,
        items: [
          { id: 'elevator-ground', type: 'facility', facilityType: 'elevator', label: 'Thang Máy', position: 'corridor', order: 1 } as Facility,
          { id: 'room-002', type: 'room', name: 'Daisy', capacity: 6, pricePerHour: 90000, status: 'available', roomType: 'Standard', position: 'right', order: 1 } as Room,
          { id: 'room-003', type: 'room', name: 'Lily', capacity: 8, pricePerHour: 110000, status: 'occupied', roomType: 'Standard', position: 'right', order: 2 } as Room,
        ]
      },
      {
        id: 1,
        name: 'Tầng 1',
        level: 1,
        items: [
          { id: 'facility-elevator-1-broken', type: 'facility', facilityType: 'elevator', label: 'THANG MÁY (HỎNG)', position: 'corridor', order: 1 } as Facility,
          { id: 'room-101', type: 'room', name: 'Hoa Hồng', capacity: 6, pricePerHour: 100000, status: 'available', roomType: 'Standard', position: 'left', order: 2 } as Room,
          { id: 'room-102', type: 'room', name: 'Hoa Lan', capacity: 8, pricePerHour: 120000, status: 'occupied', roomType: 'Standard', position: 'left', order: 3 } as Room,
          { id: 'room-103', type: 'room', name: 'Hoa Mai', capacity: 6, pricePerHour: 100000, status: 'available', roomType: 'Standard', position: 'right', order: 2 } as Room,
        ]
      },
      {
        id: 2,
        name: 'Tầng 2',
        level: 2,
        items: [
          { id: 'facility-elevator-2', type: 'facility', facilityType: 'elevator', label: 'Thang Máy', position: 'corridor', order: 1 } as Facility,
          { id: 'room-201', type: 'room', name: 'Ruby', capacity: 10, pricePerHour: 200000, status: 'available', roomType: 'VIP', position: 'left', order: 4 } as Room,
          { id: 'room-202', type: 'room', name: 'Sapphire', capacity: 12, pricePerHour: 250000, status: 'available', roomType: 'VIP', position: 'left', order: 5 } as Room,
          { id: 'room-204', type: 'room', name: 'Diamond', capacity: 12, pricePerHour: 250000, status: 'available', roomType: 'VIP', position: 'right', order: 4 } as Room,
        ]
      }
    ]
  }
]

const isRoom = (item: MapItem): item is Room => item.type === 'room'

const ReceptionistBooking: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(mockBranches[0]?.id || null)
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>((mockBranches[0]?.floors[0]?.id) || null)
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [selectedTime, setSelectedTime] = useState(dayjs().hour(19).minute(0))
  const [duration, setDuration] = useState<number>(2)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const selectedBranch = useMemo(() => mockBranches.find(b => b.id === selectedBranchId) || null, [selectedBranchId])
  const selectedFloor = useMemo(() => selectedBranch ? selectedBranch.floors.find(f => f.id === selectedFloorId) || null : null, [selectedBranch, selectedFloorId])

  React.useEffect(() => {
    if (selectedBranch && selectedBranch.floors.length > 0) {
      setSelectedFloorId(selectedBranch.floors[0].id)
    } else {
      setSelectedFloorId(null)
    }
    setSelectedRoom(null)
  }, [selectedBranchId])

  const organizedItems = useMemo(() => {
    if (!selectedFloor) return { left: [], corridor: [], right: [], facilities: [] }

    const left = selectedFloor.items.filter(i => i.position === 'left' && i.type === 'room').sort((a, b) => a.order - b.order)
    const corridor = selectedFloor.items.filter(i => i.position === 'corridor' && i.type === 'room').sort((a, b) => a.order - b.order)
    const right = selectedFloor.items.filter(i => i.position === 'right' && i.type === 'room').sort((a, b) => a.order - b.order)
    const facilities = selectedFloor.items.filter(i => i.type === 'facility' && i.position === 'corridor').sort((a, b) => a.order - b.order)
    return { left, corridor, right, facilities }
  }, [selectedFloor])

  const handleRoomClick = (room: Room) => {
    if (room.status === 'available') {
      if (selectedRoom?.id === room.id) {
        setSelectedRoom(null)
        setIsModalVisible(false)
      } else {
        setSelectedRoom(room)
        setIsModalVisible(true)
      }
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!customerName.trim()) newErrors.customerName = 'Vui lòng nhập tên khách'
    if (!phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^[0-9]{10,11}$/.test(phone)) newErrors.phone = 'Số điện thoại không hợp lệ'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBook = async () => {
    if (!selectedRoom) return message.error('Vui lòng chọn phòng')
    if (!validateForm()) return
    const payload = {
      tenKH: customerName,
      sdt: phone,
      ghiChu: notes,
      maPhong: selectedRoom.id,
      gioDat: selectedDate.format('YYYY-MM-DD') + 'T' + selectedTime.format('HH:mm:ss'),
      gioKetThuc: selectedDate.add(duration, 'hour').format('YYYY-MM-DD') + 'T' + selectedTime.format('HH:mm:ss'),
      soNguoi: selectedRoom.capacity,
      maCoSo: selectedBranchId ?? undefined,
    }
    try {
      await apiClient.bookRoom(payload)
      message.success('Đặt phòng thành công')
      setIsModalVisible(false)
      setSelectedRoom(null)
      setCustomerName('')
      setPhone('')
      setNotes('')
      setErrors({})
    } catch (err) {
      console.error(err)
      message.error('Đặt phòng thất bại')
    }
  }

  const renderMapItem = (item: MapItem) => {
    if (isRoom(item)) {
      const isSelected = selectedRoom?.id === item.id
      return (
        <div key={item.id} onClick={() => handleRoomClick(item)} className={`map-item room-item ${item.status} ${isSelected ? 'selected' : ''} ${(item.roomType || '').toString().toLowerCase()}`}>
          {item.status === 'occupied' && <Badge.Ribbon text="ĐANG SỬ DỤNG" color="red" className="status-ribbon" />}
          {item.status === 'maintenance' && <Badge.Ribbon text="BẢO TRÌ" color="orange" className="status-ribbon" />}
          <div className="room-icon">{item.roomType === 'VIP' || item.roomType === 'Premium' || item.roomType === 'Party' ? <CrownOutlined /> : <AudioOutlined />}</div>
          <div className="room-name">{item.name}</div>
          <Tag color={item.roomType === 'VIP' ? 'gold' : item.roomType === 'Premium' ? 'purple' : item.roomType === 'Party' ? 'magenta' : 'blue'} className="room-type-tag">{item.roomType}</Tag>
          <div className="room-info"><UserOutlined /> {item.capacity} | <DollarOutlined />{(item.pricePerHour / 1000).toFixed(0)}K/h</div>
        </div>
      )
    }

    const facilityIcons: any = {
      elevator: <UpOutlined />,
      wc: (<div className="facility-wc-combined"><ManOutlined className="wc-icon-man" /><span className="wc-divider">|</span><WomanOutlined className="wc-icon-woman" /></div>),
      exit: (<div className="facility-exit-sign"><LogoutOutlined className="exit-icon" /></div>),
      reception: <HomeOutlined />,
      waiting: <ClockCircleOutlined />
    }

    return (
      <div key={item.id} className={`map-item facility-item facility-${(item as Facility).facilityType}`}>
        <div className="facility-icon">{facilityIcons[(item as Facility).facilityType]}</div>
        <div className="facility-label">{(item as Facility).label}</div>
      </div>
    )
  }

  return (
    <div className="floor-plan-booking">
      <div className="booking-header">
        <h1 className="main-title"><EnvironmentOutlined /> SƠ ĐỒ PHÒNG (Tiếp Tân)</h1>
        <p className="subtitle">Giao diện đặt phòng dành cho tiếp tân</p>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <label className="filter-label">Chọn Cơ Sở</label>
            <Select size="large" placeholder="Chọn cơ sở" value={selectedBranchId} onChange={setSelectedBranchId} style={{ width: '100%' }}>
              {mockBranches.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
            </Select>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <label className="filter-label">Ngày</label>
            <DatePicker size="large" value={selectedDate} onChange={(d) => d && setSelectedDate(d)} style={{ width: '100%' }} disabled={!selectedBranchId} />
          </Col>

          <Col xs={12} sm={6} md={4}>
            <label className="filter-label">Giờ</label>
            <TimePicker size="large" value={selectedTime} onChange={(t) => t && setSelectedTime(t)} format="HH:mm" style={{ width: '100%' }} disabled={!selectedBranchId} />
          </Col>

          <Col xs={12} sm={6} md={4}>
            <label className="filter-label">Thời Gian (giờ)</label>
            <Select size="large" value={duration} onChange={setDuration} style={{ width: '100%' }} disabled={!selectedBranchId}>
              {[1,2,3,4,5,6].map(h => <Option key={h} value={h}>{h} giờ</Option>)}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="main-layout">
        <div className="floor-sidebar">
          <div className="sidebar-content">
            <h3 className="sidebar-title">CHỌN TẦNG</h3>
            <div className="floor-list">
              {selectedBranch?.floors.map(floor => (
                <div key={floor.id} onClick={() => setSelectedFloorId(floor.id)} className={`floor-selector ${selectedFloorId === floor.id ? 'active' : ''}`}>
                  <div className="floor-icon"><UpOutlined /></div>
                  <div className="floor-name">{floor.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="floor-map-area">
          {selectedFloor ? (
            <div className="floor-map-container">
              <h2 className="floor-title">{selectedFloor.name} - Sơ Đồ</h2>

              <div className="floor-grid">
                {organizedItems.facilities.filter(f => (f as Facility).facilityType === 'elevator').length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    {organizedItems.facilities
                      .filter(f => (f as Facility).facilityType === 'elevator')
                      .map(renderMapItem)}
                  </div>
                )}

                <div className="rooms-layout">
                  <div className="grid-column left-column">
                    {organizedItems.left.map(renderMapItem)}
                  </div>
                  <div className="grid-column corridor-column">
                    {organizedItems.corridor.map(renderMapItem)}
                    <div className="corridor-path">
                      <ArrowDownOutlined className="corridor-arrow" />
                      <div className="corridor-text">LỐI ĐI</div>
                      <ArrowDownOutlined className="corridor-arrow" />
                    </div>
                  </div>
                  <div className="grid-column right-column">
                    {organizedItems.right.map(renderMapItem)}
                  </div>
                </div>
              </div>

              <div className="legend">
                <div className="legend-item"><div className="legend-color available"></div><span>Còn Trống</span></div>
                <div className="legend-item"><div className="legend-color occupied"></div><span>Đang Sử Dụng</span></div>
                <div className="legend-item"><div className="legend-color selected"></div><span>Đã Chọn</span></div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <EnvironmentOutlined className="empty-icon" />
              <h2>Vui lòng chọn cơ sở để xem sơ đồ tầng</h2>
            </div>
          )}
        </div>

        <Modal
          title={<span>Đặt Phòng - Tiếp Tân</span>}
          open={isModalVisible}
          onCancel={() => { setIsModalVisible(false); setSelectedRoom(null) }}
          footer={null}
          width={420}
        >
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: '#cbd5e1' }}>Tên khách <span style={{ color: 'red' }}>*</span></label>
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên khách"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              status={errors.customerName ? 'error' : ''}
            />
            {errors.customerName && <div style={{ color: 'red', fontSize: 12 }}>{errors.customerName}</div>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: '#cbd5e1' }}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              status={errors.phone ? 'error' : ''}
            />
            {errors.phone && <div style={{ color: 'red', fontSize: 12 }}>{errors.phone}</div>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: '#cbd5e1' }}>Ghi chú</label>
            <Input.TextArea
              placeholder="Ghi chú (nếu có)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: '#cbd5e1' }}>Phòng đã chọn</label>
            <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              {selectedRoom ? (
                <>
                  <b style={{ color: '#fff' }}>{selectedRoom.name}</b>
                  <div style={{ color: '#9ca3af' }}>{selectedRoom.capacity} khách</div>
                </>
              ) : (
                <span style={{ color: '#9ca3af' }}>Chưa chọn phòng</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="default" onClick={() => { setSelectedRoom(null); setIsModalVisible(false) }} block>Hủy Chọn</Button>
            <Button type="primary" onClick={handleBook} block>Đặt Hộ</Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ReceptionistBooking