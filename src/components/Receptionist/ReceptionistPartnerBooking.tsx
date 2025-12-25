import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, Card, Row, Col, message, Modal, Divider, Tag, Space } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import './ReceptionistPartnerBooking.css';

const { Option } = Select;
const { TextArea } = Input;

interface Partner {
    id: number;
    code: string;
    name: string;
    type: string; // OTA, Travel Agency, Corporate
    commissionRate: number; // percentage
}

// Mock partner data
const mockPartners: Partner[] = [
    { id: 1, code: 'BOOKING', name: 'Booking.com', type: 'OTA', commissionRate: 15 },
    { id: 2, code: 'AGODDA', name: 'Agoda', type: 'OTA', commissionRate: 18 },
    { id: 3, code: 'TRAVELOKA', name: 'Traveloka', type: 'OTA', commissionRate: 12 },
    { id: 4, code: 'SAIGONTOURIST', name: 'Saigon Tourist', type: 'Travel Agency', commissionRate: 10 },
    { id: 5, code: 'VIETRAVEL', name: 'Vietravel', type: 'Travel Agency', commissionRate: 10 },
];

// Mock recorded booking codes (để check duplicate)
const recordedBookingCodes = new Set(['BK123456', 'AG789012', 'TV345678']);

const ReceptionistPartnerBooking: React.FC = () => {
    const [form] = Form.useForm();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [bookingDate, setBookingDate] = useState<Dayjs>(dayjs());
    const [checkInTime, setCheckInTime] = useState<Dayjs>(dayjs().hour(14).minute(0));
    const [checkOutTime, setCheckOutTime] = useState<Dayjs>(dayjs().add(1, 'day').hour(12).minute(0));
    const [estimatedPrice, setEstimatedPrice] = useState<number>(500000);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePartnerChange = (partnerId: number) => {
        const partner = mockPartners.find(p => p.id === partnerId);
        setSelectedPartner(partner || null);
    };

    const calculateCommission = () => {
        if (!selectedPartner) return 0;
        return (estimatedPrice * selectedPartner.commissionRate) / 100;
    };

    const calculateNetRevenue = () => {
        return estimatedPrice - calculateCommission();
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            // Check duplicate booking code
            if (recordedBookingCodes.has(values.bookingCode)) {
                message.error('Mã booking đã được ghi nhận trước đó!');
                return;
            }

            setShowConfirmModal(true);
        }).catch(errorInfo => {
            console.log('Validation failed:', errorInfo);
        });
    };

    const handleConfirmBooking = () => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            setShowConfirmModal(false);

            Modal.success({
                title: 'Ghi Nhận Thành Công!',
                content: (
                    <div>
                        <p>Đã ghi nhận khách từ đối tác: <strong>{selectedPartner?.name}</strong></p>
                        <p>Mã booking: <strong>{form.getFieldValue('bookingCode')}</strong></p>
                        <p>Khách hàng: <strong>{form.getFieldValue('customerName')}</strong></p>
                        <p>Hoa hồng đối tác: <strong>{calculateCommission().toLocaleString('vi-VN')} VND</strong></p>
                    </div>
                ),
                onOk: () => {
                    form.resetFields();
                    setSelectedPartner(null);
                }
            });

            message.success('Đã tạo đơn đặt phòng và gắn nhãn "Từ đối tác ' + selectedPartner?.name + '"');
        }, 1500);
    };

    return (
        <div className="partner-booking-container">
            <div className="partner-booking-header">
                <h1>📋 Ghi Nhận Khách Từ Đối Tác</h1>
                <p>Ghi nhận và xử lý thông tin khách hàng từ OTA & đối tác du lịch</p>
            </div>

            <Row gutter={24}>
                {/* Left Column - Form */}
                <Col xs={24} lg={16}>
                    <Card className="booking-form-card" bordered={false}>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                checkInDate: dayjs(),
                                checkInTime: dayjs().hour(14).minute(0),
                                checkOutTime: dayjs().add(1, 'day').hour(12).minute(0),
                            }}
                        >
                            {/* Partner Selection */}
                            <Divider orientation="left">Thông Tin Đối Tác</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Chọn Đối Tác"
                                        name="partnerId"
                                        rules={[{ required: true, message: 'Vui lòng chọn đối tác' }]}
                                    >
                                        <Select
                                            placeholder="Chọn đối tác..."
                                            onChange={handlePartnerChange}
                                            size="large"
                                        >
                                            {mockPartners.map(partner => (
                                                <Option key={partner.id} value={partner.id}>
                                                    <Space>
                                                        <Tag color={partner.type === 'OTA' ? 'blue' : 'green'}>
                                                            {partner.type}
                                                        </Tag>
                                                        {partner.name}
                                                    </Space>
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Mã Booking Đối Tác"
                                        name="bookingCode"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mã booking' },
                                            { min: 6, message: 'Mã booking phải có ít nhất 6 ký tự' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<DollarOutlined />}
                                            placeholder="VD: BK123456"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Customer Info */}
                            <Divider orientation="left">Thông Tin Khách Hàng</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ Tên Khách"
                                        name="customerName"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên khách' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Nguyễn Văn A"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Số Điện Thoại"
                                        name="customerPhone"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="0123456789"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Email"
                                name="customerEmail"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="email@example.com"
                                    size="large"
                                />
                            </Form.Item>

                            {/* Booking Details */}
                            <Divider orientation="left">Chi Tiết Đặt Phòng</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại Phòng"
                                        name="roomType"
                                        rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
                                    >
                                        <Select placeholder="Chọn loại phòng..." size="large">
                                            <Option value="standard">Standard - 500,000 VND/đêm</Option>
                                            <Option value="deluxe">Deluxe - 800,000 VND/đêm</Option>
                                            <Option value="suite">Suite - 1,200,000 VND/đêm</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Số Người"
                                        name="numberOfGuests"
                                        rules={[{ required: true, message: 'Vui lòng nhập số người' }]}
                                    >
                                        <Input
                                            type="number"
                                            min={1}
                                            max={10}
                                            placeholder="2"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Ngày Nhận Phòng"
                                        name="checkInDate"
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format="DD/MM/YYYY"
                                            size="large"
                                            onChange={setBookingDate}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="Giờ Nhận"
                                        name="checkInTime"
                                        rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                                    >
                                        <TimePicker
                                            style={{ width: '100%' }}
                                            format="HH:mm"
                                            size="large"
                                            onChange={setCheckInTime}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="Giờ Trả"
                                        name="checkOutTime"
                                        rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                                    >
                                        <TimePicker
                                            style={{ width: '100%' }}
                                            format="HH:mm"
                                            size="large"
                                            onChange={setCheckOutTime}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Ghi Chú"
                                name="notes"
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Ghi chú thêm về booking này..."
                                />
                            </Form.Item>

                            {/* Submit Button */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<CheckCircleOutlined />}
                                    onClick={handleSubmit}
                                    block
                                    style={{ height: '50px', fontSize: '16px', fontWeight: 'bold' }}
                                >
                                    GHI NHẬN BOOKING
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Right Column - Summary */}
                <Col xs={24} lg={8}>
                    <Card className="summary-card" bordered={false}>
                        <h3 style={{ marginBottom: '20px' }}>📊 Tóm Tắt</h3>

                        {selectedPartner && (
                            <>
                                <div className="summary-item">
                                    <span className="summary-label">Đối Tác:</span>
                                    <Tag color={selectedPartner.type === 'OTA' ? 'blue' : 'green'}>
                                        {selectedPartner.name}
                                    </Tag>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Loại:</span>
                                    <span className="summary-value">{selectedPartner.type}</span>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Tỷ Lệ Hoa Hồng:</span>
                                    <span className="summary-value">{selectedPartner.commissionRate}%</span>
                                </div>

                                <Divider />

                                <div className="summary-item">
                                    <span className="summary-label">Giá Booking:</span>
                                    <span className="summary-value price">
                                        {estimatedPrice.toLocaleString('vi-VN')} VND
                                    </span>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Hoa Hồng Đối Tác:</span>
                                    <span className="summary-value commission">
                                        - {calculateCommission().toLocaleString('vi-VN')} VND
                                    </span>
                                </div>

                                <Divider />

                                <div className="summary-item total">
                                    <span className="summary-label">Doanh Thu Ròng:</span>
                                    <span className="summary-value revenue">
                                        {calculateNetRevenue().toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                            </>
                        )}

                        {!selectedPartner && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                Chọn đối tác để xem tóm tắt
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Confirmation Modal */}
            <Modal
                title="Xác Nhận Ghi Nhận Booking"
                open={showConfirmModal}
                onOk={handleConfirmBooking}
                onCancel={() => setShowConfirmModal(false)}
                confirmLoading={loading}
                okText="Xác Nhận"
                cancelText="Hủy"
                width={600}
            >
                <div style={{ padding: '20px 0' }}>
                    <p><strong>Đối Tác:</strong> {selectedPartner?.name}</p>
                    <p><strong>Mã Booking:</strong> {form.getFieldValue('bookingCode')}</p>
                    <p><strong>Khách Hàng:</strong> {form.getFieldValue('customerName')}</p>
                    <p><strong>SĐT:</strong> {form.getFieldValue('customerPhone')}</p>
                    <p><strong>Email:</strong> {form.getFieldValue('customerEmail')}</p>
                    <Divider />
                    <p><strong>Giá Booking:</strong> {estimatedPrice.toLocaleString('vi-VN')} VND</p>
                    <p><strong>Hoa Hồng ({selectedPartner?.commissionRate}%):</strong> {calculateCommission().toLocaleString('vi-VN')} VND</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                        <strong>Doanh Thu Ròng:</strong> {calculateNetRevenue().toLocaleString('vi-VN')} VND
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default ReceptionistPartnerBooking;
