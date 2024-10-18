var g_dsTui;
function layDsTui() {
  fetch("./lynvn.json")
    .then((res) => res.text())
    .then((text) => {
      let sanPhams = JSON.parse(text);
      g_dsTui = sanPhams;
      hienDsTui(sanPhams);
    });
}
function layParams() {
  let params = new URL(document.location.toString()).searchParams;
  return {
    page: params.get("page"),
    start: params.get("start"),
    sort: params.get("sort"),
    min: params.get("min"),
    max: params.get("max"),
  };
}
function hienDsTui(sanPhams) {
  let { page, start, sort, min, max } = layParams();
  let comp = null;
  if (sort === "asc") comp = 1;
  else if (sort === "desc") comp = -1;
  let sanPhamsDaLoc = sanPhams
    .filter((sanPham) => (min != null ? sanPham["price-sale-n"] >= min : true)) // loc gia thap nhat
    .filter((sanPham) => (max != null ? sanPham["price-sale-n"] >= max : true)) // loc gia cao nhat
    .sort((a, b) => (comp != null ? comp * (a["price-n"] - b["price-n"]) : 0)); // sap xep
  let slSp = sanPhamsDaLoc.length;
  let batDauTai = 0;
  if (page != null) {
    batDauTai = page * 20;
  } else if (start != null) {
    batDauTai = start;
  }
  if (batDauTai > slSp) {
    bamLo();
    return;
  }
  let sanPhamsHienThi = sanPhamsDaLoc.slice(batDauTai, batDauTai + 20);
  hienThiSanPham(sanPhamsHienThi, {
    page,
    start,
    sort,
    min,
    max,
    comp,
    slSp,
    batDauTai,
  });
}
function hienTrangChiTiet(id) {
  // TODO: mo trang chi tiet san pham
  let sanPham = g_dsTui.find((sanPham) => sanPham["web-scraper-order"] === id);
  console.info(id, sanPham);
}
function bamLo() {
  // TODO: bam lo so page
}
function hienThiSanPham(sanPhams, params) {
  // TODO: hien thi danh sach san Pham sau khi load
  let body = document.querySelector("body"); // thay thanh container
  let textParams = JSON.stringify(params, null, 4);
  let paramE = document.createElement("p");
  paramE.innerText = textParams;
  body.appendChild(paramE);
  for (let s of sanPhams) {
    let item = document.createElement("div");
    let id = document.createElement("h4");
    id.innerText = s["web-scraper-order"];
    item.appendChild(id);
    let name = document.createElement("h1");
    name.innerText = s["name"];
    item.appendChild(name);
    let price = document.createElement("h3");
    price.innerText = s["price"];
    item.appendChild(price);
    let img = document.createElement("img");
    img.src = `./images/${s["image-file"]}`;
    item.appendChild(img);
    let btn = document.createElement("button");
    btn.addEventListener("click", () =>
      hienTrangChiTiet(s["web-scraper-order"])
    );
    btn.innerText = "Xem chi tiet";
    item.appendChild(btn);
    body.appendChild(item);
  }
}

window.addEventListener("load", () => {
  layDsTui();
});
