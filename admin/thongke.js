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

function topSanPhamDoanhThu({ ngay, thang, nam } = {}) {
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

function thongKeThoiGian() {
  const result = {};

  // Step 1: Fill daily data
  hoaDons.forEach((hoaDon) => {
    const ngayTao = new Date(hoaDon["ngay-tao"]);
    const year = ngayTao.getFullYear();
    const month = ngayTao.getMonth() + 1; // getMonth() is zero-based
    const day = ngayTao.getDate();

    if (!result[year]) {
      result[year] = {
        "chi-tiet": {},
      };
    }
    if (!result[year]["chi-tiet"][month]) {
      result[year]["chi-tiet"][month] = {
        "chi-tiet": Array(new Date(year, month, 0).getDate())
          .fill()
          .map(() => ({
            "so-don": 0,
            "so-khach": new Set(),
            "loai-da-ban": new Set(),
            "da-ban": 0,
            "tong-thu": 0,
          })),
      };
    }

    const dayData = result[year]["chi-tiet"][month]["chi-tiet"][day - 1];
    dayData["so-don"] += 1;
    dayData["so-khach"].add(hoaDon["nguoi-dung"]);

    hoaDon["chi-tiet"].forEach((item) => {
      dayData["loai-da-ban"].add(item["san-pham"]);
      dayData["da-ban"] += item["so-luong"];
      const product = timSanPham(item["san-pham"]);
      dayData["tong-thu"] += (product["price-sale-n"] || 0) * item["so-luong"];
    });
  });

  // Step 2: Aggregate monthly data
  Object.entries(result).forEach(([year, yearData]) => {
    Object.entries(yearData["chi-tiet"]).forEach(([month, monthDetail]) => {
      const monthData = {
        "so-don": 0,
        "so-khach": new Set(),
        "loai-da-ban": new Set(),
        "da-ban": 0,
        "tong-thu": 0,
        "chi-tiet": monthDetail["chi-tiet"],
      };

      monthData["chi-tiet"].forEach((dayData) => {
        monthData["so-don"] += dayData["so-don"];
        dayData["so-khach"].forEach((khach) =>
          monthData["so-khach"].add(khach)
        );
        dayData["loai-da-ban"].forEach((sp) =>
          monthData["loai-da-ban"].add(sp)
        );
        monthData["da-ban"] += dayData["da-ban"];
        monthData["tong-thu"] += dayData["tong-thu"];
      });

      monthData["so-khach"] = monthData["so-khach"].size;
      monthData["loai-da-ban"] = monthData["loai-da-ban"].size;
      result[year]["chi-tiet"][month] = monthData;
    });
  });

  // Step 3: Aggregate yearly data
  Object.entries(result).forEach(([year, yearDetail]) => {
    const yearData = {
      "so-don": 0,
      "so-khach": new Set(),
      "loai-da-ban": new Set(),
      "da-ban": 0,
      "tong-thu": 0,
      "chi-tiet": yearDetail["chi-tiet"],
    };

    Object.values(yearData["chi-tiet"]).forEach((monthData) => {
      yearData["so-don"] += monthData["so-don"];
      monthData["so-khach"].forEach((khach) => yearData["so-khach"].add(khach));
      monthData["loai-da-ban"].forEach((sp) => yearData["loai-da-ban"].add(sp));
      yearData["da-ban"] += monthData["da-ban"];
      yearData["tong-thu"] += monthData["tong-thu"];
    });

    yearData["so-khach"] = yearData["so-khach"].size;
    yearData["loai-da-ban"] = yearData["loai-da-ban"].size;
    result[year] = yearData;
  });
  return result;
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
