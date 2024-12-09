// Các hàm xử lý thêm/sửa/xóa sản phẩm/đã test và chạy được
function adminSuaSanPham(id) {
  const products = JSON.parse(localStorage.getItem("sanPham") || "[]");
  const sanPham = products.find((p) => p["web-scraper-order"] === id);

  if (!sanPham) {
    alert("Không tìm thấy sản phẩm!");
    return;
  }

  localStorage.setItem("editing-product", JSON.stringify(sanPham));
  openProductModal(true); // Mở modal ở chế độ sửa
}

function adminXoaSanPham(id) {
  if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    let products = JSON.parse(localStorage.getItem("sanPham") || "[]");
    const index = products.findIndex((p) => p["web-scraper-order"] === id);
    if (index !== -1) {
      products.splice(index, 1);
      localStorage.setItem("sanPham", JSON.stringify(products));
      alert("Đã xóa sản phẩm thành công!");
      window.location.reload();
    }
  }
}

// Các hàm xử lý modal
function createProductModal() {
  const modalHTML = `
      <div id="productModal" class="admintsx-modal">
        <div class="admintsx-modal-content">
          <div class="admintsx-form-container">
            <form id="productAddEditForm" class="admintsx-form">
              <h2 id="formTitle" class="admintsx-form-title">Thêm Sản Phẩm Mới</h2>
  
              <div class="form-group admintsx-form-group">
                <label for="productImage" class="admintsx-form-label required">Hình ảnh sản phẩm</label>
                <input
                  type="file"
                  id="productImage"
                  name="image"
                  accept="image/*"
                  class="admintsx-form-input admintsx-image-input"
                />
                <div id="imagePreview" class="admintsx-image-preview"></div>
              </div>
  
              <div class="form-group admintsx-form-group">
                <label for="productName" class="admintsx-form-label required">Tên sản phẩm</label>
                <input 
                  type="text" 
                  id="productName" 
                  name="name" 
                  required 
                  class="admintsx-form-input"
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>
  
              <div class="form-group admintsx-form-group">
                <label for="productCategory" class="admintsx-form-label required">Danh mục sản phẩm</label>
                <select id="productCategory" name="category" required class="admintsx-form-select">
                  <option value="">-- Chọn danh mục --</option>
                  <option value="tote">Tote</option>
                  <option value="standard">Standard</option>
                  <option value="sling">Sling</option>
                  <option value="messenger">Messenger</option>
                  <option value="laptop">Laptop</option>
                  <option value="duffle">Duffle</option>
                </select>
              </div>
  
              <div class="form-group admintsx-form-group">
                <label for="productDescription" class="admintsx-form-label required">Mô tả sản phẩm</label>
                <textarea
                  id="productDescription"
                  name="description"
                  rows="4"
                  required
                  class="admintsx-form-textarea"
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                ></textarea>
              </div>
  
              <div class="form-group admintsx-form-group">
                <label for="productOriginalPrice" class="admintsx-form-label required">Giá gốc</label>
                <input
                  type="number"
                  id="productOriginalPrice"
                  name="price-n"
                  min="0"
                  required
                  class="admintsx-form-input"
                  placeholder="Nhập giá gốc..."
                />
              </div>
  
              <div class="form-group admintsx-form-group">
                <label for="productSalePrice" class="admintsx-form-label required">Giá khuyến mãi</label>
                <input
                  type="number"
                  id="productSalePrice"
                  name="price-sale-n"
                  min="0"
                  required
                  class="admintsx-form-input"
                  placeholder="Nhập giá khuyến mãi..."
                />
              </div>
  
              <div class="admintsx-form-buttons">
                <button type="submit" id="submitBtn" class="admintsx-submit-btn">Lưu</button>
                <button type="button" id="cancelBtn" class="admintsx-cancel-btn">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("productModal");
  if (!modal) {
    console.error("Modal không được tạo thành công");
  }
}

function openProductModal(isEdit = false) {
  document.body.classList.add("admintsx-modal-open");

  let modal = document.getElementById("productModal");
  if (!modal) {
    createProductModal();
    modal = document.getElementById("productModal");
    setupModalEventListeners();
  }

  const form = document.getElementById("productAddEditForm");
  const formTitle = document.getElementById("formTitle");
  const imagePreview = document.getElementById("imagePreview");
  const imageInput = document.getElementById("productImage");

  form.reset();
  imagePreview.innerHTML = "";

  const newImageInput = imageInput.cloneNode(true);
  imageInput.parentNode.replaceChild(newImageInput, imageInput);
  newImageInput.addEventListener("change", handleImagePreview);

  if (isEdit) {
    const editingProduct = JSON.parse(localStorage.getItem("editing-product"));
    if (editingProduct) {
      formTitle.textContent = "Chỉnh Sửa Sản Phẩm";

      form.elements["name"].value = editingProduct.name;
      form.elements["category"].value = editingProduct.category;
      form.elements["description"].value = editingProduct.description;
      form.elements["price-n"].value = editingProduct["price-n"];
      form.elements["price-sale-n"].value = editingProduct["price-sale-n"];

      imagePreview.innerHTML = `
          <img src="../images/${editingProduct["image-file"]}" 
               alt="Current product image"
               style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
        `;
    }
  } else {
    formTitle.textContent = "Thêm Sản Phẩm Mới";
  }

  modal.style.display = "block";
}

function setupModalEventListeners() {
  const modal = document.getElementById("productModal");
  const form = document.getElementById("productAddEditForm");
  const cancelBtn = document.getElementById("cancelBtn");

  form.addEventListener("submit", handleProductFormSubmit);
  cancelBtn.addEventListener("click", handleCancelClick);
  modal.addEventListener("click", handleOutsideClick);
}

function handleImagePreview(e) {
  const file = e.target.files[0];
  const imagePreview = document.getElementById("imagePreview");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.innerHTML = `
          <img src="${e.target.result}" 
               alt="Preview" 
               style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
        `;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = "";
  }
}

function handleCancelClick() {
  if (confirm("Bạn có chắc muốn hủy không? Mọi thay đổi sẽ không được lưu.")) {
    closeProductModal();
  }
}

function handleOutsideClick(e) {
  if (e.target === e.currentTarget) {
    closeProductModal();
  }
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.style.display = "none";
    localStorage.removeItem("editing-product");
    document.body.classList.remove("admintsx-modal-open");
  }
}

function handleProductFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = {
    name: form.elements["name"].value,
    category: form.elements["category"].value,
    description: form.elements["description"].value,
    "price-n": parseInt(form.elements["price-n"].value),
    "price-sale-n": parseInt(form.elements["price-sale-n"].value),
  };

  let products = JSON.parse(localStorage.getItem("sanPham") || "[]");
  const editingProduct = JSON.parse(localStorage.getItem("editing-product"));

  if (editingProduct) {
    formData["web-scraper-order"] = editingProduct["web-scraper-order"];

    if (form.elements["image"].files[0]) {
      formData["image-file"] = form.elements["image"].files[0].name;
    } else {
      formData["image-file"] = editingProduct["image-file"];
    }

    const index = products.findIndex(
      (p) => p["web-scraper-order"] === editingProduct["web-scraper-order"]
    );
    if (index !== -1) {
      products[index] = formData;
      localStorage.setItem("sanPham", JSON.stringify(products));
      alert("Cập nhật sản phẩm thành công!");
    }
  } else {
    if (!form.elements["image"].files[0]) {
      alert("Vui lòng chọn ảnh cho sản phẩm mới!");
      return;
    }
    formData["image-file"] = form.elements["image"].files[0].name;

    const maxId = Math.max(
      ...products.map((p) => parseInt(p["web-scraper-order"]) || 0),
      0
    );
    formData["web-scraper-order"] = (maxId + 1).toString();
    products.push(formData);
    localStorage.setItem("sanPham", JSON.stringify(products));
    alert("Thêm sản phẩm thành công!");
  }

  closeProductModal();
  window.location.reload();
}
