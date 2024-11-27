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

async function taiDuLieu(datakey, datafile) {
  // du lieu key nay da co trong local storage
  const data = taiDuLieuLocalStorage(datakey);
  if (data) {
    return JSON.parse(data);
  }
  // chua co du lieu key nay trong local storage (lan dau mo web)
  // thi can phai tai du lieu ban dau tu file
  const response = await fetch(`${mainJsScriptDirectory}/${datafile}`);
  return await response.json();
}

function taiHoaDon() {
  taiDuLieu(hoaDonKey, hoaDonFile).then((data) => {
    g_hoaDon = data;
    i_hoaDon =
      taiDuLieuLocalStorage(hoaDonImKey) ??
      createIndexMapping(g_hoaDon, hoaDonIdKey);
    tinhHoaDonHienThi();
    
  });
}

function tinhSanPhamHienThi() {
  let { page, sort, min, max, search, categories } = layParamUrl();
  let sanPhamsDaLoc = [...g_sanPham];
  sanPhamsDaLoc = locGiaSanPham(min, max, sanPhamsDaLoc);
  sanPhamsDaLoc = locTheLoaiSanPham(categories, sanPhamsDaLoc);
  if (search) sanPhamsDaLoc = timTheoTen(search, sanPhamsDaLoc);
  sanPhamsDaLoc = sapXepSanPham(sort, sanPhamsDaLoc);
  const soLuongSanPham = sanPhamsDaLoc.length;
  const soPageToiDa = Math.ceil(soLuongSanPham / soSanPhamMoiTrang);
  let chiSoBatDau = 0;
  let chiSoPage = 0;
  if (page < 1 || isNaN(page) || page == null) {
    page = 1;
  }
  chiSoPage = page - 1;
  chiSoBatDau = chiSoPage * soSanPhamMoiTrang;
  // phan trang bam vuot gioi han so trang
  if (chiSoBatDau > soLuongSanPham) {
    caiParamUrlVaReload({ page: soPageToiDa }, false);
  }

  // mang sau khi chia phan trang
  const sanPhamsHienThi = sanPhamsDaLoc.slice(
    chiSoBatDau,
    chiSoBatDau + soSanPhamMoiTrang
  );
  hienThiSanPham(sanPhamsHienThi, {
    page, // trang phan trang hien tai
    soPageToiDa, // so trang toi da phan trang
    chiSoPage,
    sort,
    min,
    max,
    search,
    categories,
    soLuongSanPham,
    tongSoSanPham: g_sanPham.length,
    chiSoBatDau,
    soSanPhamMoiTrang,
  });
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
  if(disabled===0){
    return nguoiDungsDaLoc;
  }
  if(disabled===1)
    return nguoiDungsDaLoc.filter(
      (nguoiDung) => nguoiDung["disabled"] === true);
  if(disabled===-1)
    return nguoiDungsDaLoc.filter(
      (nguoiDung) => nguoiDung["disabled"] === false);
  return nguoiDungsDaLoc;
}

var soHoaDonMoiTrang = 25;
function tinhHoaDonHienThi() {
  let { page, sort, handle } = layParamUrl();
  let hoaDonsDaLoc = [...g_hoaDon];
  hoaDonsDaLoc = locXuLyHoaDon(handle, hoaDonsDaLoc);
  hoaDonsDaLoc = sapXepHoaDon(sort,hoaDonsDaLoc);
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
  khachHang.textContent = timNguoiDung(hoaDon["nguoi-dung"])["name"]; 
  //khachHang.textContent = hoaDon["nguoi-dung"];
  rowHoaDon.appendChild(khachHang);
  const chiTietHoaDon = document.createElement("td");
  const minitable = document.createElement("table");
  minitable.style.borderCollapse = "collapse";
  for (let i = 0; i < hoaDon["chi-tiet"].length; i++) {
    const trmini = document.createElement("tr");
    const tdmini = document.createElement("td");
    
    //tdmini.textContent = timSanPham(hoaDon["chi-tiet"][i]["san-pham"])["name"];
    //tdmini.textContent = hoaDon["chi-tiet"][i]["san-pham"];
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
  if(handle===null)
    return hoaDonsDaLoc;
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

//function taiSanPham() {} // chay duoc roi nen tam tat di
window.addEventListener("load", function () {
  //taiSanPham();
  taiNguoiDung();
  taiHoaDon();
  tinhTopHienThi();
  
  


  //taiNguoiDung();
  //taiHoaDon();

});

function timNguoiDung(id){
  return g_nguoiDung.find((nguoiDung)=> nguoiDung["id"]===id);
}

function renderItemTopSanPham(item) {
  const rowTopBanChay = document.createElement("tr");
  const tenSanPhamBanChay = document.createElement("td");
  tenSanPhamBanChay.textContent =  item.name;
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
function hienThiTopSanPham(topSanPham, hamRenderItem, wrapperSelector){
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
  for (let i = 0; i < Math.min(topSanPham.length,10);i++) {
    tbody.appendChild(hamRenderItem(topSanPham[i]));
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

/*function hienThiSelectTopSanPham(wrapperSelector){
  const wrapper = document.querySelector(wrapperSelector);
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  const selectTopSanPham = document.createElement("select");
  const banchay = document.createElement("option");
  banchay.value="ban-chay";
  banchay.textContent="Top Bán Chạy";
  selectTopSanPham.appendChild(banchay);
  const doanhthu = document.createElement("option");
  doanhthu.value= "doanh-thu";
  doanhthu.textContent =" Top Doanh Thu Cao";
  selectTopSanPham.appendChild(doanhthu);
  selectTopSanPham.addEventListener("change", () =>{
    let data;
    if(selectTopSanPham.value==="ban-chay"){
      data=topSanPhamBanChay();
    } else if(selectTopSanPham.value==="doanh-thu"){
      data = topSanPhamDoanhThu();
    }
    hienThiTopSanPham(data,renderItemTopSanPham,".topsanpham")
  });
  container.appendChild(selectTopSanPham);
  wrapper.appendChild(container);
}*/

function sapXepTopSanPham(topsp,topSanPhamsDaLoc){
  if(topsp === "ban-chay"){
    topSanPhamsDaLoc = topSanPhamBanChay();
  }
  if(topsp === "doanh-thu")
    topSanPhamsDaLoc = topSanPhamDoanhThu();
  return topSanPhamsDaLoc;
}

function sapXepTopNguoiDung(topnd,topNguoiDungsDaLoc){
  if(topnd==="nhieu-don-nhat"||topnd==="")
    topNguoiDungsDaLoc=topKhachLenDon();
  if(topnd==="nhieu-loai-nhat")
    topNguoiDungsDaLoc=topKhachMuaNhieuLoai();
  if(topnd==="nhieu-hang-nhat")
    topNguoiDungsDaLoc=topKhachMuaNhieu();
  if(topnd==="nhieu-tien-nhat")
    topNguoiDungsDaLoc=topKhachChiTieu();
  return topNguoiDungsDaLoc;
}

function tinhTopHienThi(){
  let { topsp, topnd}=layParamUrl();
  console.log("đã lấy param")
  let topSanPhamsDaLoc = thongKeSanPham();
  console.log("Thống kê sản phẩm:", topSanPhamsDaLoc);
  topSanPhamsDaLoc = sapXepTopSanPham(topsp,topSanPhamsDaLoc);
  const topSanPhamsHienThi = topSanPhamsDaLoc.slice(0,10);
  let topNguoiDungsDaLoc = [];
  topNguoiDungsDaLoc = thongKeNguoiDung();
  topNguoiDungsDaLoc = sapXepTopNguoiDung(topnd,topNguoiDungsDaLoc);
  const topNguoiDungsHienThi = topNguoiDungsDaLoc.slice(0,10);
  hienThiTop(topNguoiDungsHienThi,topSanPhamsHienThi);
}

function hienThiTop(topNguoiDungsHienThi,topSanPhamsHienThi){
  hienThiTopNguoiDung(topNguoiDungsHienThi,renderItemTopNguoiDung,".topkhachhang");
  hienThiTopSanPham(topSanPhamsHienThi,renderItemTopSanPham,".topsanpham");
}

function renderItemTopNguoiDung(item){
  const rowTopNguoiDung = document.createElement("tr");
  const tenNguoiDung = document.createElement("td");
  tenNguoiDung.textContent= item["ten"];
  rowTopNguoiDung.appendChild(tenNguoiDung);
  const soDon = document.createElement("td");
  soDon.textContent=item["so-don"];
  rowTopNguoiDung.appendChild(soDon);
  const loaiDaMua = document.createElement("td");
  loaiDaMua.textContent=item["loai-da-mua"];
  rowTopNguoiDung.appendChild(loaiDaMua);
  const daMua = document.createElement("td");
  daMua.textContent=item["da-mua"];
  rowTopNguoiDung.appendChild(daMua);
  const tongChi = document.createElement("td");
  tongChi.textContent=item["tong-chi"];
  rowTopNguoiDung.appendChild(tongChi);
  return rowTopNguoiDung;
}

function hienThiTopNguoiDung(topNguoiDung, hamRenderItem, wrapperSelector){
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
  if(topNguoiDung.length===0)
    container.appendChild(document.createTextNode("Khong co hoa don nao"));
  for (let i = 0; i < Math.min(topNguoiDung.length,10);i++) {
    tbody.appendChild(hamRenderItem(topNguoiDung[i]));
  }
  const khac = document.createElement("tr");
  const td = document.createElement("td");
  td.textContent="...";
  const td2 = document.createElement("td");
  td2.textContent="...";
  const td3 = document.createElement("td");
  td3.textContent="...";
  const td4 = document.createElement("td");
  td4.textContent="...";
  const td5 = document.createElement("td");
  td5.textContent="...";
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



/*function hienThiSelectTopNguoiDung(wrapperSelector){
  const wrapper = document.querySelector(wrapperSelector);
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  const selectTopNguoiDung = document.createElement("select");
  const nhieuDonNhat = document.createElement("option");
  nhieuDonNhat.value = "nhieu-don-nhat";
  nhieuDonNhat.textContent = "Nhiều Lượt Mua Nhất";
  selectTopNguoiDung.appendChild(nhieuDonNhat);
  const nhieuLoaiNhat = document.createElement("option");
  nhieuLoaiNhat.value ="nhieu-loai-nhat";
  nhieuLoaiNhat.textContent="Mua Nhiều Loại Nhất";
  selectTopNguoiDung.appendChild(nhieuLoaiNhat);
  const nhieuHangNhat = document.createElement("option");
  nhieuHangNhat.value = "nhieu-hang-nhat";
  nhieuHangNhat.textContent="Mua Nhiều Hàng Nhất";
  selectTopNguoiDung.appendChild(nhieuHangNhat);
  const nhieuTienNhat = document.createElement("option");
  nhieuTienNhat.value="nhieu-tien-nhat";
  nhieuTienNhat.textContent="Chi Tiêu Nhiều Nhất";
  selectTopNguoiDung.appendChild(nhieuTienNhat);
  selectTopNguoiDung.addEventListener("change", () => {
    let data;
    switch(selectTopNguoiDung.value){
      case "nhieu-don-nhat":
        data = topKhachLenDon();
        break;
      case "nhieu-loai-nhat":
        data = topKhachMuaNhieuLoai();
        break;
      case "nhieu-hang-nhat":
        data = topKhachMuaNhieu();
        break;
      case "nhieu-tien-nhat":
        data = topKhachChiTieu();
        break;
    }
    hienThiTopNguoiDung(data,renderItemTopNguoiDung,".topnguoidung")
  });
  container.appendChild(selectTopNguoiDung);
  wrapper.appendChild(container);
}*/


/*function topSanPhamBanChay(hoaDon){
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

const topBanChay = topSanPhamBanChay(hoaDon);*/

/*function hienThiMenuThongKe(){

  const board = document.createElement("div");
  board.classList.add("board");
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");
  const cardBox = document.createElement("div");
  cardBox.classList.add("card-box", "bg-mattRed");
  const inner = document.createElement("div");
  inner.classList.add("inner");
  const h3 = document.createElement("h3");
  h3.textContent= [...g_sanPham].length;
  inner.appendChild(h3);
  const p = document.createElement("p");
  p.textContent = "Sản phẩm";
  inner.appendChild(p);
  cardBox.appendChild(inner);
  const icon = document.createElement("div");
  icon.classList.add("icon");
  const i = document.createElement("i");
  i.classList.add("fas", "fa-shopping-bag");
  icon.appendChild(i);
  cardBox.appendChild(icon);
  const a = document.createElement("a");
  a.classList.add("card-box-footer");
  a.href="#";
  a.textContent ="Chi tiết &nbsp;"
  const muiTen = document.createElement("i");
  muiTen.classList.add("fa", "fa-arrow-circle-right");
  a.appendChild(muiTen);
  cardBox.appendChild(a);
  cardContainer.appendChild(cardBox);
  board.appendChild(cardContainer);
  //--------------
  const cardContainer2 = document.createElement("div");
  cardContainer2.classList.add("card-container");
  const cardBox2 = document.createElement("div");
  cardBox2.classList.add("card-box", "bg-mattRed");
  const inner2 = document.createElement("div");
  inner2.classList.add("inner");
  const h32 = document.createElement("h3");
  h32.textContent= [...g_sanPham].length;
  inner2.appendChild(h32);
  const p2 = document.createElement("p");
  p2.textContent = "Sản phẩm";
  inner2.appendChild(p2);
  cardBox2.appendChild(inner2);
  const icon2 = document.createElement("div");
  icon2.classList.add("icon");
  const i2 = document.createElement("i");
  i2.classList.add("fas", "fa-clipboard-check");
  icon2.appendChild(i);
  cardBox2.appendChild(icon2);
  const a2 = document.createElement("a");
  a2.classList.add("card-box-footer");
  a2.href="#";
  a2.textContent ="Chi tiết &nbsp;"
  const muiTen2 = document.createElement("i");
  muiTen2.classList.add("fa", "fa-arrow-circle-right");
  a2.appendChild(muiTen2);
  cardBox.appendChild(a2);
  cardContainer2.appendChild(cardBox2);
  board.appendChild(cardContainer2);


}*/