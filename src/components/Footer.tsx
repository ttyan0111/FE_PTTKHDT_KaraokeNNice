import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FacebookFilled,
    XOutlined,
    InstagramOutlined,
    YoutubeFilled,
    MailOutlined
} from '@ant-design/icons'
import './Footer.css'

export const AppFooter: React.FC = () => {
    const navigate = useNavigate()

    const handleLinkClick = (path: string) => {
        navigate(path)
        window.scrollTo(0, 0)
    }

    return (
        <footer style={{
            textAlign: 'center',
            backgroundColor: '#001529',
            color: '#fff',
            padding: '40px 20px',
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                    {/* About */}
                    <div>
                        <h4 style={{ marginBottom: '16px' }}>Về Karaoke NNice</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    Về chúng tôi
                                </a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    Lịch sử
                                </a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeV2vavrpuzbI6zftGW5fmAL9oCiV-3emHsRwaAVtlUo8U9YA/viewform?usp=header" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    Tuyển dụng
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 style={{ marginBottom: '16px' }}>Dịch vụ</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => handleLinkClick('/rooms')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontSize: 'inherit',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                >
                                    Đặt phòng
                                </button>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => handleLinkClick('/parties')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontSize: 'inherit',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                >
                                    Gói tiệc
                                </button>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => handleLinkClick('/members')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontSize: 'inherit',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                >
                                    Chương trình thành viên
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ marginBottom: '16px' }}>Hỗ trợ</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    Liên hệ
                                </a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    FAQ
                                </a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    Chính sách bảo mật
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ marginBottom: '16px' }}>Liên hệ</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>📞 0912 345 678</li>
                            <li style={{ marginBottom: '8px' }}><MailOutlined /> info@karaokennice.vn</li>
                            <li style={{ marginBottom: '8px' }}>📍 123 Đường ABC, Quận 1, TP.HCM</li>
                            <li>🕐 10:00 - 03:00 (T2-T7) | 10:00-02:00 (CN)</li>
                        </ul>
                    </div>
                </div>

                <div
                    style={{
                        borderTop: '1px solid #333',
                        paddingTop: '20px',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ margin: 0, marginBottom: '10px' }}>
                        © 2025 Karaoke NNice. Tất cả các quyền được bảo lưu.
                    </p>
                    <div style={{ fontSize: '24px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                            <FacebookFilled />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                            <XOutlined />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                            <InstagramOutlined />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}>
                            <YoutubeFilled />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
