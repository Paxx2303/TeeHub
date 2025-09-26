import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUpload, FiDownload, FiRefreshCw, FiSettings, FiClock } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { uploadImage, processTryOn, generateVariations } from '../../../store/slices/aiTryOnSlice';
import { AI_TRY_ON_STATUS } from '../../../utils/constants';
import styles from './AITryOn.module.css';

const AITryOn = () => {
  const dispatch = useDispatch();
  const { userImage, productImage, resultImage, variations, status, progress, error, history } = useSelector(
    (state) => state.aiTryOn
  );

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fileInputRef = useRef(null);

  // Sample products for demonstration
  const sampleProducts = [
    {
      id: 1,
      name: 'Áo thun cơ bản',
      image: '/images/products/basic-tshirt.jpg',
      price: 299000,
    },
    {
      id: 2,
      name: 'Áo thun polo',
      image: '/images/products/polo-tshirt.jpg',
      price: 399000,
    },
    {
      id: 3,
      name: 'Áo thun oversize',
      image: '/images/products/oversize-tshirt.jpg',
      price: 349000,
    },
  ];

  const onUserImageDrop = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        dispatch(uploadImage(file));
      }
    }
  });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    // In a real app, you would load the product image here
    // dispatch(setProductImage(product.image));
  };

  const handleTryOn = () => {
    if (userImage && selectedProduct) {
      dispatch(processTryOn({
        userImage,
        productImage: selectedProduct.image,
        productId: selectedProduct.id,
      }));
    }
  };

  const handleGenerateVariations = () => {
    if (resultImage) {
      dispatch(generateVariations({
        baseImage: resultImage,
        variations: ['different_angles', 'different_lighting', 'different_backgrounds']
      }));
    }
  };

  const handleDownload = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isProcessing = status === AI_TRY_ON_STATUS.PROCESSING;
  const isCompleted = status === AI_TRY_ON_STATUS.COMPLETED;

  return (
    <div className={styles.aiTryOn}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Thử đồ AI</h1>
          <p className={styles.description}>
            Tải ảnh của bạn lên và thử các sản phẩm áo thun với công nghệ AI tiên tiến
          </p>
        </div>

        <div className={styles.content}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}>1. Tải ảnh của bạn</h2>
            <div
              {...onUserImageDrop.getRootProps()}
              className={`${styles.uploadArea} ${userImage ? styles.uploaded : ''}`}
            >
              <input {...onUserImageDrop.getInputProps()} />
              {userImage ? (
                <div className={styles.uploadedImage}>
                  <img src={userImage} alt="Uploaded user" className={styles.userImage} />
                  <div className={styles.uploadActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiUpload />
                      Thay đổi ảnh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiUpload size={48} className={styles.uploadIcon} />
                  <p className={styles.uploadText}>
                    Kéo thả ảnh của bạn vào đây hoặc click để chọn
                  </p>
                  <p className={styles.uploadHint}>
                    Hỗ trợ: JPG, PNG, WebP (tối đa 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div className={styles.productSection}>
            <h2 className={styles.sectionTitle}>2. Chọn sản phẩm</h2>
            <div className={styles.productGrid}>
              {sampleProducts.map((product) => (
                <div
                  key={product.id}
                  className={`${styles.productCard} ${selectedProduct?.id === product.id ? styles.selected : ''
                    }`}
                  onClick={() => handleProductSelect(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Try On Button */}
          <div className={styles.actionSection}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleTryOn}
              disabled={!userImage || !selectedProduct || isProcessing}
              loading={isProcessing}
              fullWidth
            >
              {isProcessing ? 'Đang xử lý...' : 'Thử đồ ngay'}
            </Button>

            {isProcessing && (
              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className={styles.progressText}>
                  Đang xử lý ảnh... {progress}%
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {isCompleted && resultImage && (
            <div className={styles.resultsSection}>
              <h2 className={styles.sectionTitle}>Kết quả thử đồ</h2>
              <div className={styles.resultContainer}>
                <div className={styles.resultImage}>
                  <img src={resultImage} alt="AI Try-on Result" className={styles.resultImg} />
                  <div className={styles.resultActions}>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(resultImage, 'ai-try-on-result.jpg')}
                    >
                      <FiDownload />
                      Tải xuống
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleGenerateVariations}
                    >
                      <FiRefreshCw />
                      Tạo biến thể
                    </Button>
                  </div>
                </div>
              </div>

              {/* Variations */}
              {variations.length > 0 && (
                <div className={styles.variationsSection}>
                  <h3 className={styles.variationsTitle}>Biến thể khác</h3>
                  <div className={styles.variationsGrid}>
                    {variations.map((variation, index) => (
                      <div key={index} className={styles.variationCard}>
                        <img
                          src={variation.image}
                          alt={`Variation ${index + 1}`}
                          className={styles.variationImage}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(variation.image, `variation-${index + 1}.jpg`)}
                        >
                          <FiDownload />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className={styles.errorSection}>
              <p className={styles.errorText}>{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Button
            variant="ghost"
            onClick={() => setShowHistory(true)}
            disabled={history.length === 0}
          >
            <FiClock />
            Lịch sử
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowSettings(true)}
          >
            <FiSettings />
            Cài đặt
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Cài đặt AI"
        size="md"
      >
        <div className={styles.settingsContent}>
          <p>Đây là nơi bạn có thể cấu hình các tùy chọn AI như chất lượng, phong cách, v.v.</p>
          {/* Settings form would go here */}
        </div>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="Lịch sử thử đồ"
        size="lg"
      >
        <div className={styles.historyContent}>
          {history.length === 0 ? (
            <p>Chưa có lịch sử thử đồ nào.</p>
          ) : (
            <div className={styles.historyGrid}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <img
                    src={item.resultImage}
                    alt="History result"
                    className={styles.historyImage}
                  />
                  <div className={styles.historyInfo}>
                    <p className={styles.historyDate}>
                      {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(item.resultImage, `history-${item.id}.jpg`)}
                    >
                      <FiDownload />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AITryOn;
