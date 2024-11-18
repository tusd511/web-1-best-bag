var g_sanPham;

function taiSanPham() {
  // san pham da co trong local storage
  if (taiSanPhamLocalStorage()) {
    hienSanPham();
    return;
  }
  // chua co san pham trong local storage (lan dau mo web)
  fetch("./lynvn.json")
    .then((res) => res.text())
    .then((text) => {
      g_sanPham = JSON.parse(text);
      luuSanPhamLocalStorage();
      hienSanPham();
    });
}

// page: trang dang hien thi trong phan trang (set cai nay de di chuyen phan trang)
// start: chi so bat dau mang trong phan trang (ko can quan tam)
// sort: thu tu sap xep gia san pham
// min: gia thap nhat khi loc san pham
// max: gia cao nhat
function layParamUrl() {
  let params = new URL(document.location.toString()).searchParams;
  return {
    page: params.get("page"),
    start: params.get("start"),
    sort: params.get("sort"),
    min: params.get("min"),
    max: params.get("max"),
  };
}

// goi ham nay khi bam phan trang hoac sap xep/loc de tai lai trang voi param moi
function caiParamUrlVaReload(page, start, sort, min, max) {
  let url = new URL(document.location.toString());
  url.search = "";
  let params = url.searchParams;
  if (page) params.set("page", page);
  if (start) params.set("start", start);
  if (sort) params.set("sort", sort);
  if (min) params.set("min", min);
  if (max) params.set("max", max);
  window.location = url.toString();
}

function hienSanPham() {
  let { page, start, sort, min, max } = layParamUrl();
  let thuTu = null;
  if (sort === "asc") thuTu = 1;
  else if (sort === "desc") thuTu = -1;
  let sanPhamsDaLoc = [...g_sanPham];
  sanPhamsDaLoc = locGiaThapNhat(min, sanPhamsDaLoc);
  sanPhamsDaLoc = locGiaCaoNhat(max, sanPhamsDaLoc);
  sapXepSanPhamTheoGia(thuTu, sanPhamsDaLoc);
  let soLuongSanPham = sanPhamsDaLoc.length;
  let soPageToiDa = Math.max(1, 1 + Math.floor(soLuongSanPham / 21));
  let chiSoBatDau = 0;
  if (page != null) {
    chiSoBatDau = page * 20;
  } else if (start != null) {
    chiSoBatDau = start;
  }
  // phan trang bam vuot gioi han so trang
  if (chiSoBatDau > soLuongSanPham) {
    return;
  }

  // mang sau khi chia phan trang
  let sanPhamsHienThi = sanPhamsDaLoc.slice(chiSoBatDau, chiSoBatDau + 20);
  hienThiSanPham(sanPhamsHienThi, {
    page, // trang phan trang hien tai
    soPageToiDa, // so trang toi da phan trang
    start,
    sort,
    min,
    max,
    thuTu,
    soLuongSanPham,
    chiSoBatDau,
  });
}

function hienTrangChiTiet(id) {
  let sanPham = timSanPham(id);
  // TODO: mo trang chi tiet san pham
  console.info(id, sanPham);
}
function hienThiSanPham(sanPhamsHienThi, paramPhanTrang) {
  // TODO: hien thi danh sach san Pham sau khi load
  // lay page va soPageToiDa de xu ly hien thi phan trang
  // code hien tai chi la demo de hien thi kiem tra, can phai sua lai theo cach minh lam
  let textParams = JSON.stringify(paramPhanTrang, null, 4);
  let paramE = document.createElement("p");
  paramE.innerText = textParams;
  document.querySelector("body").prepend(paramE);
  let container = document.querySelector(".bar-container"); // thay thanh container
  for (let sanPham of sanPhamsHienThi) {
    let item = document.createElement("div");
    item.className = "bar";
    let id = document.createElement("h4");
    id.innerText = sanPham["web-scraper-order"];
    item.appendChild(id);
    let name = document.createElement("h1");
    name.innerText = sanPham["name"];
    item.appendChild(name);
    let price = document.createElement("p");
    price.style = "text-decoration: line-through; color: gray;";
    price.innerText = sanPham["price"];
    item.appendChild(price);
    let sale = document.createElement("h3");
    sale.style = "color: red";
    sale.innerText = sanPham["price-sale-n"];
    item.appendChild(sale);
    let img = document.createElement("img");
    img.src = `./images/${sanPham["image-file"]}`;
    img.className = "bar-img";
    item.appendChild(img);
    let btn = document.createElement("button");
    btn.addEventListener("click", () =>
      hienTrangChiTiet(sanPham["web-scraper-order"])
    );
    btn.innerText = "Xem chi tiet";
    item.appendChild(btn);
    container.appendChild(item);
  }
}

function sapXepSanPhamTheoGia(thuTu, sanPhamsDaLoc) {
  // thap den cao
  if (thuTu === "asc")
    return sanPhamsDaLoc.toSorted((a, b) => a["price-n"] - b["price-n"]);
  // cao den thap
  else if (thuTu === "desc")
    return sanPhamsDaLoc.toSorted((a, b) => b["price-n"] - a["price-n"]);
  return sanPhamsDaLoc;
}

function locGiaCaoNhat(max, sanPhamsDaLoc) {
  if (max != null)
    return sanPhamsDaLoc.filter((sanPham) => sanPham["price-sale-n"] <= max);
  return sanPhamsDaLoc;
}

function locGiaThapNhat(min, sanPhamsDaLoc) {
  if (min != null)
    return sanPhamsDaLoc.filter((sanPham) => sanPham["price-sale-n"] >= min);
  return sanPhamsDaLoc;
}

function luuSanPhamLocalStorage() {
  localStorage.setItem("sanPham", JSON.stringify(g_sanPham));
}

function taiSanPhamLocalStorage() {
  let stringSanPhams = localStorage.getItem("sanPham");
  if (stringSanPhams == null) return false;
  g_sanPham = JSON.parse(localStorage.getItem("sanPham"));
  return true;
}

// xoa local storage de load lai danh sach san pham ban dau tu file data
function xoaSanPhamLocalStorage() {
  localStorage.removeItem("sanPham");
}

// them san pham, co the nhap id hoac khong
// neu nhap id, kiem tra xem co bi trung id hay ko
// neu ko nhap id, se duoc random 1 id ngau nhien
function themSanPham(id, sanPham) {
  if (id == null) {
    sanPham["web-scraper-order"] = crypto.randomUUID();
  } else if (timSanPham(id)) {
    // TODO: xu ly id bi trung
    return;
  } else {
    sanPham["web-scraper-order"] = id;
  }
  g_sanPham.push(sanPham);
  luuSanPhamLocalStorage();
}

// sua san pham, phai nhap id de biet san pham can sua
// san pham nhan vao se thay the san pham da co
// dung timSanPhamTheoId de lay thong tin san pham cho nguoi dung sua
function suaSanPham(id, sanPham) {
  if (id == null) {
    // TODO: xu ly chua nhap id
  }
  xoaSanPham(id);
  themSanPham(id, sanPham);
}

function timSanPham(id) {
  return g_sanPham.find((sanPham) => sanPham["web-scraper-order"] === id);
}
function xoaSanPham(id) {
  if (!timSanPham(id)) {
    // TODO: xu ly ko tim thay san pham co id nay
    return;
  }
  g_sanPham.splice(
    g_sanPham.findIndex((sanPham) => sanPham["web-scraper-order"] === id),
    1
  );
  luuSanPhamLocalStorage();
}

// goi khi trang web load thanh cong
window.addEventListener("load", () => {
  taiSanPham();
});
