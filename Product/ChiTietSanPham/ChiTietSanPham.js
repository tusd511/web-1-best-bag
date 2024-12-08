// Các biến toàn cục
let currentProduct; // Lưu sản phẩm đang xem chi tiết
let currentDetailImageIndex = 0; // Chỉ số ảnh đang hiển thị trong slider
const currentUserId = "ID_NGUOI_DUNG"; // ID người dùng tạm thời (hard-code)
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng từ localStorage hoặc tạo mới

// Các hàm xử lý Modal giỏ hàng
function openCartModal() {
  const modal = document.getElementById("cartModal");
  if (!modal) {
    console.error("Không tìm thấy cart modal");
    return;
  }
  modal.style.display = "block";
  document.body.classList.add("modal-open"); // Thêm class để khóa cuộn trang
  renderGioHang(cart, renderItemGioHang, "#cartItems");
}

function closeCartModal() {
  const modal = document.getElementById("cartModal");
  if (!modal) {
    console.error("Không tìm thấy cart modal");
    return;
  }
  modal.style.display = "none";
  document.body.classList.remove("modal-open"); // Xóa class để mở lại cuộn trang
}

// Các hàm xử lý Modal chi tiết sản phẩm
function hienTrangChiTiet(id) {
  const sanPham = timSanPham(id);
  if (!sanPham) {
    console.error("Không tìm thấy sản phẩm với id:", id);
    return;
  }

  currentProduct = sanPham;
  currentDetailImageIndex = 0;

  // Cập nhật thông tin sản phẩm vào modal
  document.getElementById(
    "productDetailImage"
  ).src = `./images/${sanPham["image-file"]}`;
  document.getElementById(
    "productDetailImage2"
  ).src = `./images/${sanPham["image2-file"]}`;
  showDetailImage(0);
  document.getElementById("productDetailName").textContent = sanPham.name;
  document.getElementById(
    "productDetailCategory"
  ).textContent = `Túi ${sanPham.category}`;
  document.getElementById("productDetailDescription").textContent =
    sanPham.description || "Không có mô tả";
  document.getElementById("productDetailOriginalPrice").textContent =
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(sanPham["price-n"]);
  document.getElementById("productDetailSalePrice").textContent =
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(sanPham["price-sale-n"]);

  document.getElementById("productDetailQuantity").value = 1;
  updateDetailTotal();

  // Hiển thị modal
  const modal = document.getElementById("productDetailModal");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
}

function closeProductDetailModal() {
  const modal = document.getElementById("productDetailModal");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

// Các hàm xử lý slider ảnh
function showDetailImage(index) {
  const images = document.querySelectorAll(
    "#productDetailModal .image-slider img"
  );
  images.forEach((img) => img.classList.remove("active"));
  images[index].classList.add("active");
  currentDetailImageIndex = index;
}

function nextDetailImage() {
  const nextIndex = (currentDetailImageIndex + 1) % 2;
  showDetailImage(nextIndex);
}

function prevDetailImage() {
  const prevIndex = currentDetailImageIndex === 0 ? 1 : 0;
  showDetailImage(prevIndex);
}

// Hiển thị sản phẩm trong giỏ hàng
function renderItemGioHang(item, cart) {
  const sanpham = timSanPham(item["san-pham"]);
  if (!sanpham) {
    console.log("Không tìm thấy sản phẩm trong giỏ hàng");
    return;
  }

  const rowCart = document.createElement("div");
  rowCart.style.display = "flex";
  rowCart.style.alignItems = "center";
  rowCart.style.gap = "1rem";
  rowCart.style.marginBottom = "1rem";

  // Thêm hình ảnh
  const hinhAnh = document.createElement("div");
  hinhAnh.style.position = "relative";
  const anhSanPham = document.createElement("img");
  anhSanPham.src = "images/" + sanpham["image-file"];
  anhSanPham.style.width = "100px";
  anhSanPham.style.height = "100px";
  anhSanPham.style.objectFit = "cover";
  anhSanPham.style.borderRadius = "8px";
  anhSanPham.style.border = "1px solid #ddd";
  hinhAnh.appendChild(anhSanPham);
  rowCart.appendChild(hinhAnh);

  // Thêm các thông tin khác
  const ten = document.createElement("div");
  ten.style.flex = "1";
  ten.textContent = sanpham["name"];
  rowCart.appendChild(ten);

  const gia = document.createElement("div");
  gia.style.width = "120px";
  gia.textContent = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(sanpham["price-sale-n"]);
  rowCart.appendChild(gia);

  // Thêm ô nhập số lượng
  const soLuong = document.createElement("div");
  soLuong.style.width = "100px";
  const soLuongChiTiet = document.createElement("input");
  soLuongChiTiet.type = "number";
  soLuongChiTiet.min = 1;
  soLuongChiTiet.max = 100;
  soLuongChiTiet.value = item["so-luong"];
  soLuongChiTiet.addEventListener("input", () => {
    item["so-luong"] = parseInt(soLuongChiTiet.value, 10);
    tong.textContent = (
      sanpham["price-sale-n"] * soLuongChiTiet.value
    ).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    capNhatCart(cart);
    saveCartToLocalStorage();
  });
  soLuong.appendChild(soLuongChiTiet);
  rowCart.appendChild(soLuong);

  // Thêm tổng tiền
  const tong = document.createElement("div");
  tong.style.width = "150px";
  tong.classList.add("total-cost");
  tong.textContent = (
    sanpham["price-sale-n"] * item["so-luong"]
  ).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  rowCart.appendChild(tong);

  // Thêm nút xóa
  const xoa = document.createElement("div");
  xoa.style.width = "50px";
  const xoaKhoiCart = document.createElement("button");
  xoaKhoiCart.type = "button";
  xoaKhoiCart.innerHTML = '<i class="fas fa-trash"></i>';
  xoaKhoiCart.className = "delete-btn";
  xoaKhoiCart.addEventListener("click", () => {
    const index = cart.findIndex((i) => i["san-pham"] === item["san-pham"]);
    if (index !== -1) {
      cart.splice(index, 1);
      capNhatCart(cart);
      saveCartToLocalStorage();
    }
  });
  xoa.appendChild(xoaKhoiCart);
  rowCart.appendChild(xoa);

  return rowCart;
}

// Các hàm quản lý giỏ hàng
function updateDetailTotal() {
  if (!currentProduct) return;

  const quantity = parseInt(
    document.getElementById("productDetailQuantity").value
  );
  const price = parseFloat(currentProduct["price-sale-n"]);
  const total = quantity * price;

  document.getElementById("productDetailTotalPrice").textContent =
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(total);
}

function addToCartFromDetail() {
  if (!currentProduct) {
    console.error("Không tìm thấy thông tin sản phẩm");
    return;
  }

  const productId = currentProduct["web-scraper-order"];
  const quantity =
    parseInt(document.getElementById("productDetailQuantity").value) || 1;

  const existingItem = cart.find((item) => item["san-pham"] === productId);
  if (existingItem) {
    existingItem["so-luong"] += quantity;
  } else {
    cart.push({
      "san-pham": productId,
      "so-luong": quantity,
    });
  }

  saveCartToLocalStorage();
  capNhatCart(cart);
  alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  closeProductDetailModal();
}
// Cập nhật event listener cho window.onclick
window.onclick = function (event) {
  const cartModal = document.getElementById("cartModal");
  const productDetailModal = document.getElementById("productDetailModal");

  if (event.target === cartModal) {
    closeCartModal();
  }
  if (event.target === productDetailModal) {
    closeProductDetailModal();
  }
};
// Lưu giỏ hàng vào localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Cập nhật hiển thị giỏ hàng
function capNhatCart(cart) {
  renderGioHang(cart, renderItemGioHang, "#cartItems");

  const cartCount = document.getElementById("cartItemCount");
  if (cartCount) {
    const totalItems = cart.reduce(
      (total, item) => total + item["so-luong"],
      0
    );
    cartCount.textContent = totalItems;

    // Thêm hiệu ứng highlight khi số lượng thay đổi
    cartCount.classList.add("highlight");
    setTimeout(() => {
      cartCount.classList.remove("highlight");
    }, 300);
  }
}

// Hàm thanh toán (chưa hoàn thiện)
function checkout() {
  alert("Chức năng thanh toán đang được phát triển!");
}

// Khởi tạo giỏ hàng khi trang web tải xong
window.addEventListener("load", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  const navCartContainer = document.getElementById("navCartContainer");
  if (navCartContainer) {
    navCartContainer.appendChild(createCartButton());
  }

  document.body.appendChild(createCartModal());
  document.body.appendChild(createProductDetailModal());

  capNhatCart(cart);
});

// Các hàm tạo giao diện
function createCartButton() {
  const container = document.createElement("div");
  container.className = "cart-button-container";

  const button = document.createElement("button");
  button.id = "cartButton";
  button.onclick = openCartModal;
  button.innerHTML = `
    <i class="fas fa-shopping-cart"></i>
    <span>Giỏ hàng</span>
    <span id="cartItemCount">${cart.reduce(
    (total, item) => total + item["so-luong"],
    0
  )}</span>
  `;

  container.appendChild(button);
  return container;
}

// Tạo modal giỏ hàng
function createCartModal() {
  const modal = document.createElement("div");
  modal.id = "cartModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Giỏ hàng của bạn</h2>
        <span class="close" onclick="closeCartModal()">&times;</span>
      </div>
      <div class="modal-body">
        <div id="cartItems"></div>
        <div class="cart-summary">
          <div class="cart-buttons">
            <button onclick="closeCartModal()" class="btn-secondary">Đóng</button>
            <button onclick="checkout()" class="btn-primary" id="btn-s">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  `;

  return modal;
}

// Tạo modal chi tiết sản phẩm
function createProductDetailModal() {
  const modal = document.createElement("div");
  modal.id = "productDetailModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Chi tiết sản phẩm</h2>
        <span class="close" onclick="closeProductDetailModal()">&times;</span>
      </div>
      <div class="modal-body">
        <div class="product-detail">
          <div class="product-image">
            <div class="image-slider">
              <img id="productDetailImage" class="active" src="" alt="Hình ảnh sản phẩm 1" />
              <img id="productDetailImage2" src="" alt="Hình ảnh sản phẩm 2" />
              <button class="slider-btn prev" onclick="prevDetailImage()">&#10094;</button>
              <button class="slider-btn next" onclick="nextDetailImage()">&#10095;</button>
            </div>
          </div>

          <div class="product-info">
            <h1 id="productDetailName"></h1>
            <h3 id="productDetailCategory"></h3>
            <p id="productDetailDescription"></p>

            <div class="price-info">
              <p class="original-price">
                <span class="price-label">Giá gốc:</span>
                <span id="productDetailOriginalPrice"></span>
              </p>
              <p class="sale-price">
                <span class="price-label">Giá khuyến mãi:</span>
                <span id="productDetailSalePrice"></span>
              </p>
            </div>

            <div class="quantity-selector">
              <label for="productDetailQuantity">Số lượng:</label>
              <div class="quantity-controls">
                <input type="number" id="productDetailQuantity" value="1" min="1" onchange="updateDetailTotal()" />
              </div>
            </div>

            <div class="total-price">
              <p>Thành tiền: <span id="productDetailTotalPrice"></span></p>
            </div>

            <button id="addToCartDetailBtn" class="add-to-cart-btn" onclick="addToCartFromDetail()">
              <i class="fas fa-shopping-cart"></i>
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  return modal;
}
function renderGioHang(cart, hamRenderItem, wrapperSelector = "#cartItems") {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.error("Không tìm thấy wrapper của giỏ hàng:", wrapperSelector);
    return;
  }
  wrapper.innerHTML = "";

  // Ẩn nút mua ngay nếu giỏ hàng trống
  const btnMuaNgay = document.getElementById("btn-s");
  if (btnMuaNgay) {
    btnMuaNgay.style.display = !cart || cart.length === 0 ? "none" : "block";
  }

  if (!cart || cart.length === 0) {
    const noProductImg = document.createElement("img");
    noProductImg.src = "images/no-product-cart.jpg"; // Sửa đường dẫn và thêm phần mở rộng
    noProductImg.style.width = "60%";
    wrapper.appendChild(noProductImg);
    return;
  }
  const gioHang = document.createElement("div");
  const muc = document.createElement("div");
  muc.style.display = "flex";
  muc.style.alignItems = "center";
  muc.style.gap = "1rem";
  muc.style.marginBottom = "1rem";
  muc.style.fontWeight = "bold";

  const anh = document.createElement("div");
  anh.style.width = "100px";
  anh.textContent = "Hình ảnh";
  muc.appendChild(anh);
  const ten = document.createElement("div");
  ten.style.flex = "1";
  ten.textContent = "Tên sản phẩm";
  muc.appendChild(ten);
  const gia = document.createElement("div");
  gia.style.width = "120px";
  gia.textContent = "Giá";
  muc.appendChild(gia);
  const soLuong = document.createElement("div");
  soLuong.style.width = "100px";
  soLuong.textContent = "Số lượng";
  muc.appendChild(soLuong);
  const tong = document.createElement("div");
  tong.style.width = "150px";
  tong.textContent = "Tổng";
  muc.appendChild(tong);
  const xoa = document.createElement("div");
  xoa.style.width = "50px";
  muc.appendChild(xoa);
  gioHang.appendChild(muc);
  const danhSach = document.createElement("div");
  for (const item of cart) {
    const renderedItem = hamRenderItem(item, cart);
    if (renderedItem) {
      danhSach.appendChild(renderedItem);
    }
  }
  const tongKetRow = document.createElement("div");
  tongKetRow.style.display = "flex";
  tongKetRow.style.alignItems = "center";
  tongKetRow.style.gap = "1rem";
  tongKetRow.style.marginTop = "1rem";
  tongKetRow.style.borderTop = "1px solid #ccc";
  tongKetRow.style.paddingTop = "1rem";
  tongKetRow.innerHTML = `
    <div style="width: 100px"></div>
    <div style="flex: 1"></div>
    <div style="width: 120px"></div>
    <div style="width: 100px"><strong>Tổng tiền:</strong></div>
    <div class="final-total-cost" style="width: 150px"></div>
    <div style="width: 50px"></div>
  `;
  danhSach.appendChild(tongKetRow);
  gioHang.appendChild(danhSach);
  wrapper.appendChild(gioHang);
  capNhatFinalTotalCost(cart);
}
function capNhatFinalTotalCost(cart) {
  const finalTotal = document.querySelector(".final-total-cost");
  if (!finalTotal) return;

  const total = cart.reduce((sum, item) => {
    const sanpham = timSanPham(item["san-pham"]);
    if (sanpham) {
      return sum + sanpham["price-sale-n"] * item["so-luong"];
    }
    return sum;
  }, 0);

  finalTotal.textContent = total.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
