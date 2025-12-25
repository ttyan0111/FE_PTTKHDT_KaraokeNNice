import React, { useState, useMemo, useEffect } from 'react';
import {
  Select,
  DatePicker,
  Button,
  Modal,
  Input,
  Badge,
  Row,
  Col,
  Space,
  Tag,
  message,
  Alert
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
  LogoutOutlined,
  ManOutlined,
  WomanOutlined,
  ArrowDownOutlined,
  HomeOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { apiClient } from '../../services/api';
import type { DatPhongRequest } from '../../types/index';
import '../RoomsPage.css';

const { Option } = Select;

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
  order: number;
}

interface Room extends BaseMapItem {
  type: 'room';
  name: string;
  maPhong: number; // Numeric ID from database
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



// ============= HELPER FUNCTIONS =============
const isRoom = (item: MapItem): item is Room => item.type === 'room';

// Generate time slots from 9:00 to 23:00
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 23; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

// Mock booked times (TODO: replace with API call)
const getBookedTimes = (roomId: string, date: string): string[] => {
  return []; // Empty for now
};

/**
 * Parse room name to extract floor and position
 * Format: P[Floor][Number]
 * Examples:
 *   P001 => Floor 0, Room 1 (left side, order 1)
 *   P006 => Floor 0, Room 6 (right side, order 3)
 *   P201 => Floor 2, Room 1 (left side, order 1)
 */
const parseRoomName = (roomName: string): { floor: number; position: 'left' | 'right'; order: number } | null => {
  // Match format: P[digit][digit][digit]
  const match = roomName.match(/^P(\d)(\d{2})$/);
  if (!match) return null;

  const floorDigit = parseInt(match[1]); // 0, 1, 2
  const roomNumber = parseInt(match[2]); // 01-06

  // Determine position and order based on room number
  // 01-03: left side
  // 04-06: right side
  let position: 'left' | 'right';
  let order: number;

  if (roomNumber >= 1 && roomNumber <= 3) {
    position = 'left';
    order = roomNumber; // 1, 2, 3
  } else if (roomNumber >= 4 && roomNumber <= 6) {
    position = 'right';
    order = roomNumber - 3; // 4->1, 5->2, 6->3
  } else {
    return null; // Invalid room number
  }

  return { floor: floorDigit, position, order };
};

/**
 * Map Room Type name to RoomType enum
 */
const mapRoomTypeName = (typeName: string): RoomType => {
  const upperName = typeName.toUpperCase();
  if (upperName.includes('VIP')) return 'VIP';
  if (upperName.includes('PREMIUM') || upperName.includes('CAO CẤP')) return 'Premium';
  if (upperName.includes('PARTY') || upperName.includes('TIỆC')) return 'Party';
  return 'Standard';
};

/**
 * Convert API room data to our Room interface
 */
const convertApiRoomToRoom = (apiRoom: any, roomTypes: any[]): Room | null => {
  const parsed = parseRoomName(apiRoom.tenPhong);
  if (!parsed) return null;

  // Find room type info
  const roomType = roomTypes.find(rt => rt.maLoai === apiRoom.maLoai);
  if (!roomType) return null;

  return {
    id: apiRoom.tenPhong, // Use room name as ID (e.g., "P001")
    type: 'room',
    name: apiRoom.tenPhong,
    maPhong: apiRoom.maPhong, // Store numeric ID for API calls
    capacity: roomType.sucChua,
    pricePerHour: roomType.giaTheoGio,
    status: apiRoom.trangThai === 'Trong' ? 'available' : 'occupied',
    roomType: mapRoomTypeName(roomType.tenLoai),
    position: parsed.position,
    order: parsed.order
  };
};

// ============= MAIN COMPONENT =============
const ReceptionistBooking: React.FC = () => {
  // API Data States
  const [branches, setBranches] = useState<Branch[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs>(dayjs().hour(9).minute(0));
  const [selectedEndTime, setSelectedEndTime] = useState<Dayjs>(dayjs().hour(11).minute(0));
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Booking Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Occupied Slots State
  const [occupiedSlots, setOccupiedSlots] = useState<any[]>([]);
  const [occupiedRoomIds, setOccupiedRoomIds] = useState<Set<number>>(new Set());
  const [fetchingOccupied, setFetchingOccupied] = useState(false);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all required data
        const [roomsData, roomTypesData] = await Promise.all([
          apiClient.getAllRooms(),
          apiClient.getAllRoomTypes()
        ]);

        console.log('🔷 ReceptionistBooking - Fetched Data:');
        console.log('  📦 Rooms:', roomsData);
        console.log('  📦 Room Types:', roomTypesData);

        setRooms(roomsData);
        setRoomTypes(roomTypesData);

        // Build branch/floor structure from rooms
        const branchMap = new Map<number, Branch>();

        roomsData.forEach((room: any) => {
          console.log('🔸 Processing room:', room.tenPhong, room);
          const parsed = parseRoomName(room.tenPhong);
          if (!parsed) {
            console.warn('⚠️ Failed to parse room:', room.tenPhong);
            return;
          }
          console.log(' ✅ Parsed:', parsed);

          // Get or create branch
          if (!branchMap.has(room.maCS)) {
            branchMap.set(room.maCS, {
              id: room.maCS,
              name: `Chi Nhánh ${room.maCS}`,
              address: '',
              floors: []
            });
          }

          const branch = branchMap.get(room.maCS)!;

          // Get or create floor
          let floor = branch.floors.find(f => f.level === parsed.floor);
          if (!floor) {
            const floorNames = ['Tầng Trệt', 'Tầng 1', 'Tầng 2'];
            floor = {
              id: parsed.floor + 1,
              name: floorNames[parsed.floor] || `Tầng ${parsed.floor}`,
              level: parsed.floor,
              items: [
                // Add corridor facilities
                { id: `elevator-${parsed.floor}`, type: 'facility', facilityType: 'elevator', label: 'Thang Máy', position: 'corridor', order: 1 } as Facility,
                ...(parsed.floor === 0 ? [
                  { id: `reception-${parsed.floor}`, type: 'facility', facilityType: 'reception', label: 'Lễ Tân', position: 'corridor', order: 2 } as Facility,
                  { id: `waiting-${parsed.floor}`, type: 'facility', facilityType: 'waiting', label: 'Khu Chờ', position: 'corridor', order: 3 } as Facility,
                ] : []),
                { id: `wc-${parsed.floor}`, type: 'facility', facilityType: 'wc', label: 'WC', position: 'corridor', order: parsed.floor === 0 ? 4 : 2 } as Facility,
                { id: `exit-${parsed.floor}`, type: 'facility', facilityType: 'exit', label: 'EXIT', position: 'corridor', order: parsed.floor === 0 ? 5 : 3 } as Facility,
              ]
            };
            branch.floors.push(floor);
          }

          // Convert and add room
          const convertedRoom = convertApiRoomToRoom(room, roomTypesData);
          if (convertedRoom) {
            floor.items.push(convertedRoom);
          }
        });

        // Sort floors by level
        branchMap.forEach(branch => {
          branch.floors.sort((a, b) => a.level - b.level);
        });

        const branchesArray = Array.from(branchMap.values());
        setBranches(branchesArray);

        // Auto-select first branch
        if (branchesArray.length > 0) {
          setSelectedBranchId(branchesArray[0].id);
        }

      } catch (error) {
        console.error('Error fetching room data:', error);
        message.error('Không thể tải dữ liệu phòng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const bookedTimes = useMemo(() =>
    selectedRoom ? getBookedTimes(selectedRoom.id, selectedDate.format('YYYY-MM-DD')) : [],
    [selectedRoom, selectedDate]
  );

  const selectedBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || null;
  }, [branches, selectedBranchId]);

  const selectedFloor = useMemo(() => {
    if (!selectedBranch) return null;
    return selectedBranch.floors.find(f => f.id === selectedFloorId) || null;
  }, [selectedBranch, selectedFloorId]);

  // Calculate duration in hours
  const duration = useMemo(() => {
    return selectedEndTime.diff(selectedTime, 'hour');
  }, [selectedTime, selectedEndTime]);

  // Calculate total price with hour-by-hour after-hours multiplier (matches backend logic)
  const totalPrice = useMemo(() => {
    if (!selectedRoom) return 0;

    let total = 0;
    let current = selectedTime.clone();

    // Loop through each hour
    while (current.isBefore(selectedEndTime)) {
      const nextHour = current.clone().add(1, 'hour');

      // If next hour exceeds end time, calculate fractional hour
      if (nextHour.isAfter(selectedEndTime)) {
        const minutes = selectedEndTime.diff(current, 'minute');
        const fraction = minutes / 60;

        // Check if this hour is after 18:00
        if (current.hour() >= 18) {
          total += selectedRoom.pricePerHour * fraction * 2; // x2 for after hours
        } else {
          total += selectedRoom.pricePerHour * fraction;
        }
        break;
      }

      // Full hour calculation
      if (current.hour() >= 18) {
        total += selectedRoom.pricePerHour * 2; // x2 for after hours
      } else {
        total += selectedRoom.pricePerHour;
      }

      current = nextHour;
    }

    return Math.round(total);
  }, [selectedRoom, selectedTime, selectedEndTime]);

  // Check if after hours
  const isAfterHours = useMemo(() => {
    return selectedTime.hour() >= 18;
  }, [selectedTime]);

  React.useEffect(() => {
    if (selectedBranch && selectedBranch.floors.length > 0) {
      setSelectedFloorId(selectedBranch.floors[0].id);
    } else {
      setSelectedFloorId(null);
    }
    setSelectedRoom(null);
  }, [selectedBranchId, selectedBranch]);

  // Fetch occupied slots when date/time changes
  React.useEffect(() => {
    const fetchOccupiedSlots = async () => {
      try {
        setFetchingOccupied(true);

        // Format dates for API
        const dateStr = selectedDate.format('YYYY-MM-DDTHH:mm:ss');
        const startStr = selectedDate.format('YYYY-MM-DD') + 'T' + selectedTime.format('HH:mm:ss');
        const endStr = selectedDate.format('YYYY-MM-DD') + 'T' + selectedEndTime.format('HH:mm:ss');

        // Fetch occupied slots from backend
        const slots = await apiClient.getOccupiedSlots(dateStr, startStr, endStr);

        setOccupiedSlots(slots);

        // Extract room IDs that are occupied
        const occupiedIds = new Set(slots.map((slot: any) => slot.maPhong));
        setOccupiedRoomIds(occupiedIds);

      } catch (error) {
        console.error('Error fetching occupied slots:', error);
      } finally {
        setFetchingOccupied(false);
      }
    };

    fetchOccupiedSlots();
  }, [selectedDate, selectedTime, selectedEndTime]);

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
      // Reset time selection
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
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

    if (duration <= 0) {
      newErrors.duration = 'Giờ kết thúc phải sau giờ bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = () => {
    if (!validateForm()) return;

    // Check for time conflicts with occupied slots
    if (selectedRoom && occupiedRoomIds.has(selectedRoom.maPhong)) {
      message.error('Phòng đã có người đặt trong khung giờ này! Vui lòng chọn thời gian khác.');
      return;
    }

    // Prepare booking data (maKH is optional for walk-in guests)
    const bookingData: DatPhongRequest = {
      tenKH: customerName,
      sdt: phone,
      ghiChu: notes,
      maPhong: String(selectedRoom?.maPhong), // Use numeric maPhong from database
      gioDat: selectedDate.format('YYYY-MM-DD') + 'T' + selectedTime.format('HH:mm:ss'),
      gioKetThuc: selectedDate.format('YYYY-MM-DD') + 'T' + selectedEndTime.format('HH:mm:ss'),
      soNguoi: selectedRoom?.capacity,
      maCoSo: selectedBranch?.id,
      // maKH is intentionally omitted - allowing walk-in guests
    };

    // Call booking API
    message.loading('Đang xử lý đặt phòng...');
    apiClient
      .bookRoom(bookingData)
      .then((response) => {
        message.success('Đặt Phòng Thành Công!');
        console.log('Booking response:', response);

        Modal.success({
          title: 'Đặt Phòng Thành Công!',
          content: `Đặt phòng ${selectedRoom?.name} tại ${selectedFloor?.name} đã được xác nhận!\nMã phiếu đặt: ${response.maPhieuDat}\nTổng tiền: ${totalPrice.toLocaleString('vi-VN')} VND`,
          onOk: () => {
            setIsModalVisible(false);
            setSelectedRoom(null);
          }
        });
      })
      .catch((error) => {
        message.error(error?.response?.data?.message || 'Đặt phòng thất bại. Vui lòng thử lại.');
        console.error('Booking error:', error);
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
      const facilityIcons = {
        elevator: <UpOutlined />,
        wc: (
          <div className="facility-wc-combined">
            <ManOutlined className="wc-icon-man" />
            <span className="wc-divider">|</span>
            <WomanOutlined className="wc-icon-woman" />
          </div>
        ),
        exit: (
          <div className="facility-exit-sign">
            <LogoutOutlined className="exit-icon" />
          </div>
        ),
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
      <div className="booking-header">
        <h1 className="main-title">
          <EnvironmentOutlined /> SƠ ĐỒ PHÒNG - TIẾP TÂN
        </h1>
        <p className="subtitle">Chọn phòng để đặt cho khách hàng</p>
      </div>

      {/* Filter Bar - Only Date and Branch */}
      <div className="filter-bar">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <label className="filter-label">Chọn Cơ Sở</label>
            <Select
              size="large"
              placeholder="Chọn cơ sở"
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              style={{ width: '100%' }}
              loading={loading}
            >
              {branches.map(branch => (
                <Select.Option key={branch.id} value={branch.id}>
                  <EnvironmentOutlined /> {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
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

          {/* Debug Info */}
          {loading && (
            <Col xs={24}>
              <div style={{ padding: '10px', background: 'rgba(0,247,255,0.1)', borderRadius: '5px', color: '#00f7ff' }}>
                ⏳ Đang tải dữ liệu...
              </div>
            </Col>
          )}
          {!loading && branches.length === 0 && (
            <Col xs={24}>
              <div style={{ padding: '10px', background: 'rgba(255,77,79,0.1)', borderRadius: '5px', color: '#ff4d4f' }}>
                ⚠️ Không có dữ liệu phòng. Vui lòng kiểm tra API hoặc tạo phòng mới từ trang Admin.
              </div>
            </Col>
          )}
          {!loading && branches.length > 0 && (
            <Col xs={24} style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>
                📊 Đã tải: {rooms.length} phòng, {roomTypes.length} loại phòng, {branches.length} chi nhánh
              </div>
            </Col>
          )}
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

          <div className="floor-map-area">
            {selectedFloor && (
              <div className="floor-map-container">
                <h2 className="floor-title">{selectedFloor.name} - Sơ Đồ</h2>

                <div className="floor-grid">
                  {organizedItems.facilities.length > 0 && (
                    <div className="facilities-row">
                      {organizedItems.facilities.map(renderMapItem)}
                    </div>
                  )}

                  <div className="rooms-layout">
                    <div className="grid-column left-column">
                      {organizedItems.left.map(renderMapItem)}
                    </div>

                    <div className="grid-column corridor-column">
                      <div className="corridor-path">
                        <ArrowDownOutlined className="corridor-arrow" />
                        <div className="corridor-text">LỐI ĐI</div>
                        <ArrowDownOutlined className="corridor-arrow" />
                      </div>
                      {organizedItems.corridor.map(renderMapItem)}
                    </div>

                    <div className="grid-column right-column">
                      {organizedItems.right.map(renderMapItem)}
                    </div>
                  </div>
                </div>

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
                        <div className="bar-label">Giá Cơ Bản</div>
                        <div className="bar-value price-value">
                          {selectedRoom.pricePerHour.toLocaleString('vi-VN')}/h
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
            <AudioOutlined /> Hoàn Tất Đặt Phòng - Tiếp Tân
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        className="booking-modal"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div className="booking-summary">
          <h3>Thông Tin Booking</h3>
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
                <label>Ngày:</label>
                <span>{selectedDate.format('DD/MM/YYYY')}</span>
              </div>
            </Col>
          </Row>
        </div>

        {/* Time Slot Selection */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            color: '#00f7ff',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: 16,
            textShadow: '0 0 10px rgba(0, 247, 255, 0.5)'
          }}>
            ⏰ Chọn Giờ Đặt Phòng
          </h3>

          {isAfterHours && (
            <Alert
              message="⚠️ Giá sau 18:00 được nhân đôi"
              description={`Giá gốc: ${selectedRoom?.pricePerHour.toLocaleString('vi-VN')} VND/giờ → Giá sau 18h: ${((selectedRoom?.pricePerHour || 0) * 2).toLocaleString('vi-VN')} VND/giờ`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Row gutter={[16, 16]}>
            {/* Start Time Picker */}
            <Col span={12}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#fff',
                fontSize: '0.95rem'
              }}>
                🕐 Giờ Bắt Đầu
              </label>
              <Input
                size="large"
                placeholder="Nhấn để chọn giờ bắt đầu"
                value={selectedTime.format('HH:mm')}
                onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                readOnly
                style={{ cursor: 'pointer' }}
              />
              {showStartTimePicker && (
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px',
                    marginTop: '8px',
                    backgroundColor: '#fff',
                    zIndex: 10,
                  }}
                >
                  {timeSlots.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    const isSelected = selectedTime.format('HH:mm') === time;
                    return (
                      <div
                        key={`start-${time}`}
                        onClick={() => {
                          if (!isBooked) {
                            setSelectedTime(dayjs(selectedDate.format('YYYY-MM-DD') + 'T' + time));
                            setShowStartTimePicker(false);
                            // Auto-set end time to 2 hours later
                            const newStartTime = dayjs(selectedDate.format('YYYY-MM-DD') + 'T' + time);
                            setSelectedEndTime(newStartTime.add(2, 'hour'));
                          }
                        }}
                        style={{
                          padding: '8px 12px',
                          margin: '4px 0',
                          borderRadius: '4px',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          backgroundColor: isSelected ? '#1890ff' : isBooked ? '#ff4d4f' : '#f5f5f5',
                          color: isSelected || isBooked ? '#fff' : '#000',
                          border: isSelected ? '2px solid #1890ff' : isBooked ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          opacity: isBooked ? 0.6 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        {time} {isBooked && '(Đã đặt)'}
                      </div>
                    );
                  })}
                </div>
              )}
            </Col>

            {/* End Time Picker */}
            <Col span={12}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#fff',
                fontSize: '0.95rem'
              }}>
                🕐 Giờ Kết Thúc
              </label>
              <Input
                size="large"
                placeholder="Nhấn để chọn giờ kết thúc"
                value={selectedEndTime.format('HH:mm')}
                onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                readOnly
                style={{ cursor: 'pointer' }}
              />
              {showEndTimePicker && (
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px',
                    marginTop: '8px',
                    backgroundColor: '#fff',
                    zIndex: 10,
                  }}
                >
                  {timeSlots.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    const isSelected = selectedEndTime.format('HH:mm') === time;
                    const isDisabled = dayjs(selectedDate.format('YYYY-MM-DD') + 'T' + time).isBefore(selectedTime) ||
                      dayjs(selectedDate.format('YYYY-MM-DD') + 'T' + time).isSame(selectedTime) ||
                      isBooked;

                    return (
                      <div
                        key={`end-${time}`}
                        onClick={() => !isDisabled && (setSelectedEndTime(dayjs(selectedDate.format('YYYY-MM-DD') + 'T' + time)), setShowEndTimePicker(false))}
                        style={{
                          padding: '8px 12px',
                          margin: '4px 0',
                          borderRadius: '4px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          backgroundColor: isSelected ? '#1890ff' : isBooked ? '#ff4d4f' : isDisabled ? '#f0f0f0' : '#f5f5f5',
                          color: isSelected || isBooked ? '#fff' : isDisabled ? '#999' : '#000',
                          border: isSelected ? '2px solid #1890ff' : isBooked ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          opacity: isDisabled ? 0.6 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        {time} {isBooked && '(Đã đặt)'}
                      </div>
                    );
                  })}
                </div>
              )}
            </Col>
          </Row>

          <div style={{ marginTop: '10px', padding: '15px', backgroundColor: 'rgba(0, 247, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 247, 255, 0.3)' }}>
            <Row gutter={16}>
              <Col span={12}>
                <strong style={{ color: '#00f7ff' }}>Thời gian:</strong>{' '}
                <span style={{ color: '#fff' }}>
                  {selectedTime.format('HH:mm')} - {selectedEndTime.format('HH:mm')} ({Math.round(selectedEndTime.diff(selectedTime, 'hour', true))} giờ)
                </span>
              </Col>
              <Col span={12}>
                <div className="summary-field total-field">
                  <label>Tổng Tiền:</label>
                  <span className="total-price">{totalPrice.toLocaleString('vi-VN')} VND</span>
                </div>
              </Col>
            </Row>
          </div>

          {errors.duration && (
            <div className="error-message" style={{ marginTop: 8 }}>{errors.duration}</div>
          )}
        </div>

        <div className="form-field">
          <label>
            Họ và Tên Khách <span className="required">*</span>
          </label>
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Nhập họ và tên khách hàng"
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
            placeholder="Yêu cầu đặc biệt... (nếu có)"
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

export default ReceptionistBooking;