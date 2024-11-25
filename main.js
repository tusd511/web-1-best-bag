const sanPhamKey = "sanPham";
const nguoiDungKey = "nguoiDung";
const hoaDonKey = "hoaDon";
const sanPhamIdKey = "web-scraper-order";
const nguoiDungIdKey = "id";
const hoaDonIdKey = "id";
const sanPhamImKey = "sanPhamIm";
const nguoiDungImKey = "nguoiDungIm";
const hoaDonImKey = "hoaDonIm";
const theLoaiSanPhamKey = "theLoaiSanPham";
const sanPhamFile = "san-pham.json";
const nguoiDungFile = "nguoi-dung.json";
const hoaDonFile = "hoa-don.json";
const theLoaiSanPhamFile = "the-loai.json";

// tang bien nay khi muon reset localStorage hoac update du lieu moi tu file
const dataVersion = 18;

const soSanPhamMoiTrang = 12;

var g_sanPham, g_nguoiDung, g_hoaDon, g_theLoaiSanPham;
var i_sanPham, i_nguoiDung, i_hoaDon;

// Get the current script element (the one that included this JS file)
const mainJsScriptElement = document.currentScript;
const mainJsScriptPath = mainJsScriptElement.src;
// Get the directory of the script
const mainJsScriptDirectory = mainJsScriptPath.substring(
  0,
  mainJsScriptPath.lastIndexOf("/")
);

// thêm biến phiên bản dữ liệu để ép reset localstorage
function verifyDataVersion() {
  if (localStorage.getItem("dataVersion") != dataVersion) {
    localStorage.clear();
    localStorage.setItem("dataVersion", dataVersion);
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
async function taiSanPham() {
  g_theLoaiSanPham = await taiDuLieu(theLoaiSanPhamKey, theLoaiSanPhamFile);
  g_sanPham = await taiDuLieu(sanPhamKey, sanPhamFile);
  i_sanPham =
    taiDuLieuLocalStorage(sanPhamImKey) ??
    createIndexMapping(g_sanPham, sanPhamIdKey);
  taoBoLocSanPham();
  tinhSanPhamHienThi();
}
function taiNguoiDung() {
  taiDuLieu(nguoiDungKey, nguoiDungFile).then((data) => {
    g_nguoiDung = data;
    i_nguoiDung =
      taiDuLieuLocalStorage(nguoiDungImKey) ??
      createIndexMapping(g_nguoiDung, nguoiDungIdKey);
    tinhNguoiDungHienThi();
  });
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

function taoBoLocSanPham() {
  // cac param muon giu lai khi sua bo loc
  const { search, min, max, sort, categories } = layParamUrl();
  // Dynamically add categories to the form
  g_theLoaiSanPham.forEach((category) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = category;
    checkbox.checked = true;
    checkbox.addEventListener("dblclick", (e) => {
      e.preventDefault();
      // Function to toggle category checkboxes
      document
        .querySelectorAll('#categories input[type="checkbox"]:checked')
        .forEach((cb) => {
          cb.checked = false;
        });
      e.target.checked = true;
    });
    checkbox.addEventListener("change", (e) => {
      const cbs = [
        ...document.querySelectorAll('#categories input[type="checkbox"]'),
      ];
      if (cbs.every((cb) => !cb.checked)) {
        cbs.forEach((cb) => (cb.checked = true));
        e.target.checked = false;
      }
    });
    const label = document.createElement("label");
    label.textContent = category;

    const div = document.createElement("div");
    div.appendChild(checkbox);
    div.appendChild(label);

    document.getElementById("categories").appendChild(div);
  });
  // hien lai data tu param vao form
  document.getElementById("search").value = search;
  if (Number.isFinite(min)) document.getElementById("minPrice").value = min;
  if (Number.isFinite(max)) document.getElementById("maxPrice").value = max;
  if (categories?.length > 0)
    [
      ...document.querySelectorAll('#categories input[type="checkbox"]'),
    ].forEach((cb) => (cb.checked = categories.includes(cb.value)));
  document.getElementById("sortBy").value = sort;
  // su kien submit
  document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = {};
    new FormData(e.target).forEach((value, key) => {
      formObject[key] = value;
    });
    formObject.categories = [
      ...document.querySelectorAll(
        '#categories input[type="checkbox"]:checked'
      ),
    ].map((cb) => cb.value);
    caiParamUrlVaReload(formObject);
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
    sort: params.get("sort") || "",
    min: parseInt(params.get("min"), 10),
    max: parseInt(params.get("max"), 10),
    search: params.get("search") || "",
    categories: params.getAll("categories[]") || [],
    tab: params.get("tab"),
    disabled: params.get("disabled"),
  };
}

// goi ham nay khi bam phan trang hoac sap xep/loc de tai lai trang voi param moi
function caiParamUrlVaReload(
  { page, sort, min, max, search, categories, tab, disabled },
  resetParam
) {
  const url = new URL(document.location.toString());
  if (resetParam) url.search = "";
  const params = url.searchParams;
  const setParam = (param, name) => {
    if (param !== undefined) params.set(name, param);
  };
  const setParamArray = (ps, name) => {
    params.delete(name);
    if (Array.isArray(ps)) ps.forEach((p) => params.append(name, p));
  };
  setParam(page, "page");
  setParam(sort, "sort");
  setParam(min, "min");
  setParam(max, "max");
  setParam(search, "search");
  setParamArray(categories, "categories[]");
  setParam(tab, "tab");
  setParam(disabled, "disabled");
  window.location = url.toString();
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

  if (sanPham.matchScore) {
    const matchScore = document.createElement("p");
    matchScore.style.setProperty("color", "green");

    const matchScore1 = document.createElement("small");
    matchScore1.textContent = `Match score: ${sanPham.matchScore}`;
    matchScore.appendChild(matchScore1);

    item.appendChild(matchScore);
  }

  const id = document.createElement("h4");
  id.innerText = sanPham["web-scraper-order"];
  item.appendChild(id);

  const name = document.createElement("h1");
  name.innerText = sanPham["name"];
  item.appendChild(name);

  const spacer = document.createElement("div");
  spacer.classList.add("grid-spacer");
  item.appendChild(spacer);

  const price = document.createElement("p");
  price.style.setProperty("text-decoration", "line-through");
  price.style.setProperty("color", "gray");
  price.innerText = sanPham["price"];
  item.appendChild(price);

  const sale = document.createElement("h3");
  sale.style.setProperty("color", "red");
  sale.innerText = sanPham["price-sale-n"];
  item.appendChild(sale);

  const category = document.createElement("h4");
  category.style.setProperty("color", "cyan");
  category.innerText = `Túi ${sanPham["category"]}`;
  item.appendChild(category);

  const btn = document.createElement("button");
  btn.addEventListener("click", () =>
    hienTrangChiTiet(sanPham["web-scraper-order"])
  );
  btn.textContent = "Xem chi tiet";
  item.appendChild(btn);

  const img = document.createElement("img");
  img.src = `./images/${sanPham["image-file"]}`;
  img.classList.add("grid-img");
  item.appendChild(img);
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

function hienThiPagination(
  pageHienTai,
  pageToiDa,
  wrapperSelector = ".pagination"
) {
  if (pageToiDa === 0) return;
  const wrapper = document.querySelector(wrapperSelector);
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
        caiParamUrlVaReload({ page: goToPage }, false)
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
function locTheLoaiSanPham(theLoai, sanPhamsDaLoc) {
  if (Array.isArray(theLoai) && theLoai?.length > 0)
    return sanPhamsDaLoc.filter((sanPham) =>
      theLoai.includes(sanPham["category"])
    );
  return sanPhamsDaLoc;
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

function createPaginationDebugTable(data) {
  console.table([data]);
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

// tối ưu tìm thực thể dùng index mapping object
// Index Mapping Object Creator Template
function createIndexMapping(entityList, idKey) {
  const indexMapping = {};
  entityList.forEach((entity, index) => {
    indexMapping[entity[idKey]] = index;
  });
  return indexMapping;
}

// CRUD Functions Template
function createEntity(
  entityList,
  entityKey,
  indexMapping,
  indexMappingKey,
  idKey,
  entity
) {
  entityList.push(entity);
  indexMapping[entity[idKey]] = entityList.length - 1;
  luuDuLieuLocalStorage(entityKey, entityList);
  luuDuLieuLocalStorage(indexMappingKey, indexMapping);
}

function readEntity(entityList, indexMapping, idKey, entityId) {
  const index = indexMapping[entityId];
  return index !== undefined ? entityList[index] : null;
}

function updateEntity(
  entityList,
  entityKey,
  indexMapping,
  indexMappingKey,
  idKey,
  entityId,
  newEntity
) {
  const index = indexMapping[entityId];
  if (index !== undefined) {
    entityList[index] = newEntity;
    luuDuLieuLocalStorage(entityKey, entityList);
  }
}

function deleteEntity(
  entityList,
  entityKey,
  indexMapping,
  indexMappingKey,
  idKey,
  entityId
) {
  const index = indexMapping[entityId];
  if (index !== undefined) {
    entityList.splice(index, 1);
    delete indexMapping[entityId];

    // Update index mapping
    for (let i = index; i < entityList.length; i++) {
      indexMapping[entityList[i][idKey]] = i;
    }
    luuDuLieuLocalStorage(entityKey, entityList);
    luuDuLieuLocalStorage(indexMappingKey, indexMapping);
  }
}

// CRUD functions for sanPham
function createSanPham(entity) {
  createEntity(
    g_sanPham,
    sanPhamKey,
    i_sanPham,
    sanPhamImKey,
    sanPhamIdKey,
    entity
  );
}

function readSanPham(entityId) {
  return readEntity(g_sanPham, i_sanPham, sanPhamIdKey, entityId);
}

function updateSanPham(entityId, newEntity) {
  updateEntity(
    g_sanPham,
    sanPhamKey,
    i_sanPham,
    sanPhamImKey,
    sanPhamIdKey,
    entityId,
    newEntity
  );
}

function deleteSanPham(entityId) {
  deleteEntity(
    g_sanPham,
    sanPhamKey,
    i_sanPham,
    sanPhamImKey,
    sanPhamIdKey,
    entityId
  );
}

// CRUD functions for nguoiDung
function createNguoiDung(entity) {
  createEntity(
    g_nguoiDung,
    nguoiDungKey,
    i_nguoiDung,
    nguoiDungImKey,
    nguoiDungIdKey,
    entity
  );
}

function readNguoiDung(entityId) {
  return readEntity(g_nguoiDung, i_nguoiDung, nguoiDungIdKey, entityId);
}

function updateNguoiDung(entityId, newEntity) {
  updateEntity(
    g_nguoiDung,
    nguoiDungKey,
    i_nguoiDung,
    nguoiDungImKey,
    nguoiDungIdKey,
    entityId,
    newEntity
  );
}

function deleteNguoiDung(entityId) {
  deleteEntity(
    g_nguoiDung,
    nguoiDungKey,
    i_nguoiDung,
    nguoiDungImKey,
    nguoiDungIdKey,
    entityId
  );
}

// CRUD functions for hoaDon
function createHoaDon(entity) {
  createEntity(g_hoaDon, hoaDonKey, i_hoaDon, hoaDonImKey, hoaDonImKey, entity);
}

function readHoaDon(entityId) {
  return readEntity(g_hoaDon, i_hoaDon, hoaDonImKey, entityId);
}

function updateHoaDon(entityId, newEntity) {
  updateEntity(
    g_hoaDon,
    hoaDonKey,
    i_hoaDon,
    hoaDonImKey,
    hoaDonImKey,
    entityId,
    newEntity
  );
}

function deleteHoaDon(entityId) {
  deleteEntity(
    g_hoaDon,
    hoaDonKey,
    i_hoaDon,
    hoaDonImKey,
    hoaDonImKey,
    entityId
  );
}

// them san pham, co the nhap id hoac khong
// neu nhap id, kiem tra xem co bi trung id hay ko
// neu ko nhap id, se duoc random 1 id ngau nhien
function themSanPham(id, sanPham) {
  if (id == null) sanPham[sanPhamIdKey] = crypto.randomUUID();
  else if (timSanPham(id)) {
    // TODO: xu ly id bi trung
    alert("themSanPham trung id");
    return;
  } else sanPham[sanPhamIdKey] = id;
  createSanPham(sanPham);
}
// tim san pham theo id
function timSanPham(id) {
  if (id == null) {
    alert("timSanPham chua nhap id");
    return;
  }
  return readSanPham(id);
}
// sua san pham, phai nhap id de biet san pham can sua
// san pham nhan vao se thay the san pham da co
// dung timSanPhamTheoId de lay thong tin san pham cho nguoi dung sua
function suaSanPham(id, sanPham) {
  if (!timSanPham(id)) {
    // TODO: xu ly khong tim thay id
    alert("suaSanPham khong tim thay id");
    return;
  }
  // force reset id
  sanPham[sanPhamIdKey] = id;
  updateSanPham(id, sanPham);
}

function xoaSanPham(id) {
  if (!timSanPham(id)) {
    // TODO: xu ly ko tim thay san pham co id nay
    alert("xoaSanPham khong tim thay id");
    return;
  }
  deleteSanPham(id);
}

// them nguoi dung, co the nhap id hoac khong
// neu nhap id, kiem tra xem co bi trung id hay ko
// neu ko nhap id, se duoc random 1 id ngau nhien
function themNguoiDung(id, nguoiDung) {
  if (id == null) nguoiDung[nguoiDungIdKey] = crypto.randomUUID();
  else if (timNguoiDung(id)) {
    // TODO: xu ly id bi trung
    alert("themNguoiDung trung id");
    return;
  } else nguoiDung[nguoiDungIdKey] = id;
  createNguoiDung(nguoiDung);
}

// tim nguoi dung theo id
function timNguoiDung(id) {
  if (id == null) {
    alert("timNguoiDung chua nhap id");
    return;
  }
  return readNguoiDung(id);
}

// sua nguoi dung, phai nhap id de biet nguoi dung can sua
// nguoi dung nhan vao se thay the nguoi dung da co
// dung timNguoiDungTheoId de lay thong tin nguoi dung cho nguoi dung sua
function suaNguoiDung(id, nguoiDung) {
  if (!timNguoiDung(id)) {
    // TODO: xu ly khong tim thay id
    alert("suaNguoiDung khong tim thay id");
    return;
  }
  // force reset id
  nguoiDung[nguoiDungIdKey] = id;
  updateNguoiDung(id, nguoiDung);
}

function xoaNguoiDung(id) {
  if (!timNguoiDung(id)) {
    // TODO: xu ly ko tim thay nguoi dung co id nay
    alert("xoaNguoiDung khong tim thay id");
    return;
  }
  deleteNguoiDung(id);
}

// them hoa don, co the nhap id hoac khong
// neu nhap id, kiem tra xem co bi trung id hay ko
// neu ko nhap id, se duoc random 1 id ngau nhien
function themHoaDon(id, hoaDon) {
  if (id == null) hoaDon[hoaDonIdKey] = crypto.randomUUID();
  else if (timHoaDon(id)) {
    // TODO: xu ly id bi trung
    alert("themHoaDon trung id");
    return;
  } else hoaDon[hoaDonIdKey] = id;
  createHoaDon(hoaDon);
}

// tim hoa don theo id
function timHoaDon(id) {
  if (id == null) {
    alert("timHoaDon chua nhap id");
    return;
  }
  return readHoaDon(id);
}

// sua hoa don, phai nhap id de biet hoa don can sua
// hoa don nhan vao se thay the hoa don da co
// dung timHoaDonTheoId de lay thong tin hoa don cho nguoi dung sua
function suaHoaDon(id, hoaDon) {
  if (!timHoaDon(id)) {
    // TODO: xu ly khong tim thay id
    alert("suaHoaDon khong tim thay id");
    return;
  }
  // force reset id
  hoaDon[hoaDonIdKey] = id;
  updateHoaDon(id, hoaDon);
}

function xoaHoaDon(id) {
  if (!timHoaDon(id)) {
    // TODO: xu ly ko tim thay hoa don co id nay
    alert("xoaHoaDon khong tim thay id");
    return;
  }
  deleteHoaDon(id);
}

// goi khi trang web load thanh cong
window.addEventListener("load", () => {
  verifyDataVersion();
  if (document.querySelector(".product-list")) taiSanPham();
  if (document.querySelector(".user-list")) taiNguoiDung();
  if (document.querySelector(".receipt-list")) taiHoaDon();
});
