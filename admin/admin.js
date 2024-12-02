const toggler = document.querySelector(".topbar-toggler");
const collapse = document.querySelector(".topbar-collapse");
if (toggler) {
  toggler.addEventListener("click", () => {
    collapse.style.display =
      collapse.style.display === "flex" ? "none" : "flex";
  });
}

function PhongSide() {
  sidebar.style.width = "200px";
}

function ThuSide() {
  sidebar.style.width = "80px";
}

function kichHoat(e) {
  if (e.classList.contains("color-green")) {
    if (confirm("Bạn có chắc chắn muốn khoá tài khoản này?")) {
      e.classList.toggle("color-green");
      e.parentElement.parentElement.style.backgroundColor = "rgba(255,0,0,0.3)";
      e.parentElement.parentElement.style.textDecoration = "line-through";
    }
  } else {
    e.classList.toggle("color-green");
    e.parentElement.parentElement.style.backgroundColor = "transparent";
    e.parentElement.parentElement.style.textDecoration = "none";
  }
}

function tinhSanPhamHienThi(wrapperSelector = ".product-list") {
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

  hienThiSanPham(duLieuDaTinh, wrapperSelector);
}

function hienThiDanhSach(duLieuDaTinh, hamRenderItem, wrapperSelector) {
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
function renderItemSanPham(sanPham) {
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
function hienThiSanPham(duLieuDaTinh, wrapperSelector) {
  const khiBamTrang = () =>
    hienThiDanhSach(duLieuDaTinh, renderItemSanPham, wrapperSelector);
  khiBamTrang();
  hienThiPagination(duLieuDaTinh, () => khiBamTrang());
}

function adminSuaSanPham(id) {
  const sanPham = timSanPham(id);
  if (!sanPham) {
    alert("Khong tim thay san pham!");
  }

  // TODO: hien form chinh sua

  updateSanPham(id, newSanPham);
}

function adminXoaSanPham(id) {
  if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    deleteSanPham(id);
  }
}
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
  active.addEventListener("click", () => kichHoat(active));
  const trangthai = document.createElement("td");
  trangthai.classList.add("kichhoat");
  trangthai.appendChild(active);
  rowNguoiDung.appendChild(trangthai);
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
        break;
      case "dang":
        xuly.classList.add("dang");
        break;
      case "huy":
        xuly.classList.add("huy");
        break;
      case "roi":
        xuly.classList.add("roi");
        select.disabled = true;
        break;
    }
  });
  xuly.appendChild(select);
  rowHoaDon.appendChild(xuly);
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
  if (handle === null) return hoaDonsDaLoc;
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

window.addEventListener("load", function () {
  onPageLoad();
});

function timNguoiDung(id) {
  return g_nguoiDung.find((nguoiDung) => nguoiDung["id"] === id);
}

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

function loadTabContent(tabName, sauKhiTai) {
  fetch(`${tabName}.html`)
    .then((response) => response.text())
    .then((data) => {
      const content_area = document.getElementById("content-wrapper");
      if (content_area) {
        content_area.innerHTML = data;
      }
      sauKhiTai();
    });
}

var tabthongke = document.getElementById("thongke");
if (tabthongke) {
  tabthongke.addEventListener("click", () => {
    caiParamUrl({ tab: "thongke" }, false);
  });
}

var tabnguoidung = document.getElementById("nguoidung");
if (tabnguoidung) {
  tabnguoidung.addEventListener("click", () => {
    caiParamUrl({ tab: "nguoidung" }, false);
  });
}

var tabsanpham = document.getElementById("sanpham");
if (tabsanpham) {
  tabsanpham.addEventListener("click", () => {
    caiParamUrl({ tab: "sanpham" }, false);
  });
}

var tabhoadon = document.getElementById("hoadon");
if (tabhoadon) {
  tabhoadon.addEventListener("click", () => {
    caiParamUrl({ tab: "hoadon" }, false);
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
        taiDuLieuTongMainJs(() => taiSanPham(() => {}))
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
    if (!filterParams.disabled && !filterParams.sort) {
      alert("Vui lòng chọn ít nhất một bộ lọc hoặc sắp xếp");
      return;
    }

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
  tenSoLieuSanPham.textContent = soLieuSp["uniqueProductCount"] + " mặt hàng";
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
  const soLieuTg = thongKeThoiGian();
  if (soLieuTg) {
    var soLieuDoanhThu = document.querySelector(".bg-red .inner h3");
    soLieuDoanhThu.textContent = thongKeDoanhThu().toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    var tenSoLieuDoanhThu = document.querySelector(".bg-red .inner p");
    tenSoLieuDoanhThu.textContent = "Doanh thu tháng";
  }
}

// !!!  CHU Y --------------------------------------------------------------------------------------------
/*function thongKeSanPham({ ngay, thang, nam } = {}) {
  return Object.entries(
    g_hoaDon.reduce((spSl, hd) => {
      // Kiểm tra điều kiện lọc ngày
      if (!shouldProcessDate(hd["ngay-tao"], { ngay, thang, nam })) return spSl;

      // Xử lý từng chi tiết hóa đơn
      hd["chi-tiet"].forEach((ct) => {
        const sp = ct["san-pham"];
        spSl[sp] = (spSl[sp] ?? 0) + ct["so-luong"];
      });
      return spSl;
    }, {})
  ).map(([spId, sl]) => {
    const sp = timSanPham(spId);

    // Nếu không tìm thấy sản phẩm
    if (!sp) {
      console.warn(`Không tìm thấy sản phẩm với ID: ${spId}`);
      return {
        id: spId,
        name: "Unknown Product", // Tên mặc định nếu không tìm thấy sản phẩm
        "so-luong": sl,
        "tong-thu": 0, // Không tính doanh thu cho sản phẩm không tồn tại
      };
    }

    // Nếu sản phẩm tồn tại
    return {
      ...sp,
      "so-luong": sl,
      "tong-thu": sl * (sp["price-sale-n"] ?? 0), // Giá trị mặc định là 0 nếu `price-sale-n` không tồn tại
    };
  });
}
function thongKeNguoiDung({ ngay, thang, nam } = {}) {
  return Object.entries(
    g_hoaDon.reduce((ndCt, hd) => {
      // Lọc các hóa đơn dựa trên ngày
      if (!shouldProcessDate(hd["ngay-tao"], { ngay, thang, nam })) return ndCt;

      const nd = hd["nguoi-dung"];
      if (!ndCt[nd]) ndCt[nd] = { "tieu-thu": {}, "so-don": 0 };

      // Tăng số đơn của người dùng
      ndCt[nd]["so-don"] += 1;

      // Thống kê tiêu thụ sản phẩm của người dùng
      hd["chi-tiet"].forEach((ct) => {
        const sp = ct["san-pham"];
        ndCt[nd]["tieu-thu"][sp] =
          (ndCt[nd]["tieu-thu"][sp] ?? 0) + ct["so-luong"];
      });

      return ndCt;
    }, {})
  ).map(([ndId, ct]) => {
    const tt = ct["tieu-thu"];

    // Lấy thông tin người dùng
    const nguoiDung = timNguoiDung(ndId);
    if (!nguoiDung) {
      console.warn(`Không tìm thấy người dùng với ID: ${ndId}`);
      return {
        id: ndId,
        name: "Unknown User",
        "so-don": ct["so-don"],
        "loai-da-mua": Object.keys(tt).length,
        "da-mua": Object.values(tt).reduce((sum, qty) => sum + qty, 0),
        "tong-chi": 0, // Không tính tổng chi cho người dùng không tồn tại
      };
    }

    // Tính tổng chi
    const tongChi = Object.entries(tt).reduce((total, [spId, qty]) => {
      const sp = timSanPham(spId);
      if (!sp) {
        console.warn(`Không tìm thấy sản phẩm với ID: ${spId}`);
        return total; // Bỏ qua sản phẩm không tồn tại
      }
      const priceSale = sp["price-sale-n"] ?? 0; // Giá trị mặc định nếu thiếu
      return total + qty * priceSale;
    }, 0);

    return {
      ...nguoiDung,
      "so-don": ct["so-don"],
      "loai-da-mua": Object.keys(tt).length,
      "da-mua": Object.values(tt).reduce((sum, qty) => sum + qty, 0),
      "tong-chi": tongChi,
    };
  });
}

function thongKeThoiGian() {
  const yearlyResult = {};

  // Step 1: Fill daily data
  g_hoaDon.forEach((hoaDon) => {
    const ngayTao = new Date(hoaDon["ngay-tao"]);
    const year = ngayTao.getFullYear();
    const month = ngayTao.getMonth() + 1; // getMonth() is zero-based
    const day = ngayTao.getDate();

    if (!yearlyResult[year]) {
      yearlyResult[year] = {
        "chi-tiet": Array(12)
          .fill()
          .map(() => ({
            "so-don": 0,
            "so-khach-set": new Set(),
            "so-khach": 0,
            "loai-da-ban-set": new Set(),
            "loai-da-ban": 0,
            "da-ban": 0,
            "tong-thu": 0,
            "chi-tiet": [],
          })),
      };
    }
    if (yearlyResult[year]["chi-tiet"][month - 1]["chi-tiet"].length === 0) {
      yearlyResult[year]["chi-tiet"][month - 1]["chi-tiet"] = Array(
        new Date(year, month, 0).getDate()
      )
        .fill()
        .map(() => ({
          "so-don": 0,
          "so-khach-set": new Set(),
          "so-khach": 0,
          "loai-da-ban-set": new Set(),
          "loai-da-ban": 0,
          "da-ban": 0,
          "tong-thu": 0,
        }));
    }

    const dayData =
      yearlyResult[year]["chi-tiet"][month - 1]["chi-tiet"][day - 1];
    dayData["so-don"] += 1;
    dayData["so-khach-set"].add(hoaDon["nguoi-dung"]);
    hoaDon["chi-tiet"].forEach((chiTiet) => {
      dayData["loai-da-ban-set"].add(chiTiet["san-pham"]);
      dayData["da-ban"] += chiTiet["so-luong"];
      const sanPham = timSanPham(chiTiet["san-pham"]);
      if(sanPham!= null || sanPham != undefined)
      dayData["tong-thu"] +=
        (sanPham["price-sale-n"] || 0) * chiTiet["so-luong"];
    });
  });

  // Step 2: Aggregate monthly data
  Object.entries(yearlyResult).forEach(([year, yearData]) => {
    yearData["chi-tiet"].forEach((monthDetail, monthIndex) => {
      const monthData = {
        "so-don": 0,
        "so-khach-set": new Set(),
        "so-khach": 0,
        "loai-da-ban-set": new Set(),
        "loai-da-ban": 0,
        "da-ban": 0,
        "tong-thu": 0,
        "chi-tiet": monthDetail["chi-tiet"],
      };

      monthData["chi-tiet"].forEach((dayData) => {
        monthData["so-don"] += dayData["so-don"];
        dayData["so-khach-set"].forEach(
          monthData["so-khach-set"].add,
          monthData["so-khach-set"]
        );
        dayData["so-khach"] = dayData["so-khach-set"].size;
        dayData["loai-da-ban-set"].forEach(
          monthData["loai-da-ban-set"].add,
          monthData["loai-da-ban-set"]
        );
        dayData["loai-da-ban"] = dayData["loai-da-ban-set"].size;
        monthData["da-ban"] += dayData["da-ban"];
        monthData["tong-thu"] += dayData["tong-thu"];
      });

      yearlyResult[year]["chi-tiet"][monthIndex] = {
        ...monthData,
        "so-khach": monthData["so-khach-set"].size,
        "loai-da-ban": monthData["loai-da-ban-set"].size,
      };
    });
  });

  // Step 3: Aggregate yearly data
  Object.entries(yearlyResult).forEach(([year, yearDetail]) => {
    const yearData = {
      "so-don": 0,
      "so-khach-set": new Set(),
      "so-khach": 0,
      "loai-da-ban-set": new Set(),
      "loai-da-ban": 0,
      "da-ban": 0,
      "tong-thu": 0,
      "chi-tiet": yearDetail["chi-tiet"],
    };

    yearData["chi-tiet"].forEach((monthData) => {
      yearData["so-don"] += monthData["so-don"];
      monthData["so-khach-set"].forEach(
        yearData["so-khach-set"].add,
        yearData["so-khach-set"]
      );
      monthData["loai-da-ban-set"].forEach(
        yearData["loai-da-ban-set"].add,
        yearData["loai-da-ban-set"]
      );
      yearData["da-ban"] += monthData["da-ban"];
      yearData["tong-thu"] += monthData["tong-thu"];
    });

    yearlyResult[year] = {
      ...yearData,
      "so-khach": yearData["so-khach-set"].size,
      "loai-da-ban": yearData["loai-da-ban-set"].size,
    };
  });

  // Step 4: Aggregate all years into the final object
  const allTimeResult = {
    "so-don": 0,
    "so-khach-set": new Set(),
    "so-khach": 0,
    "loai-da-ban-set": new Set(),
    "loai-da-ban": 0,
    "da-ban": 0,
    "tong-thu": 0,
    "chi-tiet": yearlyResult, // Use the result from Steps 1-3
  };

  Object.values(yearlyResult).forEach((yearData) => {
    allTimeResult["so-don"] += yearData["so-don"];
    yearData["so-khach-set"].forEach(
      allTimeResult["so-khach-set"].add,
      allTimeResult["so-khach-set"]
    );
    yearData["loai-da-ban-set"].forEach(
      allTimeResult["loai-da-ban-set"].add,
      allTimeResult["loai-da-ban-set"]
    );
    allTimeResult["da-ban"] += yearData["da-ban"];
    allTimeResult["tong-thu"] += yearData["tong-thu"];
  });

  allTimeResult["so-khach"] = allTimeResult["so-khach-set"].size;
  allTimeResult["loai-da-ban"] = allTimeResult["loai-da-ban-set"].size;

  return allTimeResult;
}
*/
