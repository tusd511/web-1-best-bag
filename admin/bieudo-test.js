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

var g_chart = { element: null, context: null };

function setChartOptions(options) {
  const { element, context } = g_chart;
  if (context?.opts?.chart?.type !== options?.chart?.type) {
    element.innerHTML = "";
    context?.destroy();
    const newContext = new ApexCharts(element, options);
    newContext.render();
    g_chart.context = newContext;
    return;
  }
  context.updateOptions(options);
}

function hienBieuDoDoanhThu(historyLink) {
  const history = [];
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
            () => setChartOptions(yearGraphOptions)
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
                    () => setChartOptions(monthGraphOptions)
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
                    title: { text: "Bieu do doanh thu theo ngay" },
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
                      enabled: true,
                      formatter: formatVND,
                    },
                  };
                  setChartOptions(monthGraphOptions);
                },
              },
            },
            title: { text: "Bieu do doanh thu theo thang" },
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
              enabled: true,
              formatter: formatVND,
            },
          };
          setChartOptions(yearGraphOptions);
        },
      },
    },
    title: { text: "Bieu do doanh thu theo nam" },
    plotOptions: {
      bar: {
        dataLabels: { orientation: "horizontal" },
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
      enabled: true,
      formatter: formatVND,
    },
  };
  setChartOptions(decadeGraphOptions);
  const yearCount = Object.keys(tktg["chi-tiet"]).length;
  createHistory(
    `2020s`,
    `Avg: ${formatVND(Math.ceil(tktg["tong-thu"] / yearCount))}`,
    `Sum: ${formatVND(tktg["tong-thu"])}`,
    () => setChartOptions(decadeGraphOptions)
  );
}

function hienBieuDoKhachSop() {
  const tknd = thongKeNguoiDung();
  const nds = tknd.sort((a, b) => b["tong-chi"] - a["tong-chi"]).slice(0, 10);
  const options = {
    chart: {
      type: "bar",
      events: { dataPointSelection: () => {} },
    },
    title: { text: "Bieu do khach sop" },
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
  setChartOptions(options);
}

function hienBieuDoBanChay(chartContext) {
  const tkdm = thongKeDanhMuc();
  const categories = Object.keys(tkdm);
  const soLuongs = Object.values(tkdm);
  const options = {
    series: soLuongs,
    labels: categories,
    chart: { type: "donut", events: { dataPointSelection: () => {} } },
    title: { text: "San Pham Categories" },
    plotOptions: {
      pie: {
        donut: { labels: { show: true, total: { show: true } }, size: "25%" },
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          return `${val}`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(2)}%`,
    },
  };
  setChartOptions(options);
}

function taoBieuDo() {
  const historyLink = document.querySelector("#chart-navback");
  const chartForm = document.querySelector("#chartForm");
  const chartType = document.querySelector("#chartType");
  const chartElement = document.querySelector("#chart");
  g_chart.element = chartElement;
  setChartOptions({
    chart: {
      type: "pie",
    },
    series: [],
    title: {
      text: "DANG TAI DU LIEU",
      align: "center",
    },
  });
  const chartTypes = {
    doanhthu: hienBieuDoDoanhThu,
    khachsop: hienBieuDoKhachSop,
    banchay: hienBieuDoBanChay,
  };
  function onChartTypeSelection(target) {
    const { tab } = layParamUrl();
    const chart = target ? new FormData(target).get("chart") : "doanhthu";
    caiParamUrl({ tab, chart }, true, false);
    chartType.value = chart;
    historyLink.innerHTML = "";
    chartTypes[chart]?.(historyLink);
  }
  onChartTypeSelection();
  chartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    onChartTypeSelection(e.target);
  });
  chartType.addEventListener("change", (e) =>
    onChartTypeSelection(e.target.parentElement)
  );
}

window.addEventListener("load", () => {
  if (
    !document.querySelector("#chart-wrapper") ||
    !document.querySelector("#chartForm")
  )
    return;
  taiDuLieuTongMainJs(() =>
    taiHoaDon(() => taiNguoiDung(() => taiSanPham(() => taoBieuDo())))
  );
});

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
