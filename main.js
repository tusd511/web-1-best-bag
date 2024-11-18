var g_sanPham;
var soSanPhamMoiTrang = 10;

function taiSanPham() {
  // san pham da co trong local storage
  if (taiSanPhamLocalStorage()) {
    tinhSanPhamHienThi();
    return;
  }
  // chua co san pham trong local storage (lan dau mo web)
  fetch("./lynvn.json")
    .then((res) => res.text())
    .then((text) => {
      g_sanPham = JSON.parse(text);
      luuSanPhamLocalStorage();
      tinhSanPhamHienThi();
    });
}

// page: trang dang hien thi trong phan trang (set cai nay de di chuyen phan trang)
// sort: thu tu sap xep gia san pham
// min: gia thap nhat khi loc san pham
// max: gia cao nhat
function layParamUrl() {
  let params = new URL(document.location.toString()).searchParams;
  return {
    page: parseInt(params.get("page"), 10),
    sort: params.get("sort"),
    min: parseInt(params.get("min"), 10),
    max: parseInt(params.get("max"), 10),
  };
}

// goi ham nay khi bam phan trang hoac sap xep/loc de tai lai trang voi param moi
function caiParamUrlVaReload({ page, sort, min, max }) {
  let url = new URL(document.location.toString());
  let params = url.searchParams;
  if (page) params.set("page", page);
  if (sort) params.set("sort", sort);
  if (min) params.set("min", min);
  if (max) params.set("max", max);
  window.location = url.toString();
}

function tinhSanPhamHienThi() {
  let { page, sort, min, max } = layParamUrl();
  let thuTu = null;
  if (sort === "asc") thuTu = 1;
  else if (sort === "desc") thuTu = -1;
  let sanPhamsDaLoc = [...g_sanPham];
  sanPhamsDaLoc = locGiaThapNhat(min, sanPhamsDaLoc);
  sanPhamsDaLoc = locGiaCaoNhat(max, sanPhamsDaLoc);
  sapXepSanPhamTheoGia(thuTu, sanPhamsDaLoc);
  let soLuongSanPham = sanPhamsDaLoc.length;
  let soPageToiDa = Math.max(1, Math.floor(soLuongSanPham / soSanPhamMoiTrang));
  let chiSoBatDau = 0;
  let chiSoPage = 0;
  if (page < 1 || isNaN(page) || page == null) {
    page = 1;
  }
  chiSoPage = page - 1;
  chiSoBatDau = chiSoPage * soSanPhamMoiTrang;
  // phan trang bam vuot gioi han so trang
  if (chiSoBatDau > soLuongSanPham) {
    return;
  }

  // mang sau khi chia phan trang
  let sanPhamsHienThi = sanPhamsDaLoc.slice(
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
    thuTu,
    soLuongSanPham,
    chiSoBatDau,
    soSanPhamMoiTrang,
  });
}

function hienTrangChiTiet(id) {
  let sanPham = timSanPham(id);
  // TODO: mo trang chi tiet san pham
  console.info(id, sanPham);
}
function hienThiSanPham(sanPhamsHienThi, paramPhanTrang) {
  createPaginationDebugTable(paramPhanTrang);
  // TODO: hien thi danh sach san Pham sau khi load
  // lay page va soPageToiDa de xu ly hien thi phan trang
  // code hien tai chi la demo de hien thi kiem tra, can phai sua lai theo cach minh lam
  hienThiGrid(sanPhamsHienThi);
  hienThiPagination(paramPhanTrang.page, paramPhanTrang.soPageToiDa);
}

function hienThiGrid(sanPhamsHienThi) {
  let container = document.querySelector(".grid-container"); // thay thanh container
  for (let sanPham of sanPhamsHienThi) {
    let item = document.createElement("div");
    item.className = "grid";
    let id = document.createElement("h4");
    id.innerText = sanPham["web-scraper-order"];
    id.innerText = sanPham["web-scraper-order"];
    item.appendChild(id);
    let name = document.createElement("h1");
    name.innerText = sanPham["name"];
    name.innerText = sanPham["name"];
    item.appendChild(name);
    let price = document.createElement("p");
    price.style = "text-decoration: line-through; color: gray;";
    price.innerText = sanPham["price"];
    price.innerText = sanPham["price"];
    item.appendChild(price);
    let sale = document.createElement("h3");
    sale.style = "color: red";
    sale.innerText = sanPham["price-sale-n"];
    sale.innerText = sanPham["price-sale-n"];
    item.appendChild(sale);
    let img = document.createElement("img");
    img.src = `./images/${sanPham["image-file"]}`;
    img.className = "grid-img";
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

function hienThiPagination(pageHienTai, pageToiDa) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const soNutPagination = 5;
  let startPage = Math.max(1, pageHienTai - Math.floor(soNutPagination / 2));
  let endPage = Math.min(pageToiDa, startPage + soNutPagination - 1);

  // Điều chỉnh trang bắt đầu và kết thúc để đảm bảo ít nhất hiển thị 5 nut
  if (endPage - startPage + 1 < soNutPagination) {
    if (startPage > 1) {
      startPage = endPage - soNutPagination + 1;
    } else {
      endPage = startPage + soNutPagination - 1;
    }
  }

  // Thêm nút trang trước
  if (pageHienTai > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      caiParamUrlVaReload({ page: pageHienTai - 1 });
    });
    paginationContainer.appendChild(prevButton);
  }

  // them nut trang dau tien
  if (startPage > 1) {
    const firstPageButton = document.createElement("button");
    firstPageButton.textContent = 1;
    firstPageButton.addEventListener("click", () => {
      caiParamUrlVaReload({ page: 1 });
    });
    paginationContainer.appendChild(firstPageButton);

    if (startPage > 2) {
      const ellipsis1 = document.createElement("span");
      ellipsis1.textContent = "...";
      paginationContainer.appendChild(ellipsis1);
    }
  }

  // Thêm cac nút số trang
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === pageHienTai) pageButton.classList.add("active");
    pageButton.addEventListener("click", () => {
      caiParamUrlVaReload({ page: i });
    });
    paginationContainer.appendChild(pageButton);
  }
  // them nut trang cuoi cung
  if (endPage < pageToiDa) {
    if (endPage < pageToiDa - 1) {
      const ellipsis2 = document.createElement("span");
      ellipsis2.textContent = "...";
      paginationContainer.appendChild(ellipsis2);
    }

    const lastPageButton = document.createElement("button");
    lastPageButton.textContent = pageToiDa;
    lastPageButton.addEventListener("click", () => {
      caiParamUrlVaReload({ page: pageToiDa });
    });
    paginationContainer.appendChild(lastPageButton);
  }

  // Thêm nút trang tiếp theo
  if (pageHienTai < pageToiDa) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      caiParamUrlVaReload({ page: pageHienTai + 1 });
    });
    paginationContainer.appendChild(nextButton);
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
  if (max != null && !isNaN(max))
    return sanPhamsDaLoc.filter((sanPham) => sanPham["price-sale-n"] <= max);
  return sanPhamsDaLoc;
}

function locGiaThapNhat(min, sanPhamsDaLoc) {
  if (min != null && !isNaN(min))
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

function createPaginationDebugTable(data) {
  if (!Array.isArray(data)) data = [data];
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");

  // Create header row
  for (const key in data[0]) {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);
  // Create data rows
  for (const rowData of data) {
    const row = document.createElement("tr");
    for (const key in rowData) {
      const td = document.createElement("td");
      td.textContent = rowData[key] ?? "null";
      row.appendChild(td);
    }
    table.appendChild(row);
  }

  // Append the table to the DOM (replace '.debug-table' with your actual container ID)
  const container = document.querySelector(".debug-table");
  container.appendChild(table);
}

// goi khi trang web load thanh cong
window.addEventListener("load", () => {
  taiSanPham();
});
