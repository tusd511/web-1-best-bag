function layDsTui() {
    $.get("lynvn.csv", (csv) => {
        $.csv.toArrays(csv, [], (_, sanPhams) => {
            hienDsTui(sanPhams);
        });
    });
}
function hienDsTui(sanPhams) {
    let slSp = sanPhams.length;
    let page = parseInt(
        new URL(document.location.toString()).searchParams.get("page")
    );
    let maxPage = slSp / 10 - 1;
    if (page > maxPage) {
        bamLo();
        return;
    }
    let sanPhamsHienThi = sanPhams.slice(page * 10, (page + 1) * 10 + 1);
    hienThiSanPham(sanPhamsHienThi);
}
function hienTrangChiTiet(index) {
    // TODO: chi tiet san pham
}
function bamLo() {
    // TODO: bam lo so page
}
function hienThiSanPham(sanPhams) {
    // TODO: hien thi san Pham
    for (sanPham of sanPhams) {
        $("body").append(
            `<div><img src="images/${sanPhams["image-file"]}"><h1>${sanPhams["name"]}</h1><h2>${sanPhams["price"]}</h2><h3>${sanPhams["price-sale-n"]}</h3></div>`
        );
    }
}

$.ready((h) => layDsTui());
