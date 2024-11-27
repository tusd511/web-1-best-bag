function shouldProcessDate(date, { ngay, thang, nam }) {
  const nt = new Date(date);
  return (
    (ngay == null || nt.getDay() == ngay) &&
    (thang == null || nt.getMonth() == thang) &&
    (nam == null || nt.getFullYear() == nam)
  );
}

function thongKeSanPham({ ngay, thang, nam } = {}) {
  return Object.entries(
    g_hoaDon.reduce((spSl, hd) => {
      if (!shouldProcessDate(hd["ngay-tao"], { ngay, thang, nam })) return spSl;
      hd["chi-tiet"].forEach((ct) => {
        const sp = ct["san-pham"];
        spSl[sp] = (spSl[sp] ?? 0) + ct["so-luong"];
      });
      return spSl;
    }, {})
    // vd: { "1728630164-699": 2, "1728630145-400": 1 }
  ).map(([spId, sl]) => {
    const sp = timSanPham(spId);
    return { ...sp, "so-luong": sl, "tong-thu": sl * sp["price-sale-n"] };
  });
}

function topSanPhamBanChay({ ngay, thang, nam } = {}) {
  return thongKeSanPham({ ngay, thang, nam }).sort(
    (a, b) => b["so-luong"] - a["so-luong"]
  );
}

function topSanPhamDoanhThu({ ngay, thang, nam } = {}) {
  return thongKeSanPham({ ngay, thang, nam }).sort(
    (a, b) => b["tong-thu"] - a["tong-thu"]
  );
}

function thongKeNguoiDung({ ngay, thang, nam } = {}) {
  return Object.entries(
    g_hoaDon.reduce((ndCt, hd) => {
      if (!shouldProcessDate(hd["ngay-tao"], { ngay, thang, nam })) return ndCt;
      const nd = hd["nguoi-dung"];
      if (!ndCt[nd]) ndCt[nd] = { "tieu-thu": {}, "so-don": 0 };
      ndCt[nd]["so-don"] += 1;
      hd["chi-tiet"].forEach((ct) => {
        const sp = ct["san-pham"];
        ndCt[nd][["tieu-thu"]][sp] =
          (ndCt[nd][["tieu-thu"]][sp] ?? 0) + ct["so-luong"];
      });
      return ndCt;
    }, {})
    // vd: {
    //   "0650bec8-e2bd-4b1e-bf4c-c98267793392": {
    //     "tieu-thu": {
    //       "1728630164-699": 2,
    //       "1728630145-400": 1
    //     },
    //     "so-don": 2
    //   }
    // }
  ).map(([ndId, ct]) => {
    const tt = ct["tieu-thu"];
    // breakpoint();
    return {
      ...timNguoiDung(ndId),
      "so-don": ct["so-don"],
      "loai-da-mua": Object.keys(tt).length,
      "da-mua": Object.values(tt).reduce((sum, qty) => sum + qty, 0),
      "tong-chi": Object.entries(tt).reduce(
        (total, [spId, qty]) => total + qty * timSanPham(spId)["price-sale-n"],
        0
      ),
    };
  });
}

function topKhachLenDon({ ngay, thang, nam } = {}) {
  return thongKeNguoiDung({ ngay, thang, nam }).sort(
    (a, b) => b["so-don"] - a["so-don"]
  );
}

function topKhachMuaNhieuLoai({ ngay, thang, nam } = {}) {
  return thongKeNguoiDung({ ngay, thang, nam }).sort(
    (a, b) => b["loai-da-mua"] - a["loai-da-mua"]
  );
}

function topKhachMuaNhieu({ ngay, thang, nam } = {}) {
  return thongKeNguoiDung({ ngay, thang, nam }).sort(
    (a, b) => b["da-mua"] - a["da-mua"]
  );
}

function topKhachChiTieu({ ngay, thang, nam } = {}) {
  return thongKeNguoiDung({ ngay, thang, nam }).sort(
    (a, b) => b["tong-chi"] - a["tong-chi"]
  );
}

// taiDuLieu(nguoiDungKey, nguoiDungFile).then((data) => {
//     g_nguoiDung = data;
//     i_nguoiDung =
//       taiDuLieuLocalStorage(nguoiDungImKey) ??
//       createIndexMapping(g_nguoiDung, nguoiDungIdKey);
//   });
//   taiDuLieu(sanPhamKey, sanPhamFile).then((data) => {
//     g_sanPham = data;
//     i_sanPham =
//       taiDuLieuLocalStorage(sanPhamImKey) ??
//       createIndexMapping(g_sanPham, sanPhamIdKey);
//   });
//   taiDuLieu(hoaDonKey, hoaDonFile).then((data) => {
//     g_hoaDon = data;
//     i_hoaDon =
//       taiDuLieuLocalStorage(hoaDonImKey) ??
//       createIndexMapping(g_hoaDon, hoaDonIdKey);
//   });
