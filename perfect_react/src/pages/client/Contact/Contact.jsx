import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Giả lập gửi form
        setTimeout(() => {
            setSubmitStatus('success');
            setIsSubmitting(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1500);
    };

    return (
        <div className={styles.contactContainer}>
            <div className={styles.contactWrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Liên Hệ Với Chúng Tôi</h1>
                    <p className={styles.subtitle}>
                        Bạn có câu hỏi về dịch vụ thử đồ AI hoặc thiết kế áo theo sở thích?
                        Hãy liên hệ với chúng tôi!
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    {/* Contact Info */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <h2 className={styles.infoTitle}>Thông Tin Liên Hệ</h2>

                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <span className={styles.icon}>📞</span>
                                </div>
                                <div>
                                    <h3 className={styles.infoLabel}>Điện thoại</h3>
                                    <p className={styles.infoText}>0123 456 789</p>
                                    <p className={styles.infoText}>0987 654 321</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <span className={styles.icon}>✉️</span>
                                </div>
                                <div>
                                    <h3 className={styles.infoLabel}>Email</h3>
                                    <p className={styles.infoText}>contact@aophong.vn</p>
                                    <p className={styles.infoText}>support@aophong.vn</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <span className={styles.icon}>📍</span>
                                </div>
                                <div>
                                    <h3 className={styles.infoLabel}>Địa chỉ</h3>
                                    <p className={styles.infoText}>
                                        123 Đường Nguyễn Huệ<br />
                                        Quận 1, TP. Hồ Chí Minh
                                    </p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <span className={styles.icon}>⏰</span>
                                </div>
                                <div>
                                    <h3 className={styles.infoLabel}>Giờ làm việc</h3>
                                    <p className={styles.infoText}>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                                    <p className={styles.infoText}>Thứ 7 - CN: 9:00 - 17:00</p>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className={styles.featuresCard}>
                            <h3 className={styles.featuresTitle}>Dịch Vụ Của Chúng Tôi</h3>
                            <ul className={styles.featuresList}>
                                <li className={styles.featureItem}>
                                    <span className={styles.checkmark}>✓</span>
                                    Thử đồ ảo với công nghệ AI
                                </li>
                                <li className={styles.featureItem}>
                                    <span className={styles.checkmark}>✓</span>
                                    Thiết kế áo theo sở thích
                                </li>
                                <li className={styles.featureItem}>
                                    <span className={styles.checkmark}>✓</span>
                                    Tư vấn phong cách miễn phí
                                </li>
                                <li className={styles.featureItem}>
                                    <span className={styles.checkmark}>✓</span>
                                    Giao hàng toàn quốc
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={styles.formSection}>
                        <div className={styles.formCard}>
                            <h2 className={styles.formTitle}>Gửi Tin Nhắn</h2>

                            {submitStatus === 'success' && (
                                <div className={styles.successMessage}>
                                    <span className={styles.successIcon}>✓</span>
                                    Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>
                                        Họ và tên <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Nhập họ và tên của bạn"
                                        required
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email" className={styles.label}>
                                            Email <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone" className={styles.label}>
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="0123 456 789"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subject" className={styles.label}>
                                        Chủ đề <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={styles.select}
                                        required
                                    >
                                        <option value="">Chọn chủ đề</option>
                                        <option value="ai-tryon">Thử đồ AI</option>
                                        <option value="custom-design">Thiết kế theo yêu cầu</option>
                                        <option value="order">Đặt hàng</option>
                                        <option value="support">Hỗ trợ kỹ thuật</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message" className={styles.label}>
                                        Tin nhắn <span className={styles.required}>*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={styles.textarea}
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                        rows="6"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.btnIcon}>📤</span>
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}