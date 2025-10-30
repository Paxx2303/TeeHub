import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { MOCK_PRODUCTS } from '../../../services/mockProducts';
import styles from './Products.module.css';

const Products = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProducts();
        if (!isMounted) return;
        const data = response?.data || response;
        const list = Array.isArray(data) ? data : (data?.items || []);
        setItems(list && list.length ? list : MOCK_PRODUCTS);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'Không thể tải danh sách sản phẩm');
        setItems(MOCK_PRODUCTS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, []);
=======
import ReactPaginate from 'react-paginate';
import styles from './Products.module.css';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService'; 

const ITEMS_PER_PAGE = 8; // Số sản phẩm mỗi trang

const SORT_OPTIONS = [
  { id: 'newest', label: 'Sản phẩm mới nhất', icon: '🆕' }, 
  { id: 'price-desc', label: 'Giá cao đến thấp', icon: '💰' }, 
  { id: 'price-asc', label: 'Giá thấp đến cao', icon: '💵' }, 
  { id: 'best-selling', label: 'Bán chạy nhất', icon: '🔥' }, 
];

function Product() {
  // State cho sản phẩm và phân trang
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // State cho danh mục
  const [categories, setCategories] = useState([]); // Lưu danh mục từ API
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading riêng cho danh mục
  const [selectedCategory, setSelectedCategory] = useState('all'); // ID của danh mục đang chọn ('all' là mặc định)
  const [totalProductCount, setTotalProductCount] = useState(0); // State mới để lưu tổng số sản phẩm

  // State cho sắp xếp
  const [selectedSort, setSelectedSort] = useState('newest'); // Giá trị sort mặc định
  const [isSortOpen, setIsSortOpen] = useState(false); // Trạng thái đóng/mở dropdown sort

// Products.jsx (Chỉ phần useEffect tải danh mục)

// ... (các hàm và state khác giữ nguyên) ...

// Hàm trợ giúp để trích xuất mảng danh mục an toàn
const extractCategoryArray = (rawResponse) => {
    // 1. Nếu rawResponse là null/undefined, trả về mảng rỗng
    if (!rawResponse) {
        return [];
    }
    
    // 2. Nếu đã là mảng, trả về luôn
    if (Array.isArray(rawResponse)) {
        return rawResponse;
    }
    
    // 3. Nếu là đối tượng phân trang, trích xuất từ trường 'content' hoặc 'data'
    if (rawResponse.content && Array.isArray(rawResponse.content)) {
        return rawResponse.content;
    }
    if (rawResponse.data && Array.isArray(rawResponse.data)) {
        return rawResponse.data;
    }
    
    // 4. Mọi thứ khác đều là lỗi, trả về mảng rỗng an toàn
    console.error("Dữ liệu danh mục không có cấu trúc mảng hợp lệ.", rawResponse);
    return [];
};


  // --- Effect 1: Tải danh sách danh mục ---
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        // Lấy dữ liệu thô (có thể là null, object, hoặc array)
        const rawResponse = await categoryService.getAllCategories(); 
        
        // CHỈ SỬ DỤNG HÀM TRỢ GIÚP ĐỂ ĐẢM BẢO categoryData LÀ MẢNG
        const categoryData = extractCategoryArray(rawResponse); 


        // Tính tổng số sản phẩm (an toàn hơn: sử dụng 0 nếu productCount không tồn tại)
        // Lỗi reduce không thể xảy ra ở đây vì categoryData đã được đảm bảo là mảng
        const totalCount = categoryData.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
        setTotalProductCount(totalCount); 

        // Tạo mục "Tất cả"
        const allCategory = {
          categoryId: 'all',
          categoryName: 'Tất cả sản phẩm',
          productCount: totalCount 
        };

        // Gộp và cập nhật state
        const finalCategories = [allCategory, ...categoryData];
        console.log("Danh mục đã tải thành công (Tổng số: " + finalCategories.length + ")", finalCategories); 
        setCategories(finalCategories); 

      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải danh mục sản phẩm.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
-
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setError(null); 
        const data = await productService.getAllProducts(
          currentPage,        // Trang hiện tại (từ state)
          ITEMS_PER_PAGE,     // Số lượng mỗi trang (hằng số)
          selectedCategory,   // ID danh mục đang chọn (từ state)
          null,               // Không dùng searchTerm ở đây
          selectedSort        // Kiểu sắp xếp đang chọn (từ state)
        );
        console.log("DỮ LIỆU THÔ TỪ API SẢN PHẨM:", data);
        // // Log dữ liệu nhận về
        // console.log('Received product data:', data);
        // Cập nhật state sản phẩm và thông tin phân trang từ kết quả API
        setProducts(Array.isArray(data.content) ? data.content : []);
        setPageCount(data.totalPages); // `data.totalPages` là tổng số trang

      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err); // Log lỗi chi tiết
        setError(err.message || "Không thể tải danh sách sản phẩm."); // Hiển thị lỗi
      } finally {
        setLoadingProducts(false); // Kết thúc loading sản phẩm
      }
    };

    // Chỉ gọi API tải sản phẩm KHI danh mục đã được tải xong
    // (Điều này tránh gọi API với `selectedCategory` chưa đúng lúc đầu)
    if (!loadingCategories) {
      fetchProducts();
    }
    // Effect này sẽ chạy lại mỗi khi một trong các giá trị sau thay đổi:
    // currentPage, selectedCategory, selectedSort, loadingCategories
  }, [currentPage, selectedCategory, selectedSort, loadingCategories]);

  // --- Hàm xử lý sự kiện click vào trang (Pagination) ---
  const handlePageClick = (event) => {
    // `event.selected` là chỉ số của trang được click (bắt đầu từ 0)
    setCurrentPage(event.selected);
    // Cuộn lên đầu trang một cách mượt mà
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Hàm xử lý sự kiện click vào danh mục (Sidebar) ---
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId); // Cập nhật state danh mục đang chọn
    setCurrentPage(0); // Luôn quay về trang đầu tiên khi đổi danh mục
  };

  // --- Hàm xử lý sự kiện thay đổi sắp xếp (Dropdown) ---
  const handleSortChange = (sortId) => {
    setSelectedSort(sortId); // Cập nhật state sắp xếp đang chọn
    setCurrentPage(0); // Luôn quay về trang đầu tiên khi đổi sắp xếp
    setIsSortOpen(false); // Đóng dropdown sau khi chọn
  };

  // Tìm đối tượng sort option hiện tại để hiển thị label và icon
  const currentSortOption = SORT_OPTIONS.find(opt => opt.id === selectedSort) || SORT_OPTIONS[0];

  // --- Render ---

  // Hiển thị lỗi nếu có
  if (error && !loadingProducts && !loadingCategories) { // Chỉ hiển thị lỗi nếu không đang loading
    return <p>Lỗi: {error}</p>;
  }
>>>>>>> origin/tan

  return (
    <div className={styles.products}>
      <div className={styles.container}>
<<<<<<< HEAD
        <h1 className={styles.title}>Sản phẩm</h1>
        <p className={styles.description}>
          Khám phá bộ sưu tập áo thun đa dạng của chúng tôi
        </p>
        {isLoading && <p>Đang tải...</p>}
        {error && <p style={{ color: '#d00' }}>{error}</p>}
        {!isLoading && !error && (
          <div className={styles.grid}>
            {items.map((p) => (
              <div key={p.id} className={styles.card}>
                {p.image ? (
                  <img className={styles.thumb} src={p.image} alt={p.name || p.title} />
                ) : (
                  <div className={styles.thumb} />
                )}
                <div className={styles.cardBody}>
                  <div className={styles.name}>{p.name || p.title}</div>
                  {p.price != null && (
                    <div className={styles.price}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                    </div>
                  )}
                  <div className={styles.actions}>
                    <Link className={styles.linkBtn} to={`/products/${p.id}`}>Xem chi tiết</Link>
                    <Link className={`${styles.linkBtn} ${styles.secondaryBtn}`} to={`/products/${p.id}`}>Mua ngay</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
=======
        <div className={styles.contentWrapper}>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            {/* DANH MỤC SẢN PHẨM */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Danh mục sản phẩm</h3>
              {/* Hiển thị "Loading..." nếu danh mục chưa tải xong */}
              {loadingCategories ? <p>Đang tải danh mục...</p> : (
                <ul className={styles.categoryList}>
                  {categories.map((category) => (
                    <li
                      key={category.categoryId}
                      className={`${styles.categoryItem} ${selectedCategory === category.categoryId ? styles.categoryActive : ''}`}
                      onClick={() => handleCategoryClick(category.categoryId)}
                    >
                      <span className={styles.categoryName}>{category.categoryName}</span>
                      {/* === HIỂN THỊ SỐ LƯỢNG === */}
                      {/* Kiểm tra xem productCount có tồn tại và > 0 không */}
                      {category.productCount != null && category.productCount >= 0 && (
                        <span className={styles.categoryCount}>{category.productCount}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SẮP XẾP THEO (Custom Dropdown) */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Sắp xếp theo</h3>
              <div className={styles.customDropdown}>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setIsSortOpen(!isSortOpen)} // Đóng/mở dropdown
                >
                  <span className={styles.dropdownLabel}>
                    <span className={styles.dropdownIcon}>{currentSortOption.icon}</span>
                    {currentSortOption.label}
                  </span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>

                {isSortOpen && ( // Chỉ hiển thị menu nếu isSortOpen là true
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownArrowUp}></div>
                    {SORT_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.dropdownItem} ${selectedSort === option.id ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleSortChange(option.id)} // Gọi handler khi chọn
                      >
                        <span className={styles.dropdownIcon}>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* PRODUCTS CONTAINER */}
          <div className={styles.productsContainer}>
            <h1 className={styles.title}>Our Products</h1>
            <p className={styles.description}>
              Discover our amazing collection of products
            </p>

            {/* Hiển thị Loading hoặc danh sách sản phẩm */}
            {loadingProducts ? (
              <p className={styles.loadingText}>Đang tải sản phẩm...</p>
            ) : (
              <>
                {/* Hiển thị nếu không tìm thấy sản phẩm */}
                {products.length === 0 && !loadingProducts && (
                  <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                )}
                {/* Grid chứa các card sản phẩm */}
                <div className={styles.grid}>
                  {products.map((product) => (
                    <div key={product.productId} className={styles.card}>
                      <img
                        src={`/Product/${product.productMainImage}`} // Đường dẫn ảnh đúng
                        alt={product.productName}
                        className={styles.thumb}
                      />
                      <div className={styles.cardBody}>
                        <h2 className={styles.name}>{product.productName}</h2>
                        <p>{product.productDescription}</p>
                        <p>Category: {product.category?.categoryName}</p>
                        <p className={styles.price}>
                          {/* Hiển thị giá item đầu tiên (hoặc thông báo nếu không có) */}
                          {product.items && product.items.length > 0
                            ? `$${product.items[0]?.price}`
                            : 'Liên hệ'}
                        </p>
                        <div className={styles.actions}>
                          {/* Link đến trang chi tiết */}
                          <a href={`/products/${product.productId}`} className={styles.linkBtn}>
                            View Details
                          </a>
                          {/* Nút Add to Cart (chưa có logic) */}
                          <a href="#" className={`${styles.linkBtn} ${styles.secondaryBtn}`}>
                            Add to Cart
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {/* Chỉ hiển thị pagination nếu có nhiều hơn 1 trang VÀ không đang loading */}
                {pageCount > 1 && !loadingProducts && (
                  <ReactPaginate
                    previousLabel={'< Previous'}
                    nextLabel={'Next >'}
                    breakLabel={'...'}
                    pageCount={pageCount} // Tổng số trang từ API
                    marginPagesDisplayed={2} // Số trang hiển thị ở đầu/cuối
                    pageRangeDisplayed={3} // Số trang hiển thị ở giữa
                    onPageChange={handlePageClick} // Hàm gọi khi click trang
                    forcePage={currentPage} // Đồng bộ trang hiện tại với state

                    // --- SỬ DỤNG LẠI CLASS TỪ CODE CŨ CỦA BẠN ---
                    containerClassName={styles.paginationContainer}
                    pageClassName={styles.paginationPage}         // Class cho <li> chứa số trang
                    pageLinkClassName={styles.paginationLink}       // Class cho <a> chứa số trang
                    previousClassName={styles.paginationPrevious}   // Class cho <li> nút Previous
                    previousLinkClassName={styles.paginationLink}   // Class cho <a> nút Previous
                    nextClassName={styles.paginationNext}           // Class cho <li> nút Next
                    nextLinkClassName={styles.paginationLink}       // Class cho <a> nút Next
                    breakClassName={styles.paginationBreak}         // Class cho <li> dấu "..."
                    breakLinkClassName={styles.paginationLink}      // Class cho <a> dấu "..."
                    activeClassName={styles.paginationActive}       // Class cho <li> trang hiện tại
                    disabledClassName={styles.paginationDisabled}   // Class cho <li> nút Previous/Next bị vô hiệu hóa
                    // --- HẾT PHẦN CLASS ---
                    renderOnZeroPageCount={null} // Không render gì nếu pageCount = 0
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
>>>>>>> origin/tan
