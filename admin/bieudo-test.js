function generateRandomData(num) {
  return Array.from({ length: num }, () => Math.floor(Math.random() * 100));
}
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function generateDateLabels(year) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  return months.map((month) => {
    const days = getDaysInMonth(year, month);
    return {
      label: `${month}-${year}`,
      children: Array.from(
        { length: days },
        (_, i) => `${i + 1}-${month}-${year}`
      ),
    };
  });
}
function generateYearLabels(decadeStart) {
  return Array.from({ length: 10 }, (_, i) => {
    const year = decadeStart + i;
    return {
      label: year,
      children: generateDateLabels(year),
    };
  });
}
function generateYearTree(year) {
  return {
    value: Math.floor(Math.random() * 1000),
    children: generateDateLabels(year).map((month) => ({
      value: Math.floor(Math.random() * 1000),
      children: generateRandomData(getDaysInMonth(year, parseInt(month.label))),
    })),
  };
}
const data = {
  labels: generateYearLabels(2020),
  datasets: [
    {
      label: "Random Data",
      tree: generateYearLabels(2020).map((year) =>
        generateYearTree(parseInt(year.label) + 2000)
      ),
    },
  ],
};

window.onload = () => {
  const ctx = document.getElementById("hierarchicalChart").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Chart.js Hierarchical Bar Chart",
      },
      layout: {
        padding: {
          // add more space at the bottom for the hierarchy
          bottom: 90,
        },
      },
      scales: {
        x: {
          type: "hierarchical",
        },
        y: {
          ticks: {
            beginAtZero: true,
          },
        },
      },
    },
  });
};