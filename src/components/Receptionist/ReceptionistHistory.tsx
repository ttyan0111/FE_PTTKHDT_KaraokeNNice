import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Tag, Space, message, DatePicker, Modal, Form, TimePicker, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined, FilePdfOutlined, CalendarOutlined, QrcodeOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { apiClient } from '../../services/api';
import '../RoomsPage.css';

const { Option } = Select;
const { Search } = Input;

export interface BookingRecord {
    maPhieuDat: number;
    tenKH: string;
    sdt: string;
    tenPhong: string;
    gioDat: string;
    gioKetThuc: string;
    duration: number;
    tongTien: number;
    trangThai: string;
    ghiChu?: string;
}


const ReceptionistHistory: React.FC = () => {
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<BookingRecord | null>(null);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [paymentRecord, setPaymentRecord] = useState<BookingRecord | null>(null);
    const [form] = Form.useForm();

    // Fetch bookings by selected date
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            console.log('Fetching bookings for date:', dateStr);

            // Call real API
            const response = await apiClient.getAllBookings();
            console.log('API response:', response);

            // Filter by selected date
            const filteredByDate = response.filter((booking: any) => {
                const bookingDate = booking.gioDat?.substring(0, 10); // Extract YYYY-MM-DD
                return bookingDate === dateStr;
            });

            // Map to BookingRecord format
            const mappedBookings: BookingRecord[] = filteredByDate.map((booking: any) => ({
                maPhieuDat: booking.maPhieuDat,
                tenKH: booking.tenKH || 'Khách vãng lai',
                sdt: booking.sdt || 'N/A',
                tenPhong: booking.tenPhong || `Phòng ${booking.maPhong}`,
                gioDat: booking.gioDat,
                gioKetThuc: booking.gioKetThuc,
                duration: calculateDuration(booking.gioDat, booking.gioKetThuc),
                tongTien: booking.chiPhiDuKien || 0, // Use chiPhiDuKien from backend
                trangThai: mapStatus(booking.trangThai),
                ghiChu: booking.ghiChu
            }));

            setBookings(mappedBookings);
            setFilteredBookings(mappedBookings);
            message.success(`Đã tải ${mappedBookings.length} booking cho ngày ${selectedDate.format('DD/MM/YYYY')}`);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            message.error('Không thể tải lịch sử đặt phòng. Backend API chưa sẵn sàng.');
            // Fallback to empty array
            setBookings([]);
            setFilteredBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Calculate duration in hours
    const calculateDuration = (start: string, end: string): number => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    };

    // Helper: Map backend status to frontend status
    const mapStatus = (backendStatus: string): string => {
        const statusMap: { [key: string]: string } = {
            'Da dat': 'Confirmed',
            'Cho xac nhan': 'Pending',
            'Hoan thanh': 'Completed',
            'Da huy': 'Cancelled'
        };
        return statusMap[backendStatus] || 'Pending';
    };

    // Helper: Reverse map frontend status to backend format
    const reverseMapStatus = (frontendStatus: string): string => {
        const reverseMap: { [key: string]: string } = {
            'Confirmed': 'Da dat',
            'Pending': 'Cho xac nhan',
            'Completed': 'Hoan thanh',
            'Cancelled': 'Da huy'
        };
        return reverseMap[frontendStatus] || 'Cho xac nhan';
    };

    // Handle status change
    const handleStatusChange = async (maPhieuDat: number, newStatus: string) => {
        try {
            // Update in local state immediately for better UX
            const updatedBookings = bookings.map(booking =>
                booking.maPhieuDat === maPhieuDat
                    ? { ...booking, trangThai: newStatus }
                    : booking
            );
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);

            // Call backend API to persist change (convert to backend format)
            await apiClient.updateBookingStatus(maPhieuDat, reverseMapStatus(newStatus));

            message.success(`Đã cập nhật trạng thái thành "${getStatusText(newStatus)}"`);
        } catch (error) {
            message.error('Không thể cập nhật trạng thái');
            // Rollback on error
            fetchBookings();
        }
    };

    // Handle edit
    const handleEdit = (record: BookingRecord) => {
        setEditingRecord(record);
        form.setFieldsValue({
            tenKH: record.tenKH,
            sdt: record.sdt,
            gioDat: dayjs(record.gioDat),
            gioKetThuc: dayjs(record.gioKetThuc),
            ghiChu: record.ghiChu
        });
        setEditModalVisible(true);
    };

    // Handle save edit
    const handleSaveEdit = async () => {
        try {
            const values = await form.validateFields();
            // TODO: API call
            // await apiClient.updateBooking(editingRecord!.maPhieuDat, values);

            setBookings(prev => prev.map(b =>
                b.maPhieuDat === editingRecord!.maPhieuDat
                    ? {
                        ...b,
                        tenKH: values.tenKH,
                        sdt: values.sdt,
                        gioDat: values.gioDat.format('YYYY-MM-DDTHH:mm:ss'),
                        gioKetThuc: values.gioKetThuc.format('YYYY-MM-DDTHH:mm:ss'),
                        ghiChu: values.ghiChu
                    }
                    : b
            ));
            message.success('Đã cập nhật thông tin booking');
            setEditModalVisible(false);
        } catch (error) {
            message.error('Không thể cập nhật booking');
        }
    };

    // Handle delete
    const handleDelete = async (maPhieuDat: number) => {
        try {
            // Call backend API to delete
            await apiClient.deleteBooking(maPhieuDat);

            // Update local state
            setBookings(prev => prev.filter(b => b.maPhieuDat !== maPhieuDat));
            setFilteredBookings(prev => prev.filter(b => b.maPhieuDat !== maPhieuDat));

            message.success('Đã xóa booking');
        } catch (error) {
            message.error('Không thể xóa booking');
        }
    };

    // Handle invoice generation
    const handleGenerateInvoice = async (record: BookingRecord) => {
        console.log('🧾 Invoice button clicked for:', record);
        try {
            message.loading('Đang tạo hóa đơn...', 0.5);

            console.log('📦 Importing invoice generator...');
            // Import dynamically to avoid bundling issues
            const { generateInvoicePDF } = await import('../../utils/invoiceGenerator');

            console.log('📄 Generating PDF...');
            // Generate and download PDF
            generateInvoicePDF(record);

            console.log('✅ PDF generation complete!');
            message.success('Đã xuất hóa đơn thành công!');
        } catch (error) {
            console.error('❌ Error generating invoice:', error);
            message.error('Không thể xuất hóa đơn');
        }
    };

    // Handle show QR payment
    const handleShowQRPayment = (record: BookingRecord) => {
        setPaymentRecord(record);
        setQrModalVisible(true);
    };

    // Handle confirm payment
    const handleConfirmPayment = async () => {
        if (!paymentRecord) return;

        try {
            message.loading('Đang xác nhận thanh toán...', 0.5);

            // Auto-update status to "Confirmed" after payment
            await handleStatusChange(paymentRecord.maPhieuDat, 'Confirmed');

            message.success('Thanh toán thành công! Trạng thái đã cập nhật.');
            setQrModalVisible(false);
            setPaymentRecord(null);
        } catch (error) {
            message.error('Không thể xác nhận thanh toán');
        }
    };

    // Fetch when date changes or on mount
    useEffect(() => {
        fetchBookings();
    }, [selectedDate]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
    }, []);

    // Filter bookings
    useEffect(() => {
        let filtered = bookings;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(b => b.trangThai === statusFilter);
        }

        // Search by customer name or phone
        if (searchText) {
            filtered = filtered.filter(b =>
                b.tenKH.toLowerCase().includes(searchText.toLowerCase()) ||
                b.sdt.includes(searchText)
            );
        }

        setFilteredBookings(filtered);
    }, [bookings, statusFilter, searchText]);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'Confirmed': return 'blue';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'Pending': return 'Chờ Xác Nhận';
            case 'Confirmed': return 'Đã Xác Nhận';
            case 'Completed': return 'Hoàn Thành';
            case 'Cancelled': return 'Đã Hủy';
            default: return status;
        }
    };

    const columns: ColumnsType<BookingRecord> = [
        {
            title: 'Mã Phiếu',
            dataIndex: 'maPhieuDat',
            key: 'maPhieuDat',
            width: 100,
            align: 'center',
            render: (id: number) => <strong>#{id}</strong>
        },
        {
            title: 'Khách Hàng',
            dataIndex: 'tenKH',
            key: 'tenKH',
            width: 150,
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'sdt',
            key: 'sdt',
            width: 120,
        },
        {
            title: 'Phòng',
            dataIndex: 'tenPhong',
            key: 'tenPhong',
            width: 120,
            render: (text: string) => <Tag color="cyan">{text}</Tag>
        },
        {
            title: 'Giờ Đặt',
            dataIndex: 'gioDat',
            key: 'gioDat',
            width: 100,
            render: (time: string) => dayjs(time).format('HH:mm'),
        },
        {
            title: 'Giờ Kết Thúc',
            dataIndex: 'gioKetThuc',
            key: 'gioKetThuc',
            width: 120,
            render: (time: string) => dayjs(time).format('HH:mm'),
        },
        {
            title: 'Thời Gian',
            dataIndex: 'duration',
            key: 'duration',
            width: 100,
            align: 'center',
            render: (hours: number) => `${hours}h`,
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'tongTien',
            key: 'tongTien',
            width: 130,
            align: 'right',
            render: (amount: number) => (
                <strong style={{ color: '#00f7ff' }}>
                    {amount.toLocaleString('vi-VN')} đ
                </strong>
            ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: 180,
            align: 'center',
            render: (status: string, record: BookingRecord) => (
                <Select
                    value={status}
                    onChange={(newStatus) => handleStatusChange(record.maPhieuDat, newStatus)}
                    style={{ width: '100%' }}
                    size="small"
                >
                    <Option value="Pending">🟡 Chờ Xác Nhận</Option>
                    <Option value="Confirmed">🔵 Đã Xác Nhận</Option>
                    <Option value="Completed">🟢 Hoàn Thành</Option>
                    <Option value="Cancelled">🔴 Hủy</Option>
                </Select>
            ),
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Hành Động',
            key: 'actions',
            width: 180,
            align: 'center',
            render: (_: any, record: BookingRecord) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    {record.trangThai === 'Pending' && (
                        <Button
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                            icon={<QrcodeOutlined />}
                            size="small"
                            onClick={() => handleShowQRPayment(record)}
                            title="Thanh toán QR"
                        />
                    )}
                    {record.trangThai === 'Completed' && (
                        <Button
                            type="default"
                            icon={<FilePdfOutlined />}
                            size="small"
                            onClick={() => handleGenerateInvoice(record)}
                            title="Xuất hóa đơn"
                            style={{ color: '#ff4d4f' }}
                        />
                    )}
                    <Popconfirm
                        title="Xóa booking này?"
                        description="Bạn có chắc muốn xóa booking này không?"
                        onConfirm={() => handleDelete(record.maPhieuDat)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="floor-plan-booking" style={{ minHeight: '80vh' }}>
            <div className="booking-header">
                <h1 className="main-title">
                    <ClockCircleOutlined /> LỊCH SỬ
                </h1>
                <p className="subtitle">
                    <CalendarOutlined /> {selectedDate.format('DD/MM/YYYY')} - Tổng {filteredBookings.length} booking
                </p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar" style={{ marginBottom: 20 }}>
                <Space size="large" wrap>
                    {/* Date Picker */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, color: '#00f7ff', fontWeight: 'bold' }}>
                            <CalendarOutlined /> Chọn Ngày
                        </label>
                        <DatePicker
                            value={selectedDate}
                            onChange={(date) => date && setSelectedDate(date)}
                            format="DD/MM/YYYY"
                            size="large"
                            style={{ width: 200 }}
                        />
                    </div>

                    {/* Search */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, color: '#00f7ff', fontWeight: 'bold' }}>
                            <SearchOutlined /> Tìm Kiếm
                        </label>
                        <Search
                            placeholder="Tên hoặc số điện thoại..."
                            allowClear
                            size="large"
                            style={{ width: 280 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <Select
                        size="large"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 200 }}
                    >
                        <Option value="all">Tất Cả Trạng Thái</Option>
                        <Option value="Pending">Chờ Xác Nhận</Option>
                        <Option value="Confirmed">Đã Xác Nhận</Option>
                        <Option value="Completed">Hoàn Thành</Option>
                        <Option value="Cancelled">Đã Hủy</Option>
                    </Select>

                    <Button
                        type="primary"
                        size="large"
                        icon={<ReloadOutlined />}
                        onClick={fetchBookings}
                        loading={loading}
                    >
                        Làm Mới
                    </Button>
                </Space>
            </div>

            {/* Table */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 15,
                padding: 20,
                border: '1px solid rgba(0, 247, 255, 0.2)'
            }}>
                <Table
                    columns={columns}
                    dataSource={filteredBookings}
                    loading={loading}
                    rowKey="maPhieuDat"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} booking`,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    scroll={{ x: 1200 }}
                    style={{
                        background: 'transparent',
                    }}
                />
            </div>

            {/* Edit Modal */}
            <Modal
                title="Chỉnh Sửa Booking"
                open={editModalVisible}
                onOk={handleSaveEdit}
                onCancel={() => setEditModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên Khách Hàng"
                        name="tenKH"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Số Điện Thoại"
                        name="sdt"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            label="Giờ Bắt Đầu"
                            name="gioDat"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                size="large"
                                minuteStep={30}
                                style={{ width: 200 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giờ Kết Thúc"
                            name="gioKetThuc"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                size="large"
                                minuteStep={30}
                                style={{ width: 200 }}
                            />
                        </Form.Item>
                    </Space>

                    <Form.Item
                        label="Ghi Chú"
                        name="ghiChu"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* QR Payment Modal */}
            <Modal
                title="Thanh Toán QR Code"
                open={qrModalVisible}
                onCancel={() => {
                    setQrModalVisible(false);
                    setPaymentRecord(null);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setQrModalVisible(false);
                        setPaymentRecord(null);
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={handleConfirmPayment}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                        Xác Nhận Đã Thanh Toán
                    </Button>
                ]}
                width={450}
                centered
            >
                {paymentRecord && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <h3 style={{ marginBottom: 16 }}>Thông Tin Thanh Toán</h3>

                        <div style={{
                            background: '#f0f2f5',
                            padding: 16,
                            borderRadius: 8,
                            marginBottom: 24,
                            textAlign: 'left'
                        }}>
                            <p><strong>Khách hàng:</strong> {paymentRecord.tenKH}</p>
                            <p><strong>Phòng:</strong> {paymentRecord.tenPhong}</p>
                            <p><strong>Thời gian:</strong> {paymentRecord.duration} giờ</p>
                            <p style={{ fontSize: 18, color: '#ff4d4f', fontWeight: 'bold' }}>
                                <strong>Tổng tiền:</strong> {paymentRecord.tongTien.toLocaleString('vi-VN')} VND
                            </p>
                        </div>

                        <div style={{
                            background: 'white',
                            padding: 20,
                            border: '2px solid #d9d9d9',
                            borderRadius: 8,
                            display: 'inline-block'
                        }}>
                            <QRCodeSVG
                                value={`KARAOKE_PAYMENT:${paymentRecord.maPhieuDat}:${paymentRecord.tongTien}`}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <p style={{ marginTop: 16, color: '#888', fontSize: 14 }}>
                            Quét mã QR để thanh toán
                        </p>
                        <p style={{ color: '#888', fontSize: 12 }}>
                            (Demo - Sau khi quét, nhấn "Xác Nhận Đã Thanh Toán")
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReceptionistHistory;
