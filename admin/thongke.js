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
    const sp = readSanPham(spId);
    return {
      "san-pham": sp,
      "so-luong": sl,
      "tong-thu": sl * sp?.["price-sale-n"],
    };
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
      "nguoi-dung": readNguoiDung(ndId),
      "so-don": ct["so-don"],
      "loai-da-mua": Object.keys(tt).length,
      "da-mua": Object.values(tt).reduce((sum, qty) => sum + qty, 0),
      "tong-chi": Object.entries(tt).reduce(
        (total, [spId, qty]) =>
          total + qty * readSanPham(spId)?.["price-sale-n"],
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

function thongKeGioHang() {
  const uniqueProducts = new Set();
  let totalQuantity = 0;

  g_gioHang.forEach((cart) => {
    cart["chi-tiet"].forEach((item) => {
      uniqueProducts.add(item["san-pham"]);
      totalQuantity += item["so-luong"];
    });
  });

  return {
    uniqueProductCount: uniqueProducts.size,
    totalProductCount: totalQuantity,
  };
}

function thongKeDonHang() {
  return {
    orderCount: g_hoaDon.length,
  };
}

function thongKeTaiKhoan() {
  return {
    activeCount: g_nguoiDung.filter((user) => !user["disabled"]).length,
  };
}

function thongKeTruyCap() {
  const now = new Date();
  const elapsed = new Date() - new Date(now.getFullYear(), now.getMonth());
  return {
    viewCountThisMonth: Math.ceil(elapsed / 15000),
    adsClicksThisMonth: Math.ceil(elapsed / 35000),
  };
}

function thongKeDoanhThu() {
  const now = new Date();
  return thongKeThoiGian()["chi-tiet"][now.getFullYear()]["chi-tiet"][
    now.getMonth()
  ]["tong-thu"];
}

function thongKeThoiGian() {
  const yearlyResult = {};

  // Step 1: Fill daily data
  g_hoaDon.forEach((hoaDon) => {
    const ngayTao = new Date(hoaDon["ngay-tao"]);
    const year = ngayTao.getFullYear();
    const month = ngayTao.getMonth() + 1; // getMonth() is zero-based
    const day = ngayTao.getDate();

    if (!yearlyResult[year]) {
      yearlyResult[year] = {
        "chi-tiet": Array(12)
          .fill()
          .map(() => ({
            "so-don": 0,
            "so-khach-set": new Set(),
            "so-khach": 0,
            "loai-da-ban-set": new Set(),
            "loai-da-ban": 0,
            "da-ban": 0,
            "tong-thu": 0,
            "chi-tiet": [],
          })),
      };
    }
    if (yearlyResult[year]["chi-tiet"][month - 1]["chi-tiet"].length === 0) {
      yearlyResult[year]["chi-tiet"][month - 1]["chi-tiet"] = Array(
        new Date(year, month, 0).getDate()
      )
        .fill()
        .map(() => ({
          "so-don": 0,
          "so-khach-set": new Set(),
          "so-khach": 0,
          "loai-da-ban-set": new Set(),
          "loai-da-ban": 0,
          "da-ban": 0,
          "tong-thu": 0,
        }));
    }

    const dayData =
      yearlyResult[year]["chi-tiet"][month - 1]["chi-tiet"][day - 1];
    dayData["so-don"] += 1;
    dayData["so-khach-set"].add(hoaDon["nguoi-dung"]);
    hoaDon["chi-tiet"].forEach((chiTiet) => {
      dayData["loai-da-ban-set"].add(chiTiet["san-pham"]);
      dayData["da-ban"] += chiTiet["so-luong"];
      const sanPham = readSanPham(chiTiet["san-pham"]);
      dayData["tong-thu"] +=
        (sanPham["price-sale-n"] || 0) * chiTiet["so-luong"];
    });
  });

  // Step 2: Aggregate monthly data
  Object.entries(yearlyResult).forEach(([year, yearData]) => {
    yearData["chi-tiet"].forEach((monthDetail, monthIndex) => {
      const monthData = {
        "so-don": 0,
        "so-khach-set": new Set(),
        "so-khach": 0,
        "loai-da-ban-set": new Set(),
        "loai-da-ban": 0,
        "da-ban": 0,
        "tong-thu": 0,
        "chi-tiet": monthDetail["chi-tiet"],
      };

      monthData["chi-tiet"].forEach((dayData) => {
        monthData["so-don"] += dayData["so-don"];
        dayData["so-khach-set"].forEach(
          monthData["so-khach-set"].add,
          monthData["so-khach-set"]
        );
        dayData["so-khach"] = dayData["so-khach-set"].size;
        dayData["loai-da-ban-set"].forEach(
          monthData["loai-da-ban-set"].add,
          monthData["loai-da-ban-set"]
        );
        dayData["loai-da-ban"] = dayData["loai-da-ban-set"].size;
        monthData["da-ban"] += dayData["da-ban"];
        monthData["tong-thu"] += dayData["tong-thu"];
      });

      yearlyResult[year]["chi-tiet"][monthIndex] = {
        ...monthData,
        "so-khach": monthData["so-khach-set"].size,
        "loai-da-ban": monthData["loai-da-ban-set"].size,
      };
    });
  });

  // Step 3: Aggregate yearly data
  Object.entries(yearlyResult).forEach(([year, yearDetail]) => {
    const yearData = {
      "so-don": 0,
      "so-khach-set": new Set(),
      "so-khach": 0,
      "loai-da-ban-set": new Set(),
      "loai-da-ban": 0,
      "da-ban": 0,
      "tong-thu": 0,
      "chi-tiet": yearDetail["chi-tiet"],
    };

    yearData["chi-tiet"].forEach((monthData) => {
      yearData["so-don"] += monthData["so-don"];
      monthData["so-khach-set"].forEach(
        yearData["so-khach-set"].add,
        yearData["so-khach-set"]
      );
      monthData["loai-da-ban-set"].forEach(
        yearData["loai-da-ban-set"].add,
        yearData["loai-da-ban-set"]
      );
      yearData["da-ban"] += monthData["da-ban"];
      yearData["tong-thu"] += monthData["tong-thu"];
    });

    yearlyResult[year] = {
      ...yearData,
      "so-khach": yearData["so-khach-set"].size,
      "loai-da-ban": yearData["loai-da-ban-set"].size,
    };
  });

  // Step 4: Aggregate all years into the final object
  const allTimeResult = {
    "so-don": 0,
    "so-khach-set": new Set(),
    "so-khach": 0,
    "loai-da-ban-set": new Set(),
    "loai-da-ban": 0,
    "da-ban": 0,
    "tong-thu": 0,
    "chi-tiet": yearlyResult, // Use the result from Steps 1-3
  };

  Object.values(yearlyResult).forEach((yearData) => {
    allTimeResult["so-don"] += yearData["so-don"];
    yearData["so-khach-set"].forEach(
      allTimeResult["so-khach-set"].add,
      allTimeResult["so-khach-set"]
    );
    yearData["loai-da-ban-set"].forEach(
      allTimeResult["loai-da-ban-set"].add,
      allTimeResult["loai-da-ban-set"]
    );
    allTimeResult["da-ban"] += yearData["da-ban"];
    allTimeResult["tong-thu"] += yearData["tong-thu"];
  });

  allTimeResult["so-khach"] = allTimeResult["so-khach-set"].size;
  allTimeResult["loai-da-ban"] = allTimeResult["loai-da-ban-set"].size;

  return allTimeResult;
}

async function thongKeThoiGian2() {
  return await (await fetch("./tktgv18.json")).json();
}

function thongKeDanhMuc() {
  {
    const result = {};
    g_hoaDon.forEach((hoaDon) => {
      hoaDon["chi-tiet"].forEach((chiTiet) => {
        const sanPham = timSanPham(chiTiet["san-pham"]);
        const category = sanPham.category;
        const soLuong = chiTiet["so-luong"];
        if (result[category]) {
          result[category] += soLuong;
        } else {
          result[category] = soLuong;
        }
      });
    });
    return result;
  }
}
