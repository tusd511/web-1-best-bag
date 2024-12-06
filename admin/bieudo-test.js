// https://stackoverflow.com/a/66626916/12495504
/**
 * Return list of months
 * 🌍 localeName   : name of local, f.e. en-GB, default es-MX
 *  ✅ monthFormat : short, numeric, long (Default)
 */
function monthsForLocale(localeName = "en-US", monthFormat = "long") {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat })
    .format;
  return [...Array(12).keys()].map((m) =>
    format(new Date(Date.UTC(2021, m /*+ 1*/ % 12)))
  );
}
function formatVND(value) {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

function hienBieuDoDoanhThu() {
  const history = [];
  const historyLink = document.querySelector("#chart-navback");
  tktg = thongKeThoiGian();
  // thongKeThoiGian2().then((tktg) => {
  function createHistory(text1, text2, text3, callback) {
    function addSlash() {
      const slash = document.createElement("h2");
      slash.style.fontSize = "64px";
      slash.textContent = "/";
      historyLink.appendChild(slash);
    }
    function renderHistory() {
      historyLink.innerHTML = "";
      history.forEach((link, index) => {
        if (index > 0) addSlash();
        historyLink.appendChild(link);
      });
    }

    const elementa = document.createElement("a");
    elementa.href = "#";
    const element = document.createElement("h3");
    element.appendChild(document.createTextNode(text1));
    element.appendChild(document.createElement("br"));
    if (text2) {
      element.appendChild(document.createTextNode(text2));
      element.appendChild(document.createElement("br"));
    }
    if (text3) {
      element.appendChild(document.createTextNode(text3));
      element.appendChild(document.createElement("br"));
    }
    elementa.addEventListener("click", () => {
      const index = history.indexOf(elementa);
      if (index === history.length - 1) return;
      history.length = index === -1 ? 0 : index + 1;
      renderHistory();
      callback();
    });
    elementa.appendChild(element);
    history.push(elementa);
    renderHistory();
  }
  let decadeGraphOptions = {
    chart: {
      type: "bar",
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const yearIndex = config.dataPointIndex;
          const year = Object.keys(tktg["chi-tiet"])[yearIndex];
          const yearData = tktg["chi-tiet"][year];
          const monthCount = yearData["chi-tiet"].length;
          createHistory(
            `Nam ${year}`,
            `Avg: ${formatVND(Math.ceil(yearData["tong-thu"] / monthCount))}`,
            `Sum: ${formatVND(yearData["tong-thu"])}`,
            () => chart.updateOptions(yearGraphOptions)
          );
          let yearGraphOptions = {
            chart: {
              type: "bar",
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  const monthIndex = config.dataPointIndex;
                  const monthData = yearData["chi-tiet"][monthIndex];
                  const days = monthData["chi-tiet"];
                  const dayCount = days.length;
                  createHistory(
                    `Thang ${monthIndex + 1} (${dayCount} ngay)`,
                    `Avg: ${formatVND(
                      Math.ceil(monthData["tong-thu"]) / dayCount
                    )}`,
                    `Sum: ${formatVND(monthData["tong-thu"])}`,
                    () => chart.updateOptions(monthGraphOptions)
                  );
                  let monthGraphOptions = {
                    chart: {
                      type: "bar",
                      events: {
                        dataPointSelection: function (
                          event,
                          chartContext,
                          config
                        ) {},
                      },
                    },
                    plotOptions: {
                      bar: {
                        dataLabels: { orientation: "vertical" },
                        horizontal: false,
                      },
                    },
                    series: [
                      {
                        name: "profits",
                        data: days.map((day) => day["tong-thu"]),
                      },
                    ],
                    xaxis: {
                      labels: { formatter: (n) => `Ngay ${n + 1}` },
                      categories: Array(days.length)
                        .fill()
                        .map((v, i) => i),
                    },
                    yaxis: {
                      labels: { formatter: formatVND },
                      categories: Object.keys(days),
                    },
                    dataLabels: {
                      formatter: formatVND,
                    },
                  };
                  chart.updateOptions(monthGraphOptions);
                },
              },
            },
            plotOptions: {
              bar: {
                dataLabels: { orientation: "horizontal" },
                horizontal: true,
              },
            },
            series: [
              {
                name: "profits",
                data: yearData["chi-tiet"].map((month) => month["tong-thu"]),
              },
            ],
            xaxis: {
              labels: { formatter: formatVND },
              categories: monthsForLocale("vi-VN", "long"),
            },
            dataLabels: {
              formatter: formatVND,
            },
          };
          chart.updateOptions(yearGraphOptions);
        },
      },
    },
    plotOptions: {
      bar: {
        dataLabels: { orientation: "vertical" },
        horizontal: false,
      },
    },
    series: [
      {
        name: "profits",
        data: Object.values(tktg["chi-tiet"]).map((year) => year["tong-thu"]),
      },
    ],
    xaxis: {
      labels: { formatter: (n) => `Nam ${n}` },
      categories: Object.keys(tktg["chi-tiet"]),
    },
    yaxis: {
      labels: { formatter: formatVND },
      categories: [],
    },
    dataLabels: {
      formatter: formatVND,
    },
  };
  let chart = new ApexCharts(
    document.querySelector("#chart"),
    decadeGraphOptions
  );
  chart.render();
  const yearCount = Object.keys(tktg["chi-tiet"]).length;
  createHistory(
    `2020s`,
    `Avg: ${formatVND(Math.ceil(tktg["tong-thu"] / yearCount))}`,
    `Sum: ${formatVND(tktg["tong-thu"])}`,
    () => chart.updateOptions(decadeGraphOptions)
  );
}

function hienBieuDoKhachSop() {
  const tknd = thongKeNguoiDung();
  const nds = tknd.sort((a, b) => b["tong-chi"] - a["tong-chi"]).slice(0, 10);
  let yearGraphOptions = {
    chart: {
      type: "bar",
    },
    plotOptions: { bar: { horizontal: true } },
    series: [
      {
        name: "profits",
        data: nds.map((nd) => nd["tong-chi"]),
      },
    ],
    xaxis: {
      labels: { formatter: formatVND },
      categories: nds.map((nd) => nd["nguoi-dung"]["name"]),
    },
    dataLabels: {
      formatter: formatVND,
    },
  };
  let chart = new ApexCharts(
    document.querySelector("#chart"),
    yearGraphOptions
  );
  chart.render();
}

function hienBieuDoBanChay() {
  const tkdm = thongKeDanhMuc();
  const categories = Object.keys(tkdm);
  const soLuongs = Object.values(tkdm);
  const totalSoLuong = soLuongs.reduce((total, num) => total + num, 0);
  const options = {
    series: soLuongs,
    labels: categories,
    chart: { type: "pie" },
    title: { text: "San Pham Categories", align: "center" },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const soLuong = opts.w.config.series[opts.seriesIndex];
        const category = opts.w.config.labels[opts.seriesIndex];
        const percentage = val.toFixed(2);
        return `${category} ${soLuong} (${percentage}%)`;
      },
    },
  };
  let chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}

window.addEventListener("load", () =>
  taiDuLieuTongMainJs(() =>
    taiHoaDon(() => {
      const { chart } = layParamUrl();
      const chartTypes = {
        doanhthu: hienBieuDoDoanhThu,
        khachsop: hienBieuDoKhachSop,
        banchay: hienBieuDoBanChay,
      };
      chartTypes[chart ?? "doanhthu"]?.();
      document.querySelector("#chartForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        caiParamUrl({ chart: form.get("chart") }, false, true);
      });
    })
  )
);

// function generateRandomData(num) {
//   return Array.from({ length: num }, () => Math.floor(Math.random() * 100));
// }
// function getDaysInMonth(year, month) {
//   return new Date(year, month, 0).getDate();
// }
// function generateDateLabels(year) {
//   const months = Array.from({ length: 12 }, (_, i) => i + 1);
//   return months.map((month) => {
//     const days = getDaysInMonth(year, month);
//     return {
//       label: `${month}-${year}`,
//       children: Array.from(
//         { length: days },
//         (_, i) => `${i + 1}-${month}-${year}`
//       ),
//     };
//   });
// }
// function generateYearLabels(decadeStart) {
//   return Array.from({ length: 10 }, (_, i) => {
//     const year = decadeStart + i;
//     return {
//       label: year,
//       children: generateDateLabels(year),
//     };
//   });
// }
// function generateYearTree(year) {
//   return {
//     value: Math.floor(Math.random() * 1000),
//     children: generateDateLabels(year).map((month) => ({
//       value: Math.floor(Math.random() * 1000),
//       children: generateRandomData(getDaysInMonth(year, parseInt(month.label))),
//     })),
//   };
// }
// const data = {
//   labels: generateYearLabels(2020),
//   datasets: [
//     {
//       label: "Random Data",
//       tree: generateYearLabels(2020).map((year) =>
//         generateYearTree(parseInt(year.label) + 2000)
//       ),
//     },
//   ],
// };

// window.onload = () => {
//   const ctx = document.getElementById("hierarchicalChart").getContext("2d");
//   window.myBar = new Chart(ctx, {
//     type: "bar",
//     data: data,
//     options: {
//       responsive: true,
//       title: {
//         display: true,
//         text: "Chart.js Hierarchical Bar Chart",
//       },
//       layout: {
//         padding: {
//           // add more space at the bottom for the hierarchy
//           bottom: 90,
//         },
//       },
//       scales: {
//         x: {
//           type: "hierarchical",
//         },
//         y: {
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       },
//     },
//   });
// };
