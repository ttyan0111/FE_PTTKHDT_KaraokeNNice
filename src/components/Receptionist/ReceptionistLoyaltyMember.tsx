import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Card, message, Modal, Tag, Table, Progress, Divider, Row, Col, Space, Badge } from 'antd';
import { UserOutlined, IdcardOutlined, PhoneOutlined, MailOutlined, SearchOutlined, PlusOutlined, EditOutlined, TrophyOutlined, GiftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './ReceptionistLoyaltyMember.css';

const { TabPane } = Tabs;

interface LoyaltyMember {
    memberId: string;
    name: string;
    idCard: string;
    email: string;
    phone: string;
    tier: 'Bạc' | 'Vàng' | 'Bạch Kim';
    points: number;
    joinDate: string;
    totalSpent: number;
}

interface Transaction {
    id: number;
    date: string;
    type: string;
    points: number;
    description: string;
}

// Mock existing members
const mockMembers: Map<string, LoyaltyMember> = new Map([
    ['0123456789', {
        memberId: 'VIP001234',
        name: 'Nguyễn Văn A',
        idCard: '001234567890',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        tier: 'Vàng',
        points: 1250,
        joinDate: '2024-01-15',
        totalSpent: 15000000
    }],
    ['0987654321', {
        memberId: 'VIP005678',
        name: 'Trần Thị B',
        idCard: '009876543210',
        email: 'tranthib@email.com',
        phone: '0987654321',
        tier: 'Bạc',
        points: 450,
        joinDate: '2024-06-20',
        totalSpent: 5000000
    }]
]);

// Mock transaction history
const mockTransactions: Transaction[] = [
    { id: 1, date: '2024-12-20', type: 'Đặt phòng', points: 50, description: 'Phòng VIP - 3 giờ' },
    { id: 2, date: '2024-12-15', type: 'Đặt tiệc', points: 200, description: 'Tiệc sinh nhật 20 người' },
    { id: 3, date: '2024-12-10', type: 'Đặt phòng', points: 30, description: 'Phòng Standard - 2 giờ' },
];

const ReceptionistLoyaltyMember: React.FC = () => {
    const [registerForm] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [searchedMember, setSearchedMember] = useState<LoyaltyMember | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('register');

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Bạc': return 'default';
            case 'Vàng': return 'gold';
            case 'Bạch Kim': return 'purple';
            default: return 'default';
        }
    };

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'Bạc': return '🥈';
            case 'Vàng': return '🥇';
            case 'Bạch Kim': return '💎';
            default: return '🏅';
        }
    };

    const getNextTierPoints = (currentPoints: number) => {
        if (currentPoints < 500) return 500;
        if (currentPoints < 2000) return 2000;
        return 5000;
    };

    const getTierProgress = (points: number) => {
        if (points < 500) return (points / 500) * 100;
        if (points < 2000) return ((points - 500) / 1500) * 100;
        return ((points - 2000) / 3000) * 100;
    };

    const handleRegister = () => {
        registerForm.validateFields().then(values => {
            // Check if phone already exists
            if (mockMembers.has(values.phone)) {
                const existingMember = mockMembers.get(values.phone)!;
                Modal.warning({
                    title: 'Khách Hàng Đã Là Thành Viên',
                    content: (
                        <div>
                            <p><strong>Mã thành viên:</strong> {existingMember.memberId}</p>
                            <p><strong>Họ tên:</strong> {existingMember.name}</p>
                            <p><strong>Hạng:</strong> <Tag color={getTierColor(existingMember.tier)}>{existingMember.tier}</Tag></p>
                            <p><strong>Điểm tích lũy:</strong> {existingMember.points}</p>
                        </div>
                    )
                });
                return;
            }

            setLoading(true);
            // Mock registration
            setTimeout(() => {
                const newMemberId = 'VIP' + Math.random().toString().substring(2, 8);
                setLoading(false);

                Modal.success({
                    title: 'Đăng Ký Thành Công!',
                    content: (
                        <div>
                            <p>Đã tạo thẻ thành viên thân thiết</p>
                            <p><strong>Mã thành viên:</strong> {newMemberId}</p>
                            <p><strong>Họ tên:</strong> {values.name}</p>
                            <p><strong>Hạng:</strong> <Tag color="default">Bạc</Tag></p>
                            <p><strong>Điểm tích lũy:</strong> 0</p>
                        </div>
                    ),
                    onOk: () => {
                        registerForm.resetFields();
                    }
                });

                message.success('Thông tin thành viên đã được ghi nhận vào hệ thống');
            }, 1000);
        });
    };

    const handleSearch = () => {
        searchForm.validateFields().then(values => {
            const searchKey = values.searchKey;

            // Search by phone or member ID
            let member: LoyaltyMember | undefined;

            if (mockMembers.has(searchKey)) {
                member = mockMembers.get(searchKey);
            } else {
                // Search by member ID
                for (const m of mockMembers.values()) {
                    if (m.memberId === searchKey) {
                        member = m;
                        break;
                    }
                }
            }

            if (member) {
                setSearchedMember(member);
                message.success('Đã tìm thấy thông tin thành viên');
            } else {
                setSearchedMember(null);
                message.error('Không tìm thấy thông tin thành viên');
            }
        });
    };

    const handleUpdate = () => {
        if (!searchedMember) {
            message.warning('Vui lòng tìm kiếm thành viên trước khi cập nhật');
            return;
        }

        updateForm.validateFields().then(values => {
            setLoading(true);
            // Mock update
            setTimeout(() => {
                setLoading(false);
                Modal.success({
                    title: 'Cập Nhật Thành Công!',
                    content: `Đã cập nhật thông tin thành viên ${searchedMember.memberId}`,
                    onOk: () => {
                        updateForm.resetFields();
                        setSearchedMember(null);
                        setActiveTab('search');
                    }
                });
            }, 1000);
        });
    };

    const transactionColumns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Loại giao dịch',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            key: 'points',
            render: (points: number) => (
                <Tag color="blue">+{points} điểm</Tag>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <div className="loyalty-member-container">
            <div className="loyalty-member-header">
                <h1><TrophyOutlined /> Quản Lý Thành Viên Thân Thiết</h1>
                <p>Đăng ký mới, tra cứu và cập nhật thông tin thành viên</p>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
                {/* Register Tab */}
                <TabPane
                    tab={<span><PlusOutlined /> Đăng Ký Mới</span>}
                    key="register"
                >
                    <Card className="form-card">
                        <h3>📝 Thông Tin Khách Hàng</h3>
                        <Form
                            form={registerForm}
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ và Tên"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="CMND/CCCD"
                                        name="idCard"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập CMND/CCCD' },
                                            { pattern: /^[0-9]{9,12}$/, message: 'CMND/CCCD không hợp lệ' }
                                        ]}
                                    >
                                        <Input prefix={<IdcardOutlined />} placeholder="001234567890" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số Điện Thoại"
                                        name="phone"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                                        ]}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="0123456789" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email' },
                                            { type: 'email', message: 'Email không hợp lệ' }
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <div className="default-tier-info">
                                <GiftOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                <div>
                                    <p><strong>Hạng mặc định:</strong> <Tag color="default">🥈 Bạc</Tag></p>
                                    <p style={{ margin: 0, color: '#666' }}>Điểm tích lũy ban đầu: <strong>0 điểm</strong></p>
                                </div>
                            </div>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />}
                                    onClick={handleRegister}
                                    loading={loading}
                                    block
                                    style={{ height: '50px', fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}
                                >
                                    ĐĂNG KÝ THÀNH VIÊN
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* Search Tab */}
                <TabPane
                    tab={<span><SearchOutlined /> Tra Cứu</span>}
                    key="search"
                >
                    <Card className="form-card">
                        <h3>🔍 Tìm Kiếm Thành Viên</h3>
                        <Form form={searchForm} layout="vertical">
                            <Form.Item
                                label="Mã Thành Viên hoặc Số Điện Thoại"
                                name="searchKey"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin tìm kiếm' }]}
                            >
                                <Input.Search
                                    placeholder="VD: VIP001234 hoặc 0123456789"
                                    size="large"
                                    onSearch={handleSearch}
                                    enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm Kiếm</Button>}
                                />
                            </Form.Item>
                        </Form>

                        {searchedMember && (
                            <div className="member-card-display">
                                <Divider />
                                <Card className="member-info-card">
                                    <Row gutter={24}>
                                        <Col span={16}>
                                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                <div>
                                                    <h2 style={{ marginBottom: '8px' }}>{searchedMember.name}</h2>
                                                    <Tag color={getTierColor(searchedMember.tier)} style={{ fontSize: '16px', padding: '4px 12px' }}>
                                                        {getTierIcon(searchedMember.tier)} {searchedMember.tier}
                                                    </Tag>
                                                </div>

                                                <Divider style={{ margin: '12px 0' }} />

                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <div className="info-item">
                                                            <span className="info-label">Mã thành viên:</span>
                                                            <span className="info-value">{searchedMember.memberId}</span>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="info-item">
                                                            <span className="info-label">Số điện thoại:</span>
                                                            <span className="info-value">{searchedMember.phone}</span>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="info-item">
                                                            <span className="info-label">Email:</span>
                                                            <span className="info-value">{searchedMember.email}</span>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="info-item">
                                                            <span className="info-label">Ngày tham gia:</span>
                                                            <span className="info-value">{dayjs(searchedMember.joinDate).format('DD/MM/YYYY')}</span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Space>
                                        </Col>

                                        <Col span={8}>
                                            <div className="points-display">
                                                <div className="points-badge">
                                                    <TrophyOutlined style={{ fontSize: '32px', color: '#faad14' }} />
                                                    <h1 style={{ margin: '8px 0', color: '#1890ff' }}>{searchedMember.points}</h1>
                                                    <p style={{ margin: 0, color: '#666' }}>Điểm tích lũy</p>
                                                </div>
                                                <Divider style={{ margin: '16px 0' }} />
                                                <div>
                                                    <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                                                        Tiến độ lên hạng: {searchedMember.points}/{getNextTierPoints(searchedMember.points)}
                                                    </p>
                                                    <Progress
                                                        percent={getTierProgress(searchedMember.points)}
                                                        status="active"
                                                        strokeColor={{
                                                            '0%': '#108ee9',
                                                            '100%': '#87d068',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Divider />

                                    <h4>📜 Lịch Sử Giao Dịch</h4>
                                    <Table
                                        columns={transactionColumns}
                                        dataSource={mockTransactions}
                                        rowKey="id"
                                        pagination={{ pageSize: 5 }}
                                        size="small"
                                    />
                                </Card>
                            </div>
                        )}
                    </Card>
                </TabPane>

                {/* Update Tab */}
                <TabPane
                    tab={<span><EditOutlined /> Cập Nhật</span>}
                    key="update"
                >
                    <Card className="form-card">
                        <h3>✏️ Cập Nhật Thông Tin</h3>

                        {!searchedMember && (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <SearchOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                <p>Vui lòng tìm kiếm thành viên ở tab "Tra Cứu" trước</p>
                                <Button type="primary" onClick={() => setActiveTab('search')}>
                                    Đến Tra Cứu
                                </Button>
                            </div>
                        )}

                        {searchedMember && (
                            <Form
                                form={updateForm}
                                layout="vertical"
                                initialValues={searchedMember}
                            >
                                <div style={{ marginBottom: '20px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                                    <p style={{ margin: 0 }}>
                                        <strong>Đang cập nhật:</strong> {searchedMember.name} (
                                        <Tag color={getTierColor(searchedMember.tier)}>{searchedMember.tier}</Tag>)
                                    </p>
                                </div>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Họ và Tên"
                                            name="name"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                        >
                                            <Input prefix={<UserOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="CMND/CCCD"
                                            name="idCard"
                                            rules={[{ required: true, message: 'Vui lòng nhập CMND/CCCD' }]}
                                        >
                                            <Input prefix={<IdcardOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Số Điện Thoại"
                                            name="phone"
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                        >
                                            <Input prefix={<PhoneOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
                                        >
                                            <Input prefix={<MailOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<EditOutlined />}
                                        onClick={handleUpdate}
                                        loading={loading}
                                        block
                                        style={{ height: '50px', fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}
                                    >
                                        LƯU CẬP NHẬT
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ReceptionistLoyaltyMember;
