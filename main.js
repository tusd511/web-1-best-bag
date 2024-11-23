var g_sanPham, g_nguoiDung, g_hoaDon;
const sanPhamKey = "sanPham";
const nguoiDungKey = "nguoiDung";
const hoaDonKey = "hoaDon";
const sanPhamFile = "san-pham.json";
const nguoiDungFile = "nguoi-dung.json";
const hoaDonFile = "hoa-don.json";
const theLoaiFile = "the-loai.json";
var soSanPhamMoiTrang = 10;

async function taiDuLieu(datakey, datafile) {
  // du lieu key nay da co trong local storage
  const data = taiDuLieuLocalStorage(datakey);
  if (data) {
    return JSON.parse(data);
  }
  // chua co du lieu key nay trong local storage (lan dau mo web)
  const response = await fetch(datafile);
  return await response.json();
}
function taiSanPham() {
  taiDuLieu(sanPhamKey, sanPhamFile).then((data) => {
    g_sanPham = data;
    tinhSanPhamHienThi();
    // tai khung search
    const searchBox = document.getElementById("search-box");
    searchBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const search = searchBox.value;
        if (search || layParamUrl().search) caiParamUrlVaReload({ search });
        else alert("Khung search trong");
      }
    });
    search = layParamUrl().search.trim().replace(/\s+/g, " ");
    if (search != null) searchBox.value = search;
  });
}
function taiNguoiDung() {
  taiDuLieu(nguoiDungKey, nguoiDungFile).then((data) => {
    g_nguoiDung = data;
    tinhNguoiDungHienThi();
  });
}
function taiHoaDon() {
  taiDuLieu(hoaDonKey, hoaDonFile).then((data) => {
    g_hoaDon = data;
    tinhHoaDonHienThi();
  });
}

// page: trang dang hien thi trong phan trang (set cai nay de di chuyen phan trang)
// sort: thu tu sap xep gia san pham
// min: gia thap nhat khi loc san pham
// max: gia cao nhat
function layParamUrl() {
  const params = new URL(document.location.toString()).searchParams;
  return {
    page: parseInt(params.get("page"), 10),
    sort: params.get("sort"),
    min: parseInt(params.get("min"), 10),
    max: parseInt(params.get("max"), 10),
    search: params.get("search"),
  };
}

// goi ham nay khi bam phan trang hoac sap xep/loc de tai lai trang voi param moi
function caiParamUrlVaReload({ page, sort, min, max, search }) {
  const url = new URL(document.location.toString());
  const params = url.searchParams;
  if (page !== undefined) params.set("page", page);
  if (sort !== undefined) params.set("sort", sort);
  if (min !== undefined) params.set("min", min);
  if (max !== undefined) params.set("max", max);
  if (search !== undefined) params.set("search", search);
  window.location = url.toString();
}

function tinhSanPhamHienThi() {
  let { page, sort, min, max, search } = layParamUrl();
  let sanPhamsDaLoc = [...g_sanPham];
  sanPhamsDaLoc = locGiaSanPham(min, max, sanPhamsDaLoc);
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
    caiParamUrlVaReload({ page: soPageToiDa });
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
    soLuongSanPham,
    tongSoSanPham: g_sanPham.length,
    chiSoBatDau,
    soSanPhamMoiTrang,
  });
}

function tinhNguoiDungHienThi() {
  alert("chua cai dat tinh nguoi dung hien thi");
}

function tinhHoaDonHienThi() {
  alert("chua cai dat tinh hoa don hien thi");
}

function hienTrangChiTiet(id) {
  alert("Chua cai dat chuc nang hien trang chi tier");
  const sanPham = timSanPham(id);
  // TODO: mo trang chi tiet san pham
  console.info(id, sanPham);
}
function hienThiSanPham(sanPhamsHienThi, paramPhanTrang) {
  createPaginationDebugTable(paramPhanTrang);
  // TODO: hien thi danh sach san Pham sau khi load
  // lay page va soPageToiDa de xu ly hien thi phan trang
  // code hien tai chi la demo de hien thi kiem tra, can phai sua lai theo cach minh lam
  hienThiDanhSach(sanPhamsHienThi, renderItemSanPham, ".product-list");
  hienThiPagination(paramPhanTrang.page, paramPhanTrang.soPageToiDa);
}

function renderItemSanPham(sanPham) {
  const item = document.createElement("div");
  item.classList.add("grid");

  const id = document.createElement("h4");
  id.innerText = sanPham["web-scraper-order"];
  item.appendChild(id);

  const name = document.createElement("h1");
  name.innerText = sanPham["name"];
  item.appendChild(name);

  if (sanPham.matchScore) {
    const matchScore = document.createElement("p");
    matchScore.style.setProperty("color", "green");

    const matchScore1 = document.createElement("small");
    matchScore1.textContent = `Match score: ${sanPham.matchScore}`;
    matchScore.appendChild(matchScore1);

    item.appendChild(matchScore);
  }

  const price = document.createElement("p");
  price.style.setProperty("text-decoration", "line-through");
  price.style.setProperty("color", "gray");
  price.innerText = sanPham["price"];
  item.appendChild(price);

  const sale = document.createElement("h3");
  sale.style.setProperty("color", "red");
  sale.innerText = sanPham["price-sale-n"];
  item.appendChild(sale);

  const img = document.createElement("img");
  img.src = `./images/${sanPham["image-file"]}`;
  img.className = "grid-img";
  item.appendChild(img);

  const btn = document.createElement("button");
  btn.addEventListener("click", () =>
    hienTrangChiTiet(sanPham["web-scraper-order"])
  );
  btn.textContent = "Xem chi tiet";
  item.appendChild(btn);

  return item;
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

function hienThiPagination(pageHienTai, pageToiDa) {
  if (pageToiDa === 0) return;
  const wrapper = document.querySelector(".pagination");
  wrapper.innerHTML = "";
  const container = document.createElement("ul");
  container.classList.add("pagination-list");

  // ham them nhanh 1 nut
  function appendButton(text, goToPage) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = text;
    if (goToPage === pageHienTai) {
      button.classList.add("active");
      button.style.setProperty("cursor", "default");
      button.style.setProperty("pointer-events", "none");
    } else {
      button.addEventListener("click", () =>
        caiParamUrlVaReload({ page: goToPage })
      );
    }
    li.appendChild(button);
    container.appendChild(li);
  }
  // ham them nhanh dau 3 cham (e.g. 1 ... 5 6 7)
  function addEllipsis() {
    const li = document.createElement("li");
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    li.appendChild(ellipsis);
    container.appendChild(li);
  }

  const soNutPagination = Math.min(pageToiDa, 5); // Ensure no more than total pages
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
    appendButton("Previous", pageHienTai - 1);
  }

  // them nut trang dau tien
  if (startPage > 1) {
    appendButton(1, 1);
    if (startPage > 2) {
      addEllipsis();
    }
  }

  // Thêm cac nút số trang
  for (let i = startPage; i <= endPage; i++) {
    appendButton(i, i);
  }
  // them nut trang cuoi cung
  if (endPage < pageToiDa) {
    if (endPage < pageToiDa - 1) {
      addEllipsis();
    }
    appendButton(pageToiDa, pageToiDa);
  }

  // Thêm nút trang tiếp theo
  if (pageHienTai < pageToiDa) {
    appendButton("Next", pageHienTai + 1);
  }
  wrapper.appendChild(container);
}

function sapXepSanPham(thuTu, sanPhamsDaLoc) {
  // gia thap den cao
  if (thuTu === "asc")
    return sanPhamsDaLoc.toSorted((a, b) => a["price-n"] - b["price-n"]);
  // gia cao den thap
  if (thuTu === "desc")
    return sanPhamsDaLoc.toSorted((a, b) => b["price-n"] - a["price-n"]);
  // best match tim kiem
  if (sanPhamsDaLoc[0]?.matchScore != null || thuTu === "best")
    return sanPhamsDaLoc.toSorted((a, b) => b.matchScore - a.matchScore);
  return sanPhamsDaLoc;
}

function locGiaSanPham(min, max, sanPhamsDaLoc) {
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
  return locGiaThapNhat(min, locGiaCaoNhat(max, sanPhamsDaLoc));
}

function timTheoTen(name, sanPhamsDaLoc) {
  const sanitize = (string) =>
    transliterate(string).trim().replace(/\s+/g, " ").normalize().toLowerCase();
  const sanitizedInput = sanitize(name);
  const keywords = sanitizedInput.split(/\s+/);
  const matchScores = sanPhamsDaLoc.map((sanPham) => {
    if (name === sanPham["web-scraper-order"]) return 9999;
    const sanitizedName = sanitize(sanPham["name"]);
    if (sanitizedInput === sanitizedName) return 1000;
    const nameWords = sanitizedName.split(/\s+/);
    return keywords.reduce(
      (keywordScore, keyword) =>
        keywordScore +
        nameWords.reduce(
          (namewordScore, nameword) =>
            namewordScore +
            (keyword === nameword
              ? Math.max(100, 25 * keyword.length)
              : nameword.startsWith(keyword)
              ? Math.max(50, 10 * keyword.length)
              : nameword.includes(keyword)
              ? Math.max(
                  10,
                  3 * keyword.length * (nameword.split(keyword).length - 1)
                )
              : 0),
          0
        ),
      0
    );
  });
  console.table(
    matchScores
      .map((matchScore, i) => {
        return { name: sanPhamsDaLoc[i]["name"], matchScore };
      })
      .sort((a, b) => a.score - b.score)
  );
  return matchScores
    .map((matchScore, i) => {
      return { ...sanPhamsDaLoc[i], matchScore };
    })
    .filter((sanPham) => sanPham.matchScore > 0);
}

function luuSanPhamLocalStorage() {
  luuDuLieuLocalStorage(sanPhamKey, g_sanPham);
}
function luuNguoiDungLocalStorage() {
  luuDuLieuLocalStorage(nguoiDungKey, g_nguoiDung);
}
function luuHoaDonLocalStorage() {
  luuDuLieuLocalStorage(hoaDonKey, g_hoaDon);
}
function luuDuLieuLocalStorage(datakey, g_duLieu) {
  localStorage.setItem(datakey, JSON.stringify(g_duLieu));
}

function taiSanPhamLocalStorage() {
  const stringSanPhams = taiDuLieuLocalStorage(sanPham);
  if (stringSanPhams == null) return false;
  g_sanPham = JSON.parse(stringSanPhams);
  return true;
}
function taiNguoiDungLocalStorage() {
  const stringNguoiDungs = taiDuLieuLocalStorage(nguoiDungKey);
  if (stringNguoiDungs == null) return false;
  g_nguoiDung = JSON.parse(stringNguoiDungs);
  return true;
}
function taiHoaDonLocalStorage() {
  const stringHoaDons = taiDuLieuLocalStorage(hoaDonKey);
  if (stringHoaDons == null) return false;
  g_hoaDon = JSON.parse(stringHoaDons);
  return true;
}
function taiDuLieuLocalStorage(datakey) {
  return localStorage.getItem(datakey);
}
// xoa local storage de load lai danh sach san pham ban dau tu file data
function xoaSanPhamLocalStorage() {
  xoaDuLieuLocalStorage(sanPham);
}
function xoaNguoiDungLocalStorage() {
  xoaDuLieuLocalStorage(nguoiDungKey);
}
function xoaHoaDonLocalStorage() {
  xoaDuLieuLocalStorage(hoaDonKey);
}

function xoaDuLieuLocalStorage(datakey) {
  localStorage.removeItem(datakey);
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
  // Append the table to the DOM (replace '.debug-table' with your actual container ID)
  const container = document.querySelector(".debug-table");
  if (!container) return;
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
  container.appendChild(table);
}

// goi khi trang web load thanh cong
window.addEventListener("load", () => {
  if (document.querySelector(".product-list")) taiSanPham();
  if (document.querySelector(".user-list")) taiNguoiDung();
  if (document.querySelector(".receipt-list")) taiHoaDon();
});
