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

window.addEventListener("load", () => {
  let chart2;
  thongKeThoiGian2().then((tktg) => {
    const year2024 = tktg["chi-tiet"]["2024"];
    let yearGraphOptions = {
      chart: {
        type: "bar",
        events: {
          dataPointSelection: function (event, chartContext, config) {
            console.log(event, chartContext, config);
            const monthIndex = config.dataPointIndex;
            const days = year2024["chi-tiet"][monthIndex]["chi-tiet"];
            let monthGraphOptions = {
              chart: {
                type: "bar",
              },
              plotOptions: { bar: { horizontal: true } },
              series: [
                {
                  name: "profits",
                  data: days.map((day) => day["tong-thu"]),
                },
              ],
              xaxis: {
                labels: { formatter: formatVND },
                categories: Object.keys(days),
              },
              dataLabels: {
                formatter: formatVND,
              },
            };
            if (!chart2) {
              chart2 = new ApexCharts(
                document.querySelector("#chart2"),
                monthGraphOptions
              );
              chart2.render();
              return;
            }
            chart2.updateOptions(monthGraphOptions);
          },
        },
      },
      plotOptions: { bar: { horizontal: true } },
      series: [
        {
          name: "profits",
          data: year2024["chi-tiet"].map((month) => month["tong-thu"]),
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
    let chart = new ApexCharts(
      document.querySelector("#chart"),
      yearGraphOptions
    );
    chart.render();
  });
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
