import React from 'react';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, AudioOutlined, FacebookFilled } from '@ant-design/icons';
import { message } from 'antd';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface FormData {
    userId: string;
    password: string;
}

interface Errors {
    userId: boolean;
    password: boolean;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, logout, isLoading: authLoading, user } = useAuth();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [loginMode, setLoginMode] = React.useState<'user' | 'admin' | 'employee'>('user');
    const [employeeRole, setEmployeeRole] = React.useState<'KeToan' | 'TiepTan' | 'Bep' | 'PhucVu'>('TiepTan');
    const [formData, setFormData] = React.useState<FormData>({ userId: '', password: '' });
    const [errors, setErrors] = React.useState<Errors>({ userId: false, password: false });
    const [rememberMe, setRememberMe] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        console.log('🔐 Form submitted - preventDefault called');

        setIsLoading(true);
        setErrorMessage('');

        console.log('🔐 Login attempt:', {
            userId: formData.userId,
            password: formData.password,
            passwordLength: formData.password.length,
            loginMode,
            employeeRole
        });

        // Validation
        const newErrors: Errors = {
            userId: !formData.userId,
            password: !formData.password
        };
        setErrors(newErrors);

        if (!newErrors.userId && !newErrors.password) {
            try {
                console.log('📡 Calling login API with:', {
                    tenDangNhap: formData.userId,
                    matKhau: '***' + formData.password.slice(-3),
                    actualPassword: formData.password
                });
                await login(formData.userId, formData.password);
                console.log('✅ Login successful');

                // Validate loại tài khoản và chức vụ
                const userStr = localStorage.getItem('authUser');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    const roleNames: Record<string, string> = {
                        'KeToan': 'Kế Toán',
                        'TiepTan': 'Tiếp Tân',
                        'Bep': 'Bếp',
                        'PhucVu': 'Phục Vụ',
                        'Quản Trị Hệ Thống': 'Quản Trị Hệ Thống'
                    };

                    let validationFailed = false;
                    let validationMessage = '';

                    // MODE 1: KHÁCH HÀNG - Chỉ cho phép KHACH_HANG
                    if (loginMode === 'user') {
                        if (userData.loaiTaiKhoan !== 'KHACH_HANG') {
                            validationFailed = true;
                            validationMessage = 'Vui lòng chọn đúng loại tài khoản! Đây là tài khoản nhân viên/quản trị.';
                        }
                    }

                    // MODE 2: NHÂN VIÊN - Chỉ cho phép NHAN_VIEN với chức vụ cụ thể (KHÔNG bao gồm admin)
                    if (loginMode === 'employee') {
                        if (userData.loaiTaiKhoan !== 'NHAN_VIEN') {
                            validationFailed = true;
                            validationMessage = 'Tài khoản này không phải là nhân viên!';
                        }
                        // Không cho phép admin login ở chế độ nhân viên
                        else if (userData.chucVu === 'Quản Trị Hệ Thống') {
                            validationFailed = true;
                            validationMessage = 'Tài khoản quản trị vui lòng chọn chế độ "Quản Trị"!';
                        }
                        // Kiểm tra chức vụ có khớp với role đã chọn không
                        else if (userData.chucVu !== employeeRole) {
                            validationFailed = true;
                            validationMessage = `Bạn là ${roleNames[userData.chucVu] || userData.chucVu}, không phải ${roleNames[employeeRole]}!`;
                        }
                    }

                    // MODE 3: QUẢN TRỊ - Chỉ cho phép admin (Quản Trị Hệ Thống)
                    if (loginMode === 'admin') {
                        if (userData.loaiTaiKhoan !== 'NHAN_VIEN') {
                            validationFailed = true;
                            validationMessage = 'Tài khoản này không có quyền quản trị!';
                        }
                        else if (userData.chucVu !== 'Quản Trị Hệ Thống') {
                            validationFailed = true;
                            validationMessage = `Bạn là ${roleNames[userData.chucVu] || userData.chucVu}, không có quyền quản trị! Vui lòng chọn chế độ "Nhân Viên".`;
                        }
                    }

                    // Nếu validation thất bại, logout và hiển thị lỗi
                    if (validationFailed) {
                        // Logout để xóa thông tin đăng nhập (cả state và localStorage)
                        logout();

                        setErrorMessage(validationMessage);
                        message.error(validationMessage);
                        setIsLoading(false);
                        return;
                    }
                }

                message.success('Đăng nhập thành công! 🎤');

                // Role-based redirect
                setTimeout(() => {
                    const userStr = localStorage.getItem('authUser');
                    if (userStr) {
                        const userData = JSON.parse(userStr);

                        // Admin (Quản Trị Hệ Thống)
                        if (userData.chucVu === 'Quản Trị Hệ Thống') {
                            navigate('/admin');
                        }
                        // Kế Toán
                        else if (userData.chucVu === 'KeToan') {
                            navigate('/accountant');
                        }
                        // Tiếp Tân
                        else if (userData.chucVu === 'TiepTan') {
                            navigate('/receptionist');
                        }
                        // Khách hàng hoặc role khác
                        else {
                            navigate('/');
                        }
                    } else {
                        navigate('/');
                    }
                }, 800);
            } catch (error: any) {
                console.error('❌ Login error:', error);
                console.error('Error details:', {
                    message: error?.message,
                    response: error?.response,
                    responseData: error?.response?.data,
                    status: error?.response?.status
                });

                let errorMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';

                if (error?.response?.data?.message) {
                    errorMsg = error.response.data.message;
                } else if (error?.response?.data) {
                    errorMsg = typeof error.response.data === 'string'
                        ? error.response.data
                        : JSON.stringify(error.response.data);
                } else if (error?.message) {
                    errorMsg = error.message;
                }

                setErrorMessage(errorMsg);
                message.error(errorMsg);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    return (
        <div className="login-page-wrapper">
            {/* Animated Background Blobs */}
            <div className="blob-container">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            {/* Noise Texture Overlay */}
            <div className="noise-texture"></div>

            {/* Main Container */}
            <div className="login-container">
                {/* Left Side - Branding */}
                <div className="login-left-side">
                    {/* Logo */}
                    <div className="logo-wrapper">
                        <div className="logo-glow"></div>
                        <div className="logo-box">
                            <AudioOutlined style={{ fontSize: '80px', color: 'white' }} />
                        </div>
                    </div>

                    {/* Brand Name */}
                    <div className="brand-section">
                        <h1 className="brand-title">
                            <span className="brand-title-gradient">NNice</span>
                        </h1>
                        <h2 className="brand-subtitle">Hệ Thống Karaoke</h2>
                        <p className="brand-tagline">
                            "Feel the Beat, Live the Moment"
                        </p>
                    </div>

                    {/* Equalizer Visualization */}
                    <div className="equalizer-wrapper">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="equalizer-bar"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    height: `${Math.random() * 60 + 20}%`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Feature Pills */}
                    <div className="feature-pills">
                        {['Âm thanh sống động', 'Không gian nghệ thuật', 'Công nghệ đỉnh cao'].map((feature) => (
                            <div key={feature} className="feature-pill">
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-right-side">
                    <div className="login-form-wrapper">
                        {/* Glassmorphism Card */}
                        <div className="login-card-group">
                            {/* Glow Effect */}
                            <div className="card-glow"></div>

                            {/* Main Card */}
                            <div className="login-card">
                                {/* Mobile Logo */}
                                <div className="mobile-logo">
                                    <div className="mobile-logo-box">
                                        <AudioOutlined style={{ fontSize: '40px', color: 'white' }} />
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="login-header">
                                    <h3 className="login-title">Chào mừng đến với NNice!</h3>
                                    <p className="login-subtitle">
                                        {loginMode === 'admin' ? 'Đăng nhập Quản Trị' :
                                            loginMode === 'employee' ? 'Đăng nhập Nhân Viên' :
                                                'Đăng nhập Khách Hàng'}
                                    </p>
                                </div>

                                {/* Toggle User/Admin/Employee Mode */}
                                <div style={{
                                    display: 'flex',
                                    marginBottom: '16px',
                                    gap: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: '4px',
                                    borderRadius: '8px'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setLoginMode('user')}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            backgroundColor: loginMode === 'user' ? '#1890ff' : 'transparent',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: loginMode === 'user' ? 'bold' : 'normal',
                                            transition: 'all 0.3s',
                                            fontSize: '13px'
                                        }}
                                    >
                                        👤 Khách Hàng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLoginMode('employee')}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            backgroundColor: loginMode === 'employee' ? '#1890ff' : 'transparent',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: loginMode === 'employee' ? 'bold' : 'normal',
                                            transition: 'all 0.3s',
                                            fontSize: '13px'
                                        }}
                                    >
                                        👔 Nhân Viên
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLoginMode('admin')}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            backgroundColor: loginMode === 'admin' ? '#1890ff' : 'transparent',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: loginMode === 'admin' ? 'bold' : 'normal',
                                            transition: 'all 0.3s',
                                            fontSize: '13px'
                                        }}
                                    >
                                        ⚙️ Quản Trị
                                    </button>
                                </div>

                                {/* Employee Role Selection (chỉ hiện khi chọn Nhân Viên) */}
                                {loginMode === 'employee' && (
                                    <div style={{
                                        marginBottom: '20px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <label style={{
                                            display: 'block',
                                            color: '#e9d5ff',
                                            fontSize: '13px',
                                            marginBottom: '8px',
                                            fontWeight: '500'
                                        }}>
                                            Chọn vai trò:
                                        </label>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '8px'
                                        }}>
                                            <button
                                                type="button"
                                                onClick={() => setEmployeeRole('KeToan')}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '6px',
                                                    backgroundColor: employeeRole === 'KeToan' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontWeight: employeeRole === 'KeToan' ? 'bold' : 'normal',
                                                    transition: 'all 0.3s',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                💼 Kế Toán
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEmployeeRole('TiepTan')}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '6px',
                                                    backgroundColor: employeeRole === 'TiepTan' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontWeight: employeeRole === 'TiepTan' ? 'bold' : 'normal',
                                                    transition: 'all 0.3s',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                📋 Tiếp Tân
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEmployeeRole('Bep')}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '6px',
                                                    backgroundColor: employeeRole === 'Bep' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontWeight: employeeRole === 'Bep' ? 'bold' : 'normal',
                                                    transition: 'all 0.3s',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                👨‍🍳 Bếp
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEmployeeRole('PhucVu')}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '6px',
                                                    backgroundColor: employeeRole === 'PhucVu' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontWeight: employeeRole === 'PhucVu' ? 'bold' : 'normal',
                                                    transition: 'all 0.3s',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                🍽️ Phục Vụ
                                            </button>
                                        </div>
                                        <p style={{
                                            fontSize: '11px',
                                            color: '#d8b4fe',
                                            marginTop: '8px',
                                            marginBottom: 0,
                                            fontStyle: 'italic'
                                        }}>
                                            {employeeRole === 'KeToan' && '→ Quản lý tài chính, thanh toán, báo cáo'}
                                            {employeeRole === 'TiepTan' && '→ Đặt phòng, đặt tiệc, check-in khách'}
                                            {employeeRole === 'Bep' && '→ Chế biến món ăn, quản lý bếp'}
                                            {employeeRole === 'PhucVu' && '→ Phục vụ khách hàng, order đồ ăn'}
                                        </p>
                                    </div>
                                )}

                                {/* Error Message */}
                                {errorMessage && (
                                    <div style={{
                                        padding: '12px',
                                        marginBottom: '16px',
                                        backgroundColor: '#fee',
                                        border: '1px solid #fcc',
                                        borderRadius: '6px',
                                        color: '#c33',
                                        fontSize: '14px'
                                    }}>
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="login-form">
                                    {/* User ID Input */}
                                    <div className="form-group">
                                        <label className="form-label">Số điện thoại / User ID</label>
                                        <div className={`form-input-wrapper ${errors.userId ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.userId ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <UserOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type="text"
                                                    value={formData.userId}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('userId', e.target.value)}
                                                    placeholder="Nhập số điện thoại / User ID"
                                                    className={`form-input ${errors.userId ? 'form-input-error-border' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        {errors.userId && (
                                            <p className="form-error-text">Vui lòng điền số Điện thoại / User ID</p>
                                        )}
                                    </div>

                                    {/* Password Input */}
                                    <div className="form-group">
                                        <label className="form-label">Mật khẩu</label>
                                        <div className={`form-input-wrapper ${errors.password ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.password ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <LockOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                                                    placeholder="Nhập mật khẩu"
                                                    className={`form-input form-input-password ${errors.password ? 'form-input-error-border' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="form-input-toggle"
                                                >
                                                    {showPassword ? <EyeInvisibleOutlined style={{ fontSize: '16px' }} /> : <EyeOutlined style={{ fontSize: '16px' }} />}
                                                </button>
                                            </div>
                                        </div>
                                        {errors.password && (
                                            <p className="form-error-text">Vui lòng điền mật khẩu</p>
                                        )}
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="form-footer-row">
                                        <label className="form-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                                                className="form-checkbox"
                                            />
                                            <span className="checkbox-text">Nhớ mật khẩu</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="forgot-password-btn"
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </div>

                                    {/* Sign In Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || authLoading}
                                        className="login-submit-btn"
                                    >
                                        <div className="submit-btn-gradient"></div>
                                        <div className="submit-btn-content">
                                            {isLoading || authLoading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    <span>Đang đăng nhập...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Đăng nhập</span>
                                                    <svg className="submit-btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="form-divider">
                                    <div className="divider-line"></div>
                                    <span className="divider-text">Hoặc đăng nhập với</span>
                                </div>

                                {/* Social Login */}
                                <div className="social-login-buttons">
                                    <button type="button" className="social-btn google-btn">
                                        <svg className="social-icon" viewBox="0 0 24 24">
                                            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Google</span>
                                    </button>
                                    <button type="button" className="social-btn facebook-btn">
                                        <FacebookFilled style={{ fontSize: '16px' }} />
                                        <span>Facebook</span>
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="login-card-footer">
                                    <p className="footer-text">
                                        Không có tài khoản?{' '}
                                        <button
                                            type="button"
                                            className="signup-link"
                                            onClick={() => navigate('/register')}
                                        >
                                            Đăng ký ngay
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
