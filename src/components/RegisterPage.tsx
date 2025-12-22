import React from 'react';
import { UserOutlined, LockOutlined, PhoneOutlined, AudioOutlined, GiftOutlined, ThunderboltOutlined, StarOutlined } from '@ant-design/icons';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';

interface FormData {
    fullName: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

interface Errors {
    fullName: boolean;
    phone: boolean;
    password: boolean;
    confirmPassword: boolean;
    agreeTerms: boolean;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<FormData>({
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = React.useState<Errors>({
        fullName: false,
        phone: false,
        password: false,
        confirmPassword: false,
        agreeTerms: false
    });
    const [errorMessages, setErrorMessages] = React.useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const validatePhone = (phone: string): boolean => {
        return /^0[0-9]{9}$/.test(phone);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        const newErrors: Errors = {
            fullName: !formData.fullName.trim(),
            phone: !formData.phone || !validatePhone(formData.phone),
            password: !formData.password || formData.password.length < 6,
            confirmPassword: !formData.confirmPassword || formData.password !== formData.confirmPassword,
            agreeTerms: !formData.agreeTerms
        };

        const newErrorMessages: { [key: string]: string } = {};
        if (newErrors.fullName) newErrorMessages.fullName = 'Vui lòng nhập họ và tên';
        if (newErrors.phone) {
            newErrorMessages.phone = !formData.phone ? 'Vui lòng nhập số điện thoại' : 'Số điện thoại không hợp lệ (10 số)';
        }
        if (newErrors.password) {
            newErrorMessages.password = !formData.password ? 'Vui lòng nhập mật khẩu' : 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (newErrors.confirmPassword) {
            newErrorMessages.confirmPassword = !formData.confirmPassword ? 'Vui lòng nhập lại mật khẩu' : 'Mật khẩu không khớp';
        }
        if (newErrors.agreeTerms) newErrorMessages.agreeTerms = 'Bạn phải đồng ý với điều khoản';

        setErrors(newErrors);
        setErrorMessages(newErrorMessages);

        if (!Object.values(newErrors).some(error => error)) {
            setTimeout(() => {
                // Show success alert
                const successAlert = document.createElement('div');
                successAlert.className = 'success-alert';
                successAlert.innerHTML = `
                    <div class="success-alert-content">
                        <div class="success-icon">✓</div>
                        <h3>Đăng ký thành công!</h3>
                        <p>Tài khoản của bạn đã được tạo. Đang chuyển đến trang đăng nhập...</p>
                    </div>
                `;
                document.body.appendChild(successAlert);

                setTimeout(() => {
                    successAlert.classList.add('show');
                }, 10);

                setTimeout(() => {
                    successAlert.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(successAlert);
                        navigate('/login');
                    }, 300);
                }, 2000);

                setIsLoading(false);
            }, 1500);
        } else {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof Errors]) {
            setErrors(prev => ({ ...prev, [field]: false }));
            setErrorMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[field];
                return newMessages;
            });
        }
    };

    const memberBenefits = [
        { icon: <GiftOutlined />, text: 'Tích điểm mỗi lần sử dụng' },
        { icon: <ThunderboltOutlined />, text: 'Đặt phòng nhanh chóng' },
        { icon: <StarOutlined />, text: 'Ưu đãi độc quyền' }
    ];

    return (
        <div className="register-page-wrapper">
            {/* Animated Background Blobs */}
            <div className="blob-container">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            {/* Noise Texture Overlay */}
            <div className="noise-texture"></div>

            {/* Main Container */}
            <div className="register-container">
                {/* Left Side - Branding */}
                <div className="register-left-side">
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
                            "Trở thành thành viên ngay hôm nay"
                        </p>
                    </div>

                    {/* Member Benefits */}
                    <div className="member-benefits">
                        <h3 className="benefits-title">Lợi ích thành viên</h3>
                        <div className="benefits-list">
                            {memberBenefits.map((benefit, index) => (
                                <div key={index} className="benefit-item">
                                    <div className="benefit-icon">{benefit.icon}</div>
                                    <span className="benefit-text">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
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
                </div>

                {/* Right Side - Register Form */}
                <div className="register-right-side">
                    <div className="register-form-wrapper">
                        {/* Glassmorphism Card */}
                        <div className="register-card-group">
                            {/* Glow Effect */}
                            <div className="card-glow"></div>

                            {/* Main Card */}
                            <div className="register-card">
                                {/* Mobile Logo */}
                                <div className="mobile-logo">
                                    <div className="mobile-logo-box">
                                        <AudioOutlined style={{ fontSize: '40px', color: 'white' }} />
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="register-header">
                                    <h3 className="register-title">Đăng Ký Tài Khoản</h3>
                                    <p className="register-subtitle">Tạo tài khoản để trải nghiệm dịch vụ</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="register-form">
                                    {/* Full Name Input */}
                                    <div className="form-group">
                                        <label className="form-label">Họ và Tên</label>
                                        <div className={`form-input-wrapper ${errors.fullName ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.fullName ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <UserOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                                                    placeholder="Nhập họ và tên đầy đủ"
                                                    className={`form-input ${errors.fullName ? 'form-input-error-border' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        {errors.fullName && (
                                            <p className="form-error-text">{errorMessages.fullName}</p>
                                        )}
                                    </div>

                                    {/* Phone Input */}
                                    <div className="form-group">
                                        <label className="form-label">Số Điện Thoại</label>
                                        <div className={`form-input-wrapper ${errors.phone ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.phone ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <PhoneOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                                                    placeholder="Nhập số điện thoại "
                                                    className={`form-input ${errors.phone ? 'form-input-error-border' : ''}`}
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>
                                        {errors.phone && (
                                            <p className="form-error-text">{errorMessages.phone}</p>
                                        )}
                                    </div>

                                    {/* Password Input */}
                                    <div className="form-group">
                                        <label className="form-label">Mật Khẩu</label>
                                        <div className={`form-input-wrapper ${errors.password ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.password ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <LockOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                                                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                                    className={`form-input form-input-password ${errors.password ? 'form-input-error-border' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="form-input-toggle"
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                        </div>
                                        {errors.password && (
                                            <p className="form-error-text">{errorMessages.password}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="form-group">
                                        <label className="form-label">Nhập Lại Mật Khẩu</label>
                                        <div className={`form-input-wrapper ${errors.confirmPassword ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.confirmPassword ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <LockOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={formData.confirmPassword}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                                                    placeholder="Nhập lại mật khẩu"
                                                    className={`form-input form-input-password ${errors.confirmPassword ? 'form-input-error-border' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="form-input-toggle"
                                                >
                                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="form-error-text">{errorMessages.confirmPassword}</p>
                                        )}
                                    </div>

                                    {/* Terms Checkbox */}
                                    <div className="form-group">
                                        <label className={`form-checkbox-label ${errors.agreeTerms ? 'checkbox-error' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.agreeTerms}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('agreeTerms', e.target.checked)}
                                                className="form-checkbox"
                                            />
                                            <span className="checkbox-text">
                                                Tôi đồng ý với <a href="#" className="terms-link">Điều khoản</a> & <a href="#" className="terms-link">Chính sách</a>
                                            </span>
                                        </label>
                                        {errors.agreeTerms && (
                                            <p className="form-error-text">{errorMessages.agreeTerms}</p>
                                        )}
                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="register-submit-btn"
                                    >
                                        <div className="submit-btn-gradient"></div>
                                        <div className="submit-btn-content">
                                            {isLoading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    <span>Đang đăng ký...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Đăng Ký</span>
                                                    <svg className="submit-btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>

                                {/* Footer */}
                                <div className="register-card-footer">
                                    <p className="footer-text">
                                        Đã có tài khoản?{' '}
                                        <button
                                            type="button"
                                            className="login-link"
                                            onClick={() => navigate('/login')}
                                        >
                                            Đăng nhập ngay
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

export default RegisterPage;