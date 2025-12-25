import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Modal, Row, Col, Tag, Divider, Space, Progress, InputNumber } from 'antd';
import { TrophyOutlined, GiftOutlined, UserOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './ReceptionistPayment.css';

interface BonusCode {
    code: string;
    bonusPoints: number;
    multiplier?: number; // Optional multiplier instead of fixed points
    expiryDate: string;
    used: boolean;
    description: string;
}

interface Member {
    id: string;
    name: string;
    phone: string;
    points: number;
    tier: 'Bạc' | 'Vàng' | 'Bạch Kim';
}

// Mock bonus point codes
const mockBonusCodes: Map<string, BonusCode> = new Map([
    ['DOUBLE2X', {
        code: 'DOUBLE2X',
        bonusPoints: 0,
        multiplier: 2,
        expiryDate: '2025-12-31',
        used: false,
        description: 'Nhân đôi điểm tích lũy (x2)'
    }],
    ['TRIPLE3X', {
        code: 'TRIPLE3X',
        bonusPoints: 0,
        multiplier: 3,
        expiryDate: '2025-12-31',
        used: false,
        description: 'Nhân ba điểm tích lũy (x3)'
    }],
    ['BONUS100', {
        code: 'BONUS100',
        bonusPoints: 100,
        expiryDate: '2025-12-31',
        used: false,
        description: 'Thưởng thêm 100 điểm'
    }],
    ['BONUS500', {
        code: 'BONUS500',
        bonusPoints: 500,
        expiryDate: '2025-01-31',
        used: false,
        description: 'Thưởng thêm 500 điểm'
    }],
    ['USED999', {
        code: 'USED999',
        bonusPoints: 200,
        expiryDate: '2025-12-31',
        used: true,
        description: 'Mã đã sử dụng'
    }],
]);

// Mock members
const mockMembers: Map<string, Member> = new Map([
    ['0123456789', {
        id: 'VIP001',
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        points: 480,
        tier: 'Bạc'
    }],
    ['0987654321', {
        id: 'VIP002',
        name: 'Trần Thị B',
        phone: '0987654321',
        points: 1250,
        tier: 'Vàng'
    }]
]);

const ReceptionistPayment: React.FC = () => {
    const [form] = Form.useForm();
    const [transactionAmount, setTransactionAmount] = useState<number>(300000);
    const [appliedBonus, setAppliedBonus] = useState<BonusCode | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(false);

    const calculateBasePoints = (amount: number, tier: string): number => {
        // 1 point per 10,000 VND
        let basePoints = Math.floor(amount / 10000);

        // Tier multiplier
        switch (tier) {
            case 'Vàng': return basePoints * 1.5;
            case 'Bạch Kim': return basePoints * 2;
            default: return basePoints;
        }
    };

    const calculateFinalPoints = (): number => {
        if (!member) return 0;

        let basePoints = calculateBasePoints(transactionAmount, member.tier);

        if (appliedBonus) {
            if (appliedBonus.multiplier) {
                // Multiplier bonus
                basePoints = basePoints * appliedBonus.multiplier;
            } else {
                // Fixed bonus
                basePoints += appliedBonus.bonusPoints;
            }
        }

        return Math.round(basePoints);
    };

    const checkTierUpgrade = (currentPoints: number, newPoints: number): { upgraded: boolean; newTier: string } => {
        const totalPoints = currentPoints + newPoints;

        if (totalPoints >= 2000 && currentPoints < 2000) {
            return { upgraded: true, newTier: 'Bạch Kim' };
        }
        if (totalPoints >= 500 && currentPoints < 500) {
            return { upgraded: true, newTier: 'Vàng' };
        }

        return { upgraded: false, newTier: '' };
    };

    const handleApplyBonus = () => {
        const bonusCode = form.getFieldValue('bonusCode')?.toUpperCase().trim();

        if (!bonusCode) {
            message.warning('Vui lòng nhập mã tăng điểm');
            return;
        }

        const bonus = mockBonusCodes.get(bonusCode);

        if (!bonus) {
            message.error('Mã tăng điểm không hợp lệ');
            return;
        }

        if (bonus.used) {
            message.error('Mã tăng điểm đã được sử dụng');
            return;
        }

        if (dayjs(bonus.expiryDate).isBefore(dayjs())) {
            message.error('Mã tăng điểm đã hết hạn');
            return;
        }

        setAppliedBonus(bonus);
        message.success(`Đã áp dụng mã ${bonus.code}!`);
    };

    const handleRemoveBonus = () => {
        setAppliedBonus(null);
        form.setFieldValue('bonusCode', '');
        message.info('Đã xóa mã tăng điểm');
    };

    const handleCheckMember = () => {
        const phone = form.getFieldValue('memberPhone');
        const foundMember = mockMembers.get(phone);

        if (foundMember) {
            setMember(foundMember);
            message.success('Đã tìm thấy thành viên!');
        } else {
            setMember(null);
            message.error('Không tìm thấy thành viên với số điện thoại này');
        }
    };

    const handleRecordPoints = () => {
        if (!member) {
            message.warning('Vui lòng kiểm tra thông tin thành viên trước');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            const earnedPoints = calculateFinalPoints();
            const { upgraded, newTier } = checkTierUpgrade(member.points, earnedPoints);

            Modal.success({
                title: 'Ghi Nhận Điểm Thành Công!',
                content: (
                    <div className="payment-success-content">
                        <Divider />
                        <p><strong>Số tiền giao dịch:</strong> {transactionAmount.toLocaleString('vi-VN')} VND</p>
                        <Divider />
                        <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                            <p style={{ margin: '4px 0', color: '#1890ff', fontSize: '16px' }}>
                                <TrophyOutlined /> <strong>Điểm tích lũy:</strong> +{earnedPoints} điểm
                            </p>
                            {appliedBonus && (
                                <p style={{ margin: '4px 0', color: '#52c41a' }}>
                                    <StarOutlined /> Đã áp dụng: {appliedBonus.description}
                                </p>
                            )}
                            <p style={{ margin: '4px 0', fontSize: '14px' }}>
                                <strong>Tổng điểm:</strong> {member.points + earnedPoints} điểm
                            </p>
                        </div>
                        {upgraded && (
                            <div style={{ background: '#fff7e6', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '2px solid #faad14' }}>
                                <p style={{ margin: 0, color: '#fa8c16', fontWeight: 'bold', fontSize: '16px' }}>
                                    🎉 Chúc mừng! Bạn đã được nâng hạng lên <Tag color="gold">{newTier}</Tag>
                                </p>
                            </div>
                        )}
                    </div>
                ),
                onOk: () => {
                    // Reset form
                    form.resetFields();
                    setAppliedBonus(null);
                    setMember(null);
                    setTransactionAmount(300000);
                }
            });

            message.success('Điểm đã được cộng vào tài khoản thành viên!');
        }, 1500);
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Bạc': return 'default';
            case 'Vàng': return 'gold';
            case 'Bạch Kim': return 'purple';
            default: return 'default';
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h1><TrophyOutlined /> Ghi Nhận Điểm Tích Lũy</h1>
                <p>Cộng điểm cho thành viên và áp dụng mã thưởng điểm</p>
            </div>

            <Row gutter={24}>
                {/* Left: Form */}
                <Col xs={24} lg={14}>
                    <Card className="payment-card">
                        <h3>👤 Thông Tin Thành Viên</h3>
                        <Form form={form} layout="vertical">
                            {/* Member Check */}
                            <Form.Item label="Số Điện Thoại Thành Viên" name="memberPhone" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                                <Input.Search
                                    placeholder="0123456789"
                                    size="large"
                                    onSearch={handleCheckMember}
                                    enterButton={<Button type="default" icon={<UserOutlined />}>Tìm Kiếm</Button>}
                                />
                            </Form.Item>

                            {member && (
                                <div className="member-info">
                                    <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f', marginBottom: '20px' }}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <p style={{ margin: '4px 0' }}><strong>Mã TV:</strong> {member.id}</p>
                                                <p style={{ margin: '4px 0' }}><strong>Họ tên:</strong> {member.name}</p>
                                            </Col>
                                            <Col span={12}>
                                                <p style={{ margin: '4px 0' }}>
                                                    <strong>Hạng:</strong> <Tag color={getTierColor(member.tier)}>{member.tier}</Tag>
                                                </p>
                                                <p style={{ margin: '4px 0' }}><strong>Điểm HT:</strong> {member.points} điểm</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                            )}

                            <Divider />

                            {/* Transaction Amount */}
                            <h4>💰 Giao Dịch</h4>
                            <Form.Item label="Số Tiền Giao Dịch (VND)">
                                <InputNumber
                                    value={transactionAmount}
                                    onChange={(val) => setTransactionAmount(val || 0)}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                    size="large"
                                    min={0}
                                    disabled={!member}
                                />
                            </Form.Item>

                            <Divider />

                            {/* Bonus Code */}
                            <h4><StarOutlined /> Mã Tăng Điểm (Tùy chọn)</h4>
                            <Form.Item label="Mã Thưởng Điểm" name="bonusCode">
                                <Input.Search
                                    placeholder="VD: DOUBLE2X, BONUS100"
                                    size="large"
                                    onSearch={handleApplyBonus}
                                    enterButton={<Button type="primary" icon={<GiftOutlined />}>Áp Dụng</Button>}
                                    disabled={!!appliedBonus || !member}
                                />
                            </Form.Item>

                            {appliedBonus && (
                                <div className="applied-promo">
                                    <Tag color="success" style={{ fontSize: '14px', padding: '8px 12px' }}>
                                        ✓ {appliedBonus.code} - {appliedBonus.description}
                                    </Tag>
                                    <Button type="link" danger onClick={handleRemoveBonus}>
                                        Xóa
                                    </Button>
                                </div>
                            )}

                            <div className="promo-hints">
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>💡 Mã khả dụng:</p>
                                <Space wrap>
                                    <Tag>DOUBLE2X (x2 điểm)</Tag>
                                    <Tag>TRIPLE3X (x3 điểm)</Tag>
                                    <Tag>BONUS100 (+100 điểm)</Tag>
                                    <Tag>BONUS500 (+500 điểm)</Tag>
                                </Space>
                            </div>

                            <Divider />

                            <Button
                                type="primary"
                                size="large"
                                icon={<CheckCircleOutlined />}
                                onClick={handleRecordPoints}
                                loading={loading}
                                disabled={!member}
                                block
                                style={{ height: '50px', fontSize: '16px', fontWeight: 'bold' }}
                            >
                                GHI NHẬN ĐIỂM
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* Right: Summary */}
                <Col xs={24} lg={10}>
                    <Card className="summary-card">
                        <h3>📊 Tóm Tắt</h3>

                        {!member && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                <p>Vui lòng tìm kiếm thành viên</p>
                            </div>
                        )}

                        {member && (
                            <>
                                <div className="summary-item">
                                    <span>Số tiền giao dịch:</span>
                                    <span className="amount">{transactionAmount.toLocaleString('vi-VN')} đ</span>
                                </div>

                                <div className="summary-item">
                                    <span>Điểm cơ bản:</span>
                                    <span className="amount">
                                        {Math.round(calculateBasePoints(transactionAmount, member.tier))} điểm
                                    </span>
                                </div>

                                {appliedBonus && (
                                    <div className="summary-item discount">
                                        <span>Mã thưởng ({appliedBonus.code}):</span>
                                        <span className="amount" style={{ color: '#52c41a' }}>
                                            {appliedBonus.multiplier ? `x${appliedBonus.multiplier}` : `+${appliedBonus.bonusPoints}`}
                                        </span>
                                    </div>
                                )}

                                <Divider />

                                <div className="summary-item total">
                                    <span>Tổng điểm nhận:</span>
                                    <span className="amount final" style={{ color: '#1890ff' }}>
                                        +{calculateFinalPoints()} điểm
                                    </span>
                                </div>

                                <Divider />

                                <div className="points-preview">
                                    <h4><TrophyOutlined /> Tài Khoản</h4>
                                    <div className="points-calc">
                                        <p>Điểm hiện tại: <strong>{member.points}</strong></p>
                                        <p style={{ color: '#52c41a', fontSize: '16px' }}>
                                            Điểm nhận được: <strong>+{calculateFinalPoints()}</strong>
                                        </p>
                                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                                            Tổng sau GD: <strong>{member.points + calculateFinalPoints()}</strong>
                                        </p>
                                    </div>

                                    <div style={{ marginTop: '16px' }}>
                                        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Tiến độ lên hạng:</p>
                                        <Progress
                                            percent={Math.min(100, ((member.points + calculateFinalPoints()) / 500) * 100)}
                                            status="active"
                                            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                        />
                                        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            {member.points + calculateFinalPoints() >= 2000
                                                ? '🎉 Đã đạt Bạch Kim!'
                                                : member.points + calculateFinalPoints() >= 500
                                                    ? `Còn ${2000 - (member.points + calculateFinalPoints())} điểm để lên Bạch Kim`
                                                    : `Còn ${500 - (member.points + calculateFinalPoints())} điểm để lên Vàng`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReceptionistPayment;
