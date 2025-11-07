import React, { useState, useCallback } from 'react';
import { generateTryOnImage } from '../../../services/geminiService';
import ImageUploader from '../../../components/ai-tryon/ImageUploader';
import Spinner from '../../../components/ai-tryon/Spinner';
import styles from './AITryOn.module.css';

const AITryOn = () => {
  const [modelImage, setModelImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTryOn = useCallback(async () => {
    if (!modelImage || !clothingImage) return;

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      console.log('🎨 Starting AI Try-On process...');
      const generatedImageBase64 = await generateTryOnImage(modelImage, clothingImage);
      setResultImage(`data:image/png;base64,${generatedImageBase64}`);
      console.log('✨ Image generated successfully!');
    } catch (err) {
      console.error('❌ Error generating image:', err);
      
      // Hiển thị thông báo lỗi thân thiện
      const errorMsg = err.message || 'Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, clothingImage]);

  const isButtonDisabled = isLoading || !modelImage || !clothingImage;

  return (
    <div className={styles.aiTryOn}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.badge}>
            AI Try-On Studio
          </div>
          <h1 className={styles.title}>
            Thử trang phục thời thượng với AI trong vài giây
          </h1>
          <p className={styles.description}>
            Tải lên ảnh của bạn và sản phẩm yêu thích, hệ thống sẽ dựng nên bức ảnh phối đồ chân thực với kích thước lớn để bạn ngắm nhìn chi tiết.
          </p>
        </header>

        <main className={styles.content}>
          {/* Hàng 1: 2 ảnh upload TO HƠN */}
          <div className={styles.uploadRow}>
            <ImageUploader
              title="Bước 1. Chọn trang phục"
              description="Tải ảnh sản phẩm bạn muốn thử. Ưu tiên ảnh trên nền trắng."
              onImageSelected={setClothingImage}
              inputId="uploadClothing"
            />

            <ImageUploader
              title="Bước 2. Tải ảnh người mẫu"
              description="Tải ảnh người mẫu hoặc ảnh của bạn với ánh sáng tốt."
              onImageSelected={setModelImage}
              inputId="uploadModel"
            />
          </div>

          {/* Hàng 2: Button Tạo Ảnh AI */}
          <div className={styles.createButtonSection}>
            <button
              onClick={handleTryOn}
              disabled={isButtonDisabled}
              className={styles.tryOnButton}
            >
              <span className={styles.buttonContent}>
                {isLoading ? 'Đang xử lý...' : 'TẠO ẢNH'}
              </span>
            </button>
            <p className={styles.buttonHint}>
              💡 Đảm bảo cả hai ảnh đã được tải lên để nhận kết quả chất lượng cao nhất.
            </p>
          </div>

          {/* Hàng 3: Ảnh AI kết quả - TÂM ĐIỂM */}
          <div className={styles.resultSection}>
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.resultHeaderInfo}>
                  <h3>Bước 3 - KẾT QUẢ</h3>
                  <h2>Ảnh AI Try-On</h2>
                  <p>Ảnh phối đồ HD với kích thước lớn để xem rõ mọi chi tiết.</p>
                </div>
                {resultImage && !isLoading && (
                  <span className={styles.hdBadge}>
                    <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    HD QUALITY
                  </span>
                )}
              </div>

              <div className={styles.resultDisplay}>
                {isLoading ? (
                  <div className={styles.loadingContainer}>
                    <Spinner />
                    <p className={styles.loadingText}>AI đang tạo ảnh với chất lượng cao, vui lòng đợi...</p>
                  </div>
                ) : error ? (
                  <div className={styles.errorContainer}>
                    <p className={styles.errorTitle}>Đã xảy ra lỗi</p>
                    <p className={styles.errorMessage}>{error}</p>
                  </div>
                ) : resultImage ? (
                  <img
                    src={resultImage}
                    alt="Kết quả thử đồ AI"
                    className={styles.resultImage}
                  />
                ) : (
                  <div className={styles.emptyState}>
                    <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className={styles.emptyTitle}>Ảnh AI sẽ xuất hiện tại đây</p>
                    <p className={styles.emptyMessage}>Tải 2 ảnh ở trên và nhấn "TẠO ẢNH" để xem kết quả.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className={styles.tipsCard}>
            <div className={styles.tipsContent}>
              <h3 className={styles.tipsTitle}>
                <svg className={styles.tipsIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Mẹo cho kết quả đẹp hơn
              </h3>
              <ul className={styles.tipsList}>
                <li>Ảnh người mẫu nên có tư thế thẳng, ít vật cản phần thân.</li>
                <li>Ảnh trang phục với độ phân giải cao giúp giữ được chất liệu rõ nét.</li>
                <li>Tránh ảnh bị ngược sáng hoặc có quá nhiều chi tiết nền.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AITryOn;
