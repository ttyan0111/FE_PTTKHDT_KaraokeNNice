import React, { useState, useMemo } from 'react';
import {
  Select,
  DatePicker,
  TimePicker,
  Button,
  Modal,
  Input,
  Badge,
  Row,
  Col,
  Space,
  Tag
} from 'antd';
import {
  AudioOutlined,
  CrownOutlined,
  UserOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UpOutlined,
  ExportOutlined,
  ManOutlined,
  WomanOutlined,
  ArrowDownOutlined,
  HomeOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import './RoomsPage.css';

// ============= TYPE DEFINITIONS =============
type RoomStatus = 'available' | 'occupied' | 'maintenance';
type RoomType = 'VIP' | 'Standard' | 'Premium' | 'Party';
type ItemPosition = 'left' | 'right' | 'corridor';
type ItemType = 'room' | 'facility';
type FacilityType = 'elevator' | 'wc' | 'exit' | 'reception' | 'waiting';

interface BaseMapItem {
  id: string;
  type: ItemType;
  position: ItemPosition;
  order: number; // For vertical ordering in the grid
}

interface Room extends BaseMapItem {
  type: 'room';
  name: string;
  capacity: number;
  pricePerHour: number;
  status: RoomStatus;
  roomType: RoomType;
}

interface Facility extends BaseMapItem {
  type: 'facility';
  facilityType: FacilityType;
  label: string;
}

type MapItem = Room | Facility;

interface Floor {
  id: number;
  name: string;
  level: number;
  items: MapItem[];
}

interface Branch {
  id: number;
  name: string;
  address: string;
  floors: Floor[];
}

// ============= MOCK DATA =============
const mockBranches: Branch[] = [
  {
    id: 1,
    name: 'Chi Nhánh Trung Tâm',
    address: '123 Đường Âm Nhạc, Quận 1, TP.HCM',
    floors: [
      {
        id: 1,
        name: 'Tầng Trệt',
        level: 0,
        items: [
          // Facilities
          {
            id: 'elevator-ground',      // ID duy nhất
            type: 'facility',           // Loại là tiện ích
            facilityType: 'elevator',   // Kiểu thang máy (để hiện icon mũi tên lên)
            label: 'Thang Máy',         // Tên hiển thị
            position: 'corridor',       // Vị trí: nằm ở giữa hành lang (hoặc 'left'/'right')
            order: 0                    // Thứ tự hiển thị (0 là trên cùng)
          } as Facility,
          {
            id: 'facility-reception',
            type: 'facility',
            facilityType: 'reception',
            label: 'Lễ Tân',
            position: 'left',
            order: 1
          } as Facility,
          {
            id: 'facility-waiting',
            type: 'facility',
            facilityType: 'waiting',
            label: 'Khu Chờ',
            position: 'left',
            order: 2
          } as Facility,
          {
            id: 'facility-wc-left',
            type: 'facility',
            facilityType: 'wc',
            label: 'WC',
            position: 'left',
            order: 3
          } as Facility,
          {
            id: 'facility-exit-ground',
            type: 'facility',
            facilityType: 'exit',
            label: 'EXIT',
            position: 'left',
            order: 4
          } as Facility,

          // Left side rooms
          {
            id: 'room-101',
            type: 'room',
            name: 'Hoa Hồng',
            capacity: 6,
            pricePerHour: 100000,
            status: 'available',
            roomType: 'Standard',
            position: 'left',
            order: 5
          } as Room,
          {
            id: 'room-102',
            type: 'room',
            name: 'Hoa Lan',
            capacity: 8,
            pricePerHour: 120000,
            status: 'occupied',
            roomType: 'Standard',
            position: 'left',
            order: 6
          } as Room,

          // Right side rooms
          {
            id: 'room-103',
            type: 'room',
            name: 'Hoa Mai',
            capacity: 6,
            pricePerHour: 100000,
            status: 'available',
            roomType: 'Standard',
            position: 'right',
            order: 1
          } as Room,
          {
            id: 'room-104',
            type: 'room',
            name: 'Hoa Đào',
            capacity: 8,
            pricePerHour: 120000,
            status: 'available',
            roomType: 'Standard',
            position: 'right',
            order: 2
          } as Room,
        ]
      },
      {
        id: 2,
        name: 'Tầng 1',
        level: 1,
        items: [
          // Facilities
          {
            id: 'facility-elevator-1',
            type: 'facility',
            facilityType: 'elevator',
            label: 'Thang Máy',
            position: 'corridor',
            order: 1
          } as Facility,
          {
            id: 'facility-wc-1',
            type: 'facility',
            facilityType: 'wc',
            label: 'WC',
            position: 'left',
            order: 2
          } as Facility,
          {
            id: 'facility-exit-1',
            type: 'facility',
            facilityType: 'exit',
            label: 'EXIT',
            position: 'right',
            order: 3
          } as Facility,

          // Left side rooms
          {
            id: 'room-201',
            type: 'room',
            name: 'Ruby',
            capacity: 10,
            pricePerHour: 200000,
            status: 'available',
            roomType: 'VIP',
            position: 'left',
            order: 4
          } as Room,
          {
            id: 'room-202',
            type: 'room',
            name: 'Sapphire',
            capacity: 12,
            pricePerHour: 250000,
            status: 'available',
            roomType: 'VIP',
            position: 'left',
            order: 5
          } as Room,
          {
            id: 'room-203',
            type: 'room',
            name: 'Emerald',
            capacity: 10,
            pricePerHour: 200000,
            status: 'occupied',
            roomType: 'VIP',
            position: 'left',
            order: 6
          } as Room,

          // Right side rooms
          {
            id: 'room-204',
            type: 'room',
            name: 'Diamond',
            capacity: 12,
            pricePerHour: 250000,
            status: 'available',
            roomType: 'VIP',
            position: 'right',
            order: 4
          } as Room,
          {
            id: 'room-205',
            type: 'room',
            name: 'Pearl',
            capacity: 10,
            pricePerHour: 200000,
            status: 'maintenance',
            roomType: 'VIP',
            position: 'right',
            order: 5
          } as Room,
          {
            id: 'room-206',
            type: 'room',
            name: 'Amethyst',
            capacity: 10,
            pricePerHour: 200000,
            status: 'available',
            roomType: 'VIP',
            position: 'right',
            order: 6
          } as Room,
        ]
      },
      {
        id: 3,
        name: 'Tầng 2',
        level: 2,
        items: [
          // Facilities
          {
            id: 'facility-elevator-2',
            type: 'facility',
            facilityType: 'elevator',
            label: 'Thang Máy',
            position: 'corridor',
            order: 1
          } as Facility,
          {
            id: 'facility-exit-2',
            type: 'facility',
            facilityType: 'exit',
            label: 'EXIT',
            position: 'corridor',
            order: 2
          } as Facility,

          // Left side rooms
          {
            id: 'room-301',
            type: 'room',
            name: 'Party Hall A',
            capacity: 20,
            pricePerHour: 400000,
            status: 'available',
            roomType: 'Party',
            position: 'left',
            order: 3
          } as Room,
          {
            id: 'room-302',
            type: 'room',
            name: 'Party Hall B',
            capacity: 25,
            pricePerHour: 500000,
            status: 'available',
            roomType: 'Party',
            position: 'left',
            order: 4
          } as Room,

          // Right side rooms
          {
            id: 'room-303',
            type: 'room',
            name: 'VIP Lounge',
            capacity: 15,
            pricePerHour: 350000,
            status: 'occupied',
            roomType: 'Premium',
            position: 'right',
            order: 3
          } as Room,
          {
            id: 'room-304',
            type: 'room',
            name: 'Sky Lounge',
            capacity: 18,
            pricePerHour: 380000,
            status: 'available',
            roomType: 'Premium',
            position: 'right',
            order: 4
          } as Room,
        ]
      }
    ]
  }
];

// ============= HELPER FUNCTIONS =============
const isRoom = (item: MapItem): item is Room => item.type === 'room';

// ============= MAIN COMPONENT =============
const RoomsPage: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs>(dayjs());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [duration, setDuration] = useState<number>(2);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedBranch = useMemo(() => {
    return mockBranches.find(b => b.id === selectedBranchId) || null;
  }, [selectedBranchId]);

  const selectedFloor = useMemo(() => {
    if (!selectedBranch) return null;
    return selectedBranch.floors.find(f => f.id === selectedFloorId) || null;
  }, [selectedBranch, selectedFloorId]);

  React.useEffect(() => {
    if (selectedBranch && selectedBranch.floors.length > 0) {
      setSelectedFloorId(selectedBranch.floors[0].id);
    } else {
      setSelectedFloorId(null);
    }
    setSelectedRoom(null);
  }, [selectedBranchId, selectedBranch]);

  const organizedItems = useMemo(() => {
    if (!selectedFloor) return { left: [], corridor: [], right: [], facilities: [] };

    const left = selectedFloor.items
      .filter(item => item.position === 'left' && item.type === 'room')
      .sort((a, b) => a.order - b.order);

    const corridor = selectedFloor.items
      .filter(item => item.position === 'corridor' && item.type === 'room')
      .sort((a, b) => a.order - b.order);

    const right = selectedFloor.items
      .filter(item => item.position === 'right' && item.type === 'room')
      .sort((a, b) => a.order - b.order);

    const facilities = selectedFloor.items
      .filter(item => item.type === 'facility')
      .sort((a, b) => a.order - b.order);

    return { left, corridor, right, facilities };
  }, [selectedFloor]);

  const totalPrice = useMemo(() => {
    if (!selectedRoom) return 0;
    return selectedRoom.pricePerHour * duration;
  }, [selectedRoom, duration]);

  const handleRoomClick = (room: Room) => {
    if (room.status === 'available') {
      setSelectedRoom(room.id === selectedRoom?.id ? null : room);
    }
  };

  const handleContinue = () => {
    if (selectedRoom && selectedBranch) {
      setIsModalVisible(true);
      setCustomerName('');
      setPhone('');
      setNotes('');
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập họ tên';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = () => {
    if (!validateForm()) return;

    console.log('Booking submitted:', {
      customerName,
      phone,
      notes,
      branch: selectedBranch,
      floor: selectedFloor,
      room: selectedRoom,
      date: selectedDate.format('YYYY-MM-DD'),
      time: selectedTime.format('HH:mm'),
      duration,
      totalPrice
    });

    Modal.success({
      title: 'Đặt Phòng Thành Công!',
      content: `Đặt phòng ${selectedRoom?.name} tại ${selectedFloor?.name} đã được xác nhận!`,
      onOk: () => {
        setIsModalVisible(false);
        setSelectedRoom(null);
      }
    });
  };

  const renderMapItem = (item: MapItem) => {
    if (isRoom(item)) {
      const isSelected = selectedRoom?.id === item.id;

      return (
        <div
          key={item.id}
          onClick={() => handleRoomClick(item)}
          className={`map-item room-item ${item.status} ${isSelected ? 'selected' : ''} ${item.roomType.toLowerCase()}`}
        >
          {item.status === 'occupied' && (
            <Badge.Ribbon text="ĐANG SỬ DỤNG" color="red" className="status-ribbon" />
          )}
          {item.status === 'maintenance' && (
            <Badge.Ribbon text="BẢO TRÌ" color="orange" className="status-ribbon" />
          )}

          <div className="room-icon">
            {item.roomType === 'VIP' || item.roomType === 'Premium' || item.roomType === 'Party' ? <CrownOutlined /> : <AudioOutlined />}
          </div>
          <div className="room-name">{item.name}</div>
          <Tag color={
            item.roomType === 'VIP' ? 'gold' :
              item.roomType === 'Premium' ? 'purple' :
                item.roomType === 'Party' ? 'magenta' :
                  'blue'
          } className="room-type-tag">
            {item.roomType}
          </Tag>
          <div className="room-info">
            <UserOutlined /> {item.capacity} | <DollarOutlined />{(item.pricePerHour / 1000).toFixed(0)}K/h
          </div>
        </div>
      );
    } else {
      // Facility
      const facilityIcons = {
        elevator: <UpOutlined />,
        wc: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <ManOutlined style={{ color: '#1890ff' }} /> {/* Icon Nam màu xanh */}
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>|</span>
            <WomanOutlined style={{ color: '#eb2f96' }} /> {/* Icon Nữ màu hồng */}
          </div>
        ),
        exit: <ExportOutlined />,
        reception: <HomeOutlined />,
        waiting: <ClockCircleOutlined />
      };

      return (
        <div
          key={item.id}
          className={`map-item facility-item facility-${item.facilityType}`}
        >
          <div className="facility-icon">
            {facilityIcons[item.facilityType]}
          </div>
          <div className="facility-label">{item.label}</div>
        </div>
      );
    }
  };

  return (
    <div className="floor-plan-booking">
      {/* Header */}
      <div className="booking-header">
        <h1 className="main-title">
          <EnvironmentOutlined /> SƠ ĐỒ PHÒNG HÁT
        </h1>
        <p className="subtitle">Chọn tầng và phòng của bạn</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <label className="filter-label">Chọn Cơ Sở</label>
            <Select
              size="large"
              placeholder="Chọn cơ sở"
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              style={{ width: '100%' }}
            >
              {mockBranches.map(branch => (
                <Select.Option key={branch.id} value={branch.id}>
                  <EnvironmentOutlined /> {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <label className="filter-label">Ngày</label>
            <DatePicker
              size="large"
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              style={{ width: '100%' }}
              disabled={!selectedBranchId}
              placeholder="Chọn ngày"
            />
          </Col>

          <Col xs={12} sm={6} md={4}>
            <label className="filter-label">Giờ</label>
            <TimePicker
              size="large"
              value={selectedTime}
              onChange={(time) => time && setSelectedTime(time)}
              format="HH:mm"
              style={{ width: '100%' }}
              disabled={!selectedBranchId}
              placeholder="Chọn giờ"
            />
          </Col>

          <Col xs={12} sm={6} md={4}>
            <label className="filter-label">Thời Gian (giờ)</label>
            <Select
              size="large"
              value={duration}
              onChange={setDuration}
              style={{ width: '100%' }}
              disabled={!selectedBranchId}
            >
              {[1, 2, 3, 4, 5, 6].map(hr => (
                <Select.Option key={hr} value={hr}>
                  {hr} giờ
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      {!selectedBranchId ? (
        <div className="empty-state">
          <EnvironmentOutlined className="empty-icon" />
          <h2>Vui lòng chọn cơ sở để xem sơ đồ tầng</h2>
          <p>Chọn chi nhánh từ danh sách trên</p>
        </div>
      ) : (
        <div className="main-layout">
          {/* Left Sidebar - Floor Selector */}
          <div className="floor-sidebar">
            <div className="sidebar-content">
              <h3 className="sidebar-title">CHỌN TẦNG</h3>
              <div className="floor-list">
                {selectedBranch?.floors.map(floor => (
                  <div
                    key={floor.id}
                    onClick={() => setSelectedFloorId(floor.id)}
                    className={`floor-selector ${selectedFloorId === floor.id ? 'active' : ''}`}
                  >
                    <div className="floor-icon">
                      <UpOutlined />
                    </div>
                    <div className="floor-name">{floor.name}</div>
                    <div className="floor-info">
                      {floor.items.filter(isRoom).length} phòng
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Area - Floor Map */}
          <div className="floor-map-area">
            {selectedFloor && (
              <div className="floor-map-container">
                <h2 className="floor-title">{selectedFloor.name} - Sơ Đồ</h2>

                {/* The Floor Grid with Facilities on Top */}
                <div className="floor-grid">
                  {/* Facilities Row on Top */}
                  {organizedItems.facilities.length > 0 && (
                    <div className="facilities-row">
                      {organizedItems.facilities.map(renderMapItem)}
                    </div>
                  )}

                  {/* Rooms Layout - 3 Columns */}
                  <div className="rooms-layout">
                    {/* Left Column */}
                    <div className="grid-column left-column">
                      {organizedItems.left.map(renderMapItem)}
                    </div>

                    {/* Corridor Column */}
                    <div className="grid-column corridor-column">
                      <div className="corridor-path">
                        <ArrowDownOutlined className="corridor-arrow" />
                        <div className="corridor-text">LỐI ĐI</div>
                        <ArrowDownOutlined className="corridor-arrow" />
                      </div>
                      {organizedItems.corridor.map(renderMapItem)}
                    </div>

                    {/* Right Column */}
                    <div className="grid-column right-column">
                      {organizedItems.right.map(renderMapItem)}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="legend">
                  <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>Còn Trống</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color occupied"></div>
                    <span>Đang Sử Dụng</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span>Đã Chọn</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      {selectedRoom && selectedBranch && selectedFloor && (
        <div className="sticky-bottom-bar">
          <div className="bottom-bar-content">
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} lg={18}>
                <Row gutter={[24, 8]}>
                  <Col xs={12} sm={6}>
                    <div className="bar-info-item">
                      <EnvironmentOutlined className="bar-icon" />
                      <div>
                        <div className="bar-label">Cơ Sở</div>
                        <div className="bar-value">{selectedBranch.name}</div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} sm={6}>
                    <div className="bar-info-item">
                      <UpOutlined className="bar-icon" />
                      <div>
                        <div className="bar-label">Tầng</div>
                        <div className="bar-value">{selectedFloor.name}</div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} sm={6}>
                    <div className="bar-info-item">
                      <AudioOutlined className="bar-icon" />
                      <div>
                        <div className="bar-label">Phòng</div>
                        <div className="bar-value">{selectedRoom.name}</div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} sm={6}>
                    <div className="bar-info-item">
                      <DollarOutlined className="bar-icon" />
                      <div>
                        <div className="bar-label">Tổng Tiền</div>
                        <div className="bar-value price-value">
                          {totalPrice.toLocaleString('vi-VN')} VND
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} lg={6}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleContinue}
                  className="continue-button"
                >
                  TIẾP TỤC
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        title={
          <div className="modal-title-custom">
            <AudioOutlined /> Hoàn Tất Đặt Phòng
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        className="booking-modal"
      >
        <div className="booking-summary">
          <h3>Thông Tin Đặt Phòng</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="summary-field">
                <label>Cơ Sở:</label>
                <span>{selectedBranch?.name}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="summary-field">
                <label>Tầng:</label>
                <span>{selectedFloor?.name}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="summary-field">
                <label>Phòng:</label>
                <span>{selectedRoom?.name} ({selectedRoom?.roomType})</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="summary-field">
                <label>Ngày & Giờ:</label>
                <span>{selectedDate.format('DD/MM/YYYY')} - {selectedTime.format('HH:mm')}</span>
              </div>
            </Col>
            <Col span={24}>
              <div className="summary-field total-field">
                <label>Tổng Tiền ({duration}h):</label>
                <span className="total-price">{totalPrice.toLocaleString('vi-VN')} VND</span>
              </div>
            </Col>
          </Row>
        </div>

        <div className="form-field">
          <label>
            Họ và Tên <span className="required">*</span>
          </label>
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Nhập họ và tên"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            status={errors.customerName ? 'error' : ''}
          />
          {errors.customerName && (
            <div className="error-message">{errors.customerName}</div>
          )}
        </div>

        <div className="form-field">
          <label>
            Số Điện Thoại <span className="required">*</span>
          </label>
          <Input
            size="large"
            prefix={<PhoneOutlined />}
            placeholder="0xxx xxx xxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            status={errors.phone ? 'error' : ''}
          />
          {errors.phone && (
            <div className="error-message">{errors.phone}</div>
          )}
        </div>

        <div className="form-field">
          <label>Ghi Chú (Tùy chọn)</label>
          <Input.TextArea
            rows={3}
            placeholder="Yêu cầu đặc biệt..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <Space>
            <Button size="large" onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleBookingSubmit}
              className="confirm-button"
            >
              Xác Nhận Đặt Phòng
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export { RoomsPage };