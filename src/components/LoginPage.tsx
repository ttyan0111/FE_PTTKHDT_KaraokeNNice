import React from 'react';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, AudioOutlined, FacebookFilled } from '@ant-design/icons';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

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
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<FormData>({ userId: '', password: '' });
    const [errors, setErrors] = React.useState<Errors>({ userId: false, password: false });
    const [rememberMe, setRememberMe] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        const newErrors: Errors = {
            userId: !formData.userId,
            password: !formData.password
        };
        setErrors(newErrors);

        if (!newErrors.userId && !newErrors.password) {
            setTimeout(() => {
                alert('Login successful! 🎤');
                setIsLoading(false);
            }, 1500);
        } else {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
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
                                    <h3 className="login-title">Welcome Back!</h3>
                                    <p className="login-subtitle">Please sign in to continue</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="login-form">
                                    {/* User ID Input */}
                                    <div className="form-group">
                                        <label className="form-label">Phone / User ID</label>
                                        <div className={`form-input-wrapper ${errors.userId ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.userId ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <UserOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type="text"
                                                    value={formData.userId}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('userId', e.target.value)}
                                                    placeholder="Enter your phone or user ID"
                                                    className={`form-input ${errors.userId ? 'form-input-error-border' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        {errors.userId && (
                                            <p className="form-error-text">This field is required</p>
                                        )}
                                    </div>

                                    {/* Password Input */}
                                    <div className="form-group">
                                        <label className="form-label">Password</label>
                                        <div className={`form-input-wrapper ${errors.password ? 'form-error' : ''}`}>
                                            <div className={`form-input-glow ${errors.password ? 'form-input-glow-error' : ''}`}></div>
                                            <div className="form-input-inner">
                                                <LockOutlined style={{ position: 'absolute', left: '16px', color: '#c084fc', fontSize: '16px' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                                                    placeholder="Enter your password"
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
                                            <p className="form-error-text">This field is required</p>
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
                                            <span className="checkbox-text">Remember me</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="forgot-password-btn"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    {/* Sign In Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="login-submit-btn"
                                    >
                                        <div className="submit-btn-gradient"></div>
                                        <div className="submit-btn-content">
                                            {isLoading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    <span>Signing in...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Sign In</span>
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
                                    <span className="divider-text">Or login with</span>
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
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            className="signup-link"
                                            onClick={() => navigate('/register')}
                                        >
                                            Sign up
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
