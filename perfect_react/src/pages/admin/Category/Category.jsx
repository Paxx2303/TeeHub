import React, { useState, useEffect, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Category.module.css';
import { categoryService } from '../../../services/categoryService';
import { promotionService } from '../../../services/promotionService';

const ITEMS_PER_PAGE = 10;
const getInitialPromoForm = () => ({
  promotionId: null, // Dùng để biết là Sửa hay Thêm
  name: '',
  description: '',
  discountRate: '',
  startDate: '',
  endDate: ''
});
const INITIAL_PROMO_STATE = {
  promotionId: null, // SỬA TỪ 'id' THÀNH 'promotionId'
  name: '',
  description: '',
  discountRate: '',
  startDate: '',
  endDate: '',
  productCategoryId: null
};
function Category() {
  // State cho categories và phân trang
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // State cho modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // State cho form
  const [formData, setFormData] = useState({
    categoryName: ''

  });

  //state cho khuyến mãi
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionFormData, setPromotionFormData] = useState(INITIAL_PROMO_STATE);
  const [currentCategory, setCurrentCategory] = useState(null); // Lưu category đang được chọn
  const [loadingPromo, setLoadingPromo] = useState(false); // Loading riêng cho modal KM

  const [editingCategory, setEditingCategory] = useState(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await categoryService.getAllCategories(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearchTerm
      );

      setCategories(data.content || data);
      setPageCount(data.totalPages || 1);

    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      setError(err.message || "Không thể tải danh sách danh mục.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handlers
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCategory(null);
    setFormData({
      categoryName: ''
    });
  };

  const handleAddCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await categoryService.createCategory(formData);

      alert('Thêm danh mục thành công!');
      handleCloseModal();
      fetchCategories();

    } catch (err) {
      alert(`Lỗi khi thêm danh mục: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName
    });
    setShowEditModal(true);
  };

  const handleEditCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await categoryService.updateCategory(editingCategory.categoryId, formData);

      alert('Cập nhật danh mục thành công!');
      handleCloseModal();
      fetchCategories();

    } catch (err) {
      alert(`Lỗi khi cập nhật danh mục: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}" (ID: ${categoryId})?`)) {
      try {
        setLoading(true);
        await categoryService.deleteCategory(categoryId);
        alert(`Đã xóa danh mục ${categoryId} thành công!`);
        fetchCategories();
      } catch (err) {
        alert(`Xóa danh mục thất bại: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  //handle khuyến mãi
  // Mở Modal Khuyến mãi
  const handleOpenPromotionModal = async (category) => {
    setCurrentCategory(category); // Lưu category đang thao tác
    setLoadingPromo(true);
    setShowPromotionModal(true);

    try {
      // Gọi API mới để tìm KM
      const promoData = await promotionService.getPromotionByCategoryId(category.categoryId);
      // Nếu tìm thấy, điền form
      setPromotionFormData({
        promotionId: promoData.promotionId,
        name: promoData.name || '',
        description: promoData.description || '',
        discountRate: promoData.discountRate || '',
        startDate: promoData.startDate || '',
        endDate: promoData.endDate || ''
      });
    } catch (err) {
      // Lỗi 404 (Không tìm thấy) nghĩa là "Chưa có KM" -> Mở form rỗng
      if (err.response && err.response.status === 404) {
        setPromotionFormData({
          ...INITIAL_PROMO_STATE, // Dùng state chuẩn
          productCategoryId: category.categoryId
        });
      } else {
        setError(err.message || "Lỗi khi tải dữ liệu khuyến mãi.");
        handleClosePromotionModal(); // Đóng modal nếu có lỗi lạ
      }
    } finally {
      setLoadingPromo(false);
    }
  };

  // Đóng Modal Khuyến mãi
  const handleClosePromotionModal = () => {
    setShowPromotionModal(false);
    setPromotionFormData(INITIAL_PROMO_STATE); // <-- THÊM DÒNG NÀY ĐỂ RESET FORM
    setCurrentCategory(null); // Cũng nên reset category đang chọn
  };

  // Thay đổi input trong Form KM
  const handlePromoFormChange = (e) => {
    const { name, value } = e.target;
    setPromotionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Form Khuyến mãi (Tạo mới hoặc Cập nhật)
  const handlePromotionSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...promotionFormData,
      categoryId: currentCategory.categoryId // Gắn categoryId vào data gửi đi
    };

    try {
      if (promotionFormData.promotionId) {
        // Cập nhật (Update)
        await promotionService.updatePromotion(promotionFormData.promotionId, payload);
        alert('Cập nhật khuyến mãi thành công!');
      } else {
        // Tạo mới (Create)
        await promotionService.createPromotion(payload);
        alert('Tạo khuyến mãi thành công!');
      }
      handleClosePromotionModal();
    } catch (err) {
      // Bắt lỗi 409 (Conflict) nếu backend đã ném
      if (err.response && err.response.status === 409) {
        alert('Lỗi: Danh mục này đã có khuyến mãi. Vui lòng xóa KM cũ trước khi thêm.');
      } else {
        alert(`Lỗi: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xóa Khuyến mãi
  const handleDeletePromotion = async () => {
    if (!promotionFormData.promotionId) return;

    if (window.confirm(`Bạn có chắc chắn muốn XÓA khuyến mãi "${promotionFormData.name}"?`)) {
      try {
        setLoading(true);
        await promotionService.deletePromotion(promotionFormData.promotionId);
        alert('Đã xóa khuyến mãi thành công!');
        handleClosePromotionModal();
      } catch (err) {
        alert(`Lỗi khi xóa: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.categories}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý danh mục</h1>
        <p className={styles.pageSubtitle}>Thêm, chỉnh sửa và quản lý danh mục sản phẩm</p>
      </div>

      {/* Filters and actions */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm theo tên danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            ➕ Thêm danh mục
          </button>
          <button className={styles.exportBtn}>📊 Xuất báo cáo</button>
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {error && <p className={styles.errorText}>Lỗi: {error}</p>}

      {/* Categories table */}
      <div className={styles.tableContainer}>
        <table className={styles.categoryTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>

              <th>Số lượng sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className={styles.loadingText}>Đang tải danh mục...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="4" className={styles.noDataText}>Không tìm thấy danh mục nào.</td></tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.categoryId}>
                  <td className={styles.categoryId}>{category.categoryId}</td>
                  <td>
                    <div className={styles.categoryName}>{category.categoryName}</div>
                  </td>

                  <td>
                    <span className={styles.productCount}>
                      {category.productCount || 0} sản phẩm
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEditCategory(category)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.promoBtn}`} // Thêm class .promoBtn vào CSS
                        onClick={() => handleOpenPromotionModal(category)}
                        title="Quản lý khuyến mãi"
                      > 🏷️ </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteCategory(category.categoryId, category.categoryName)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {!loading && pageCount > 1 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          forcePage={currentPage}
          containerClassName={styles.paginationContainer}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextClassName={styles.pageItem}
          nextLinkClassName={styles.pageLink}
          breakClassName={styles.pageItem}
          breakLinkClassName={styles.pageLink}
          activeClassName={styles.active}
          disabledClassName={styles.disabled}
          renderOnZeroPageCount={null}
        />
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddCategorySubmit}>
              <div className={styles.modalHeader}>
                <h3>Thêm danh mục mới</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tên danh mục <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>


              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Đang thêm...' : '✓ Thêm danh mục'}
                </button>

                {/* xóa khuyến mãi */}
                {promotionFormData.promotionId && (
                  <button
                    type="button"
                    className={styles.deleteBtn} // Dùng class deleteBtn (giống modal Sửa Category)
                    onClick={handleDeletePromotion} // GỌI ĐÚNG HÀM XÓA
                    disabled={loadingPromo}
                    style={{ marginRight: 'auto' }} // Đẩy nút này sang trái
                  >
                    Xóa KM
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditCategorySubmit}>
              <div className={styles.modalHeader}>
                <h3>Chỉnh sửa danh mục</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tên danh mục <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>


              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Đang cập nhật...' : '✓ Cập nhật danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* === 6. THÊM JSX CHO MODAL KHUYẾN MÃI === */}
      {showPromotionModal && (
        <div className={styles.modalOverlay} onClick={handleClosePromotionModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handlePromotionSubmit}>
              <div className={styles.modalHeader}>
                <h3>Quản lý KM cho: {currentCategory?.categoryName}</h3>
                <button type="button" className={styles.closeBtn} onClick={handleClosePromotionModal}>✕</button>
              </div>

              <div className={styles.modalContent}>
                {loadingPromo ? <p>Đang tải...</p> : (
                  <>
                    {/* Tên Khuyến mãi */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tên KM (ví dụ: Sale 11/11) <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={promotionFormData.name}
                        onChange={handlePromoFormChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    {/* Mô tả */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mô tả</label>
                      <textarea
                        name="description"
                        value={promotionFormData.description}
                        onChange={handlePromoFormChange}
                        className={styles.formTextarea}
                        rows="3"
                      />
                    </div>
                    {/* Tỉ lệ giảm (VD: 20) */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>% Giảm giá (ví dụ: 20) <span className={styles.required}>*</span></label>
                      <input
                        type="number"
                        name="discountRate"
                        value={promotionFormData.discountRate}
                        onChange={handlePromoFormChange}
                        className={styles.formInput}
                        min="0.01" max="100" step="0.01"
                        required
                      />
                    </div>
                    {/* Ngày Bắt đầu */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Ngày bắt đầu <span className={styles.required}>*</span></label>
                      <input
                        type="date"
                        name="startDate"
                        value={promotionFormData.startDate}
                        onChange={handlePromoFormChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    {/* Ngày Kết thúc */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Ngày kết thúc <span className={styles.required}>*</span></label>
                      <input
                        type="date"
                        name="endDate"
                        value={promotionFormData.endDate}
                        onChange={handlePromoFormChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* === PHẦN BỔ SUNG BẮT ĐẦU TỪ ĐÂY === */}
              <div className={styles.modalActions}>

                {/* === 1. NÚT XÓA KHUYẾN MÃI === */}
                {/* Logic: Chỉ hiện nút Xóa nếu KM này đã tồn tại (có promotionId) */}
                {promotionFormData.promotionId && (
                  <button
                    type="button"
                    className={styles.deleteBtn} // Dùng class deleteBtn (giống modal Sửa Category)
                    onClick={handleDeletePromotion} // GỌI ĐÚNG HÀM XÓA
                    disabled={loadingPromo}
                    style={{ marginRight: 'auto' }} // Đẩy nút này sang trái
                  >
                    Xóa KM
                  </button>
                )}
                {/* === HẾT PHẦN NÚT XÓA === */}

                {/* === 2. NÚT HỦY (CANCEL) === */}
                <button
                  type="button"
                  className={styles.cancelBtn} // Dùng class cancelBtn (giống modal Sửa Category)
                  onClick={handleClosePromotionModal} // Nút này chỉ đóng modal
                  disabled={loadingPromo}
                >
                  Hủy
                </button>

                {/* === 3. NÚT SUBMIT (TẠO/CẬP NHẬT) === */}
                <button
                  type="submit"
                  className={styles.submitBtn} // Dùng class submitBtn (giống modal Sửa Category)
                  disabled={loadingPromo}
                >
                  {loadingPromo ? 'Đang xử lý...' : (promotionFormData.promotionId ? '✓ Cập nhật' : '✓ Tạo Khuyến Mãi')}
                </button>
              </div>
              {/* === HẾT PHẦN BỔ SUNG === */}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Category;





