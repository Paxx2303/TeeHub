import React, { useState } from "react";
import "./AuthPage.css";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e, type) => {
    e.preventDefault();
    alert(type === "login" ? "🎉 Đăng nhập thành công!" : "🎉 Đăng ký thành công!");
  };

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="animated-background">
        <div className="bg-element"></div>
        <div className="bg-element"></div>
        <div className="bg-element"></div>
        <div className="bg-element"></div>
      </div>

      <div className="auth-wrapper">
        {/* Brand Panel */}
        <div className="brand-panel">
          <div className="brand-logo">TeeHub</div>
          <div className="brand-tagline">
            Khám phá bộ sưu tập áo thun premium <br />
            Phong cách - Chất lượng - Đẳng cấp
          </div>
          <ul className="brand-features">
            <li>Chất liệu cotton 100% cao cấp</li>
            <li>Thiết kế độc quyền & trendy</li>
            <li>Miễn phí ship toàn quốc</li>
            <li>Đổi trả trong 30 ngày</li>
            <li>Hỗ trợ 24/7</li>
          </ul>
        </div>

        {/* Auth Panel */}
        <div className="auth-panel">
          <div className="auth-header">
            <h1 className="auth-title">
              {activeTab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h1>
            <p className="auth-subtitle">
              {activeTab === "login"
                ? "Đăng nhập để khám phá thế giới thời trang"
                : "Tham gia cộng đồng thời trang TeeHub"}
            </p>
          </div>

          {/* Tabs */}
          <div className="tab-container">
            <div
              className={`tab-slider ${activeTab === "register" ? "register" : ""}`}
            ></div>
            <button
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Đăng nhập
            </button>
            <button
              className={`tab-button ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Đăng ký
            </button>
          </div>

          <div className="form-container">
            {/* Login Form */}
            {activeTab === "login" && (
              <div className="form-content active">
                <form onSubmit={(e) => handleSubmit(e, "login")}>
                  <div className="input-group">
                    <label className="input-label">Email hoặc Số điện thoại</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Nhập email hoặc số điện thoại"
                        required
                      />
                      <span className="input-icon">👤</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Mật khẩu</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field"
                        placeholder="Nhập mật khẩu"
                        required
                      />
                      <span className="input-icon">🔒</span>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="forgot-link">
                    <a href="#">Quên mật khẩu?</a>
                  </div>

                  <button type="submit" className="submit-button">
                    <span>Đăng nhập</span>
                  </button>
                </form>

                <div className="divider">
                  <span>Hoặc tiếp tục với</span>
                </div>

                <div className="social-grid">
                  <button className="social-button">
                    <span style={{ color: "#1877f2" }}>📘</span> Facebook
                  </button>
                  <button className="social-button">
                    <span style={{ color: "#ea4335" }}>🔍</span> Google
                  </button>
                </div>
              </div>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <div className="form-content active">
                <form onSubmit={(e) => handleSubmit(e, "register")}>
                  <div className="input-group">
                    <label className="input-label">Họ và tên</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Nhập họ và tên đầy đủ"
                        required
                      />
                      <span className="input-icon">👤</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="input-field"
                        placeholder="Nhập địa chỉ email"
                        required
                      />
                      <span className="input-icon">📧</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Mật khẩu</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field"
                        placeholder="Tạo mật khẩu mạnh"
                        required
                      />
                      <span className="input-icon">🔒</span>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Xác nhận mật khẩu</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field"
                        placeholder="Nhập lại mật khẩu"
                        required
                      />
                      <span className="input-icon">🔒</span>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="checkbox-wrapper">
                    <label className="custom-checkbox">
                      <input type="checkbox" required />
                      <span className="checkmark"></span>
                    </label>
                    <div className="checkbox-label">
                      Tôi đồng ý với{" "}
                      <a href="#">Điều khoản sử dụng</a> và{" "}
                      <a href="#">Chính sách bảo mật</a> của TeeHub
                    </div>
                  </div>

                  <button type="submit" className="submit-button">
                    <span>Tạo tài khoản</span>
                  </button>
                </form>

                <div className="divider">
                  <span>Hoặc đăng ký với</span>
                </div>

                <div className="social-grid">
                  <button className="social-button">
                    <span style={{ color: "#1877f2" }}>📘</span> Facebook
                  </button>
                  <button className="social-button">
                    <span style={{ color: "#ea4335" }}>🔍</span> Google
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}