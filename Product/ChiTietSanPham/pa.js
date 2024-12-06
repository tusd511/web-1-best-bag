function hienTrangChiTiet(id) {
  const sanPham = timSanPham(id);
  if (!sanPham) {
    console.error("Không tìm thấy sản phẩm với id:", id);
    return;
  }

  // Lưu sản phẩm vào localStorage để trang chi tiết có thể truy cập
  localStorage.setItem("chiTietSanPham", JSON.stringify(sanPham));

  // Chuyển hướng đến trang chi tiết sản phẩm
  window.location.href = `pa.html?id=${id}`;
}

// Thêm sự kiện load để hiển thị chi tiết sản phẩm
window.addEventListener("load", function () {
  // Kiểm tra nếu đang ở trang chi tiết sản phẩm
  if (window.location.pathname.includes("pa.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // Lấy thông tin sản phẩm từ localStorage
    const chiTietSanPham = JSON.parse(localStorage.getItem("chiTietSanPham"));

    if (chiTietSanPham && chiTietSanPham["web-scraper-order"] === id) {
      // TODO: Hiển thị chi tiết sản phẩm lên trang pa.html
      console.info("Chi tiết sản phẩm:", chiTietSanPham);
    }
  }
});
let currentProduct = null;
let currentImageIndex = 0;

function showImage(index) {
  const images = document.querySelectorAll(".image-slider img");
  images.forEach((img) => img.classList.remove("active"));
  images[index].classList.add("active");
  currentImageIndex = index;
}

function nextImage() {
  const nextIndex = (currentImageIndex + 1) % 2;
  showImage(nextIndex);
}

function prevImage() {
  const prevIndex = currentImageIndex === 0 ? 1 : 0;
  showImage(prevIndex);
}

function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    alert("Không tìm thấy ID sản phẩm");
    return;
  }

  taiSanPham(() => {
    currentProduct = timSanPham(productId);
    console.log("Sản phẩm tìm thấy:", currentProduct);
    if (!currentProduct) {
      alert("Không tìm thấy sản phẩm");
      return;
    }

    console.log("Giá gốc:", currentProduct["price-n"]);
    console.log("Giá khuyến mãi:", currentProduct["price-sale-n"]);

    // Cập nhật UI với thông tin sản phẩm
    document.getElementById(
      "productImage"
    ).src = `./images/${currentProduct["image-file"]}`;
    document.getElementById(
      "productImage2"
    ).src = `./images/${currentProduct["image2-file"]}`;
    showImage(0); // Hiển thị ảnh đầu tiên
    document.getElementById("productName").textContent = currentProduct.name;
    document.getElementById(
      "productCategory"
    ).textContent = `Túi ${currentProduct.category}`;
    document.getElementById("productDescription").textContent =
      currentProduct.description || "Không có mô tả";
    document.getElementById("productOriginalPrice").textContent =
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(currentProduct["price-n"]);
    document.getElementById("productSalePrice").textContent =
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(currentProduct["price-sale-n"]);
    updateTotal();
  });
}

function updateTotal() {
  if (!currentProduct) return;

  const quantity = parseInt(document.getElementById("quantity").value);
  const price = parseFloat(currentProduct["price-sale-n"]);
  const total = quantity * price;

  document.getElementById("totalPrice").textContent = new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
    }
  ).format(total);
}

function addToCart() {
  if (!currentProduct) {
    alert("Lỗi: Không tìm thấy thông tin sản phẩm");
    return;
  }

  const quantity = parseInt(document.getElementById("quantity").value);

  // TODO: Thêm logic thêm vào giỏ hàng ở đây
  alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
}

// Load thông tin sản phẩm khi trang được tải
window.addEventListener("load", loadProductDetails);
