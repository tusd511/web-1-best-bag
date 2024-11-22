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
function caiParamUrlVaReload({ page, sort, min, max, qname: search }) {
  const url = new URL(document.location.toString());
  const params = url.searchParams;
  if (page) params.set("page", page);
  if (sort) params.set("sort", sort);
  if (min) params.set("min", min);
  if (max) params.set("max", max);
  if (search) params.set("search", search);
  window.location = url.toString();
}

function tinhSanPhamHienThi() {
  let { page, sort, min, max, search } = layParamUrl();
  let sanPhamsDaLoc = [...g_sanPham];
  sanPhamsDaLoc = locGiaThapNhat(min, sanPhamsDaLoc);
  sanPhamsDaLoc = locGiaCaoNhat(max, sanPhamsDaLoc);
  if (search) sanPhamsDaLoc = timTheoTen(search, sanPhamsDaLoc);
  if (!sort) sort = "best";
  sanPhamsDaLoc = sapXepSanPham(sort, sanPhamsDaLoc);
  const soLuongSanPham = sanPhamsDaLoc.length;
  const soPageToiDa = Math.max(
    1,
    Math.floor(soLuongSanPham / soSanPhamMoiTrang)
  );
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

function hienTrangChiTiet(id) {
  const sanPham = timSanPham(id);
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
  const wrapper = document.querySelector(".product-list");
  wrapper.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("grid-container");
  for (const sanPham of sanPhamsHienThi) {
    const item = document.createElement("div");
    item.classList.add("grid");
    const id = document.createElement("h4");
    id.innerText = sanPham["web-scraper-order"];
    id.innerText = sanPham["web-scraper-order"];
    item.appendChild(id);
    const name = document.createElement("h1");
    name.innerText = sanPham["name"];
    name.innerText = sanPham["name"];
    item.appendChild(name);
    const price = document.createElement("p");
    price.style = "text-decoration: line-through; color: gray;";
    price.innerText = sanPham["price"];
    price.innerText = sanPham["price"];
    item.appendChild(price);
    const sale = document.createElement("h3");
    sale.style = "color: red";
    sale.innerText = sanPham["price-sale-n"];
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
    btn.innerText = "Xem chi tiet";
    item.appendChild(btn);
    container.appendChild(item);
  }
  wrapper.appendChild(container);
}

function hienThiPagination(pageHienTai, pageToiDa) {
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
  if (thuTu === "best")
    return sanPhamsDaLoc.toSorted((a, b) => a.matchScore - b.matchScore);
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

function timTheoTen(name, sanPhamsDaLoc) {
  const sanitizedInput = name.normalize().toLowerCase();
  const keywords = sanitizedInput.split(/\s+/);
  const matchScores = sanPhamsDaLoc.map((sanPham) => {
    if (name === sanPham["web-scraper-order"]) return 9999;
    const sanitizedName = sanPham["name"].normalize().toLowerCase();
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
          ) || -2 * keyword.length,
      0
    );
  });
  console.table(
    matchScores
      .map((matchScore, i) => {
        return { name: sanPhamsDaLoc[i]["name"], score: matchScore };
      })
      .sort((a, b) => a.score - b.score)
  );
  return matchScores
    .map((matchScore, i) => {
      return { ...sanPhamsDaLoc[i], score: matchScore };
    })
    .filter((sanPham) => sanPham.matchScore > 0);
}

function luuSanPhamLocalStorage() {
  localStorage.setItem("sanPham", JSON.stringify(g_sanPham));
}

function taiSanPhamLocalStorage() {
  const stringSanPhams = localStorage.getItem("sanPham");
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
