const toggler = document.querySelector(".topbar-toggler");
const collapse = document.querySelector(".topbar-collapse");
if (toggler) {
  toggler.addEventListener("click", () => {
    collapse.style.display =
      collapse.style.display === "flex" ? "none" : "flex";
  });
}

function PhongSide() {
  document.querySelector(".sideMenu").style.width = "200px";
}

function ThuSide() {
  document.querySelector(".sideMenu").style.width = "80px";
}

function tinhSanPhamHienThiAdmin(wrapperSelector = ".product-list") {
  if (!document.querySelector(wrapperSelector)) {
    console.info("tinhSanPhamHienThi khong tim thay wrapper!");
    return;
  }
  let { page, sort, min, max, search, categories } = layParamUrl();
  let sanPhamsDaLoc = [...g_sanPham];
  sanPhamsDaLoc = locGiaSanPham(min, max, sanPhamsDaLoc);
  sanPhamsDaLoc = locTheLoaiSanPham(categories, sanPhamsDaLoc);
  if (search) sanPhamsDaLoc = timTheoTen(search, sanPhamsDaLoc);
  sanPhamsDaLoc = sapXepSanPham(sort, sanPhamsDaLoc);

  const soLuongSanPham = sanPhamsDaLoc.length;
  const soPageToiDa = Math.ceil(soLuongSanPham / soSanPhamMoiTrang);

  createPaginationDebugTable({
    soPageToiDa, // so trang toi da phan trang
    sort,
    min,
    max,
    search,
    categories,
    soLuongSanPham,
    tongSoSanPham: g_sanPham.length,
    soSanPhamMoiTrang,
  });

  duLieuDaTinh = { duLieuDaLoc: sanPhamsDaLoc, soPageToiDa, pageHienTai: page };

  hienThiSanPhamAdmin(duLieuDaTinh, wrapperSelector);
}

function hienThiDanhSachAdmin(duLieuDaTinh, hamRenderItem, wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.error(`Không tìm thấy phần tử với selector: ${wrapperSelector}`);
    return; // Nếu không tìm thấy, dừng lại và không làm gì thêm
  }
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("grid-container");
  const { duLieuDaLoc, soPageToiDa } = duLieuDaTinh;
  let { pageHienTai } = duLieuDaTinh;
  let chiSoBatDau = 0;
  if (pageHienTai < 1 || isNaN(pageHienTai) || pageHienTai == null) {
    pageHienTai = 1;
  }
  chiSoBatDau = (pageHienTai - 1) * soSanPhamMoiTrang;
  if (chiSoBatDau > duLieuDaTinh.length) {
    caiParamUrl({ page: soPageToiDa }, false, true);
  }
  const duLieuPhanTrang = duLieuDaLoc.slice(
    chiSoBatDau,
    chiSoBatDau + soSanPhamMoiTrang
  );
  if (duLieuDaTinh.length === 0)
    container.appendChild(
      document.createTextNode("Khong co san pham dap ung tieu chi")
    );
  for (const item of duLieuPhanTrang) {
    container.appendChild(hamRenderItem(item));
  }
  wrapper.appendChild(container);
}
function renderItemSanPhamAdmin(sanPham) {
  const wrapCart = document.createElement("div");
  wrapCart.classList.add("wrap-cart");
  const card = document.createElement("div");
  card.classList.add("card");
  const img = document.createElement("div");
  img.classList.add("inner-img");
  const cardImgTop = document.createElement("img");
  cardImgTop.classList.add("card-img-top");
  cardImgTop.src = `/images/${sanPham["image-file"]}`;
  img.appendChild(cardImgTop);
  card.appendChild(img);
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = sanPham["name"];
  cardBody.appendChild(cardTitle);
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = sanPham["category"];
  cardBody.appendChild(cardText);
  const cartPrice = document.createElement("div");
  cartPrice.classList.add("cart-price");
  const cardOldPrice = document.createElement("span");
  cardOldPrice.classList.add("card-old-price");
  cardOldPrice.textContent = sanPham["price-n"];
  cartPrice.appendChild(cardOldPrice);
  const cardCurrentPrice = document.createElement("span");
  cardCurrentPrice.classList.add("card-current-price");
  cardCurrentPrice.textContent = sanPham["price-sale-n"];
  cartPrice.appendChild(cardCurrentPrice);
  cardBody.appendChild(cartPrice);
  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("button-group");
  const updateProductbtn = document.createElement("button");
  updateProductbtn.classList.add("updateproduct-button");
  updateProductbtn.addEventListener("click", () =>
    adminSuaSanPham(sanPham["web-scraper-order"])
  );
  updateProductbtn.textContent = "Chinh sua";
  buttonGroup.appendChild(updateProductbtn);
  const deleteProductbtn = document.createElement("button");
  deleteProductbtn.classList.add("deleteproduct-button");
  deleteProductbtn.addEventListener("click", () =>
    adminXoaSanPham(sanPham["web-scraper-order"])
  );
  deleteProductbtn.textContent = "Xoa";
  buttonGroup.appendChild(deleteProductbtn);
  cardBody.appendChild(buttonGroup);
  card.appendChild(cardBody);
  wrapCart.appendChild(card);
  return wrapCart;
}
function hienThiSanPhamAdmin(duLieuDaTinh, wrapperSelector) {
  const khiBamTrang = () =>
    hienThiDanhSachAdmin(duLieuDaTinh, renderItemSanPhamAdmin, wrapperSelector);
  khiBamTrang();
  hienThiPagination(duLieuDaTinh, () => khiBamTrang());
}

function taoNutThemSanPham() {
  const nutThemSanPham = document.querySelector("#addproduct-button");
  if (nutThemSanPham) {
    console.log("da tim thay nut them san pham");
    nutThemSanPham.addEventListener("click", () => adminThemSanPham());
  } else {
    console.log("khong tim thay nut them san pham");
  }
}

function adminThemSanPham() {
  const infoFormDialog = document.querySelector("#infoFormDialog");
  const infoForm = document.querySelector("#infoForm");
  infoFormDialog.showModal();
  document.getElementById("tenSanPham").value = "";
  document.getElementById("giaSanPham").value = "";
  document.getElementById("loaiSanPham").value = "";
  document.getElementById("moTaSanPham").value = "";
  document.getElementById("linkHinhAnh").value = "";
  document.getElementById("cancel-button").addEventListener("click", () => {
    infoFormDialog.close();
  });
  infoForm.addEventListener("submit", () => {
    const sanPham = {
      name: document.getElementById("tenSanPham").value,
      price: document.getElementById("giaSanPham").toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      ["image-src"]: document.getElementById("linkHinhAnh").value,
      ["images-file"]: document.getElementById("hinhAnhSanPham").files[0],
      ["price-n"]: document.getElementById("giaSanPham"),
      category: document.getElementById("loaiSanPham").value,
      description: document.getElementById("moTaSanPham").value,
    };
    themSanPham(id, sanPham);
    infoFormDialog.close();
  });
}

function adminSuaSanPham(id) {
  const sanPham = timSanPham(id);
  if (!sanPham) {
    alert("Khong tim thay san pham!");
    return;
  }
  const infoFormDialog = document.querySelector("#infoFormDialog");
  const infoForm = document.querySelector("#infoForm");
  infoFormDialog.showModal();
  (document.getElementById("linkHinhAnh").value = sanPham["image-src"]),
    (document.getElementById("tenSanPham").value = sanPham["name"]);
  document.getElementById("giaSanPham").value = sanPham["price-n"];
  document.getElementById("loaiSanPham").value = sanPham["category"];
  document.getElementById("moTaSanPham").value = sanPham["description"];
  document.getElementById("cancel-button").addEventListener("click", () => {
    infoFormDialog.close();
  });
  infoForm.addEventListener("submit", () => {
    const sanPham = {
      name: document.getElementById("tenSanPham").value,
      price: document.getElementById("giaSanPham").toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      "image-src": document.getElementById("linkHinhAnh").value,
      "price-n": document.getElementById("giaSanPham"),
      category: document.getElementById("loaiSanPham").value,
      description: document.getElementById("moTaSanPham").value,
    };
    if (document.getElementById("hinhAnhSanPham").files.length !== 0) {
      sanPham["images-file"] =
        document.getElementById("hinhAnhSanPham").files[0];
    }
    themSanPham(id, sanPham);
    infoFormDialog.close();
  });
}

function adminXoaSanPham(id) {
  if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    deleteSanPham(id);
  }
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

var soNguoiDungMoiTrang = 25;
function tinhNguoiDungHienThi(wrapperSelector = ".account-list") {
  if (!document.querySelector(wrapperSelector)) {
    console.info("tinhNguoiDungHienThi khong tim thay wrapper");
    return;
  }
  let { page, sort, disabled } = layParamUrl();
  let nguoiDungsDaLoc = [...g_nguoiDung];
  nguoiDungsDaLoc = locTrangThaiKhoa(disabled, nguoiDungsDaLoc);
  nguoiDungsDaLoc = sapXepNguoiDung(sort, nguoiDungsDaLoc);

  const soLuongNguoiDung = nguoiDungsDaLoc.length;
  const soPageToiDa = Math.ceil(soLuongNguoiDung / soNguoiDungMoiTrang);
  createPaginationDebugTable({
    soPageToiDa,
    sort,
    disabled,
    soLuongNguoiDung,
    tongSoNguoiDung: g_nguoiDung.length,
    soNguoiDungMoiTrang,
  });

  duLieuNguoiDungDaTinh = {
    duLieuNguoiDungDaLoc: nguoiDungsDaLoc,
    soPageToiDa,
    pageHienTai: page,
  };
  hienThiNguoiDung(duLieuNguoiDungDaTinh, wrapperSelector);
}
function hienThiNguoiDung(duLieuNguoiDungDaTinh, wrapperSelector) {
  const khiBamTrangNguoiDung = () =>
    hienThiDanhSachNguoiDung(
      duLieuNguoiDungDaTinh,
      renderItemNguoiDung,
      wrapperSelector
    );
  khiBamTrangNguoiDung();
  hienThiPagination(
    duLieuNguoiDungDaTinh,
    () => khiBamTrangNguoiDung(),
    ".pagination2"
  );
}

function renderItemNguoiDung(nguoiDung) {
  const rowNguoiDung = document.createElement("tr");
  rowNguoiDung.setAttribute("data-id", nguoiDung["id"]);
  if (markedForDelete.has(nguoiDung["id"])) {
    rowNguoiDung.classList.add("ready-for-delete");
  }
  const ngaytao = document.createElement("td");
  ngaytao.textContent = formatDateLocaleVn(nguoiDung["ngay-tao"]);
  rowNguoiDung.appendChild(ngaytao);
  const name = document.createElement("td");
  name.textContent = nguoiDung["name"];
  rowNguoiDung.appendChild(name);
  const email = document.createElement("td");
  email.textContent = nguoiDung["email"];
  rowNguoiDung.appendChild(email);
  const password = document.createElement("td");
  password.textContent = nguoiDung["password"];
  rowNguoiDung.appendChild(password);
  const active = document.createElement("i");
  if (!nguoiDung["disabled"]) {
    active.classList.add("fas", "fa-check-circle", "color-green");
  } else {
    active.classList.add("fas", "fa-check-circle");
    rowNguoiDung.style.backgroundColor = "rgba(255,0,0,0.3)";
    rowNguoiDung.style.textDecoration = "line-through";
  }
  active.addEventListener("click", () => {
    if (
      nguoiDung["disabled"] ||
      confirm("Bạn có chắc chắn muốn khoá tài khoản này?")
    ){
      suaNguoiDung(nguoiDung["id"], {
        ...nguoiDung,
        disabled: !nguoiDung["disabled"],
      });
      nguoiDung["disabled"]=!nguoiDung["disabled"];
    }
    if (!nguoiDung["disabled"]) {
      active.classList.add("fas", "fa-check-circle", "color-green");
      rowNguoiDung.style.backgroundColor = "transparent";
      rowNguoiDung.style.textDecoration = "none";
    } else {
      active.classList.add("fas", "fa-check-circle");
      active.classList.remove("color-green");
      rowNguoiDung.style.backgroundColor = "rgba(255,0,0,0.3)";
      rowNguoiDung.style.textDecoration = "line-through";
    }
  });
  const trangthai = document.createElement("td");
  trangthai.classList.add("kichhoat");
  trangthai.appendChild(active);
  rowNguoiDung.appendChild(trangthai);
  rowNguoiDung.addEventListener("dblclick", () => {
    if (
      document
        .querySelector(".mode-button .fas")
        .classList.contains("fa-wrench")
    ) {
      adminSuaNguoiDung(rowNguoiDung.getAttribute("data-id"));
    }
    if (
      document.querySelector(".mode-button .fas").classList.contains("fa-trash")
    ) {
      const userId = nguoiDung["id"]; // Lấy ID của dòng
      if (markedForDelete.has(userId)) {
        markedForDelete.delete(userId); // Bỏ đánh dấu
        rowNguoiDung.classList.remove("ready-for-delete");
      } else {
        markedForDelete.add(userId); // Đánh dấu
        rowNguoiDung.classList.add("ready-for-delete");
      }
    }
  });
  return rowNguoiDung;
}
function hienThiDanhSachNguoiDung(
  duLieuNguoiDungDaTinh,
  hamRenderItem,
  wrapperSelector
) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.error(`Không tìm thấy phần tử với selector: ${wrapperSelector}`);
    return; // Nếu không tìm thấy, dừng lại và không làm gì thêm
  }
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container-nguoidung");
  const table = document.createElement("table");
  table.classList.add("user-table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  const th5 = document.createElement("th");
  th.scope = "col";
  th2.scope = "col";
  th3.scope = "col";
  th4.scope = "col";
  th5.scope = "col";
  th.textContent = "Ngày tạo";
  th2.textContent = "Tên khách hàng";
  th3.textContent = "Email";
  th4.textContent = "Password";
  th5.textContent = "Trạng thái";
  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  const { duLieuNguoiDungDaLoc, soPageToiDa } = duLieuNguoiDungDaTinh;
  let { pageHienTai } = duLieuNguoiDungDaTinh;
  let chiSoBatDau = 0;
  if (pageHienTai < 1 || isNaN(pageHienTai) || pageHienTai == null) {
    pageHienTai = 1;
  }
  chiSoBatDau = (pageHienTai - 1) * soNguoiDungMoiTrang;
  if (chiSoBatDau > duLieuNguoiDungDaTinh.length) {
    caiParamUrl({ page: soPageToiDa }, false, true);
  }
  const duLieuNguoiDungPhanTrang = duLieuNguoiDungDaLoc.slice(
    chiSoBatDau,
    chiSoBatDau + soNguoiDungMoiTrang
  );
  if (duLieuNguoiDungDaTinh.length === 0)
    container.appendChild(document.createTextNode("Khong co khach hang nao"));
  for (const item of duLieuNguoiDungPhanTrang) {
    tbody.appendChild(hamRenderItem(item));
  }
  table.appendChild(tbody);
  container.appendChild(table);
  wrapper.appendChild(container);
}
//sắp xếp người dùng theo ngày tạo tài khoản
function sapXepNguoiDung(sort, nguoiDungsDaLoc) {
  if (sort === "asc")
    return nguoiDungsDaLoc.toSorted(
      (a, b) => new Date(a["ngay-tao"]) - new Date(b["ngay-tao"])
    );
  if (sort === "desc")
    return nguoiDungsDaLoc.toSorted(
      (a, b) => new Date(b["ngay-tao"]) - new Date(a["ngay-tao"])
    );
  return nguoiDungsDaLoc;
}

//lọc những tài khoản bị khóa
function locTrangThaiKhoa(disabled, nguoiDungsDaLoc) {
  if (disabled === 0) {
    return nguoiDungsDaLoc;
  }
  if (disabled === 1)
    return nguoiDungsDaLoc.filter(
      (nguoiDung) => nguoiDung["disabled"] === true
    );
  if (disabled === -1)
    return nguoiDungsDaLoc.filter(
      (nguoiDung) => nguoiDung["disabled"] === false
    );
  return nguoiDungsDaLoc;
}

function adminThemNguoiDung() {
  const editDialog = document.getElementById("editFormDialog");
  const editForm = document.getElementById("editForm");
  editDialog.showModal(); // Hiển thị form
  document.getElementById("name").value = "";
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document
    .getElementById("closeFormBtn")
    .addEventListener("click", function () {
      editDialog.close(); // Ẩn form đi khi nhấn nút "Thoát"
    });
  const today = new Date();
  const formattedDate = today.toISOString(); // Định dạng ngày theo chuẩn ISO (yyyy-mm-ddThh:mm:ss.sssZ)
  document.getElementById("ngay-tao").value = formattedDate; // Gán giá trị ngày hiện tại vào input
  document.getElementById("ngay-tao").disabled = true;
  editForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Ngừng sự kiện mặc định của

    const newNguoiDung = {
      name: document.getElementById("name").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      ["ngay-tao"]: formattedDate,
      disabled: document.getElementById("disabled2").checked,
    };
    themNguoiDung(newNguoiDung);
    editDialog.close();
  });
}

function adminSuaNguoiDung(id) {
  const nguoiDung = timNguoiDung(id);
  if (!nguoiDung) {
    alert("Không tìm thấy người dùng!");
    return;
  }
  const editDialog = document.getElementById("editFormDialog");
  const editForm = document.getElementById("editForm");
  editDialog.showModal(); // Hiển thị form sửa

  // Điền dữ liệu hiện tại vào các trường trong form
  document.getElementById("name").value = nguoiDung["name"];
  document.getElementById("username").value = nguoiDung["username"];
  document.getElementById("email").value = nguoiDung["email"];
  document.getElementById("password").value = nguoiDung["password"];

  // Điền ngày tạo (không cho sửa)
  document.getElementById("ngay-tao").value = nguoiDung["ngay-tao"];
  document.getElementById("ngay-tao").disabled = true;

  // Điền trạng thái disabled (checkbox)
  document.getElementById("disabled2").checked = nguoiDung["disabled"];

  document
    .getElementById("closeFormBtn")
    .addEventListener("click", function () {
      editDialog.close(); // Ẩn form đi khi nhấn nút "Thoát"
    });
  // Lắng nghe sự kiện submit của form
  editForm.onsubmit = function (event) {
    event.preventDefault(); // Ngừng sự kiện mặc định của

    const newNguoiDung = {
      name: document.getElementById("name").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      disabled: document.getElementById("disabled2").checked,
    };
    suaNguoiDung(id, newNguoiDung);
    editDialog.close();
  };
}

const markedForDelete = new Set();

function adminXoaNguoiDung() {
  if (markedForDelete.size === 0) {
    alert("Doubleclick vào hàng để thêm vào danh sách xóa!");
    return;
  }

  // Chuyển Set thành Array để dễ thao tác
  const idsToDelete = Array.from(markedForDelete);

  if (confirm("Bạn có chắc chắn muốn xóa những tài khoản này?")) {
    for (let id of idsToDelete) {
      xoaNguoiDung(id);
    }
  }
}
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
var soHoaDonMoiTrang = 25;
function tinhHoaDonHienThi(wrapperSelector = ".order-list") {
  if (!document.querySelector(wrapperSelector)) {
    console.info("tinhHoaDonHienThi khong tim thay wrapper");
    return;
  }
  let { page, sort, handle } = layParamUrl();
  let hoaDonsDaLoc = [...g_hoaDon];
  hoaDonsDaLoc = locXuLyHoaDon(handle, hoaDonsDaLoc);
  hoaDonsDaLoc = sapXepHoaDon(sort, hoaDonsDaLoc);

  const soLuongHoaDon = hoaDonsDaLoc.length;
  const soPageToiDa = Math.ceil(soLuongHoaDon / soHoaDonMoiTrang);

  createPaginationDebugTable({
    soPageToiDa,
    sort,
    handle,
    soLuongHoaDon,
    tongSoHoaDon: g_hoaDon.length,
    soHoaDonMoiTrang,
  });

  duLieuHoaDonDaTinh = {
    duLieuHoaDonDaLoc: hoaDonsDaLoc,
    soPageToiDa,
    pageHienTai: page,
  };

  hienThiHoaDon(duLieuHoaDonDaTinh, wrapperSelector);
}

function hienThiHoaDon(duLieuHoaDonDaTinh, wrapperSelector) {
  const khiBamTrangHoaDon = () =>
    hienThiDanhSachHoaDon(
      duLieuHoaDonDaTinh,
      renderItemHoaDon,
      wrapperSelector
    );
  khiBamTrangHoaDon();
  hienThiPagination(
    duLieuHoaDonDaTinh,
    () => khiBamTrangHoaDon(),
    ".pagination3"
  );
}

function renderItemHoaDon(hoaDon) {
  const rowHoaDon = document.createElement("tr");
  rowHoaDon.setAttribute("data-id", hoaDon["id"]);
  if (addOrderToBin.has(hoaDon["id"])) {
    rowHoaDon.classList.add("ready-for-delete");
  }
  const ngayTaoHoaDon = document.createElement("td");
  ngayTaoHoaDon.textContent = formatDateLocaleVn(hoaDon["ngay-tao"]);
  rowHoaDon.appendChild(ngayTaoHoaDon);
  const khachHang = document.createElement("td");
  khachHang.textContent = timNguoiDung(hoaDon["nguoi-dung"])["name"];
  rowHoaDon.appendChild(khachHang);
  const chiTietHoaDon = document.createElement("td");
  chiTietHoaDon.colSpan = "2";
  const minitable = document.createElement("table");
  minitable.style.borderCollapse = "collapse";
  for (let i = 0; i < hoaDon["chi-tiet"].length; i++) {
    const trmini = document.createElement("tr");
    const tdmini = document.createElement("td");
    const checksp = timSanPham(hoaDon["chi-tiet"][i]["san-pham"]);
    if (checksp) {
      tdmini.textContent = checksp["name"];
    } else {
      tdmini.textContent = "!!! Khong tim thay san pham";
    }
    const tdmini2 = document.createElement("td");
    if (checksp) {
      tdmini2.textContent = hoaDon["chi-tiet"][i]["so-luong"];
    } else {
      tdmini2.textContent = "#";
    }
    trmini.appendChild(tdmini2);
    trmini.appendChild(tdmini);
    minitable.appendChild(trmini);
  }
  chiTietHoaDon.appendChild(minitable);
  rowHoaDon.appendChild(chiTietHoaDon);
  const xuly = document.createElement("td");
  const select = document.createElement("select");
  select.classList.add("select-donhang");
  const chua = document.createElement("option");
  chua.value = "chua";
  chua.textContent = "Chưa";
  select.appendChild(chua);
  const dang = document.createElement("option");
  dang.value = "dang";
  dang.textContent = "Đang";
  select.appendChild(dang);
  const huy = document.createElement("option");
  huy.value = "huy";
  huy.textContent = "Hủy";
  select.appendChild(huy);
  const roi = document.createElement("option");
  roi.value = "roi";
  roi.textContent = "Rồi";
  select.appendChild(roi);
  select.value = hoaDon["xu-ly"];
  if (select.value === "roi") select.disabled = true;
  xuly.classList.add(select.value);
  select.addEventListener("change", () => {
    xuly.className = "";
    switch (select.value) {
      case "chua":
        xuly.classList.add("chua");
        suaHoaDon(hoaDon["id"], { ...hoaDon, "xu-ly": "chua" });
        break;
      case "dang":
        xuly.classList.add("dang");
        suaHoaDon(hoaDon["id"], { ...hoaDon, "xu-ly": "dang" });
        break;
      case "huy":
        xuly.classList.add("huy");
        suaHoaDon(hoaDon["id"], { ...hoaDon, "xu-ly": "huy" });
        break;
      case "roi":
        xuly.classList.add("roi");
        suaHoaDon(hoaDon["id"], { ...hoaDon, "xu-ly": "roi" });
        select.disabled = true;
        break;
    }
  });
  xuly.appendChild(select);
  rowHoaDon.appendChild(xuly);
  rowHoaDon.addEventListener("dblclick", () => {
    if (
      document
        .querySelector(".mode-button .fas")
        .classList.contains("fa-wrench")
    ) {
      adminSuaHoaDon(rowHoaDon.getAttribute("data-id"));
    }
    if (
      document.querySelector(".mode-button .fas").classList.contains("fa-trash")
    ) {
      const orderId = hoaDon["id"]; // Lấy ID của dòng
      if (addOrderToBin.has(orderId)) {
        addOrderToBin.delete(orderId); // Bỏ đánh dấu
        rowHoaDon.classList.remove("ready-for-delete");
      } else {
        addOrderToBin.add(orderId); // Đánh dấu
        rowHoaDon.classList.add("ready-for-delete");
      }
    }
  });
  return rowHoaDon;
}

function hienThiDanhSachHoaDon(
  duLieuHoaDonDaTinh,
  hamRenderItem,
  wrapperSelector
) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.error(`Không tìm thấy phần tử với selector: ${wrapperSelector}`);
    return; // Nếu không tìm thấy, dừng lại và không làm gì thêm
  }
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container-hoadon");
  const table = document.createElement("table");
  table.classList.add("order-table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  th.scope = "col";
  th2.scope = "col";
  th3.scope = "col";
  th4.scope = "col";
  th.textContent = "Ngày tạo";
  th2.textContent = "Người dùng";
  th3.textContent = "Chi tiết";
  th4.textContent = "Đã xác nhận";
  th.rowSpan = "2";
  th2.rowSpan = "2";
  th3.colSpan = "2"; // Span two columns for "Chi tiết"
  th4.rowSpan = "2";
  const tr2 = document.createElement("tr"); // Second row
  const th3_1 = document.createElement("th");
  const th3_2 = document.createElement("th");
  th3_1.textContent = "SL";
  th3_2.textContent = "Tên Sản Phẩm";
  tr2.appendChild(th3_1);
  tr2.appendChild(th3_2);
  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  thead.appendChild(tr);
  thead.appendChild(tr2);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  const { duLieuHoaDonDaLoc, soPageToiDa } = duLieuHoaDonDaTinh;
  let { pageHienTai } = duLieuHoaDonDaTinh;
  let chiSoBatDau = 0;
  if (pageHienTai < 1 || isNaN(pageHienTai) || pageHienTai == null) {
    pageHienTai = 1;
  }
  chiSoBatDau = (pageHienTai - 1) * soHoaDonMoiTrang;
  if (chiSoBatDau > duLieuHoaDonDaTinh) {
    caiParamUrl({ page: soPageToiDa }, false, true);
  }

  const duLieuHoaDonPhanTrang = duLieuHoaDonDaLoc.slice(
    chiSoBatDau,
    chiSoBatDau + soHoaDonMoiTrang
  );
  if (duLieuHoaDonDaTinh.length === 0)
    container.appendChild(document.createTextNode("Khong co hoa don nao"));
  for (const item of duLieuHoaDonPhanTrang) {
    tbody.appendChild(hamRenderItem(item));
  }
  table.appendChild(tbody);
  container.appendChild(table);
  wrapper.appendChild(container);
}
//sắp xêps hóa đơn theo ngày
function sapXepHoaDon(sort, hoaDonsDaLoc) {
  if (sort === "asc")
    return hoaDonsDaLoc.toSorted(
      (a, b) => new Date(a["ngay-tao"]) - new Date(b["ngay-tao"])
    );
  if (sort === "desc")
    return hoaDonsDaLoc.toSorted(
      (a, b) => new Date(b["ngay-tao"]) - new Date(a["ngay-tao"])
    );
  return hoaDonsDaLoc;
}
//lọc sản phẩm chưa hoặc đã được xử lý
function locXuLyHoaDon(handle, hoaDonsDaLoc) {
  if (handle === "") return hoaDonsDaLoc;
  if (handle === "chua")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"] === "chua");
  if (handle === "dang")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"] === "dang");
  if (handle === "huy")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"] === "huy");
  if (handle === "roi")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"] === "roi");
  return hoaDonsDaLoc;
}

function renderItemGioHang(item, cart) {
  const sanpham = timSanPham(item["san-pham"]);
  if (!sanpham) {
    console.log("khong tim thay san pham trong gio hang");
    return;
  }
  const rowCart = document.createElement("tr");
  const hinhAnh = document.createElement("td");
  hinhAnh.style.position = "relative";
  const anhSanPham = document.createElement("img");
  anhSanPham.src = "/images/" + sanpham["image-file"];
  anhSanPham.classList.add("tiny-image");
  hinhAnh.appendChild(anhSanPham);

  // Tạo tooltip chứa hình ảnh lớn hơn
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");

  const largeImage = document.createElement("img");
  largeImage.src = "/images/" + sanpham["image-file"];
  largeImage.classList.add("lagre-image");
  tooltip.appendChild(largeImage);
  hinhAnh.appendChild(tooltip);

  // Xử lý hover để hiển thị tooltip
  anhSanPham.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
  });
  anhSanPham.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  rowCart.appendChild(hinhAnh);
  const ten = document.createElement("td");
  ten.textContent = sanpham["name"];
  rowCart.appendChild(ten);
  const gia = document.createElement("td");
  gia.textContent = sanpham["price"];
  rowCart.appendChild(gia);
  const soLuong = document.createElement("td");
  const soLuongChiTiet = document.createElement("input");
  soLuongChiTiet.type = "number";
  soLuongChiTiet.min = 1;
  soLuongChiTiet.max = 100;
  soLuongChiTiet.value = item["so-luong"];
  soLuongChiTiet.addEventListener("input", () => {
    item["so-luong"] = parseInt(soLuongChiTiet.value, 10);
    tong.textContent = (
      sanpham["price-n"] * soLuongChiTiet.value
    ).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    console.log(cart);
    capNhatCart(cart);
  });
  soLuong.appendChild(soLuongChiTiet);
  rowCart.appendChild(soLuong);
  const tong = document.createElement("td");
  tong.classList.add("total-cost");
  tong.textContent = (sanpham["price-n"] * item["so-luong"]).toLocaleString(
    "vi-VN",
    { style: "currency", currency: "VND" }
  );
  rowCart.appendChild(tong);
  const xoa = document.createElement("td");
  const xoaKhoiCart = document.createElement("button");
  xoaKhoiCart.type = "button";
  const iconXoaKhoiCart = document.createElement("i");
  iconXoaKhoiCart.classList.add("fas");
  iconXoaKhoiCart.classList.add("fa-trash");
  xoaKhoiCart.appendChild(iconXoaKhoiCart);
  xoaKhoiCart.addEventListener("click", () => {
    const index = cart.findIndex((i) => i["san-pham"] === item["san-pham"]);
    if (index !== 1) {
      cart.splice(index, 1);
    }
    console.log(cart);
    capNhatCart(cart);
  });
  xoa.appendChild(xoaKhoiCart);
  rowCart.appendChild(xoa);
  return rowCart;
}
function renderGioHang(cart, hamRenderItem, wrapperSelector = ".menuGioHang") {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.log("khong tim duoc wrapper cua gio hang");
    return;
  }
  wrapper.innerHTML = "";
  if (cart.length === 0) {
    wrapper.appendChild(document.createTextNode("Thêm sản phẩm vào giỏ hàng!"));
    return;
  }
  const gioHang = document.createElement("table");
  gioHang.classList.add("cart-table");
  const muc = document.createElement("thead");
  const anh = document.createElement("th");
  anh.scope = "col";
  muc.appendChild(anh);
  const ten = document.createElement("th");
  ten.scope = "col";
  ten.textContent = "Tên sản phẩm";
  muc.appendChild(ten);
  const gia = document.createElement("th");
  gia.scope = "col";
  gia.textContent = "Giá";
  muc.appendChild(gia);
  const soLuong = document.createElement("th");
  soLuong.scope = "col";
  soLuong.textContent = "Số lượng";
  muc.appendChild(soLuong);
  const tong = document.createElement("th");
  tong.scope = "col";
  tong.textContent = "Tổng";
  muc.appendChild(tong);
  const xoa = document.createElement("th");
  xoa.scope = "col";
  muc.appendChild(xoa);
  gioHang.appendChild(muc);
  const danhSach = document.createElement("tbody");
  for (const item of cart) {
    danhSach.appendChild(hamRenderItem(item, cart));
  }
  const space1 = document.createElement("td");
  const space2 = document.createElement("td");
  space2.textContent = "Tổng tiền";
  const space3 = document.createElement("td");
  const space4 = document.createElement("td");
  const space5 = document.createElement("td");
  space5.classList.add("final-total-cost");

  const space6 = document.createElement("td");
  danhSach.appendChild(space1);
  danhSach.appendChild(space2);
  danhSach.appendChild(space3);
  danhSach.appendChild(space4);
  danhSach.appendChild(space5);
  danhSach.appendChild(space6);
  gioHang.appendChild(danhSach);
  wrapper.appendChild(gioHang);
  //capNhatFinalTotalCost(cart);
}
function capNhatFinalTotalCost(cart) {
  const finalTotal = document.querySelector(".final-total-cost");
  if (!finalTotal) {
    console.log("khong tim thay o tong gia tien");
    return;
  }
  const total = cart.reduce((sum, item) => {
    const sanpham = timSanPham(item["san-pham"]);
    if (sanpham) {
      return sum + sanpham["price-n"] * item["so-luong"];
    }
    return sum;
  }, 0);
  finalTotal.textContent = total.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
function renderItemCuaHang(sanPham, cart) {
  const rowShop = document.createElement("tr");
  const hinhAnh = document.createElement("td");
  hinhAnh.style.position = "relative";
  const anhSanPham = document.createElement("img");
  anhSanPham.src = "/images/" + sanPham["image-file"];
  anhSanPham.classList.add("tiny-image");
  hinhAnh.appendChild(anhSanPham);

  // Tạo tooltip chứa hình ảnh lớn hơn
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");

  const largeImage = document.createElement("img");
  largeImage.src = "/images/" + sanPham["image-file"];
  largeImage.classList.add("lagre-image");
  tooltip.appendChild(largeImage);
  hinhAnh.appendChild(tooltip);

  // Xử lý hover để hiển thị tooltip
  anhSanPham.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
  });
  anhSanPham.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  rowShop.appendChild(hinhAnh);
  const ten = document.createElement("td");
  ten.textContent = sanPham["name"];
  rowShop.appendChild(ten);
  const gia = document.createElement("td");
  gia.textContent = sanPham["price"];
  rowShop.appendChild(gia);
  const loai = document.createElement("td");
  loai.textContent = sanPham["category"];
  rowShop.appendChild(loai);
  const them = document.createElement("td");
  const themVaoCart = document.createElement("button");
  themVaoCart.type = "button";
  const iconThemVaoCart = document.createElement("i");
  iconThemVaoCart.classList.add("fas", "fa-shopping-cart");
  themVaoCart.appendChild(iconThemVaoCart);
  themVaoCart.addEventListener("click", () => {
    cart.push({ "san-pham": sanPham["web-scraper-order"], "so-luong": 1 });
    console.log(cart);
    capNhatCart(cart);
  });
  them.appendChild(themVaoCart);
  rowShop.appendChild(them);
  return rowShop;
}
function renderCuaHang(cart, hamRenderItem, wrapperSelector = ".menuCuaHang") {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.log("Khong tim thay wrapper de hien thi cua hang");
    return;
  }
  wrapper.innerHTML = "";
  const danhSachConLai = [...g_sanPham];
  /*const danhSachConLai = danhSachCuaHang.filter(sp=>
    !cart.some(cartItem => cartItem["san-pham"]===sp["web-scraper-order"])
  );*/
  for (let cartItem of cart) {
    // Tìm tất cả các sản phẩm trong danh sách cửa hàng có "san-pham" trùng với "web-scraper-order"
    const index = danhSachConLai.findIndex(
      (s) => s["web-scraper-order"] === cartItem["san-pham"]
    );

    // Nếu tìm thấy, xóa sản phẩm đó khỏi danh sách cửa hàng
    if (index !== -1) {
      danhSachConLai.splice(index, 1);
    }
  }
  if (danhSachConLai.length === 0) {
    wrapper.appendChild(document.createTextNode("Khong con gi lun"));
  }
  const cuaHang = document.createElement("table");
  const muc = document.createElement("thead");
  const hinhAnh = document.createElement("th");
  hinhAnh.textContent = "";
  muc.appendChild(hinhAnh);
  const ten = document.createElement("th");
  ten.textContent = "Tên sản phẩm";
  muc.appendChild(ten);
  const gia = document.createElement("th");
  gia.textContent = "Giá";
  muc.appendChild(gia);
  const loai = document.createElement("th");
  loai.textContent = "Loại";
  muc.appendChild(loai);
  const them = document.createElement("th");
  them.textContent = "";
  muc.appendChild(them);
  cuaHang.appendChild(muc);
  const danhSach = document.createElement("tbody");
  for (const item of danhSachConLai) {
    danhSach.appendChild(hamRenderItem(item, cart));
  }
  cuaHang.appendChild(danhSach);
  wrapper.appendChild(cuaHang);
}
function capNhatCart(cart) {
  renderGioHang(cart, renderItemGioHang, ".menuGioHang");
  renderCuaHang(cart, renderItemCuaHang, ".menuCuaHang");
  capNhatFinalTotalCost(cart);
}
function renderItemKhachHang(nguoiDung) {
  const luachon = document.createElement("option");
  luachon.value = nguoiDung["id"];
  luachon.textContent = nguoiDung["name"] + " - " + nguoiDung["email"];
  return luachon;
}
function renderKhachHang(hamRenderItem, wrapperSelector = "#khach-hang") {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) {
    console.log("khong tim thay wrapper de render khachhang");
    return;
  }
  wrapper.innerHTML = "";
  const chuachon = document.createElement("option");
  chuachon.textContent = "--Chọn--";
  chuachon.disabled = true;
  chuachon.selected = true;
  wrapper.appendChild(chuachon);
  for (const item of [...g_nguoiDung]) {
    wrapper.appendChild(hamRenderItem(item));
  }
}
function adminThemHoaDon() {
  let cart = [];
  const invoiceDialog = document.getElementById("invoiceDialog");
  const invoiceForm = document.getElementById("invoiceForm");
  invoiceDialog.showModal();

  const today = new Date();
  const formattedDate = today.toISOString();
  document.getElementById("ngayTaoHoaDon").value = formattedDate;
  document.getElementById("xuLyHoaDon").value = "chua";
  renderKhachHang(renderItemKhachHang, "#khach-hang");
  renderGioHang(cart, renderItemGioHang, ".menuGioHang");
  renderCuaHang(cart, renderItemCuaHang, ".menuCuaHang");
  document.getElementById("taoKhachHang").addEventListener("click", () => {
    adminThemNguoiDung();
    renderKhachHang(renderItemKhachHang, "#khach-hang");
    document.getElementById("khach-hang").value = [...g_nguoiDung].toSorted(
      (a, b) => new Date(b["ngay-tao"]) - new Date(a["ngay-tao"])
    )[0]["id"];
  });
  document.getElementById("thoatThayDoi").addEventListener("click", () => {
    cart = null;
    invoiceDialog.close();
  });
  invoiceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newHoaDon = {
      "nguoi-dung": document.getElementById("khach-hang").value,
      "ngay-tao": document.getElementById("ngayTaoHoaDon").value,
      "chi-tiet": cart,
      "xu-ly": document.getElementById("xuLyHoaDon").value,
    };
    themHoaDon(id, newHoaDon);
    invoiceDialog.close();
  });
}

function adminSuaHoaDon(id) {
  const hoaDon = timHoaDon(id);
  if (!hoaDon) {
    alert("Không tìm thấy hóa đơn!");
    return;
  }
  let cart = [...hoaDon["chi-tiet"]];
  console.log(cart);

  const invoiceDialog = document.getElementById("invoiceDialog");
  const invoiceForm = document.getElementById("invoiceForm");
  invoiceDialog.showModal();

  //dien du lieu
  document.getElementById("maHoaDon").textContent = hoaDon["id"];
  document.getElementById("ngayTaoHoaDon").value = hoaDon["ngay-tao"];
  document.getElementById("xuLyHoaDon").value = hoaDon["xu-ly"];
  renderKhachHang(renderItemKhachHang, "#khach-hang");
  document.getElementById("khach-hang").value = hoaDon["nguoi-dung"];
  capNhatCart(cart);
  document.getElementById("taoKhachHang").addEventListener("click", () => {
    adminThemNguoiDung();
    renderKhachHang(renderItemKhachHang, "#khach-hang");
    document.getElementById("khach-hang").value = [...g_nguoiDung].toSorted(
      (a, b) => new Date(b["ngay-tao"]) - new Date(a["ngay-tao"])
    )[0]["id"];
  });
  document.getElementById("thoatThayDoi").addEventListener("click", () => {
    cart = null;
    invoiceDialog.close();
  });
  invoiceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newHoaDon = {
      "nguoi-dung": document.getElementById("khach-hang").value,
      "ngay-tao": hoaDon["ngay-tao"],
      "chi-tiet": cart,
      "xu-ly": document.getElementById("xuLyHoaDon").value,
    };
    suaHoaDon(id, newHoaDon);
    invoiceDialog.close();
  });
}

const addOrderToBin = new Set();
function adminXoaHoaDon() {
  if (addOrderToBin.size === 0) {
    alert("Doubleclick vào hàng để thêm vào danh sách xóa!");
    return;
  }

  const arr_AddOrderToBin = Array.from(addOrderToBin);
  if (confirm("Bạn chắc chắn muốn xóa những hóa đơn này?")) {
    for (let id of arr_AddOrderToBin) {
      xoaHoaDon(id);
    }
  }
}

window.addEventListener("load", function () {
  if(window.daylaTrangAdmin)
    onPageAdminLoad();
  
});

// function timNguoiDung(id) {
//   return g_nguoiDung.find((nguoiDung) => nguoiDung["id"] === id);
// }

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
function renderItemTopSanPham(item) {
  const rowTopBanChay = document.createElement("tr");
  const tenSanPhamBanChay = document.createElement("td");
  tenSanPhamBanChay.textContent = item["san-pham"]["name"];
  rowTopBanChay.appendChild(tenSanPhamBanChay);
  const daBan = document.createElement("td");
  daBan.textContent = item["so-luong"];
  rowTopBanChay.appendChild(daBan);
  const tongThu = document.createElement("td");
  tongThu.textContent = item["tong-thu"].toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  rowTopBanChay.appendChild(tongThu);
  return rowTopBanChay;
}
function hienThiTopSanPham(topSanPham, hamRenderItem, wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container-topsanpham");
  const table = document.createElement("table");
  table.classList.add("topsanpham-table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  th.scope = "col";
  th2.scope = "col";
  th3.scope = "col";
  th.textContent = "Sản Phẩm";
  th2.textContent = "Đã bán";
  th3.textContent = "Tổng Thu (VND)";
  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  for (let i = 0; i < Math.min(topSanPham.length, 10); i++) {
    tbody.appendChild(hamRenderItem(topSanPham[i]));
  }
  const khac = document.createElement("tr");
  const td = document.createElement("td");
  td.textContent = "...";
  const td2 = document.createElement("td");
  td2.textContent = "...";
  const td3 = document.createElement("td");
  td3.textContent = "...";
  khac.appendChild(td);
  khac.appendChild(td2);
  khac.appendChild(td3);
  tbody.appendChild(khac);
  table.appendChild(tbody);
  container.appendChild(table);
  wrapper.appendChild(container);
}

function sapXepTopSanPham(topsp, topSanPhamsDaLoc) {
  if (topsp === "ban-chay") {
    topSanPhamsDaLoc = topSanPhamBanChay();
  }
  if (topsp === "doanh-thu") topSanPhamsDaLoc = topSanPhamDoanhThu();
  return topSanPhamsDaLoc;
}

function sapXepTopNguoiDung(topnd, topNguoiDungsDaLoc) {
  if (topnd === "nhieu-don-nhat" || topnd === "")
    topNguoiDungsDaLoc = topKhachLenDon();
  if (topnd === "nhieu-loai-nhat") topNguoiDungsDaLoc = topKhachMuaNhieuLoai();
  if (topnd === "nhieu-hang-nhat") topNguoiDungsDaLoc = topKhachMuaNhieu();
  if (topnd === "nhieu-tien-nhat") topNguoiDungsDaLoc = topKhachChiTieu();
  return topNguoiDungsDaLoc;
}

function tinhTopHienThi() {
  let { topsp, topnd } = layParamUrl();
  console.log("đã lấy param");
  let topSanPhamsDaLoc = thongKeSanPham();
  console.log("Thống kê sản phẩm:", topSanPhamsDaLoc);
  topSanPhamsDaLoc = sapXepTopSanPham(topsp, topSanPhamsDaLoc);
  const topSanPhamsHienThi = topSanPhamsDaLoc.slice(0, 10);
  let topNguoiDungsDaLoc = thongKeNguoiDung();
  topNguoiDungsDaLoc = sapXepTopNguoiDung(topnd, topNguoiDungsDaLoc);
  const topNguoiDungsHienThi = topNguoiDungsDaLoc.slice(0, 10);
  hienThiTop(topNguoiDungsHienThi, topSanPhamsHienThi);
}

function hienThiTop(topNguoiDungsHienThi, topSanPhamsHienThi) {
  hienThiTopNguoiDung(
    topNguoiDungsHienThi,
    renderItemTopNguoiDung,
    ".topkhachhang"
  );
  hienThiTopSanPham(topSanPhamsHienThi, renderItemTopSanPham, ".topsanpham");
}

function renderItemTopNguoiDung(item) {
  const rowTopNguoiDung = document.createElement("tr");
  const tenNguoiDung = document.createElement("td");
  tenNguoiDung.textContent = item["nguoi-dung"]["name"];
  rowTopNguoiDung.appendChild(tenNguoiDung);
  const soDon = document.createElement("td");
  soDon.textContent = item["so-don"];
  rowTopNguoiDung.appendChild(soDon);
  const loaiDaMua = document.createElement("td");
  loaiDaMua.textContent = item["loai-da-mua"];
  rowTopNguoiDung.appendChild(loaiDaMua);
  const daMua = document.createElement("td");
  daMua.textContent = item["da-mua"];
  rowTopNguoiDung.appendChild(daMua);
  const tongChi = document.createElement("td");
  tongChi.textContent = item["tong-chi"].toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  rowTopNguoiDung.appendChild(tongChi);
  return rowTopNguoiDung;
}

function hienThiTopNguoiDung(topNguoiDung, hamRenderItem, wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container-topnguoidung");
  const table = document.createElement("table");
  table.classList.add("topnguoidung-table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  const th5 = document.createElement("th");
  th.scope = "col";
  th2.scope = "col";
  th3.scope = "col";
  th4.scope = "col";
  th5.scope = "col";
  th.textContent = "Người Dùng";
  th2.textContent = "Số Đơn";
  th3.textContent = "Loại Đã Mua";
  th4.textContent = "Đã Mua";
  th5.textContent = "Tổng Chi";
  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  if (topNguoiDung.length === 0)
    container.appendChild(document.createTextNode("Khong co hoa don nao"));
  for (let i = 0; i < Math.min(topNguoiDung.length, 10); i++) {
    tbody.appendChild(hamRenderItem(topNguoiDung[i]));
  }
  const khac = document.createElement("tr");
  const td = document.createElement("td");
  td.textContent = "...";
  const td2 = document.createElement("td");
  td2.textContent = "...";
  const td3 = document.createElement("td");
  td3.textContent = "...";
  const td4 = document.createElement("td");
  td4.textContent = "...";
  const td5 = document.createElement("td");
  td5.textContent = "...";
  khac.appendChild(td);
  khac.appendChild(td2);
  khac.appendChild(td3);
  khac.appendChild(td4);
  khac.appendChild(td5);
  tbody.appendChild(khac);
  table.appendChild(tbody);
  container.appendChild(table);
  wrapper.appendChild(container);
}
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
function loadTabContent(tabName, sauKhiTai) {
  function fetchContent(url, onSuccess, onFailure) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`loadTabContent Failed to fetch ${url}`);
        }
        return response.text();
      })
      .then(onSuccess)
      .catch(onFailure);
  }
  const content_area = document.getElementById("content-wrapper");
  if (!content_area) return;
  const onFetchSuccess = (data) => {
    content_area.innerHTML = data;
    sauKhiTai();
  };
  const onFetchFailure = () => {
    fetchContent(`${tabName}.html`, onFetchSuccess, (error) => {
      console.error("loadTabContent Error loading HTML content:", error);
    });
  };
  fetchContent(`${tabName}.xml`, onFetchSuccess, (error) => {
    console.error("loadTabContent Error loading XML content:", error);
    onFetchFailure();
  });
}

var tabthongke = document.getElementById("thongke");
if (tabthongke) {
  tabthongke.addEventListener("click", () => {
    caiParamUrl({ tab: "thongke" }, true);
  });
}

var tabnguoidung = document.getElementById("nguoidung");
if (tabnguoidung) {
  tabnguoidung.addEventListener("click", () => {
    caiParamUrl({ tab: "nguoidung" }, true);
  });
}

var tabsanpham = document.getElementById("sanpham");
if (tabsanpham) {
  tabsanpham.addEventListener("click", () => {
    caiParamUrl({ tab: "sanpham" }, true);
  });
}

var tabhoadon = document.getElementById("hoadon");
if (tabhoadon) {
  tabhoadon.addEventListener("click", () => {
    caiParamUrl({ tab: "hoadon" }, true);
  });
}

function onPageAdminLoad() {
  
  const params = layParamUrl();
  const tab = params["tab"] || "thongke";
  switch (tab) {
    case "nguoidung":
      loadTabContent("nguoidung", () => {
        taiDuLieuTongMainJs(() =>
          taiNguoiDung(() => {
            taoBoLocNguoiDung();
          })
        );
        toggleModeButton(adminThemNguoiDung, adminXoaNguoiDung);
      });
      tabnguoidung.classList.add("isActive");
      break;
    case "sanpham":
      loadTabContent("sanpham", () => {
        taiDuLieuTongMainJs(() => taiSanPham(() => {}));
        taoNutThemSanPham();
      });
      tabsanpham.classList.add("isActive");
      break;
    case "hoadon":
      loadTabContent("hoadon", () => {
        taiDuLieuTongMainJs(() =>
          taiHoaDon(() => {
            tinhHoaDonHienThi();
            taoBoLocHoaDon();
          })
        );
        toggleModeButton(adminThemHoaDon, adminXoaHoaDon);
      });

      tabhoadon.classList.add("isActive");
      break;
    case "bieudo-test":
      loadTabContent("bieudo-test", () =>
        taiDuLieuTongMainJs(() =>
          taiHoaDon(() => taiNguoiDung(() => taiSanPham(() => taoBieuDo())))
        )
      );
      doiMauBackGround();
      break;
    default:
      loadTabContent("thongke", () =>
        taiDuLieuTongMainJs(() =>
          taiHoaDon(() =>
            taiGioHang(() => {
              taoBoLocTop();
              tinhTopHienThi();
              themChuyenTrangVaoThongKe();
              themDuLieuVaoTheThongKe();
            })
          )
        )
      );
      tabthongke.classList.add("isActive");
  }

}

function taoBoLocNguoiDung() {
  // Lấy form
  const form = document.getElementById("filter");
  if (!form) {
    console.error("Không tìm thấy form #filter");
    return;
  }

  // Lấy các phần tử trong form
  const disabledSelect = document.getElementById("disabled");
  const sortSelect = document.getElementById("sort");

  // Kiểm tra và lưu lại các giá trị từ URL
  const { disabled, sort } = layParamUrl(); // Hàm giả định lấy params từ URL
  if (disabled !== undefined) disabledSelect.value = disabled;
  if (sort !== undefined) sortSelect.value = sort;

  // Xử lý khi form được submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Lấy giá trị từ form
    const formData = new FormData(form);
    const filterParams = {};
    formData.forEach((value, key) => {
      filterParams[key] = value;
    });

    // Kiểm tra và hiển thị cảnh báo nếu cần
    /*if (!filterParams.disabled && !filterParams.sort) {
      alert("Vui lòng chọn ít nhất một bộ lọc hoặc sắp xếp");
      return;
    }*/

    // Cập nhật URL hoặc gửi dữ liệu qua AJAX
    caiParamUrl(filterParams); // Hàm giả định cập nhật URL hoặc gửi request
  });
}

function taoBoLocHoaDon() {
  // Lấy form và các phần tử bên trong
  const form = document.getElementById("filterHoaDon");
  if (!form) {
    console.error("Không tìm thấy form #filterHoaDon");
    return;
  }

  const handleSelect = document.getElementById("handle");
  const sortSelect = document.getElementById("sort");

  // Lấy dữ liệu từ URL và hiển thị lại trên form
  const { handle, sort } = layParamUrl(); // Hàm lấy dữ liệu từ URL
  if (handle !== undefined) handleSelect.value = handle;
  if (sort !== undefined) sortSelect.value = sort;

  // Xử lý sự kiện submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Thu thập dữ liệu từ form
    const formData = new FormData(form);
    const filterParams = {};
    formData.forEach((value, key) => {
      filterParams[key] = value;
    });

    // Hiển thị thông báo nếu không chọn gì
    if (!filterParams.handle && !filterParams.sort) {
      alert("Vui lòng chọn ít nhất một bộ lọc hoặc sắp xếp");
      return;
    }

    // Gửi dữ liệu hoặc cập nhật URL
    caiParamUrl(filterParams); // Hàm giả định gửi request hoặc reload trang
  });
}

function taoBoLocTop() {
  const form = document.getElementById("filterTop");
  if (!form) {
    console.error("Không tìm thấy form #filterTop");
    return;
  }

  const topspSelect = document.getElementById("topsp");
  const topndSelect = document.getElementById("topnd");

  // Lấy tham số từ URL
  const { topsp, topnd } = layParamUrl();
  if (topsp) topspSelect.value = topsp;
  if (topnd) topndSelect.value = topnd;

  // Xử lý submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const params = new FormData(form);
    const filterParams = {};
    params.forEach((value, key) => {
      filterParams[key] = value;
    });
    caiParamUrl(filterParams);
  });
}

function themChuyenTrangVaoThongKe() {
  var chuyenTrangSanPham = document.getElementById("cardsanpham");
  if (!chuyenTrangSanPham) {
    console.error("Không tìm thấy id de chuyen trang san pham");
    return;
  }
  chuyenTrangSanPham.addEventListener("click", () => {
    caiParamUrl({ tab: "sanpham" }, false);
  });
  var chuyenTrangNguoiDung = document.getElementById("cardnguoidung");
  if (!chuyenTrangNguoiDung) {
    console.error("Không tìm thấy id de chuyen trang nguoi dung");
    return;
  }
  chuyenTrangNguoiDung.addEventListener("click", () => {
    caiParamUrl({ tab: "nguoidung" }, false);
  });
  var chuyenTrangHoaDon = document.getElementById("cardhoadon");
  if (!chuyenTrangHoaDon) {
    console.error("Không tìm thấy id de chuyen trang nguoi dung");
    return;
  }
  chuyenTrangHoaDon.addEventListener("click", () => {
    caiParamUrl({ tab: "hoadon" }, false);
  });
  var chuyenTrangBieuDo = document.getElementById("carddoanhthu");
  if (!chuyenTrangBieuDo) {
    console.error("khong tim thay id de chuyen trang bieu do");
    return;
  }
  chuyenTrangBieuDo.addEventListener("click", () => {
    caiParamUrl({ tab: "bieudo-test" }, false);
  });
}

function doiMauBackGround() {
  var bg = document.getElementById("content-wrapper");
  if (!bg) {
    console.error("khong tim thay content wrapper");
    return;
  }
  bg.classList.add("change-background");
}

function themDuLieuVaoTheThongKe() {
  const soLieuSp = thongKeGioHang();
  var soLieuSanPham = document.querySelector(".bg-mattRed .inner h3");
  soLieuSanPham.textContent = soLieuSp["totalProductCount"];
  var tenSoLieuSanPham = document.querySelector(".bg-mattRed .inner p");
  tenSoLieuSanPham.textContent ="Sản phẩm, " + soLieuSp["uniqueProductCount"] + " mặt hàng";
  const soLieuHd = thongKeDonHang();
  var soLieuHoaDon = document.querySelector(".bg-green .inner h3");
  soLieuHoaDon.textContent = soLieuHd["orderCount"];
  var tenSoLieuHoaDon = document.querySelector(".bg-green .inner p");
  tenSoLieuHoaDon.textContent = "Đơn hàng";
  const soLieuTk = thongKeTaiKhoan();
  var soLieuTaiKhoan = document.querySelector(".bg-orange .inner h3");
  soLieuTaiKhoan.textContent = soLieuTk["activeCount"];
  var tenSoLieuTaiKhoan = document.querySelector(".bg-orange .inner p");
  tenSoLieuTaiKhoan.textContent = "Tài khoản đang hoạt động";
  const soLieuTc = thongKeTruyCap();
  var soLieuLuotXem = document.querySelector(".bg-blue .inner h3");
  soLieuLuotXem.textContent = soLieuTc["viewCountThisMonth"];
  var tenSoLieuLuotXem = document.querySelector(".bg-blue .inner p");
  tenSoLieuLuotXem.textContent = "Lượt truy cập trang";
  var soLieuXemAd = document.querySelector(".bg-maroon .inner h3");
  soLieuXemAd.textContent = soLieuTc["adsClicksThisMonth"];
  var tenSoLieuXemAd = document.querySelector(".bg-maroon .inner p");
  tenSoLieuXemAd.textContent = "Lượt nhấn vào quảng cáo";
  var soLieuDoanhThu = document.querySelector(".bg-red .inner h3");
  soLieuDoanhThu.textContent = thongKeDoanhThu().toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  var tenSoLieuDoanhThu = document.querySelector(".bg-red .inner p");
  tenSoLieuDoanhThu.textContent = "Doanh thu tháng";
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

let clickTimeout;

function toggleModeButton(adminThem, adminXoa) {
  const modeButton = document.querySelector(".mode-button");
  if (!modeButton) {
    console.error("Không tìm thấy mode-button");
    return;
  }
  const icon = modeButton.querySelector(".fas");
  if (!icon) {
    console.error("Không tìm thấy icon trong mode-button");
    return;
  }
  modeButton.addEventListener("dblclick", () => {
    if (icon.classList.contains("fa-plus")) {
      icon.classList.remove("fa-plus");
      modeButton.classList.remove("color-add");
      icon.classList.add("fa-wrench");
      modeButton.classList.add("color-edit");
    } else if (icon.classList.contains("fa-wrench")) {
      icon.classList.remove("fa-wrench");
      modeButton.classList.remove("color-edit");
      icon.classList.add("fa-trash");
      modeButton.classList.add("color-delete");
    } else if (icon.classList.contains("fa-trash")) {
      icon.classList.remove("fa-trash");
      modeButton.classList.remove("color-delete");
      icon.classList.add("fa-plus");
      modeButton.classList.add("color-add");
    }
  });

  modeButton.addEventListener("click", () => {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      if (icon.classList.contains("fa-plus")) {
        adminThem();
      } else if (icon.classList.contains("fa-wrench")) {
        alert("Doubleclick vào hàng để chỉnh sửa!");
      } else if (icon.classList.contains("fa-trash")) {
        adminXoa();
      }
    }, 300);
  });
}

// !!!  CHU Y --------------------------------------------------------------------------------------------
