function adminSuaSanPham(id) {
  // Lấy danh sách sản phẩm từ localStorage
  const products = JSON.parse(localStorage.getItem("sanPham") || "[]");

  // Tìm sản phẩm cần sửa
  const sanPham = products.find((p) => p["web-scraper-order"] === id);

  if (!sanPham) {
    alert("Không tìm thấy sản phẩm!");
    return;
  }

  // Lưu sản phẩm cần sửa vào localStorage
  localStorage.setItem("editing-product", JSON.stringify(sanPham));
  // Chuyển đến trang form với mode sửa
  window.location.href = "ThemSuaXoaSP.html?mode=edit";
}

function adminXoaSanPham(id) {
  if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    // Lấy danh sách sản phẩm từ localStorage
    let products = JSON.parse(localStorage.getItem("sanPham") || "[]");

    // Tìm và xóa sản phẩm
    const index = products.findIndex((p) => p["web-scraper-order"] === id);
    if (index !== -1) {
      products.splice(index, 1);
      // Lưu lại vào localStorage
      localStorage.setItem("sanPham", JSON.stringify(products));
      alert("Đã xóa sản phẩm thành công!");
      // Cập nhật lại hiển thị
      window.location.reload();
    }
  }
}
// Xử lý form trong ThemSuaXoaSP.html
if (window.location.pathname.includes("ThemSuaXoaSP.html")) {
  window.addEventListener("load", () => {
    const form = document.getElementById("productAddEditForm");
    const formTitle = document.getElementById("formTitle");
    const imageInput = document.getElementById("productImage");
    const imagePreview = document.getElementById("imagePreview");

    // Kiểm tra xem có phải đang sửa sản phẩm không
    const params = new URLSearchParams(window.location.search);
    const isEdit = params.get("mode") === "edit";

    if (isEdit) {
      // Lấy thông tin sản phẩm đang sửa
      const editingProduct = JSON.parse(
        localStorage.getItem("editing-product")
      );
      if (editingProduct) {
        formTitle.textContent = "Chỉnh Sửa Sản Phẩm";

        // Điền dữ liệu vào form
        form.elements["name"].value = editingProduct.name;
        form.elements["category"].value = editingProduct.category;
        form.elements["description"].value = editingProduct.description;
        form.elements["price-n"].value = editingProduct["price-n"];
        form.elements["price-sale-n"].value = editingProduct["price-sale-n"];

        // Hiển thị ảnh hiện tại
        imagePreview.innerHTML = `<img src="../images/${editingProduct["image-file"]}" style="max-width: 200px;">`;
      }
    }

    // Xử lý submit form
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: form.elements["name"].value,
        category: form.elements["category"].value,
        description: form.elements["description"].value,
        "price-n": parseInt(form.elements["price-n"].value),
        "price-sale-n": parseInt(form.elements["price-sale-n"].value),
      };

      // Lấy danh sách sản phẩm từ localStorage
      let products = JSON.parse(localStorage.getItem("sanPham") || "[]");

      if (isEdit) {
        // Cập nhật sản phẩm đang sửa
        const editingProduct = JSON.parse(
          localStorage.getItem("editing-product")
        );
        formData["web-scraper-order"] = editingProduct["web-scraper-order"];

        // Chỉ cập nhật ảnh nếu người dùng chọn ảnh mới
        if (form.elements["image"].files[0]) {
          formData["image-file"] = form.elements["image"].files[0].name;
        } else {
          formData["image-file"] = editingProduct["image-file"]; // Giữ nguyên ảnh cũ
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
        // Thêm sản phẩm mới
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

      // Xóa dữ liệu sản phẩm đang sửa
      localStorage.removeItem("editing-product");
      // Quay lại trang quản lý
      window.location.href = "admin.html?tab=sanpham";
    });

    // Xử lý nút hủy
    document.getElementById("cancelBtn").addEventListener("click", () => {
      if (
        confirm("Bạn có chắc muốn hủy không? Mọi thay đổi sẽ không được lưu.")
      ) {
        localStorage.removeItem("editing-product");
        window.location.href = "admin.html?tab=sanpham";
      }
    });
  });
}
function onPageLoad() {
  const params = layParamUrl();
  const tab = params["tab"] || "thongke";
  switch (tab) {
    case "thongke":
      loadTabContent("thongke", () =>
        taiDuLieuTongMainJs(() =>
          taiHoaDon(() => {
            taoBoLocTop();
            tinhTopHienThi();
            themChuyenTrangVaoThongKe();
            themDuLieuVaoTheThongKe();
          })
        )
      );
      if (tabthongke) {
        tabthongke.classList.add("isActive");
      }
      break;
    case "nguoidung":
      loadTabContent("nguoidung", () =>
        taiDuLieuTongMainJs(() =>
          taiNguoiDung(() => {
            taoBoLocNguoiDung();
          })
        )
      );

      tabnguoidung.classList.add("isActive");
      break;
    case "sanpham":
      loadTabContent("sanpham", () =>
        taiDuLieuTongMainJs(() => {
          taiSanPham(() => {
            // Thêm event listener cho nút thêm mới
            const addButton = document.getElementById("addproduct-button");
            if (addButton) {
              addButton.addEventListener("click", () => {
                window.location.href = "pra.html";
              });
            }
          });
        })
      );
      tabsanpham.classList.add("isActive");
      break;
    case "hoadon":
      loadTabContent("hoadon", () =>
        taiDuLieuTongMainJs(() =>
          taiHoaDon(() => {
            taoBoLocHoaDon();
          })
        )
      );

      tabhoadon.classList.add("isActive");
      break;
    case "bieudo-test":
      loadTabContent("bieudo-test", () =>
        taiDuLieuTongMainJs(() => taiHoaDon(() => {}))
      );
      doiMauBackGround();
      break;
    default:
      loadTabContent("thongke", () =>
        taiDuLieuTongMainJs(() =>
          taiHoaDon(() => {
            taoBoLocTop();
            tinhTopHienThi();
            themChuyenTrangVaoThongKe();
            themDuLieuVaoTheThongKe();
          })
        )
      );
      tabnguoidung.classList.add("isActive");
  }
}
