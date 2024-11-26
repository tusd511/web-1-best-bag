var esanpham = document.getElementById("quanlysanpham");
var edonhang = document.getElementById("quanlydonhang");
var enguoidung = document.getElementById("quanlynguoidung");
var ethongke = document.getElementById("quanlythongke");

var sidebar = document.getElementsByClassName("sideMenu")[0];

function PhongSide() {
  sidebar.style.width = "200px";
}

function ThuSide() {
  sidebar.style.width = "80px";
}

var noActive = document.getElementsByClassName("sidebar-link");

function hiensanpham() {
  for (i = 0; i < noActive.length; i++)
    if (noActive[i].classList.contains("isActive"))
      noActive[i].classList.remove("isActive");
  noActive[1].classList.add("isActive");
  esanpham.style.display = "block";
  edonhang.style.display = "none";
  enguoidung.style.display = "none";
  ethongke.style.display = "none";
}

function hiendonhang() {
  for (i = 0; i < noActive.length; i++)
    if (noActive[i].classList.contains("isActive"))
      noActive[i].classList.remove("isActive");
  noActive[3].classList.add("isActive");
  esanpham.style.display = "none";
  enguoidung.style.display = "none";
  ethongke.style.display = "none";
  edonhang.style.display = "block";
}

function hiennguoidung() {
  for (i = 0; i < noActive.length; i++)
    if (noActive[i].classList.contains("isActive"))
      noActive[i].classList.remove("isActive");
  noActive[2].classList.add("isActive");
  esanpham.style.display = "none";
  edonhang.style.display = "none";
  ethongke.style.display = "none";
  enguoidung.style.display = "block";
}

function hienthongke() {
  for (i = 0; i < noActive.length; i++)
    if (noActive[i].classList.contains("isActive"))
      noActive[i].classList.remove("isActive");
  noActive[0].classList.add("isActive");
  esanpham.style.display = "none";
  edonhang.style.display = "none";
  enguoidung.style.display = "none";
  ethongke.style.display = "block";
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

function hienThiDanhSach(duLieusHienThi, hamRenderItem, wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("grid-container");
  if (duLieusHienThi.length === 0)
    container.appendChild(
      document.createTextNode("Khong co san pham dap ung tieu chi")
    );
  for (const item of duLieusHienThi) {
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
function hienThiSanPham(sanPhamsHienThi, paramPhanTrang) {
  createPaginationDebugTable(paramPhanTrang);
  hienThiDanhSach(sanPhamsHienThi, renderItemSanPham, ".product-list");
  hienThiPagination(paramPhanTrang.page, paramPhanTrang.soPageToiDa);
}

function adminSuaSanPham(id) {
  const sanPham = timSanPham(id);
  // TODO: hien form chinh sua

  //   suaSanPham(id, newSanPham);
}

function adminXoaSanPham(id) {
  xoaSanPham(id);
}
var soNguoiDungMoiTrang = 25;
function tinhNguoiDungHienThi() {
  let { page, sort, disabled } = layParamUrl();
  let nguoiDungsDaLoc = [...g_nguoiDung];
  nguoiDungsDaLoc = locTrangThaiKhoa(disabled, nguoiDungsDaLoc);
  nguoiDungsDaLoc = sapXepNguoiDung(sort, nguoiDungsDaLoc);
  const soLuongNguoiDung = nguoiDungsDaLoc.length;
  const soPageToiDa = Math.ceil(soLuongNguoiDung / soNguoiDungMoiTrang);
  let chiSoBatDau = 0;
  if (page < 1 || isNaN(page) || page == null) {
    page = 1;
  }
  chiSoBatDau = (page - 1) * soNguoiDungMoiTrang;
  if (chiSoBatDau > soLuongNguoiDung) {
    caiParamUrlVaReload({ page: soPageToiDa }, false);
  }
  const nguoiDungsHienThi = nguoiDungsDaLoc.slice(
    chiSoBatDau,
    Math.min(chiSoBatDau + soNguoiDungMoiTrang, soLuongNguoiDung)
  );
  hienThiNguoiDung(nguoiDungsHienThi, {
    page,
    soPageToiDa,
    sort,
    soLuongNguoiDung,
    tongSoNguoiDung: g_nguoiDung.length,
    chiSoBatDau,
    soNguoiDungMoiTrang,
  });
}
function hienThiNguoiDung(nguoiDungsHienThi, paramPhanTrang) {
  createPaginationDebugTable(paramPhanTrang);
  hienThiDanhSachNguoiDung(
    nguoiDungsHienThi,
    renderItemNguoiDung,
    ".account-list"
  );
  hienThiPagination(
    paramPhanTrang.page,
    paramPhanTrang.soPageToiDa,
    ".pagination2"
  );
}

function renderItemNguoiDung(nguoiDung) {
  const rowNguoiDung = document.createElement("tr");
  const ngaytao = document.createElement("td");
  ngaytao.textContent = nguoiDung["ngay-tao"];
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
  duLieusHienThi,
  hamRenderItem,
  wrapperSelector
) {
  const wrapper = document.querySelector(wrapperSelector);
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
  if (duLieusHienThi === 0)
    container.appendChild(document.createTextNode("Khong co khach hang nao"));
  for (const item of duLieusHienThi) {
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
  if (disabled)
    return nguoiDungsDaLoc.filter(
      (nguoiDung) => nguoiDung["disabled"] === false);
  if(!disabled)
    return nguoiDungsDaLoc.filter(
      (nguoiDung) => nguoiDung["disabled"] === true);
  
  return nguoiDungsDaLoc;
}

var soHoaDonMoiTrang = 25;
function tinhHoaDonHienThi() {
  let { page, sort } = layParamUrl();
  let hoaDonsDaLoc = [...g_hoaDon];

  const soLuongHoaDon = hoaDonsDaLoc.length;
  const soPageToiDa = Math.ceil(soLuongHoaDon / soHoaDonMoiTrang);
  let chiSoBatDau = 0;
  if (page < 1 || isNaN(page) || page == null) {
    page = 1;
  }
  chiSoBatDau = (page - 1) * soHoaDonMoiTrang;
  if (chiSoBatDau > soLuongHoaDon) {
    caiParamUrlVaReload({ page: soPageToiDa }, false);
  }

  const hoaDonsHienThi = hoaDonsDaLoc.slice(
    chiSoBatDau,
    Math.min(chiSoBatDau + soHoaDonMoiTrang, soLuongHoaDon)
  );
  hienThiHoaDon(hoaDonsHienThi, {
    page,
    soPageToiDa,
    sort,
    soLuongHoaDon,
    tongSoHoaDon: g_hoaDon.length,
    chiSoBatDau,
    soHoaDonMoiTrang,
  });
}

function hienThiHoaDon(hoaDonsHienThi, paramPhanTrang) {
  createPaginationDebugTable(paramPhanTrang);
  hienThiDanhSachHoaDon(hoaDonsHienThi, renderItemHoaDon, ".order-list");
  hienThiPagination(paramPhanTrang.page, paramPhanTrang.soPageToiDa,".pagination3");
}

function renderItemHoaDon(hoaDon) {
  const rowHoaDon = document.createElement("tr");
  const ngayTaoHoaDon = document.createElement("td");
  ngayTaoHoaDon.textContent = hoaDon["ngay-tao"];
  rowHoaDon.appendChild(ngayTaoHoaDon);
  const khachHang = document.createElement("td");
  //khachHang.textContent = timNguoiDung(hoaDon["nguoi-dung"])["name"]; 
  khachHang.textContent = hoaDon["nguoi-dung"];
  rowHoaDon.appendChild(khachHang);
  const chiTietHoaDon = document.createElement("td");
  const minitable = document.createElement("table");
  minitable.style.borderCollapse = "collapse";
  for (let i = 0; i < hoaDon["chi-tiet"].length; i++) {
    const trmini = document.createElement("tr");
    const tdmini = document.createElement("td");
    //tdmini.textContent = timSanPham(hoaDon["chi-tiet"][i]["san-pham"])["name"];
    tdmini.textContent = hoaDon["chi-tiet"][i]["san-pham"];
    trmini.appendChild(tdmini);
    const tdmini2 = document.createElement("td");
    tdmini2.textContent = hoaDon["chi-tiet"][i]["so-luong"];
    trmini.appendChild(tdmini2);
    minitable.appendChild(trmini);
  }
  chiTietHoaDon.appendChild(minitable);
  rowHoaDon.appendChild(chiTietHoaDon);
  const xuly = document.createElement("td");
  const select = document.createElement("select");
  select.classList.add("select-donhang");
  const chua = document.createElement("option");
  chua.value="chua";
  chua.textContent="Chưa";
  select.appendChild(chua);
  const dang = document.createElement("option");
  dang.value = "dang";
  dang.textContent="Đang";
  select.appendChild(dang);
  const huy = document.createElement("option");
  huy.value="huy";
  huy.textContent="Hủy";
  select.appendChild(huy);
  const roi = document.createElement("option");
  roi.value="roi";
  roi.textContent="Rồi";
  select.appendChild(roi);
  select.value = hoaDon["xu-ly"];
  if(select.value==="roi") select.disabled = true;
  xuly.classList.add(select.value);
  select.addEventListener("change", () => {
    xuly.className="";
    switch(select.value){
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
        select.disabled= true;
        break;
    }
  });
  xuly.appendChild(select);
  rowHoaDon.appendChild(xuly);
  return rowHoaDon;
}

function hienThiDanhSachHoaDon(duLieusHienThi, hamRenderItem, wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
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
  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  if (duLieusHienThi === 0)
    container.appendChild(document.createTextNode("Khong co hoa don nao"));
  for (const item of duLieusHienThi) {
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
function locXuLyHoaDon(handle, hoaDonsDaLoc ){
  if(handle==="chua")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"]==="chua");
  if(handle==="dang")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"]==="dang");
  if(handle==="huy")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"]==="huy");
  if(handle==="roi")
    return hoaDonsDaLoc.filter((hoaDon) => hoaDon["xu-ly"]==="roi");
  return hoaDonsDaLoc;
}

function kiemTraTabHienTai() {
  const params = layParamUrl();
  return params["tab"] || "thongke";
}

function taiSanPham() {} // chay duoc roi nen tam tat di
window.addEventListener("load", function () {

  //taiNguoiDung();
  taiHoaDon();


  //taiNguoiDung();
  //taiHoaDon();

});

function timNguoiDung(id){
  return g_nguoiDung.find((nguoiDung)=> nguoiDung["id"]===id);
}



function topSanPhamBanChay(hoaDon){
  const sanPhamMap = new Map();
  hoaDon.forEach(hD => {
    hD["chi-tiet"].forEach( cT =>{
      const sP = cT["san-pham"];
      const sL = cT["so-luong"];
      if(sanPhamMap.has(sP)){
        sanPhamMap.set(sP, sanPhamMap.get(sP) + sL);
      } else {
        sanPhamMap.set(sP, sL);
      }
    });
  });
  const topBanChay = Array.from(sanPhamMap.entries())
  .map(([sP,sL])=> ({sP,sL}))
  .sort((a,b)=> b.sL - a.sL);

  return topBanChay;
}

const topBanChay = topSanPhamBanChay(hoaDon);

function renderItemTopBanChay(item) {
  const rowTopBanChay = document.createElement("tr");
  const tenSanPhamBanChay = document.createElement("td");
  tenSanPhamBanChay.textContent =  timSanPham(item.sP)["name"];
  rowTopBanChay.appendChild(tenSanPhamBanChay);
  const daBan = document.createElement("td");
  daBan.textContent = item.sL;
  rowTopBanChay.appendChild(daBan);
  const loiNhuan = document.createElement("td");
  loiNhuan.textContent = timSanPham(item.sP)["price-n"]*item.sL;
  rowTopBanChay.appendChild(loiNhuan);
  return rowTopBanChay;
}
function hienThiTopBanChay(topBanChay, hamRenderItem, wrapperSelector){
  const wrapper = document.querySelector(wrapperSelector);
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container-hoadon");
  const table = document.createElement("table");
  table.classList.add("topbanchay-table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  th.scope = "col";
  th2.scope = "col";
  th3.scope = "col";
  th4.scope = "col";
  th.textContent = "Sản Phẩm";
  th2.textContent = "Đã bán";
  th3.textContent = "Lợi Nhuận";
  tr.appendChild(th);
  tr.appendChild(th2);
  tr.appendChild(th3);
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  for (const item =0; item < 10;item++) {
    tbody.appendChild(hamRenderItem(topBanChay[item]));
  }
  const khac = document.createElement("tr");
  const td = document.createElement("td");
  td.textContent="...";
  const td2 = document.createElement("td");
  td2.textContent="...";
  const td3 = document.createElement("td");
  td3.textContent="...";
  khac.appendChild(td);
  khac.appendChild(td2);
  khac.appendChild(td3);
  tbody.appendChild(khac);
  table.appendChild(tbody);
  container.appendChild(table);
  wrapper.appendChild(container);
}

